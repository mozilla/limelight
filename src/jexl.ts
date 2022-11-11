/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import mozjexl from "mozjexl";

const jexl = new mozjexl.Jexl();

jexl.addTransforms({
  date: (s: unknown) => (typeof s === "string" ? new Date(s) : undefined),
  stableSample: () => false,
  bucketSample: () => false,
  preferenceValue: () => false,
  preferenceIsUserSet: () => false,
  preferenceExists: () => false,
  keys: () => [],
  length: () => 0,
  mapToProperty: () => [],
  regExpMatch: () => false,
  versionCompare: () => 0,
});

jexl.addBinaryOp("intersection", 40, (): unknown[] => []);

export default function evalJexl(
  expr: string,
  context: object = {}
): Promise<unknown> {
  return jexl.eval(expr, context);
}
