/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useFormContext } from "react-hook-form";

import {
  RegisteredFormCheck,
  RegisteredFormControl,
} from "../RegisteredFormControl";
import FormRow from "../FormRow";
import TabOrGlobalInput from "../inputs/TabOrGlobalInput";
import SpotlightWizardFormData from "./formData";
import { WizardSection } from "../Wizard/WizardSections";
import SpotlightScreensInput from "../inputs/SpotlightScreensInput";

export default function SpotlightWizard() {
  const { register } = useFormContext<SpotlightWizardFormData>();

  return (
    <>
      <WizardSection label="Spotlight Content">
        <FormRow
          label="Transitions"
          controlId="content.transitions"
          containerClassName="form-input-check"
          helpText="Show transitions within and between screens."
        >
          <RegisteredFormCheck
            name="content.transitions"
            register={register}
            defaultChecked
          />
        </FormRow>

        <FormRow
          label="Backdrop"
          controlId="content.backdrop"
          helpText="Background CSS behind modal content."
        >
          <RegisteredFormControl
            name="content.backdrop"
            register={register}
            as="textarea"
            className="input-monospace"
          />
        </FormRow>

        <TabOrGlobalInput label="Modal?" controlId="content.modal" />
      </WizardSection>
      <WizardSection label="Screens">
        <SpotlightScreensInput />
      </WizardSection>
    </>
  );
}
