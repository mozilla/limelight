/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFieldArray, useFormContext } from "react-hook-form";

import InfoBarWizardFormData from "./formData";
import LocalizableTextInput from "../../LocalizableTextInput";
import {
  RegisteredFormControl,
  RegisteredFormCheck,
} from "../../RegisteredFormControl";

const defaults = (): InfoBarWizardFormData["content"]["buttons"][number] => ({
  label: {
    localized: false,
    text: "",
  },
  accessKey: "",
  primary: false,
  supportPage: "",
  action: "{}",
});

const controlPrefix = "content.buttons";

export default function InfoBarButtonsInput() {
  const { control, register } = useFormContext<InfoBarWizardFormData>();
  const { fields, append, remove } = useFieldArray<InfoBarWizardFormData>({
    control,
    name: controlPrefix,
  });
  // The currently active tab is stored as its index converted to a string.
  const [activeKey, setActiveKey] = useState<string | null>(
    fields.length ? "0" : null
  );

  const addButton = () => {
    setActiveKey(fields.length.toString());
    append(defaults(), {
      focusName: `${controlPrefix}.${fields.length}.label.localized`,
    });
  };

  const tabs = fields.map((field, idx) => {
    return (
      <Nav.Item key={field.id}>
        <Nav.Link eventKey={idx}>{idx}</Nav.Link>
      </Nav.Item>
    );
  });

  const tabContents = fields.length
    ? fields.map((field, idx) => {
        const tabControlPrefix = `${controlPrefix}.${idx}` as const;
        const onDelete = () => {
          if (activeKey && activeKey === String(idx)) {
            if (idx > 0) {
              setActiveKey((idx - 1).toString());
            } else if (idx === 0 && fields.length === 1) {
              setActiveKey(null);
            }
            // If we are deleting the first button and there is another button, we
            // just stay at the same button and therefore don't have to change the
            // activeKey.
          }
          remove(idx);
        };

        return (
          <Tab.Pane eventKey={idx} key={field.id} as="fieldset">
            <LocalizableTextInput
              controlPrefix={`${tabControlPrefix}.label`}
              label="Label"
              required
            />

            <Form.Group
              as={Row}
              controlId={`${controlPrefix}.accessKey`}
              className="form-row"
            >
              <Form.Label>Access Key</Form.Label>
              <div className="access-key-input">
                <RegisteredFormControl
                  name={`${tabControlPrefix}.accessKey`}
                  register={register}
                  type="text"
                  maxLength={1}
                />
              </div>
            </Form.Group>

            <Form.Group
              as={Row}
              controlId={`${controlPrefix}.primary`}
              className="form-row"
            >
              <Form.Check.Label className="form-label">
                Primary?
              </Form.Check.Label>
              <div className="form-input form-input-check">
                <RegisteredFormCheck
                  name={`${tabControlPrefix}.primary`}
                  register={register}
                />
              </div>
            </Form.Group>

            <Form.Group
              as={Row}
              controlId={`${controlPrefix}.supportPage`}
              className="form-row"
            >
              <Form.Label>Support URL</Form.Label>
              <div className="form-input">
                <RegisteredFormControl
                  name={`${tabControlPrefix}.supportPage`}
                  register={register}
                  type="text"
                  className="input-monospace"
                />
              </div>
            </Form.Group>

            <Form.Group
              as={Row}
              controlId={`${controlPrefix}.action`}
              className="form-row"
            >
              <Form.Label>Action</Form.Label>
              <div className="form-input">
                <RegisteredFormControl
                  name={`${tabControlPrefix}.action`}
                  register={register}
                  registerOptions={{ required: true }}
                  as="textarea"
                  className="input-monospace"
                />
              </div>
            </Form.Group>

            <Row className="form-row form-buttons">
              <Col>
                <Button variant="danger" onClick={onDelete}>
                  <FontAwesomeIcon icon={faTrash} /> Delete
                </Button>
              </Col>
            </Row>
          </Tab.Pane>
        );
      })
    : "There are no buttons";

  return (
    <Row className="form-row">
      <span className="form-label">Buttons</span>
      <Col>
        <Card className="infobar-buttons-input">
          <Tab.Container
            activeKey={activeKey ?? undefined}
            onSelect={setActiveKey}
          >
            <Card.Header>
              <Nav variant="tabs">
                {tabs}
                <div className="tabs-controls">
                  <Nav.Item>
                    <Button
                      onClick={addButton}
                      className="new-button"
                      title="Add a button"
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </Button>
                  </Nav.Item>
                </div>
              </Nav>
            </Card.Header>
            <Card.Body>
              <Tab.Content>{tabContents}</Tab.Content>
            </Card.Body>
          </Tab.Container>
        </Card>
      </Col>
    </Row>
  );
}
