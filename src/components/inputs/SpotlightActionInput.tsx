/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FieldPathByValue, useFormContext } from "react-hook-form";

import ErrorMessage from "../ErrorMessage";
import FormRow from "../FormRow";
import SpotlightWizardFormData, { SpotlightActionFormData } from "../SpotlightWizard/formData";
import {
  RegisteredFormCheck,
  RegisteredFormControl,
} from "../RegisteredFormControl";
import { validateJsonAsObjectOptional } from "../../validators";

interface SpotlightActionInputProps {
  controlPrefix: FieldPathByValue<
    SpotlightWizardFormData,
    SpotlightActionFormData
  >;
  required?: boolean;
  disabled?: boolean;
}

export default function SpotlightActionInput({
  controlPrefix,
  required = false,
  disabled = false,
}: SpotlightActionInputProps) {
  const { register, watch } = useFormContext<SpotlightWizardFormData>();

  const dismiss = watch(`${controlPrefix}.dismiss`);
  const navigate = watch(`${controlPrefix}.navigate`);

  return (
    <FormRow label="Action">
      <FormRow
        label="Navigate?"
        containerClassName="form-input-check"
        helpText="Advance to the next screen when this action triggers"
      >
        <RegisteredFormCheck
          name={`${controlPrefix}.navigate`}
          register={register}
          disabled={disabled || dismiss}
        />
      </FormRow>
      <FormRow
        label="Dismiss?"
        containerClassName="form-input-check"
        helpText="Dismiss the spotlight when this action triggers"
      >
        <RegisteredFormCheck
          name={`${controlPrefix}.dismiss`}
          register={register}
          disabled={disabled || navigate}
        />
      </FormRow>
      <FormRow
        label="Type"
        helpText="The action type, as specified in SpecialMessageActionSchemas.json"
      >
        <RegisteredFormControl
          name={`${controlPrefix}.type`}
          register={register}
          disabled={disabled}
          required={required && !disabled}
        />
      </FormRow>
      <FormRow label="Data" helpText="JSON data for the action">
        <RegisteredFormControl
          name={`${controlPrefix}.data`}
          register={register}
          registerOptions={{
            validate: !disabled ? validateJsonAsObjectOptional : undefined,
          }}
          disabled={disabled}
          as="textarea"
          className="input-monospace"
        />
        <ErrorMessage name={`${controlPrefix}.data`} />
      </FormRow>
    </FormRow>
  );
}
