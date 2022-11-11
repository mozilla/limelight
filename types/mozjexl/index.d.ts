/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

type BinaryOperator = (arg0: unknown, arg1: unknown) => unknown;
type UnaryOperator = (arg0: unknown) => unknown;
type Callback = (error: Error | null, value?: unknown) => unknown;
type Transform = (value: unknown, args: object, arg2: Callback) => unknown;
type Transforms = {
  [key: string]: Transform;
};

declare module "mozjexl" {
  class Jexl {
    constructor();

    addBinaryOp(operator: string, precedence: number, fn: BinaryOperator): void;

    addUnaryOp(operator: string, fn: UnaryOperator): void;

    addTransform(name: string, fn: Transform): void;

    addTransforms(transforms: Transforms): void;

    getTransform(name: string): Transform | undefined;

    eval(expression: string, cb?: Callback): Promise<unknown>;
    eval(expression: string, context?: object, cb?: Callback): Promise<unknown>;

    removeOp(operator: string): void;
  }
}
