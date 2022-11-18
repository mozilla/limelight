/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFieldArray, useFormContext } from "react-hook-form";

import FormRow from "../FormRow";
import InfoBarWizardFormData from "./formData";
import LocalizableTextInput from "../../LocalizableTextInput";
import {
  RegisteredFormControl,
  RegisteredFormCheck,
} from "../../RegisteredFormControl";
import { validateJsonAsObject } from "../validators";
import ErrorMessage from "../../ErrorMessage";

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

            <FormRow
              label="Access Key"
              controlId={`${controlPrefix}.accessKey`}
            >
              <div className="access-key-input">
                <RegisteredFormControl
                  name={`${tabControlPrefix}.accessKey`}
                  register={register}
                  type="text"
                  maxLength={1}
                />
              </div>
            </FormRow>

            <FormRow
              label="Primary?"
              controlId={`${controlPrefix}.primary`}
              containerClassName="form-input-check"
            >
              <RegisteredFormCheck
                name={`${tabControlPrefix}.primary`}
                register={register}
              />
            </FormRow>

            <FormRow
              label="Support URL"
              controlId={`${controlPrefix}.supportPage`}
            >
              <RegisteredFormControl
                name={`${tabControlPrefix}.supportPage`}
                register={register}
                type="text"
                className="input-monospace"
              />
            </FormRow>

            <FormRow label="Action" controlId={`${controlPrefix}.action`}>
              <RegisteredFormControl
                name={`${tabControlPrefix}.action`}
                register={register}
                registerOptions={{
                  required: true,
                  validate: validateJsonAsObject,
                }}
                as="textarea"
                className="input-monospace"
              />
              <ErrorMessage name={`${tabControlPrefix}.action`} />
            </FormRow>

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
    <FormRow label="Buttons">
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
    </FormRow>
  );
}
