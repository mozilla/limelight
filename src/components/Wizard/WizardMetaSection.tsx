/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useFormContext } from "react-hook-form";

import FrequencyInput from "./FrequencyInput";
import MessageGroupsInput from "./MessageGroupsInput";
import PriorityInput from "./PriorityInput";
import { RegisteredFormControl } from "../RegisteredFormControl";
import { validateJexl, validateJsonAsObject } from "./validators";
import ErrorMessage from "../ErrorMessage";
import WizardFormData from "./formData";

export default function WizardMetaSection() {
  const { register } = useFormContext<WizardFormData>();

  return (
    <>
      <Form.Group as={Row} controlId="targeting" className="form-row">
        <Form.Label>Targeting Expression</Form.Label>
        <div className="form-input">
          <RegisteredFormControl
            name="meta.targeting"
            register={register}
            registerOptions={{
              required: true,
              validate: validateJexl,
            }}
            as="textarea"
            className="input-monospace"
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
    </>
  );
}
