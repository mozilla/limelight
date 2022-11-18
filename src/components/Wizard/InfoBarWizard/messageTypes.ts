/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import LocalizableText from "../../LocalizableTextInput/messageTypes";

export default interface InfoBarMessageContent {
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
}
