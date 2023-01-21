/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/**
 * Context for deserialization.
 *
 * This class keeps track of the current path into the object being deserialized for issuing warnings.
 */
export default class DeserializationContext {
  warnings: { field: string; message: string }[];
  path: string;

  constructor() {
    this.warnings = [];
    this.path = "";
  }

  /**
   * Issue a deserialization warning about the current field or a child field.
   */
  warn(field: string, message: string): void;
  warn(message: string): void;
  warn(...args: [string] | [string, string]): void {
    let field: string;
    let message: string;

    if (args.length === 1) {
      field = this.path;
      message = args[0];
    } else {
      field = this.path.length ? `${this.path}.${args[0]}` : args[0];
      message = args[1];
    }

    this.warnings.push({ field, message });
  }

  /**
   * Return a deserialization error about the current field or a child field.
   *
   * @example
   *     const ctx = new DeserializationContext().field("content");
   *     throw ctx.error("missing required field label");
   */
  error(message: string): Error;
  error(field: string, message: string): Error;
  error(...args: [string] | [string, string]): Error {
    let field: string;
    let message: string;

    if (args.length === 1) {
      field = this.path;
      message = args[0];
    } else {
      field = this.path ? `${this.path}.${args[0]}` : args[0];
      message = args[1];
    }

    return new Error(`${field}: ${message}`);
  }

  /**
   * Create a new DeserializationContext for the given child field.
   */
  field(fieldName: string): DeserializationContext {
    const child = new DeserializationContext();

    // Share warnings between all instances.
    child.warnings = this.warnings;
    child.path = this.path.length ? `${this.path}.${fieldName}` : fieldName;

    return child;
  }

  warnOnUnknown(object: object, knownProperties: string[]) {
    for (const field of Object.keys(object)) {
      if (!knownProperties.includes(field)) {
        this.warn(field, "Field was not deserialized");
      }
    }
  }
}
