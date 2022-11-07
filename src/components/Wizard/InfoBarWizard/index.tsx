/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import CloseButton from "react-bootstrap/CloseButton";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import { useForm, FormProvider } from "react-hook-form";

import InfoBarButtonsInput from "./InfoBarButtonsInput";
import FrequencyInput from "../FrequencyInput";
import LocalizableTextInput from "../../LocalizableTextInput";
import MessageGroupsInput from "../MessageGroupsInput";
import PriorityInput from "../PriorityInput";
import InfoBarWizardFormData from "./formData";
import {
  RegisteredFormControl,
  RegisteredFormCheck,
  RegisteredFormRange,
} from "../../RegisteredFormControl";

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
  const formContext = useForm<InfoBarWizardFormData>();
  const { register, watch, trigger } = formContext;
  const priority = watch("content.priority") ?? { enabled: false, value: 0 };

  const handleShowJson = async (): Promise<void> => {
    await trigger(undefined, { shouldFocus: true });
  };

  const handlePreview = handleShowJson;

  return (
    <Container className="wizard">
      <Form>
        <FormProvider {...formContext}>
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
                <LocalizableTextInput
                  controlPrefix="content.text"
                  label="Text"
                  helpText="The text of the infobar. Localized text uses a Fluent string ID."
                  required
                />

                <InfoBarButtonsInput />

                <Row className="form-row">
                  <span className="form-label">Type</span>
                  <div className="form-input form-input-check">
                    <div>
                      <RegisteredFormCheck
                        name="content.type"
                        register={register}
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
                      <RegisteredFormCheck
                        name="content.type"
                        register={register}
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
                        <RegisteredFormCheck
                          name="content.priority.enabled"
                          register={register}
                          label="Set Priority"
                        />
                      </div>
                    </Row>
                    <Row>
                      <div className="priority-input">
                        <RegisteredFormRange
                          name="content.priority.value"
                          register={register}
                          registerOptions={{ valueAsNumber: true }}
                          min={0}
                          max={9}
                          defaultValue={0}
                          disabled={!priority.enabled}
                        />
                      </div>
                      <Form.Text className="priority-text">
                        {PRIORITIES[priority?.value ?? 0]}
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
                    <RegisteredFormControl
                      name="meta.targeting"
                      register={register}
                      registerOptions={{ required: true }}
                      as="textarea"
                    />
                  </div>
                  <Form.Text className="row-help-text">
                    The JEXL targeting expression for the message
                  </Form.Text>
                </Form.Group>

                <MessageGroupsInput />

                <Form.Group as={Row} controlId="trigger" className="form-row">
                  <Form.Label>Trigger</Form.Label>
                  <div className="form-input">
                    <RegisteredFormControl
                      name="meta.trigger"
                      register={register}
                      registerOptions={{ required: true }}
                      as="textarea"
                      rows={3}
                      className="input-monospace"
                      defaultValue="{}"
                    />
                  </div>
                  <Form.Text className="row-help-text">
                    The trigger that will show this message
                  </Form.Text>
                </Form.Group>

                <FrequencyInput />

                <PriorityInput />
              </ListGroup.Item>

              <ListGroup.Item className="wizard-buttons">
                <Button onClick={() => void handleShowJson()}>Show JSON</Button>
                <Button onClick={() => void handlePreview()}>Preview</Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </FormProvider>
      </Form>
    </Container>
  );
}
