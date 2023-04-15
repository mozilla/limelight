/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from "react";
import FormCheck from "react-bootstrap/FormCheck";
import FormControl from "react-bootstrap/FormControl";
import FormRange from "react-bootstrap/FormRange";
import {
  FieldPath,
  FieldValues,
  RegisterOptions,
  useFormContext,
  UseFormRegister,
} from "react-hook-form";

export type GenericRegisteredControlProps<
  TProps,
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>
> = Omit<TProps, "isInvalid" | "isValid" | "name"> & {
  name: TFieldName;
  register: UseFormRegister<TFieldValues>;
  registerOptions?: RegisterOptions<TFieldValues, TFieldName>;
};

function makeProps<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
  TProps
>({
  name,
  register,
  registerOptions = {},
  ...props
}: GenericRegisteredControlProps<TProps, TFieldValues, TFieldName>) {
  const { formState, getFieldState } = useFormContext<TFieldValues>();
  const { error } = getFieldState(name, formState);

  return {
    ...register(name, {
      ...registerOptions,
      required:
        registerOptions.required === true
          ? "This field is required."
          : registerOptions.required,
    }),
    ...props,
    isInvalid: !!error,
  };
}

export function RegisteredFormControl<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  props: GenericRegisteredControlProps<
    React.ComponentProps<typeof FormControl>,
    TFieldValues,
    TFieldName
  >
) {
  return <FormControl {...makeProps(props)} />;
}

export function RegisteredFormCheck<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  props: GenericRegisteredControlProps<
    React.ComponentProps<typeof FormCheck>,
    TFieldValues,
    TFieldName
  >
) {
  return <FormCheck {...makeProps(props)} />;
}

export function RegisteredFormRange<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  register,
  registerOptions = {},
  ...props
}: GenericRegisteredControlProps<
  React.ComponentProps<typeof FormRange>,
  TFieldValues,
  TFieldName
>) {
  const newProps = {
    ...register(name, {
      ...registerOptions,
    }),
    ...props,
  };

  return <FormRange {...newProps} />;
}
