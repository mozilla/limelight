/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
  useFormContext,
  FieldPathByValue,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";

import FormRow from "../Wizard/FormRow";
import ErrorMessage from "../ErrorMessage";
import LocalizableTextFormData from "./formData";
import {
  RegisteredFormCheck,
  RegisteredFormControl,
} from "../RegisteredFormControl";

interface LocalizableTextInputProps<TFieldValues extends FieldValues> {
  controlPrefix: FieldPathByValue<TFieldValues, LocalizableTextFormData>;
  label: string;
  helpText?: string;
  required?: boolean;
  disabled?: boolean;
  rich?: boolean;
  register?: UseFormRegister<TFieldValues>;
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

export default function LocalizableTextInput<TFieldValues extends FieldValues>({
  controlPrefix,
  label,
  helpText = undefined,
  required = false,
  disabled = false,
  rich = undefined,
  register = undefined,
}: LocalizableTextInputProps<TFieldValues>) {
  const context = useFormContext<TFieldValues>();
  const { watch } = context;

  const localized =
    watch(fieldname<TFieldValues>(controlPrefix, "localized")) ?? false;

  register = register ?? context.register;

  return (
    <FormRow label={label} helpText={helpText}>
      <FormRow
        label="Localized?"
        containerClassName="form-input-check"
        controlId={fieldname(controlPrefix, "localized")}
      >
        <RegisteredFormCheck
          name={fieldname(controlPrefix, "localized")}
          register={register}
          disabled={disabled}
          defaultChecked={false}
        />
      </FormRow>
      {localized ? (
        <FormRow
          label="String ID"
          controlId={fieldname(controlPrefix, "value")}
        >
          <RegisteredFormControl
            name={fieldname(controlPrefix, "value")}
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
        <FormRow label="Text" controlId={fieldname(controlPrefix, "value")}>
          <RegisteredFormControl
            name={fieldname(controlPrefix, "value")}
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
          controlId={fieldname(controlPrefix, "rich")}
        >
          <RegisteredFormCheck
            name={fieldname(controlPrefix, "rich")}
            register={register}
            registerOptions={{ shouldUnregister: true }}
            defaultChecked
          />
        </FormRow>
      )}
    </FormRow>
  );
}

/**
 * Build a Path<TFieldValues>, asserting that `fieldName` is a valid field in
 * `LocalizableTextFormData`.
 */
function fieldname<TFieldValues extends FieldValues>(
  controlPrefix: FieldPathByValue<TFieldValues, LocalizableTextFormData>,
  fieldName: keyof LocalizableTextFormData
): Path<TFieldValues> {
  // TypeScript cannot deduce that `${controlPrefix}` will map to a
  // LocalizableTextFormData because TFieldValues is generic, so it deduces type
  // `string` for `${controlPrefix}.localized`
  //
  // However, we have a constraint on `controlPrefix` that it *must* point to a
  // `LocalizableTextFormData`, so this cast is safe.
  return `${controlPrefix}.${fieldName}` as Path<TFieldValues>;
}
