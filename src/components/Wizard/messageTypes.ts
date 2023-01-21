/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import InfoBarMessageContent from "./InfoBarWizard/messageTypes";
import LocalizableText from "../LocalizableTextInput/messageTypes";
import SpotlightMessageContent from "./SpotlightWizard/messageTypes";

export type { InfoBarMessageContent };
export type { LocalizableText };
export type { SpotlightMessageContent };

export type MessageTemplate = "cfr" | "infobar" | "spotlight" | "pbnewtab";

export interface BaseMessage {
  id: string;
  targeting: string;
  groups?: string[];
  trigger?: object;
  priority?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  order?: number;
  frequency?: {
    lifetime?: number;
    custom?: {
      period: number;
      cap: number;
    }[];
  };

  [key: string]: unknown;
}

export type Message = BaseMessage &
  (
    | {
        template: "infobar";
        content: InfoBarMessageContent;
      }
    | {
        template: "spotlight";
        content: SpotlightMessageContent;
      }
  );
