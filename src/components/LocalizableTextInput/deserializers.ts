/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import DeserializationContext from "../Wizard/deserializers/context";
import LocalizableTextFormData from "./formData";
import LocalizableText from "./messageTypes";

export default function deserializeLocalizableText(
  ctx: DeserializationContext,
  data: LocalizableText
): LocalizableTextFormData {
  if (typeof data === "string") {
    return {
      localized: false,
      value: data,
    };
  }

  // TODO: Support RichTextProperties presets.

  if ("raw" in data) {
    return {
      localized: false,
      value: data.raw,
    };
  }

  return {
    localized: true,
    value: data.string_id,
  };
}
