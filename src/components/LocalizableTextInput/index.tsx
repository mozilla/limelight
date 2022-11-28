/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useFormContext, FieldPathByValue } from "react-hook-form";

import FormRow from "../Wizard/FormRow";
import ErrorMessage from "../ErrorMessage";
import WizardFormData from "../Wizard/formData";
import LocalizableTextFormData from "./formData";
import {
  RegisteredFormCheck,
  RegisteredFormControl,
} from "../RegisteredFormControl";

interface LocalizableTextInputProps {
  controlPrefix: FieldPathByValue<WizardFormData, LocalizableTextFormData>;
  label: string;
  helpText?: string;
  required?: boolean;
  disabled?: boolean;
}

export default function LocalizableTextInput({
  controlPrefix,
  label,
  helpText = undefined,
  required = false,
  disabled = false,
}: LocalizableTextInputProps) {
  const { register, watch } = useFormContext<WizardFormData>();
  const localized = watch(`${controlPrefix}.localized`) ?? false;

  return (
    <FormRow label={label} helpText={helpText}>
      <Row className="form-row">
        <Form.Group className="form-input-check">
          <RegisteredFormCheck
            label="Localized?"
            name={`${controlPrefix}.localized`}
            register={register}
            disabled={disabled}
            defaultChecked={false}
          />
        </Form.Group>
      </Row>
      <Row>
        {localized ? (
          <Form.Group controlId={`${controlPrefix}.value`} as={React.Fragment}>
            <Form.Label>String ID</Form.Label>
            <div>
              <RegisteredFormControl
                name={`${controlPrefix}.value`}
                register={register}
                registerOptions={{ required, shouldUnregister: true }}
                type="text"
                className="input-monospace"
                key="string-id"
                disabled={disabled}
              />
              <ErrorMessage name={`${controlPrefix}.value`} />
            </div>
          </Form.Group>
        ) : (
          <Form.Group controlId={`${controlPrefix}.value`} as={React.Fragment}>
            <Form.Label>Text</Form.Label>
            <div>
              <RegisteredFormControl
                name={`${controlPrefix}.value`}
                register={register}
                registerOptions={{ required, shouldUnregister: true }}
                as="textarea"
                key="text"
                disabled={disabled}
              />
              <ErrorMessage name={`${controlPrefix}.value`} />
            </div>
          </Form.Group>
        )}
      </Row>
    </FormRow>
  );
}
