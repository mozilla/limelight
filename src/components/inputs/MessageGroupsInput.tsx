/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import CreatableSelect from "react-select/creatable";
import { useFormContext, useController } from "react-hook-form";

import FormRow from "../FormRow";
import { BaseFormData } from "../Wizard/formData";

const MESSAGE_GROUPS = [
  { value: "cfr", label: "cfr" },
  { value: "eco", label: "eco" },
  { value: "cfr-experiments", label: "cfr-experiments" },
  { value: "moments-pages", label: "moments-pages" },
];

const controlId = "meta.groups";

export default function MessageGroupsInput() {
  const { control } = useFormContext<BaseFormData>();
  const {
    field: { onChange, onBlur, name, value: rawValue, ref },
  } = useController({
    name: controlId,
    control,
    defaultValue: [],
  });

  const value = rawValue.map(
    (value) =>
      MESSAGE_GROUPS.find((g) => g.value === value) ?? { value, label: value }
  );

  return (
    <FormRow
      label="Message Groups"
      controlId={controlId}
      helpText="Message groups used for frequency capping."
    >
      <CreatableSelect
        name={name}
        onChange={(newValue) => onChange(newValue.map((item) => item.value))}
        onBlur={onBlur}
        options={MESSAGE_GROUPS}
        value={value}
        ref={ref}
        isMulti
        classNamePrefix="react-select"
      />
    </FormRow>
  );
}
