/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export interface RichTextProperties {
  zap?: boolean;
  color?: string;
  fontSize?: string;
  fontWeight?: number;
  letterSpacing?: string;
  lineHeight?: string;
  marginBlock?: string;
  marginInline?: string;
  paddingBlock?: string;
  paddingInline?: string;
}

export default interface LocalizableTextFormData {
  localized: boolean;
  value: string;
  rich?: RichTextProperties;
}
