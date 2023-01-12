/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import {
  useFormContext,
  FieldPathByValue,
  UseFormRegister,
} from "react-hook-form";

import FormRow from "../FormRow";
import { RegisteredFormCheck } from "../../RegisteredFormControl";
import SpotlightWizardFormData, { SpotlightButtonFormData } from "./formData";
import SpotlightActionInput from "./SpotlightActionInput";
import LocalizableTextInput from "../../LocalizableTextInput";
import WizardFormData from "../formData";

interface SpotlightButtonInputProps {
  controlPrefix: FieldPathByValue<
    SpotlightWizardFormData,
    SpotlightButtonFormData
  >;
  label: string;
  helpText?: string;
  required?: boolean;
  register: UseFormRegister<WizardFormData>;
}

export default function SpotlightButtonInput({
  controlPrefix,
  label,
  helpText = undefined,
  required = false,
  register,
}: SpotlightButtonInputProps) {
  const { watch, setValue } = useFormContext<SpotlightWizardFormData>();

  useEffect(() => {
    if (required) {
      setValue(`${controlPrefix}.enabled`, true);
    }
  }, []);

  const enabled = watch(`${controlPrefix}.enabled`);

  return (
    <FormRow label={label} helpText={helpText}>
      {!required && (
        <Row className="form-row">
          <Form.Group className="form-input-check">
            <RegisteredFormCheck
              label="Enabled"
              name={`${controlPrefix}.enabled`}
              register={register}
              defaultChecked={enabled}
            />
          </Form.Group>
        </Row>
      )}
      <LocalizableTextInput
        label="Label"
        controlPrefix={`${controlPrefix}.label`}
        disabled={!enabled}
        required={enabled}
      />
      <SpotlightActionInput
        disabled={!enabled}
        controlPrefix={`${controlPrefix}.action`}
      />
    </FormRow>
  );
}
