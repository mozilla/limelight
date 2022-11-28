/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFormContext } from "react-hook-form";

import FormRow from "../FormRow";
import InfoBarWizardFormData from "./formData";
import LocalizableTextInput from "../../LocalizableTextInput";
import {
  RegisteredFormControl,
  RegisteredFormCheck,
} from "../../RegisteredFormControl";
import { validateJsonAsObject } from "../validators";
import ErrorMessage from "../../ErrorMessage";
import TabbedInput, { TabInputProps } from "../TabbedInput";

function defaults(): InfoBarWizardFormData["content"]["buttons"][number] {
  return {
    label: {
      localized: false,
      text: "",
    },
    accessKey: "",
    primary: false,
    supportPage: "",
    action: "{}",
  };
}

const controlPrefix = "content.buttons";

export default function InfoBaorButtonsInput() {
  const { register } = useFormContext<InfoBarWizardFormData>();

  const renderTab = ({ index, handleDelete }: TabInputProps) => {
    const tabControlPrefix = `${controlPrefix}.${index}` as const;
    return (
      <>
        <LocalizableTextInput
          controlPrefix={`${tabControlPrefix}.label`}
          label="Label"
          required
        />

        <FormRow label="Access Key" controlId={`${controlPrefix}.accessKey`}>
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

        <FormRow label="Support URL" controlId={`${controlPrefix}.supportPage`}>
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
            <Button variant="danger" onClick={handleDelete}>
              <FontAwesomeIcon icon={faTrash} /> Delete
            </Button>
          </Col>
        </Row>
      </>
    );
  };

  return (
    <FormRow label="Buttons">
      <TabbedInput
        className="infobar-buttons-input"
        controlPrefix="content.buttons"
        emptyTabs="There are no buttons."
        renderTab={renderTab}
        focusName="label.raw"
        defaults={defaults}
        addText="Add button"
      />
    </FormRow>
  );
}
