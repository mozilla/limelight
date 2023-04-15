/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import LocalizableTextFormData, {
  defaultLocalizableTextFormData,
} from "../inputs/LocalizableTextInput/formData";
import { SpotlightScreenKind } from "../inputs/SpotlightScreensInput/screens";

export default interface SpotlightWizardFormData {
  content: {
    modal: "tab" | "global";
    backdrop?: string;
    transitions: boolean;
    screens: SpotlightScreenFormData[];
  };
}

export interface SpotlightLogoFormData {
  hasImageURL: boolean;
  imageURL: string;
  height: string;
}

export type SpotlightButtonFormData = {
  enabled: boolean;
  label: LocalizableTextFormData;
  action: SpotlightActionFormData;
};

export type SpotlightDismissButtonFormData = {
  enabled: boolean;
};

export interface SpotlightActionFormData {
  navigate: boolean;
  dismiss: boolean;
  type: string;
  data: string;
}

export type SpotlightScreenFormData =
  | { kind: undefined }
  | {
      screenId: string;
      kind: SpotlightScreenKind.LogoAndTitle;
      content: LogoAndTitleScreenFormData;
    };

export interface LogoAndTitleScreenFormData {
  logo: SpotlightLogoFormData;
  background: string;
  title: LocalizableTextFormData;
  titleStyle: "" | "fancy" | "fancy shine";
  subtitle: LocalizableTextFormData;
  primaryButton: SpotlightButtonFormData;
  secondaryButton: SpotlightButtonFormData;
  dismissButton: SpotlightDismissButtonFormData;
}

export function defaultSpotlightButtonFormData({
  enabled,
}: {
  enabled: boolean;
}): SpotlightButtonFormData {
  return {
    enabled,
    label: defaultLocalizableTextFormData({ rich: false }),
    action: {
      navigate: true,
      dismiss: false,
      type: "",
      data: "",
    },
  };
}
