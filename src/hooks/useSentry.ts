/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as Sentry from "@sentry/react";
import { useEffect, useState } from "react";

export interface SentryConfig {
  dsn?: string;
  release?: string;
}

export enum SentryStatus {
  Disabled = "DISABLED",
  Pending = "PENDING",
  OK = "OK",
  Error = "ERROR",
}

export default function useSentry({ dsn, release }: SentryConfig) {
  const [status, setStatus] = useState(SentryStatus.Pending);

  useEffect(() => {
    if (!dsn) {
      setStatus(SentryStatus.Disabled);
      return;
    }

    // The sentry organization is encoded in the host name, prefixed with an
    // "o".
    const ORG_RE = /^o(.+)\.ingest\.sentry\.io$/;

    const url = new URL(dsn);
    const sentryKey = url.username;
    const sentryOrg = ORG_RE.exec(url.hostname)?.[1];

    if (!sentryOrg) {
      console.error(`Sentry DSN "${dsn}" is invalid`);

      setStatus(SentryStatus.Disabled);
      return;
    }

    url.pathname = `api/${sentryOrg}/envelope/`;

    // The sentry_key query parameter is given as the username in the DSN. We
    // must strip the username from the resulting URL because you cannot supply
    // a URL with credentials to fetch().
    url.search = `?sentry_key=${sentryKey}`;
    url.username = "";

    fetch(url, { method: "POST", body: "{}" })
      .then(() => {
        Sentry.init({
          dsn,
          release,
          integrations: [Sentry.browserTracingIntegration()],
          tracesSampleRate: 1.0,
        });

        setStatus(SentryStatus.OK);
      })
      .catch((e) => {
        console.error("Error initializing sentry", e);
        setStatus(SentryStatus.Error);
      });
  }, [dsn]);

  return status;
}
