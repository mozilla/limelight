/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useFormContext, FieldPathByValue } from "react-hook-form";

import FormRow from "../FormRow";
import { RegisteredFormCheck } from "../../RegisteredFormControl";
import SpotlightWizardFormData, {
  SpotlightDismissButtonFormData,
} from "./formData";

interface SpotlightDismissButtonInputProps {
  controlPrefix: FieldPathByValue<
    SpotlightWizardFormData,
    SpotlightDismissButtonFormData
  >;
}

export default function SpotlightDismissButtonInput({
  controlPrefix,
}: SpotlightDismissButtonInputProps) {
  const { register } = useFormContext<SpotlightWizardFormData>();

  return (
    <FormRow
      label="Add Dismiss Button?"
      containerClassName="form-input-check"
      helpText="Add a dismiss button (X) to the Spotlight modal. Sends 'dismiss' telemetry when clicked."
    >
      <RegisteredFormCheck
        label="Enabled"
        name={`${controlPrefix}.enabled`}
        register={register}
      />
    </FormRow>
  );
}
