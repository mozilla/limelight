/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useFieldArray, useFormContext } from "react-hook-form";

import FormRow from "../FormRow";
import {
  RegisteredFormCheck,
  RegisteredFormControl,
} from "../RegisteredFormControl";
import { BaseFormData } from "../Wizard/formData";

const controlPrefix = "meta.frequency";

function customDefaults() {
  return {
    period: 1,
    cap: 1,
  };
}

export default function FrequencyInput() {
  const { control, register, watch } = useFormContext<BaseFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `${controlPrefix}.custom`,
  });

  const lifetimeCapEnabled = watch(`${controlPrefix}.lifetime.enabled`);

  const handleAdd = () => {
    append(customDefaults(), {
      focusName: `${controlPrefix}.custom.${fields.length}.period`,
    });
  };

  const handleDelete = (idx: number) => {
    remove(idx);
  };

  const customRows = fields.map((field, idx) => {
    return (
      <Row as="fieldset" className="form-row" key={field.id}>
        <Col className="custom-input-col">
          <RegisteredFormControl
            name={`${controlPrefix}.custom.${idx}.period`}
            register={register}
            registerOptions={{ required: true, min: 1 }}
            type="number"
          />
        </Col>
        <Col className="custom-input-col">
          <RegisteredFormControl
            name={`${controlPrefix}.custom.${idx}.cap`}
            register={register}
            registerOptions={{ required: true, min: 1 }}
            type="number"
          />
        </Col>
        <Col className="custom-trash-col">
          <Button
            variant="danger"
            title="Delete this custom frequency cap"
            onClick={() => handleDelete(idx)}
          >
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </Col>
      </Row>
    );
  });

  return (
    <FormRow label="Frequency" containerClassName="meta-frequency-input">
      <Row as="fieldset" className="form-row">
        <Form.Group
          controlId={`${controlPrefix}.lifetime.enabled`}
          className="lifetime-enabled-input"
        >
          <RegisteredFormCheck
            name={`${controlPrefix}.lifetime.enabled`}
            register={register}
            label="Lifetime Cap"
          />
        </Form.Group>
        <div className="form-input">
          <RegisteredFormControl
            name={`${controlPrefix}.lifetime.value`}
            register={register}
            registerOptions={{
              disabled: !lifetimeCapEnabled,
              required: lifetimeCapEnabled,
              min: 1,
              max: 100,
            }}
            type="number"
            defaultValue={lifetimeCapEnabled ? 1 : undefined}
          />
        </div>
        <Form.Text className="row-help-text">
          The total number of times this message can be shown to a user.
        </Form.Text>
      </Row>
      <Row className="form-row">
        <span className="form-label">Custom</span>
        <Col className="form-input custom-input">
          <Row className="form-row">
            <Col className="custom-header-col">Period (ms)</Col>
            <Col className="custom-header-col">Cap</Col>
          </Row>
          {customRows}
          <Row className="form-row form-buttons">
            <Col>
              <Button onClick={handleAdd}>
                <FontAwesomeIcon icon={faPlus} /> Add a Custom Frequency
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </FormRow>
  );
}
