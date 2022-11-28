/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useFormContext } from "react-hook-form";

import { ScreenComponentProps, SpotlightScreenKind } from "./screens";
import FormRow from "../../FormRow";
import SpotlightWizardFormData from "../formData";
import { RegisteredFormControl } from "../../../RegisteredFormControl";
import LocalizableTextInput from "../../../LocalizableTextInput";
import SpotlightButtonInput from "../SpotlightButtonInput";
import ErrorMessage from "../../../ErrorMessage";

function validateAsUriOrNone(s: string) {
  if (s === "none") {
    return;
  }

  try {
    new URL(s);
  } catch (ex) {
    return "Invalid URL."
  }
}

function LogoAndTitleScreen({
  controlPrefix,
}: ScreenComponentProps) {
  const { register } = useFormContext<SpotlightWizardFormData>();

  return (
    <>
      <FormRow
        label="Logo"
        controlId={`${controlPrefix}.logo.imageURL`}
        helpText="The URL of the logo, or none to hide the logo"
      >
        <RegisteredFormControl
          name={`${controlPrefix}.logo.imageURL`}
          register={register}
          registerOptions={{
            required: "This field is required. Use 'none' to hide the logo.",
            validate: validateAsUriOrNone,
          }}
          required
          type="text"
        />
        <ErrorMessage name={`${controlPrefix}.logo.imageURL`} />
      </FormRow>
      <FormRow
        label="Logo Height"
        controlId={`${controlPrefix}.height`}
        helpText="The height of the image"
      >
        <RegisteredFormControl
          name={`${controlPrefix}.logo.height`}
          register={register}
          type="text"
        />
      </FormRow>
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

export default Object.assign(
  LogoAndTitleScreen,
  {
    title: "Logo and Title",
    kind: SpotlightScreenKind.LogoAndTitle,
    defaults: () => ({
      content: {
        logo: {
          imageURL: "",
          height: "",
        },
        background: "",
        title: {
          localized: false,
          value: "",
        },
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
      }
    }),
  } as const
);
