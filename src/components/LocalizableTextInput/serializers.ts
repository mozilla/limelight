/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import LocalizableTextFormData from "./formData";
import LocalizableText, { RichTextProperties } from "./messageTypes";

export default function serializeLocalizableText(
  data: LocalizableTextFormData,
  richTextPreset?: RichTextProperties
): LocalizableText {
  if (!richTextPreset && !data.localized) {
    return data.value;
  }

  let text: LocalizableText;
  if (data.localized) {
    text = { string_id: data.value };
  } else {
    text = { raw: data.value };
  }

  if (data.rich) {
    Object.assign(text, richTextPreset);
  }

  return text;
}
