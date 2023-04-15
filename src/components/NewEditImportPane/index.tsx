/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";

import EditMessageForm from "./EditMessageForm";
import ExperimentMessageImportForm from "./ExperimentImportMessageForm";
import JsonMessageImportForm from "./JsonImportMessageForm";
import NewMessageForm from "./NewMessageForm";
import NewEditImportPaneProps from "./propTypes";

enum EventKeys {
  New = "NEW",
  Edit = "EDIT",
  JsonImport = "JSON_IMPORT",
  ExperimentImport = "EXPERIMENT_IMPORT",
}

export default function NewEditImportPane({
  onNewMessage,
  onEditMessage,
  onDeleteMessage,
  onImportMessage,
  messages,
}: NewEditImportPaneProps) {
  return (
    <Container>
      <Card className="col-lg-8 offset-lg-2 mt-3">
        <Tab.Container defaultActiveKey={EventKeys.New}>
          <Card.Header>
            <Nav variant="tabs">
              <Nav.Item>
                <Nav.Link eventKey={EventKeys.New}>New</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey={EventKeys.Edit}>Edit</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey={EventKeys.JsonImport}>Import JSON</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey={EventKeys.ExperimentImport}>
                  Import from Nimbus
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Card.Header>

          <Card.Body>
            <Tab.Content>
              <Tab.Pane eventKey={EventKeys.New}>
                <NewMessageForm onNewMessage={onNewMessage} />
              </Tab.Pane>
              <Tab.Pane eventKey={EventKeys.Edit}>
                <EditMessageForm
                  onEditMessage={onEditMessage}
                  onDeleteMessage={onDeleteMessage}
                  messages={messages}
                />
              </Tab.Pane>
              <Tab.Pane eventKey={EventKeys.JsonImport}>
                <JsonMessageImportForm onImportMessage={onImportMessage} />
              </Tab.Pane>
              <Tab.Pane eventKey={EventKeys.ExperimentImport}>
                <ExperimentMessageImportForm
                  onImportMessage={onImportMessage}
                />
              </Tab.Pane>
            </Tab.Content>
          </Card.Body>
        </Tab.Container>
      </Card>
    </Container>
  );
}
