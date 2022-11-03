/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import CloseButton from "react-bootstrap/CloseButton";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import CreatableSelect from "react-select/creatable";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import LocalizableTextInput from "../LocalizableTextInput";

const MESSAGE_GROUPS = [
  { value: "cfr", label: "cfr" },
  { value: "eco", label: "eco" },
  { value: "cfr-experiments", label: "cfr-experiments" },
  { value: "moments-pages", label: "moments-pages" },
];

const PRIORITIES = [
  "System",
  "Info (Low)",
  "Info (Medium)",
  "Info (High)",
  "Warning (Low)",
  "Warning (Medium)",
  "Warning (High)",
  "Critical (Low)",
  "Critical (Medium)",
  "Critical (High)",
];

interface InfoBarWizardProps {
  id: string;
  stopEditing: () => void;
}

export default function InfoBarWizard({ id, stopEditing }: InfoBarWizardProps) {
  const [contentPriorityEnabled, setContentPriorityEnabled] = useState(false);
  const [contentPriority, setContentPriority] = useState(0);
  const [lifetimeCapEnabled, setLifetimeCapEnabled] = useState(false);
  const [metaPriorityEnabled, setMetaPriorityEnabled] = useState(false);

  return (
    <Container className="mt-3 mb-3">
      <Form>
        <Card className="mt-3">
          <Card.Header className="d-flex justify-content-between">
            <Card.Title className="mb-0">
              Editing Message: <span className="message-id">{id}</span>
            </Card.Title>
            <CloseButton onClick={stopEditing} title="Stop Editing" />
          </Card.Header>
          <ListGroup variant="flush">
            <ListGroup.Item className="wizard-section-header">
              Message Content
            </ListGroup.Item>

            <ListGroup.Item>
              <Form.Group as={Row} controlId="content-text">
                <Form.Label className="col-2 col-form-label">Text</Form.Label>
                <LocalizableTextInput
                  controlPrefix="content-title"
                  as={Col}
                  className="col-10"
                />
                <Form.Text className="offset-2">
                  The text of the infobar. Localized text uses a Fluent string
                  ID.
                </Form.Text>
              </Form.Group>

              <Row className="mt-3">
                <span className="col-2 col-form-label">Buttons</span>
                <Col className="col-10">
                  <Card>
                    <Tab.Container defaultActiveKey={0}>
                      <Card.Header>
                        <Nav variant="tabs">
                          <Nav.Item>
                            <Nav.Link eventKey={0}>OK</Nav.Link>
                          </Nav.Item>
                          <div className="d-flex justify-content-end flex-fill">
                            <Nav.Item>
                              <Button>
                                <FontAwesomeIcon icon={faPlus} />
                              </Button>
                            </Nav.Item>
                          </div>
                        </Nav>
                      </Card.Header>

                      <Card.Body>
                        <Tab.Content>
                          <Tab.Pane eventKey={0} as="fieldset">
                            <Form.Group
                              as={Row}
                              controlId="content-buttons-0-label"
                              className="mt-2"
                            >
                              <span className="form-label col-2 col-form-label">
                                Label
                              </span>
                              <div className="col-10">
                                <LocalizableTextInput
                                  controlPrefix="content.buttons[0].label"
                                  required
                                />
                              </div>
                            </Form.Group>
                            <Form.Group
                              as={Row}
                              controlId="content-buttons-0-accessKey"
                              className="mt-2"
                            >
                              <Form.Label className="col-2 col-form-label">
                                Access Key
                              </Form.Label>
                              <div className="col-2">
                                <Form.Control
                                  type="text"
                                  maxLength={1}
                                  name="content.buttons[0].accessKey"
                                />
                              </div>
                            </Form.Group>
                            <Form.Group
                              as={Row}
                              controlId="content-buttons-0-primary"
                              className="mt-2"
                            >
                              <Form.Check.Label className="col-2 col-form-label">
                                Primary?
                              </Form.Check.Label>
                              <div className="col-10 pt-2">
                                <Form.Check.Input name="content.buttons[0].primary" />
                              </div>
                            </Form.Group>
                            <Form.Group
                              as={Row}
                              controlId="content-buttons-0-supportPage"
                              className="mt-2"
                            >
                              <Form.Label className="col-2 col-form-label">
                                Support URL
                              </Form.Label>
                              <div className="col-10">
                                <Form.Control
                                  type="text"
                                  name="content.buttons[0].supportPage"
                                />
                              </div>
                            </Form.Group>
                            <Form.Group
                              as={Row}
                              controlId="content-buttons-0-action"
                              className="mt-2"
                            >
                              <Form.Label className="col-2 col-form-label">
                                Action
                              </Form.Label>
                              <div className="col-10">
                                <Form.Control
                                  as="textarea"
                                  name="content.buttons[0].action"
                                  className="input-action"
                                  defaultValue="{}"
                                />
                              </div>
                            </Form.Group>
                            <Row className="mt-2 justify-content-end">
                              <Col className="col-2">
                                <Button variant="danger" className="w-100">
                                  <FontAwesomeIcon icon={faTrash} /> Delete
                                </Button>
                              </Col>
                            </Row>
                          </Tab.Pane>
                        </Tab.Content>
                      </Card.Body>
                    </Tab.Container>
                  </Card>
                </Col>
              </Row>

              <Row>
                <span className="col-2 col-form-label">Type</span>
                <div className="col-10 pt-2">
                  <div>
                    <Form.Check
                      name="content.type"
                      id="content-type-tab"
                      type="radio"
                      label="Tab"
                      value="tab"
                      defaultChecked
                    />
                    <Form.Text>
                      The InfoBar will be shown on a single tab.
                    </Form.Text>
                  </div>
                  <div>
                    <Form.Check
                      name="content.type"
                      id="content-type-global"
                      type="radio"
                      label="Global"
                      value="global"
                    />
                    <Form.Text>
                      The InfoBar will be shown browser-wide, across all tabs.
                    </Form.Text>
                  </div>
                </div>
              </Row>

              <Form.Group as={Row} controlId="content-priority">
                <Form.Label className="col-2 col-form-label">
                  Priority
                </Form.Label>
                <div className="col-10 pt-2">
                  <Row>
                    <div>
                      <Form.Check
                        name="content.priority.enabled"
                        label="Set Priority"
                        onChange={(e) =>
                          setContentPriorityEnabled(e.target.checked)
                        }
                      />
                    </div>
                  </Row>
                  <Row>
                    <div className="col-9">
                      <Form.Range
                        min={0}
                        max={9}
                        defaultValue={0}
                        onChange={(e) =>
                          setContentPriority(e.target.valueAsNumber)
                        }
                        disabled={!contentPriorityEnabled}
                      />
                    </div>
                    <Form.Text className="col-3">
                      {PRIORITIES[contentPriority ?? 0]}
                    </Form.Text>
                    <Form.Text>
                      Determines the appearance of the notification, based on
                      the severity. Only the notification with the highest
                      severity is displayed.
                    </Form.Text>
                  </Row>
                </div>
              </Form.Group>
            </ListGroup.Item>

            <ListGroup.Item className="wizard-section-header">
              Metadata
            </ListGroup.Item>

            <ListGroup.Item>
              <Form.Group as={Row} controlId="targeting">
                <Form.Label className="col-2 col-form-label">
                  Targeting Expression
                </Form.Label>
                <div className="col-10">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="targeting"
                    className="input-targeting"
                    required
                  />
                </div>
                <Form.Text className="offset-2">
                  The JEXL targeting expression for the message
                </Form.Text>
              </Form.Group>

              <Form.Group as={Row} controlId="groups" className="mt-3">
                <Form.Label className="col-2 col-form-label">
                  Message Groups
                </Form.Label>
                <div className="col-10">
                  <CreatableSelect
                    options={MESSAGE_GROUPS}
                    isMulti
                    classNamePrefix="react-select"
                  />
                </div>
                <Form.Text className="offset-2">
                  Message groups used for frequency capping.
                </Form.Text>
              </Form.Group>

              <Form.Group as={Row} controlId="trigger" className="mt-3">
                <Form.Label className="col-2 col-form-label">
                  Trigger
                </Form.Label>
                <div className="col-10">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="trigger"
                    className="input-trigger"
                    defaultValue="{}"
                    required
                  />
                </div>
                <Form.Text className="offset-2">
                  The trigger that will show this message
                </Form.Text>
              </Form.Group>

              <Row className="mt-3">
                <span className="col-2 col-form-label">Frequency</span>
                <Col className="col-10" as="fieldset">
                  <Row as="fieldset">
                    <Form.Group
                      controlId="frequency-lifetime-enabled"
                      className="col-2 pt-2"
                    >
                      <Form.Check
                        name="frequency.lifetime.enabled"
                        label="Lifetime Cap"
                        onChange={(e) =>
                          setLifetimeCapEnabled(e.target.checked)
                        }
                      />
                    </Form.Group>
                    <div className="col-10">
                      <Form.Control
                        type="number"
                        name="frequency.lifetime.value"
                        min={1}
                        max={100}
                        disabled={!lifetimeCapEnabled}
                      />
                    </div>
                    <Form.Text className="offset-2">
                      The total number of times this message can be shown to a
                      user.
                    </Form.Text>
                  </Row>

                  <Row className="mt-1">
                    <Form.Label className="col-2 col-form-label">
                      Custom
                    </Form.Label>
                    <Col className="col-10 pt-2" as="fieldset">
                      <Row as="fieldset">
                        <span className="col-5">Period (ms)</span>
                        <span className="col-5">Cap</span>
                      </Row>
                      <Row as="fieldset" className="mt-1">
                        <div className="col-5">
                          <Form.Control
                            type="number"
                            name="frequency.custom[0].period"
                            min={1}
                          />
                        </div>
                        <div className="col-5">
                          <Form.Control
                            type="number"
                            name="frequency.custom[0].cap"
                            min={1}
                            max={100}
                            defaultValue={1}
                          />
                        </div>
                        <div className="col-1 offset-1">
                          <Button
                            variant="danger"
                            title="Delete this custom frequency"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </div>
                      </Row>
                      <Row className="mt-1">
                        <div className="col-5">
                          <Form.Control
                            type="number"
                            name="frequency.custom[1].period"
                            min={1}
                          />
                        </div>
                        <div className="col-5">
                          <Form.Control
                            type="number"
                            name="frequency.custom[1].cap"
                            min={1}
                            max={100}
                            defaultValue={1}
                          />
                        </div>
                        <div className="col-1 offset-1">
                          <Button variant="danger">
                            <FontAwesomeIcon
                              icon={faTrash}
                              title="Delete this custom frequency"
                            />
                          </Button>
                        </div>
                      </Row>
                      <Row>
                        <Form.Text className="col-5">
                          The time period (in milliseconds).
                        </Form.Text>
                        <Form.Text className="col-5">
                          The number of times the message can appear in the
                          period.
                        </Form.Text>
                      </Row>
                      <Row className="mt-1 justify-content-end">
                        <div className="col-4">
                          <Button className="w-100">
                            <FontAwesomeIcon icon={faPlus} /> Add a Custom
                            Frequency
                          </Button>
                        </div>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row className="mt-3">
                <span className="col-2 col-form-label">Priority</span>
                <Col as="fieldset" className="col-10 pt-2">
                  <Row>
                    <div>
                      <Form.Check
                        name="priority.enabled"
                        label="Set Priority"
                        onChange={(e) =>
                          setMetaPriorityEnabled(e.target.checked)
                        }
                      />
                    </div>
                  </Row>
                  <Row>
                    <Form.Group
                      as={Col}
                      controlId="priority-value"
                      className="col-6 d-flex"
                    >
                      <Form.Label className="col-2 col-form-label">
                        Priority
                      </Form.Label>
                      <div className="col-10">
                        <Form.Control
                          name="priority.value"
                          type="number"
                          defaultValue={0}
                          max={0}
                          min={9}
                          disabled={!metaPriorityEnabled}
                          required={!metaPriorityEnabled}
                        />
                      </div>
                    </Form.Group>
                    <Form.Group
                      as={Col}
                      controlId="priority-order"
                      className="col-6 d-flex"
                    >
                      <Form.Label className="col-2 col-form-label">
                        Order
                      </Form.Label>
                      <div className="col-10">
                        <Form.Control
                          name="priority.order"
                          type="number"
                          disabled={!metaPriorityEnabled}
                        />
                      </div>
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Text className="col-6">
                      Messages with higher priority will be shown first.
                    </Form.Text>
                    <Form.Text className="col-6">
                      Order is used to break ties between equal priority
                      messages. Lower order messages are shown first.
                    </Form.Text>
                  </Row>
                </Col>
                <Form.Text className="offset-2">
                  Determines the priority of the message in the messaging system
                  queue.
                </Form.Text>
              </Row>
            </ListGroup.Item>

            <ListGroup.Item className="d-flex justify-content-end p-3">
              <Button className="me-2">Show JSON</Button>
              <Button>Preview</Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Form>
    </Container>
  );
}
