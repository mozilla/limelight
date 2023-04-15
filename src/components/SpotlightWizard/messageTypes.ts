/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import LocalizableText from "../inputs/LocalizableTextInput/messageTypes";

export default interface SpotlightMessageContent {
  template: string;
  modal?: "tab" | "global";
  transitions?: boolean;
  backdrop?: string;

  screens: SpotlightScreen[];
}

export interface SpotlightScreen {
  id: string;
  content: Record<string, unknown>;

  [key: string]: unknown;
}

export interface SpotlightAction {
  navigate?: true;
  dismiss?: true;
}

export interface LogoAndTitleScreenContent {
  logo: SpotlightLogo;
  background?: string;
  title: LocalizableText;
  title_style?: "fancy" | "fancy shine";
  subtitle?: LocalizableText;
  primary_button: SpotlightButton;
  secondary_button?: SpotlightButton;
  dismiss_button?: SpotlightDismissButton;

  [key: string]: unknown;
}

export interface SpotlightLogo {
  imageURL?: string;
  height?: string;
}

export interface SpotlightButton {
  label: LocalizableText;
  action: SpotlightAction & {
    type?: string;
    data?: Record<string, unknown>;
  };
}

export interface SpotlightDismissButton {
  action: {
    dismiss?: boolean;
  };
}
