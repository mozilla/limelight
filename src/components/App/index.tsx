/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

import useSentry, { SentryConfig, SentryStatus } from "../../hooks/useSentry";
import useToasts from "../../hooks/useToasts";
import Toasts from "../Toasts";
import Wizard from "../Wizard";

interface AppProps {
  sentryConfig: SentryConfig;
}

export default function App({ sentryConfig }: AppProps) {
  const sentryStatus = useSentry(sentryConfig);
  const toastCtx = useToasts();

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

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>Limelight</Navbar.Brand>
          <Nav>
            <Nav.Link href="https://github.com/mozilla/limelight/wiki/Documentation">
              Help
            </Nav.Link>
          </Nav>
          <Navbar.Collapse className="justify-content-end">
            <Nav.Link href="https://github.com/mozilla/limelight">
              <FontAwesomeIcon icon={faGithub} color="white" />
            </Nav.Link>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Wizard />

      <Toasts context={toastCtx} />
    </>
  );
}
