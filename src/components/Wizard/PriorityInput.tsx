/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useFormContext } from "react-hook-form";

import WizardFormData from "./formData";
import {
  RegisteredFormControl,
  RegisteredFormCheck,
} from "../RegisteredFormControl";

const controlPrefix = "meta.priority";

export default function PriorityInput() {
  const { register, watch } = useFormContext<WizardFormData>();
  const priorityEnabled = watch(`${controlPrefix}.enabled`) ?? false;

  return (
    <Row className="form-row">
      <span className="form-label">Priority</span>
      <Col as="fieldset" className="form-input meta-priority-input">
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
          <Form.Group as={Col} controlId="priority-value" className="form-col">
            <Form.Label>Priority</Form.Label>
            <div className="form-input">
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
            </div>
          </Form.Group>
          <Form.Group as={Col} controlId="priority-order" className="form-col">
            <Form.Label>Order</Form.Label>
            <div className="form-input">
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
            </div>
          </Form.Group>
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
      </Col>
      <Form.Text className="row-help-text">
        Determines the priority of the message in the messaging system queue.
      </Form.Text>
    </Row>
  );
}
