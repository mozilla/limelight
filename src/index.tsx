/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createRoot } from "react-dom/client";

import App from "./components/App";

// Parcel exposes environment variables via process.env.VAR.
// This must be kept in sync with the @parcel/transformer-js entry in
// package.json.
declare const process: {
  env: {
    SENTRY_DSN?: string;
    SENTRY_RELEASE?: string;
  };
};

document.addEventListener("DOMContentLoaded", () => {
  const appElement = document.getElementById("app");
  if (appElement) {
    const root = createRoot(appElement);
    const sentryConfig = {
      dsn: process.env.SENTRY_DSN,
      release: process.env.SENTRY_RELEASE,
    };
    root.render(<App sentryConfig={sentryConfig} />);
  }
});
