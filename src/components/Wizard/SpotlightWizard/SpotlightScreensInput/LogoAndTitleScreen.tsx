/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useFormContext } from "react-hook-form";

import { ScreenComponentProps, SpotlightScreenKind } from "./screens";
import FormRow from "../../FormRow";
import SpotlightWizardFormData from "../formData";
import {
  RegisteredFormCheck,
  RegisteredFormControl,
} from "../../../RegisteredFormControl";
import LocalizableTextInput from "../../../LocalizableTextInput";
import SpotlightButtonInput from "../SpotlightButtonInput";
import SpotlightLogoInput from "../SpotlightLogoInput";

function LogoAndTitleScreen({ controlPrefix }: ScreenComponentProps) {
  const { register } = useFormContext<SpotlightWizardFormData>();

  return (
    <>
      <SpotlightLogoInput controlPrefix={`${controlPrefix}.logo`} />
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
        title: {
          localized: false,
          value: "",
        },
        titleStyle: "",
        subtitle: {
          localized: false,
          value: "",
        },
        primaryButton: {
          enabled: true,
          label: {
            localized: false,
            value: "",
          },
          action: {
            navigate: true,
            type: "",
            data: "{}",
          },
        },
        secondaryButton: {
          enabled: false,
          label: {
            localized: false,
            value: "",
          },
          action: {
            navigate: true,
            type: "",
            data: "{}",
          },
        },
      },
    } as const),
} as const);
