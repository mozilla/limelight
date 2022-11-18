/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useFormContext } from "react-hook-form";

import FormRow from "./FormRow";
import { BaseFormData } from "./formData";
import {
  RegisteredFormControl,
  RegisteredFormCheck,
} from "../RegisteredFormControl";

const controlPrefix = "meta.priority";

export default function PriorityInput() {
  const { register, watch } = useFormContext<BaseFormData>();
  const priorityEnabled = watch(`${controlPrefix}.enabled`) ?? false;

  return (
    <FormRow
      label="Priority"
      helpText="Determines the priority of the message in the messaging system queue."
    >
      <fieldset className="meta-priority-input">
        <Row className="form-row">
          <Form.Group
            controlId={`${controlPrefix}.enabled`}
            className="form-input-check"
          >
            <RegisteredFormCheck
              name={`${controlPrefix}.enabled`}
              register={register}
              label="Set Priority"
            />
          </Form.Group>
        </Row>
        <Row className="form-row">
          <FormRow
            label="Priority"
            controlId={`${controlPrefix}.value`}
            column={true}
          >
            <RegisteredFormControl
              name={`${controlPrefix}.value`}
              register={register}
              registerOptions={{
                required: priorityEnabled,
                disabled: !priorityEnabled,
                valueAsNumber: true,
                min: 0,
                max: 9,
              }}
              type="number"
              defaultValue={0}
              min={0}
              max={9}
            />
          </FormRow>
          <FormRow
            label="Order"
            controlId={`${controlPrefix}.order`}
            column={true}
          >
            <RegisteredFormControl
              name={`${controlPrefix}.order`}
              register={register}
              registerOptions={{
                disabled: !priorityEnabled,
                valueAsNumber: true,
              }}
              type="number"
              min={0}
            />
          </FormRow>
        </Row>
        <Row>
          <Form.Text className="col-help-text">
            Messages with higher priority will be shown first.
          </Form.Text>
          <Form.Text className="col-help-text">
            Order is used to break ties between equal priority messages. Lower
            order messages are shown first.
          </Form.Text>
        </Row>
      </fieldset>
    </FormRow>
  );
}
