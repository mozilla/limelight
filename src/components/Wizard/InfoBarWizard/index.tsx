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

import LocalizableTextInput from "../../LocalizableTextInput";

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
    <Container className="wizard">
      <Form>
        <Card>
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
              <Form.Group
                as={Row}
                controlId="content-text"
                className="form-row"
              >
                <Form.Label>Text</Form.Label>
                <LocalizableTextInput
                  controlPrefix="content-title"
                  as={Col}
                  className="form-input"
                />
                <Form.Text className="row-help-text">
                  The text of the infobar. Localized text uses a Fluent string
                  ID.
                </Form.Text>
              </Form.Group>

              <Row className="form-row">
                <span className="form-label">Buttons</span>
                <Col className="form-input">
                  <Card className="infobar-buttons-input">
                    <Tab.Container defaultActiveKey={0}>
                      <Card.Header>
                        <Nav variant="tabs">
                          <Nav.Item>
                            <Nav.Link eventKey={0}>OK</Nav.Link>
                          </Nav.Item>
                          <div className="tabs-controls">
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
                              className="form-row"
                            >
                              <span className="form-label">Label</span>
                              <div className="form-input">
                                <LocalizableTextInput
                                  controlPrefix="content.buttons[0].label"
                                  required
                                />
                              </div>
                            </Form.Group>
                            <Form.Group
                              as={Row}
                              controlId="content-buttons-0-accessKey"
                              className="form-row"
                            >
                              <Form.Label>Access Key</Form.Label>
                              <div className="access-key-input">
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
                              className="form-row"
                            >
                              <Form.Check.Label className="form-label">
                                Primary?
                              </Form.Check.Label>
                              <div className="form-input form-input-check">
                                <Form.Check.Input name="content.buttons[0].primary" />
                              </div>
                            </Form.Group>
                            <Form.Group
                              as={Row}
                              controlId="content-buttons-0-supportPage"
                              className="form-row"
                            >
                              <Form.Label>Support URL</Form.Label>
                              <div className="form-input">
                                <Form.Control
                                  type="text"
                                  name="content.buttons[0].supportPage"
                                  className="input-monospace"
                                />
                              </div>
                            </Form.Group>
                            <Form.Group
                              as={Row}
                              controlId="content-buttons-0-action"
                              className="form-row"
                            >
                              <Form.Label>Action</Form.Label>
                              <div className="form-input">
                                <Form.Control
                                  as="textarea"
                                  name="content.buttons[0].action"
                                  className="input-monospace"
                                  defaultValue="{}"
                                />
                              </div>
                            </Form.Group>
                            <Row className="form-row form-buttons">
                              <Col className="col-2">
                                <Button variant="danger">
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

              <Row className="form-row">
                <span className="form-label">Type</span>
                <div className="form-input form-input-check">
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

              <Form.Group
                as={Row}
                controlId="content-priority"
                className="form-row"
              >
                <Form.Label>Priority</Form.Label>
                <div className="form-input form-input-range infobar-priority-input">
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
                    <Form.Text className="priority-text">
                      {PRIORITIES[contentPriority]}
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
              <Form.Group as={Row} controlId="targeting" className="form-row">
                <Form.Label>Targeting Expression</Form.Label>
                <div className="form-input">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="targeting"
                    className="input-monospace"
                    required
                  />
                </div>
                <Form.Text className="row-help-text">
                  The JEXL targeting expression for the message
                </Form.Text>
              </Form.Group>

              <Form.Group as={Row} controlId="groups" className="form-row">
                <Form.Label>Message Groups</Form.Label>
                <div className="form-input">
                  <CreatableSelect
                    options={MESSAGE_GROUPS}
                    isMulti
                    classNamePrefix="react-select"
                  />
                </div>
                <Form.Text className="row-help-text">
                  Message groups used for frequency capping.
                </Form.Text>
              </Form.Group>

              <Form.Group as={Row} controlId="trigger" className="form-row">
                <Form.Label>Trigger</Form.Label>
                <div className="form-input">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="trigger"
                    className="input-monospace"
                    defaultValue="{}"
                    required
                  />
                </div>
                <Form.Text className="row-help-text">
                  The trigger that will show this message
                </Form.Text>
              </Form.Group>

              <Row className="form-row">
                <span className="form-label">Frequency</span>
                <Col className="form-input meta-frequency-input" as="fieldset">
                  <Row as="fieldset" className="form-row">
                    <Form.Group
                      controlId="frequency-lifetime-enabled"
                      className="lifetime-enabled-input"
                    >
                      <Form.Check
                        name="frequency.lifetime.enabled"
                        label="Lifetime Cap"
                        onChange={(e) =>
                          setLifetimeCapEnabled(e.target.checked)
                        }
                      />
                    </Form.Group>
                    <div className="form-input">
                      <Form.Control
                        type="number"
                        name="frequency.lifetime.value"
                        min={1}
                        max={100}
                        disabled={!lifetimeCapEnabled}
                      />
                    </div>
                    <Form.Text className="row-help-text">
                      The total number of times this message can be shown to a
                      user.
                    </Form.Text>
                  </Row>

                  <Row className="form-row">
                    <Form.Label>Custom</Form.Label>
                    <Col className="form-input custom-input" as="fieldset">
                      <Row as="fieldset" className="form-row">
                        <Col className="custom-input-col">Period (ms)</Col>
                        <Col className="custom-input-col">Cap</Col>
                      </Row>
                      <Row as="fieldset" className="form-row">
                        <Col className="custom-input-col">
                          <Form.Control
                            type="number"
                            name="frequency.custom[0].period"
                            min={1}
                          />
                        </Col>
                        <Col className="custom-input-col">
                          <Form.Control
                            type="number"
                            name="frequency.custom[0].cap"
                            min={1}
                            max={100}
                            defaultValue={1}
                          />
                        </Col>
                        <Col className="custom-trash-col">
                          <Button
                            variant="danger"
                            title="Delete this custom frequency"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </Col>
                      </Row>
                      <Row className="form-row">
                        <Col className="custom-input-col">
                          <Form.Control
                            type="number"
                            name="frequency.custom[1].period"
                            min={1}
                          />
                        </Col>
                        <Col className="custom-input-col">
                          <Form.Control
                            type="number"
                            name="frequency.custom[1].cap"
                            min={1}
                            max={100}
                            defaultValue={1}
                          />
                        </Col>
                        <div className="custom-trash-col">
                          <Button variant="danger">
                            <FontAwesomeIcon
                              icon={faTrash}
                              title="Delete this custom frequency"
                            />
                          </Button>
                        </div>
                      </Row>
                      <Row>
                        <Form.Text className="custom-help-col">
                          The time period (in milliseconds).
                        </Form.Text>
                        <Form.Text className="custom-help-col">
                          The number of times the message can appear in the
                          period.
                        </Form.Text>
                      </Row>
                      <Row className="form-row form-buttons">
                        <Col>
                          <Button className="w-100">
                            <FontAwesomeIcon icon={faPlus} /> Add a Custom
                            Frequency
                          </Button>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row className="form-row">
                <span className="form-label">Priority</span>
                <Col as="fieldset" className="form-input meta-priority-input">
                  <Row className="form-row">
                    <div className="form-input-check">
                      <Form.Check
                        name="priority.enabled"
                        id="priority-enabled"
                        label="Set Priority"
                        checked={metaPriorityEnabled}
                        onChange={(e) =>
                          setMetaPriorityEnabled(e.target.checked)
                        }
                      />
                    </div>
                  </Row>
                  <Row className="form-row">
                    <Form.Group
                      as={Col}
                      controlId="priority-value"
                      className="form-col"
                    >
                      <Form.Label>Priority</Form.Label>
                      <div className="form-input">
                        <Form.Control
                          name="priority.value"
                          type="number"
                          defaultValue={0}
                          max={0}
                          min={9}
                          disabled={!metaPriorityEnabled}
                          required={metaPriorityEnabled}
                        />
                      </div>
                    </Form.Group>
                    <Form.Group
                      as={Col}
                      controlId="priority-order"
                      className="form-col"
                    >
                      <Form.Label>Order</Form.Label>
                      <div className="form-input">
                        <Form.Control
                          name="priority.order"
                          type="number"
                          disabled={!metaPriorityEnabled}
                        />
                      </div>
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Text className="col-help-text">
                      Messages with higher priority will be shown first.
                    </Form.Text>
                    <Form.Text className="col-help-text">
                      Order is used to break ties between equal priority
                      messages. Lower order messages are shown first.
                    </Form.Text>
                  </Row>
                </Col>
                <Form.Text className="row-help-text">
                  Determines the priority of the message in the messaging system
                  queue.
                </Form.Text>
              </Row>
            </ListGroup.Item>

            <ListGroup.Item className="wizard-buttons">
              <Button>Show JSON</Button>
              <Button>Preview</Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Form>
    </Container>
  );
}
