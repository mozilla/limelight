/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import evalJexl from "../../jexl";

/**
 * Validate the given string parses as a JSON object.
 */
export function validateJsonAsObject(s: string): true | string {
  let obj: unknown;

  try {
    obj = JSON.parse(s);
  } catch (e) {
    return "Could not parse JSON";
  }

  if (typeof obj !== "object" || obj === null) {
    return "Expected a JSON object";
  }

  return true;
}

export async function validateJexl(s: string): Promise<true | string> {
  try {
    await evalJexl(s);
  } catch (e) {
    return String(e);
  }

  return true;
}
