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
import { useForm } from "react-hook-form";

type MessageTemplate = "cfr" | "infobar" | "multistage-spotlight" | "pbnewtab";

interface NewFormData {
  id: string;
  template: MessageTemplate;
}

function onNewFormSubmit(data: NewFormData): void {
  console.log(data);
}

function NewForm() {
  const {
    register,
    handleSubmit,
    formState: { isDirty, isValid },
  } = useForm<NewFormData>({ mode: "onChange" });

  return (
    <>
      <Card.Title>Create a New Message</Card.Title>
      <Form onSubmit={handleSubmit(onNewFormSubmit)}>
        <Form.Group as={Row} controlId="message-id">
          <Form.Label className="col-2 col-form-label">Message ID</Form.Label>
          <div className="col-10">
            <Form.Control
              {...register("id", { required: true })}
              type="text"
              className="input-message-id"
            />
          </div>
        </Form.Group>

        <Form.Group as={Row} controlId="message-template">
          <Form.Label className="col-2 col-form-label pt-0">
            Template
          </Form.Label>
          <div className="col-10">
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

        <div className="d-flex justify-content-end mt-3">
          <Button
            type="submit"
            className="col-2"
            disabled={!isDirty || !isValid}
          >
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
      <Form>
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

        <div className="d-flex justify-content-end mt-3">
          <Button type="submit" className="col-2" disabled>
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

export default function NewEditImportPane() {
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
                <NewForm />
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
