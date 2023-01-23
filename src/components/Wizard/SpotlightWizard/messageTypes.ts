/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export default interface SpotlightMessageContent {
  template: "multistage";
  modal?: "tab" | "global";
  transitions?: boolean;
  backdrop?: string;

  screens: SpotlightScreen[];
}

export interface SpotlightScreen {
  id: string;
  content: Record<string, unknown>;
}

export interface SpotlightAction {
  navigate?: true;
  dismiss?: true;
}
