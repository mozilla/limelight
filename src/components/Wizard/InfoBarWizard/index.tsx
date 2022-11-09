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
import { validateJsonAsObject } from "../validators";
import ErrorMessage from "../../ErrorMessage";
import { InfoBarMessage, localizableTextToJson } from "../messageTypes";

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
  setPreviewJson: (json: object | undefined) => void;
}

export default function InfoBarWizard({
  id,
  stopEditing,
  setPreviewJson,
}: InfoBarWizardProps) {
  const formContext = useForm<InfoBarWizardFormData>();
  const { register, watch, trigger, getValues } = formContext;
  const priority = watch("content.priority") ?? { enabled: false, value: 0 };

  const validate = async (): Promise<object | null> => {
    if (await trigger(undefined, { shouldFocus: true })) {
      return formDataToMessageJson(id, getValues());
    }

    return null;
  };

  const handleShowJson = async (): Promise<void> => {
    try {
      const json = await validate();
      if (json) {
        setPreviewJson(json);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePreview = async (): Promise<void> => {
    try {
      const json = await validate();
      if (json) {
        const jsonStr = JSON.stringify(json);
        const uri = `about:messagepreview?json=${btoa(jsonStr)}`;

        return navigator.clipboard.writeText(uri);
      }
    } catch (e) {
      console.error(e);
    }
  };

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
                    <ErrorMessage name="meta.targeting" />
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
                      registerOptions={{
                        required: true,
                        validate: validateJsonAsObject,
                      }}
                      as="textarea"
                      rows={3}
                      className="input-monospace"
                      defaultValue="{}"
                    />
                    <ErrorMessage name="meta.trigger" />
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
                <Button
                  onClick={() => void handlePreview()}
                  className="copy-button"
                >
                  Copy Preview Link
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </FormProvider>
      </Form>
    </Container>
  );
}

function buttonToJson({
  label,
  primary,
  accessKey,
  supportPage,
  action,
}: InfoBarWizardFormData["content"]["buttons"][number]): InfoBarMessage["content"]["buttons"][number] {
  return {
    label: localizableTextToJson(label),
    ...(accessKey ? { accessKey } : {}),
    ...(primary ? { primary } : {}),
    ...(supportPage ? { supportPage } : {}),
    action: JSON.parse(action) as object,
  };
}

function formDataToMessageJson(id: string, data: InfoBarWizardFormData) {
  const message: InfoBarMessage = {
    id,
    template: "infobar",
    targeting: data.meta.targeting,
    groups: data.meta.groups,
    trigger: JSON.parse(data.meta.trigger) as object,

    content: {
      type: data.content.type,
      text: localizableTextToJson(data.content.text),
      buttons: data.content.buttons.map(buttonToJson),
    },
  };

  if (data.content.priority.enabled) {
    message.content.priority = data.content.priority.value;
  }

  if (
    data.meta.frequency.lifetime.enabled ||
    data.meta.frequency.custom.length
  ) {
    message.frequency = {};
    if (data.meta.frequency.lifetime.enabled) {
      message.frequency.lifetime = data.meta.frequency.lifetime.value;
    }
    if (data.meta.frequency.custom.length) {
      message.frequency.custom = data.meta.frequency.custom;
    }
  }

  if (data.meta.priority.enabled) {
    message.priority = data.meta.priority.value;
    if (!isNaN(data.meta.priority.order)) {
      message.order = data.meta.priority.order;
    }
  }

  return message;
}
