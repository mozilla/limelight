/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Form from "react-bootstrap/Form";
import { FieldPathByValue, useFormContext } from "react-hook-form";

import FormRow from "../FormRow";
import { RegisteredFormCheck } from "../RegisteredFormControl";
import WizardFormData from "../Wizard/formData";

export interface TabOrGlobalInputProps {
  label: string;
  controlId: FieldPathByValue<WizardFormData, "tab" | "global">;
}

export default function TabOrGlobalInput({
  label,
  controlId,
}: TabOrGlobalInputProps) {
  const { register } = useFormContext<WizardFormData>();

  return (
    <FormRow label={label}>
      <RegisteredFormCheck
        name={controlId}
        register={register}
        id="content-type-tab"
        type="radio"
        label="Tab"
        value="tab"
        defaultChecked
      />
      <Form.Text>The message will be shown on a single tab.</Form.Text>
      <RegisteredFormCheck
        name={controlId}
        register={register}
        id="content-type-global"
        type="radio"
        label="Global"
        value="global"
      />
      <Form.Text>
        The message will be shown browser-wide, across all tabs.
      </Form.Text>
    </FormRow>
  );
}
