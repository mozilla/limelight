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
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";

import FormRow from "./FormRow";
import { MessageTemplate } from "./messageTypes";
import {
  RegisteredFormControl,
  RegisteredFormCheck,
} from "../RegisteredFormControl";

interface NewFormData {
  id: string;
  template: MessageTemplate;
}

interface NewFormProps {
  onNewMessage: (id: string, template: MessageTemplate) => void;
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

function EditForm() {
  return (
    <>
      <Card.Title>Edit an Existing Message</Card.Title>
      <Card.Text>There are no messages saved.</Card.Text>
    </>
  );
}

function ImportForm() {
  return (
    <>
      <Card.Title>Import a Message</Card.Title>
      <Form className="import-form">
        <Form.Group controlId="message-json">
          <Form.Label>Message JSON</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Paste JSON"
            name="message-json"
            className="input-message-json"
            disabled
          />
        </Form.Group>

        <div className="form-row form-buttons">
          <Button type="submit" disabled>
            Next
          </Button>
        </div>
      </Form>
    </>
  );
}

enum EventKeys {
  New = "new",
  Edit = "edit",
  Import = "import",
}

type NewEditImportPaneProps = NewFormProps;

export default function NewEditImportPane({
  onNewMessage,
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
                <EditForm />
              </Tab.Pane>
              <Tab.Pane eventKey={EventKeys.Import}>
                <ImportForm />
              </Tab.Pane>
            </Tab.Content>
          </Card.Body>
        </Tab.Container>
      </Card>
    </Container>
  );
}
