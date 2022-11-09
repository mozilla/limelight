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
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import { useForm, SubmitHandler } from "react-hook-form";

import { MessageTemplate } from "./messageTypes";

interface NewFormData {
  id: string;
  template: MessageTemplate;
}

interface NewFormProps {
  onNewMessage: (id: string, template: MessageTemplate) => void;
}

function NewForm({ onNewMessage }: NewFormProps) {
  const {
    register,
    handleSubmit,
    formState: { isDirty, isValid },
  } = useForm<NewFormData>({ mode: "onChange" });

  const onSubmit: SubmitHandler<NewFormData> = (data) => {
    onNewMessage(data.id, data.template);
  };

  return (
    <>
      <Card.Title>Create a New Message</Card.Title>
      <Form onSubmit={handleSubmit(onSubmit)} className="new-form">
        <Form.Group as={Row} controlId="message-id" className="form-row">
          <Form.Label>Message ID</Form.Label>
          <div className="form-input">
            <Form.Control
              {...register("id", { required: true })}
              type="text"
              className="input-monospace"
            />
          </div>
        </Form.Group>

        <Form.Group as={Row} controlId="message-template" className="form-row">
          <Form.Label>Template</Form.Label>
          <div className="form-input form-input-check">
            <Form.Check
              {...register("template", { required: true })}
              type="radio"
              label="CFR"
              value="cfr"
              id="message-template-cfr"
              disabled
            />
            <Form.Check
              {...register("template", { required: true })}
              type="radio"
              label="InfoBar"
              value="infobar"
              id="message-template-infobar"
              defaultChecked
            />
            <Form.Check
              {...register("template", { required: true })}
              type="radio"
              name="template"
              label="Multi-Stage Spotlight"
              value="multistage-spotlight"
              id="message-template-multistage-spotlight"
              disabled
            />
            <Form.Check
              {...register("template", { required: true })}
              type="radio"
              name="template"
              label="Private Browsing New Tab"
              value="pbnewtab"
              id="message-template-pbnewtab"
              disabled
            />
          </div>
        </Form.Group>

        <div className="form-row form-buttons">
          <Button type="submit" disabled={!isDirty || !isValid}>
            Next
          </Button>
        </div>
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