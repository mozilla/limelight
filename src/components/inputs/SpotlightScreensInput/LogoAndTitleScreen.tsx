/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useFormContext } from "react-hook-form";

import FormRow from "../../FormRow";
import {
  RegisteredFormCheck,
  RegisteredFormControl,
} from "../../RegisteredFormControl";
import SpotlightWizardFormData, {
  defaultSpotlightButtonFormData,
} from "../../SpotlightWizard/formData";
import LocalizableTextInput from "../LocalizableTextInput";
import { defaultLocalizableTextFormData } from "../LocalizableTextInput/formData";
import SpotlightButtonInput from "../SpotlightButtonInput";
import SpotlightDismissButtonInput from "../SpotlightDismissButtonInput";
import SpotlightLogoInput from "../SpotlightLogoInput";
import { ScreenComponentProps, SpotlightScreenKind } from "./screens";

function LogoAndTitleScreen({ controlPrefix }: ScreenComponentProps) {
  const { register } = useFormContext<SpotlightWizardFormData>();
  return (
    <>
      <SpotlightLogoInput controlPrefix={`${controlPrefix}.logo`} />
      <SpotlightDismissButtonInput
        controlPrefix={`${controlPrefix}.dismissButton`}
      />
      <FormRow
        label="Background"
        controlId={`${controlPrefix}.background`}
        helpText="CSS for the screen background"
      >
        <RegisteredFormControl
          name={`${controlPrefix}.background`}
          register={register}
          as="textarea"
        />
      </FormRow>
      <LocalizableTextInput
        label="Title"
        controlPrefix={`${controlPrefix}.title`}
        rich
        required
      />
      <FormRow label="Title Style" containerClassName="form-input-check">
        <RegisteredFormCheck
          name={`${controlPrefix}.titleStyle`}
          id={`${controlPrefix}.titleStyle-none`}
          register={register}
          type="radio"
          label="None"
          value=""
        />
        <RegisteredFormCheck
          name={`${controlPrefix}.titleStyle`}
          id={`${controlPrefix}.titleStyle-fancy`}
          register={register}
          type="radio"
          label="Fancy"
          value="fancy"
        />
        <RegisteredFormCheck
          name={`${controlPrefix}.titleStyle`}
          id={`${controlPrefix}.titleStyle-fancyshine`}
          register={register}
          type="radio"
          label="Fancy Shine"
          value="fancy shine"
        />
      </FormRow>
      <LocalizableTextInput
        label="Subtitle"
        controlPrefix={`${controlPrefix}.subtitle`}
        rich
      />
      <SpotlightButtonInput
        label="Primary Button"
        controlPrefix={`${controlPrefix}.primaryButton`}
        required
      />
      <SpotlightButtonInput
        label="Secondary Button"
        controlPrefix={`${controlPrefix}.secondaryButton`}
      />
    </>
  );
}

export default Object.assign(LogoAndTitleScreen, {
  title: "Logo and Title",
  kind: SpotlightScreenKind.LogoAndTitle,
  defaults: () =>
    ({
      content: {
        logo: {
          hasImageURL: true,
          imageURL: "",
          height: "",
        },
        background: "",
        title: defaultLocalizableTextFormData({ rich: true }),
        titleStyle: "",
        subtitle: defaultLocalizableTextFormData({ rich: true }),
        primaryButton: defaultSpotlightButtonFormData({ enabled: true }),
        secondaryButton: defaultSpotlightButtonFormData({ enabled: false }),
        dismissButton: {
          enabled: false,
        },
      },
    } as const),
} as const);
