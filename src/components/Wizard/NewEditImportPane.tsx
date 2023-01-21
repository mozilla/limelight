/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import Row from "react-bootstrap/Row";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import FormRow from "./FormRow";
import { MessageTemplate } from "./messageTypes";
import { SavedMessages } from "../../hooks/useSavedMessages";
import {
  RegisteredFormControl,
  RegisteredFormCheck,
} from "../RegisteredFormControl";
import { validateJsonAsObject } from "./validators";
import deserialize from "./deserializers";
import WizardFormData from "./formData";
import ErrorMessage from "../ErrorMessage";
import { useToastsContext } from "../../hooks/useToasts";

interface NewFormData {
  id: string;
  template: MessageTemplate;
}

interface NewFormProps {
  onNewMessage: (id: string, template: MessageTemplate) => void;
}

interface EditFormData {
  id: string;
}

interface EditFormProps {
  onEditMessage: (id: string) => void;
  onDeleteMessage: (key: string) => void;
  messages: SavedMessages;
}

function NewForm({ onNewMessage }: NewFormProps) {
  const formContext = useForm<NewFormData>({ mode: "onChange" });
  const {
    register,
    handleSubmit,
    formState: { isDirty, isValid },
  } = formContext;

  const onSubmit: SubmitHandler<NewFormData> = (data) => {
    onNewMessage(data.id, data.template);
  };

  return (
    <>
      <Card.Title>Create a New Message</Card.Title>
      <Form onSubmit={handleSubmit(onSubmit)} className="new-form">
        <FormProvider {...formContext}>
          <FormRow label="Message ID" controlId="id">
            <RegisteredFormControl
              name="id"
              register={register}
              registerOptions={{ required: true }}
              type="text"
              className="input-monospace"
            />
          </FormRow>

          <FormRow label="Template">
            <RegisteredFormCheck
              name="template"
              register={register}
              registerOptions={{ required: true }}
              type="radio"
              label="CFR"
              value="cfr"
              id="message-template-cfr"
              disabled
            />
            <RegisteredFormCheck
              name="template"
              register={register}
              registerOptions={{ required: true }}
              type="radio"
              label="InfoBar"
              value="infobar"
              id="message-template-infobar"
              defaultChecked
            />
            <RegisteredFormCheck
              name="template"
              register={register}
              registerOptions={{ required: true }}
              type="radio"
              label="Multi-Stage Spotlight"
              value="spotlight"
              id="message-template-multistage-spotlight"
            />
            <RegisteredFormCheck
              name="template"
              register={register}
              registerOptions={{ required: true }}
              type="radio"
              label="Private Browsing New Tab"
              value="pbnewtab"
              id="message-template-pbnewtab"
              disabled
            />
          </FormRow>

          <div className="form-row form-buttons">
            <Button type="submit" disabled={!isDirty || !isValid}>
              Next
            </Button>
          </div>
        </FormProvider>
      </Form>
    </>
  );
}

function EditForm({ onEditMessage, onDeleteMessage, messages }: EditFormProps) {
  const formContext = useForm<EditFormData>({ mode: "onChange" });
  const {
    register,
    handleSubmit,
    formState: { isDirty, isValid },
  } = formContext;

  const onSubmit: SubmitHandler<EditFormData> = (data: EditFormData) => {
    onEditMessage(data.id);
  };

  const messageIds = Object.keys(messages);

  return (
    <>
      <Card.Title>Edit an Existing Message</Card.Title>

      <Form onSubmit={handleSubmit(onSubmit)} className="edit-form">
        <FormProvider {...formContext}>
          {messageIds.length ? (
            <FormRow
              label="Select Message"
              containerClassName="form-input-check"
            >
              {messageIds.map((id) => (
                <Row className="edit-entry" key={id}>
                  <RegisteredFormCheck
                    name="id"
                    register={register}
                    registerOptions={{ required: true }}
                    type="radio"
                    key={id}
                    label={id}
                    value={id}
                    id={`message-select-${id}`}
                  />
                  <div className="delete-col">
                    <Button
                      key={`delete-${id}`}
                      type="button"
                      variant="danger"
                      onClick={() => onDeleteMessage(id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </div>
                </Row>
              ))}
            </FormRow>
          ) : (
            <Card.Text>There are no messages saved.</Card.Text>
          )}
        </FormProvider>

        <div className="form-row form-buttons">
          <Button type="submit" disabled={!isDirty || !isValid}>
            Next
          </Button>
        </div>
      </Form>
    </>
  );
}

interface ImportFormData {
  messageJson: string;
}

interface ImportFormProps {
  onImportMessage: (
    messageId: string,
    messageTemplate: MessageTemplate,
    formData: WizardFormData
  ) => void;
}

function ImportForm({ onImportMessage }: ImportFormProps) {
  const { addToast } = useToastsContext();
  const formContext = useForm<ImportFormData>({ mode: "onChange" });
  const {
    register,
    handleSubmit,
    formState: { isDirty, isValid },
    setError,
  } = formContext;

  const onSubmit: SubmitHandler<ImportFormData> = (data: ImportFormData) => {
    const json = JSON.parse(data.messageJson) as Record<string, unknown>;
    let result;

    try {
      result = deserialize(json);
    } catch (e) {
      setError("messageJson", {
        message: `Could not import message: ${String(e)}`,
      });
      console.error(e);
      return;
    }

    if (result.warnings.length) {
      console.warn(`Message ${result.id} imported with warnings: `);
      for (const { field, message } of result.warnings) {
        console.warn(`[${field}]: ${message}`);
      }

      addToast(
        "Message imported with warnings",
        "See browser console for full details"
      );
    }

    onImportMessage(result.id, result.template, result.formData);
  };

  return (
    <>
      <Card.Title>Import a Message</Card.Title>
      <Form onSubmit={handleSubmit(onSubmit)} className="import-form">
        <FormProvider {...formContext}>
          <Form.Group controlId="message-json">
            <FormRow label="Message JSON" controlId="messageJson">
              <RegisteredFormControl
                as="textarea"
                name="messageJson"
                register={register}
                registerOptions={{
                  required: true,
                  validate: validateJsonAsObject,
                }}
                className="input-monospace"
              />
              <ErrorMessage name="messageJson" />
            </FormRow>
          </Form.Group>

          <div className="form-row form-buttons">
            <Button type="submit" disabled={!isValid || !isDirty}>
              Next
            </Button>
          </div>
        </FormProvider>
      </Form>
    </>
  );
}

enum EventKeys {
  New = "new",
  Edit = "edit",
  Import = "import",
}

type NewEditImportPaneProps = NewFormProps & EditFormProps & ImportFormProps;

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
                <Nav.Link eventKey={EventKeys.Import}>Import</Nav.Link>
              </Nav.Item>
            </Nav>
          </Card.Header>

          <Card.Body>
            <Tab.Content>
              <Tab.Pane eventKey={EventKeys.New}>
                <NewForm onNewMessage={onNewMessage} />
              </Tab.Pane>
              <Tab.Pane eventKey={EventKeys.Edit}>
                <EditForm
                  onEditMessage={onEditMessage}
                  onDeleteMessage={onDeleteMessage}
                  messages={messages}
                />
              </Tab.Pane>
              <Tab.Pane eventKey={EventKeys.Import}>
                <ImportForm onImportMessage={onImportMessage} />
              </Tab.Pane>
            </Tab.Content>
          </Card.Body>
        </Tab.Container>
      </Card>
    </Container>
  );
}
