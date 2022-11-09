/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import LocalizableTextFormData from "../LocalizableTextInput/formData";

export type MessageTemplate =
  | "cfr"
  | "infobar"
  | "multistage-spotlight"
  | "pbnewtab";

export type LocalizableText = string | { string_id: string };
export interface InfoBarMessage {
  id: string;
  template: "infobar";
  targeting: string;
  groups?: string[];
  trigger: object;
  priority?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  order?: number;
  frequency?: {
    lifetime?: number;
    custom?: {
      period: number;
      cap: number;
    }[];
  };
  content: {
    type: "tab" | "global";
    text: LocalizableText;
    priority?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    buttons: {
      label: LocalizableText;
      primary?: boolean;
      accessKey?: string;
      supportPage?: string;
      action: object;
    }[];
  };
}

export function localizableTextToJson(
  data: LocalizableTextFormData
): LocalizableText {
  if (data.localized) {
    return { string_id: data.stringId };
  } else {
    return data.text;
  }
}
