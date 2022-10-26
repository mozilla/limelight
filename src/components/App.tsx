/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

export default function App() {
  return (
    <>
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
      <Container className="page-container" />
    </>
  );
}
