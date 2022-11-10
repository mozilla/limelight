/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useFormContext, FieldPathByValue } from "react-hook-form";

import ErrorMessage from "../ErrorMessage";
import WizardFormData from "../Wizard/formData";
import LocalizableTextFormData from "./formData";
import {
  RegisteredFormControl,
  RegisteredFormCheck,
} from "../RegisteredFormControl";

interface LocalizableTextInputProps {
  controlPrefix: FieldPathByValue<WizardFormData, LocalizableTextFormData>;
  label: string;
  helpText?: string;
  required?: boolean;
}

export default function LocalizableTextInput({
  controlPrefix,
  label,
  helpText = undefined,
  required = false,
}: LocalizableTextInputProps) {
  const { register, watch } = useFormContext<WizardFormData>();
  const localized = watch(`${controlPrefix}.localized`) ?? false;

  return (
    <Row className="form-row">
      <span className="form-label">{label}</span>
      <Col className="form-input">
        <Row>
          <div>
            <Form.Group controlId={`${controlPrefix}.localized`}>
              <RegisteredFormCheck
                name={`${controlPrefix}.localized`}
                register={register}
                label="Localized?"
                defaultChecked={localized}
              />
            </Form.Group>
          </div>
        </Row>
        <Row>
          {localized ? (
            <Form.Group
              controlId={`${controlPrefix}.stringId`}
              as={React.Fragment}
            >
              <Form.Label>String ID</Form.Label>
              <div>
                <RegisteredFormControl
                  name={`${controlPrefix}.stringId`}
                  register={register}
                  registerOptions={{ required, shouldUnregister: true }}
                  type="text"
                  className="input-monospace"
                  key="string-id"
                />
                <ErrorMessage name={`${controlPrefix}.stringId`} />
              </div>
            </Form.Group>
          ) : (
            <Form.Group controlId={`${controlPrefix}.text`} as={React.Fragment}>
              <Form.Label>Text</Form.Label>
              <div>
                <RegisteredFormControl
                  name={`${controlPrefix}.text`}
                  register={register}
                  registerOptions={{ required, shouldUnregister: true }}
                  as="textarea"
                  key="text"
                />
                <ErrorMessage name={`${controlPrefix}.text`} />
              </div>
            </Form.Group>
          )}
        </Row>
        {helpText && (
          <Row>
            <Form.Text className="row-help-text">{helpText}</Form.Text>
          </Row>
        )}
      </Col>
    </Row>
  );
}
