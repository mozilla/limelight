/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as R from "remeda";

import DeserializationContext from "../Wizard/deserializers/context";
import LocalizableTextFormData, {
  defaultLocalizableTextFormData,
} from "./formData";
import LocalizableText, { RichTextProperties } from "./messageTypes";

export default function deserializeLocalizableText(
  ctx: DeserializationContext,
  data: LocalizableText | undefined,
  { richTextPreset }: { richTextPreset?: RichTextProperties } = {}
): LocalizableTextFormData {
  if (typeof data === "undefined") {
    return defaultLocalizableTextFormData({ rich: !!richTextPreset });
  }

  if (typeof data === "string") {
    if (richTextPreset) {
      ctx.warn(
        "Expected { raw } object instead of literal string. Rich text presets are not supported on literal strings."
      );
    }

    return {
      localized: false,
      value: data,
      rich: false,
    };
  }

  // The type checker can't unify the union type in LocalizedText with a Record
  // type, so we cast to work around it. Properties don't need to be present to
  // be omitted.
  const richTextProperties: RichTextProperties = R.omit(
    data as Record<"raw" | "string_id", string> & RichTextProperties,
    ["string_id", "raw"]
  );

  let rich = false;
  if (Object.keys(richTextProperties).length) {
    if (richTextPreset) {
      rich = true;

      if (!R.equals(richTextPreset, richTextProperties)) {
        ctx.warn(
          "Rich text properties did not match expected preset; deserializing as if they did"
        );
      }
    } else {
      ctx.warn("Rich text not supported");
    }
  }

  if ("raw" in data) {
    return {
      localized: false,
      value: data.raw,
      rich,
    };
  }

  return {
    localized: true,
    value: data.string_id,
    rich,
  };
}
