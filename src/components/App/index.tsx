/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";

import useSavedMessages from "../../hooks/useSavedMessages";
import useSentry, { SentryConfig, SentryStatus } from "../../hooks/useSentry";
import useToasts from "../../hooks/useToasts";
import Toasts from "../Toasts";
import deserialize from "../Wizard/deserializers";

interface AppProps {
  sentryConfig: SentryConfig;
  nimbusEditor?: {
    branchSlug: string;
  };
}

export default function App({
  sentryConfig,
  nimbusEditor,
}: AppProps) {
  const navigate = useNavigate();
  const sentryStatus = useSentry(sentryConfig);
  const toastCtx = useToasts();
  const savedMessages = useSavedMessages();

  const [ready, setReady] = useState<Boolean>(!nimbusEditor);

  useEffect(() => {
    if (sentryStatus === SentryStatus.Error) {
      toastCtx.addToast("Could not initialize Sentry", () => (
        <>
          <p>
            Something is preventing Sentry from loading correctly, likely a
            content blocker like uBlock Origin or Ghostery.
          </p>
          <p>
            Please disable content blockers on this page so we can report
            diagnostics.
          </p>
        </>
      ));
    }
  }, [sentryStatus]);

  useEffect(() => {
    if (nimbusEditor && !ready) {
      window.addEventListener("message", event => {

      console.log(event.data.type);
        if (!("type" in event.data) || event.data.type !== "nimbus:edit") {
          return;
        }
        console.log(event);
        if ("json" in event.data && typeof event.data.json === "object" && event.data.json !== null) {
          let result;
          try {
            result = deserialize(event.data.json);
          } catch (e) {}

          if (result) {
            navigate("/import", {
              state: {
                formData: result.formData,
                messageId: result.id,
                template: result.template,
              },
            });
          }
        }

        setReady(true);
      });

      window.opener.postMessage({ type: "limelight:ready" });
    }
  }, [nimbusEditor, navigate]);

  const context = { savedMessages, nimbusEditor };

  return (
    <>
      <Toasts.Provider context={toastCtx}>
        <Navbar bg="dark" variant="dark">
          <Container>
            <Navbar.Brand>Limelight</Navbar.Brand>
            <Navbar.Collapse className="justify-content-end">
              <Nav.Link href="https://github.com/mozilla/limelight">
                <FontAwesomeIcon icon={faGithub} color="white" />
              </Nav.Link>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {nimbusEditor && !ready ? (<Spinner animation="border"/>) : (
        <Outlet context={context} />
        )}

        <Toasts />
      </Toasts.Provider>
    </>
  );
}
