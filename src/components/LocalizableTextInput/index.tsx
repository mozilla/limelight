/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
  useFormContext,
  FieldPathByValue,
  UseFormRegister,
} from "react-hook-form";

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
  rich?: boolean;
  register?: UseFormRegister<WizardFormData>;
}

export const RichTextPresets = {
  TITLE: {
    paddingBlock: "8px",
  },
  SUBTITLE: {
    fontSize: "15px",
    fontWeight: 400,
    letterSpacing: 0,
    lineHeight: "1.33",
    marginBlock: "4px 12px",
    paddingInline: "16px",
  },
} as const;

export default function LocalizableTextInput({
  controlPrefix,
  label,
  helpText = undefined,
  required = false,
  disabled = false,
  rich = undefined,
  register = undefined,
}: LocalizableTextInputProps) {
  const context = useFormContext<WizardFormData>();
  const { watch } = context;
  const localized = watch(`${controlPrefix}.localized`) ?? false;

  register = register ?? context.register;

  return (
    <FormRow label={label} helpText={helpText}>
      <FormRow label="Localized?" containerClassName="form-input-check">
        <RegisteredFormCheck
          name={`${controlPrefix}.localized`}
          register={register}
          disabled={disabled}
          defaultChecked={false}
        />
      </FormRow>
      {localized ? (
        <FormRow label="String ID">
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
        </FormRow>
      ) : (
        <FormRow label="Text">
          <RegisteredFormControl
            name={`${controlPrefix}.value`}
            register={register}
            registerOptions={{ required, shouldUnregister: true }}
            as="textarea"
            key="text"
            disabled={disabled}
          />
          <ErrorMessage name={`${controlPrefix}.value`} />
        </FormRow>
      )}
      {rich && (
        <FormRow
          label="Rich Text?"
          helpText="Use the rich text preset used in experiments"
        >
          <RegisteredFormCheck
            name={`${controlPrefix}.rich`}
            register={register}
            registerOptions={{ shouldUnregister: true }}
            defaultChecked
          />
        </FormRow>
      )}
    </FormRow>
  );
}
