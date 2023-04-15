/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import DeserializationContext from "./context";
import { BaseMessage, Message, MessageTemplate } from "../messageTypes";
import WizardFormData from "../formData";

import deserializeInfoBarContent from "../../InfoBarWizard/deserializers";
import deserializeSpotlightContent from "../../SpotlightWizard/deserializers";

export interface DeserializeResult {
  id: string;
  template: MessageTemplate;
  formData: WizardFormData;
  warnings: DeserializationContext["warnings"];
}

export default function deserialize(
  data: Record<string, unknown>
): DeserializeResult {
  // TODO: More rigorous validation.
  const REQUIRED = ["id", "targeting"];

  const ctx = new DeserializationContext();

  for (const key of REQUIRED) {
    if (!Object.hasOwn(data, key)) {
      throw ctx.error(key, `Missing required field`);
    }
  }

  const message = data as unknown as Message;

  const SUPPORTED_TEMPLATES = ["infobar", "spotlight"];

  if (!SUPPORTED_TEMPLATES.includes(message.template)) {
    throw ctx.error(
      "template",
      `Unsupported message template: '${message.template}'`
    );
  }

  if (["cfr", "infobar"].includes(message.template)) {
    if (!Object.hasOwn(data, "trigger")) {
      throw ctx.error("trigger", `Missing required field`);
    }
  }

  let content: WizardFormData["content"];

  switch (message.template) {
    case "infobar":
      content = deserializeInfoBarContent(
        ctx.field("content"),
        message.content
      );
      break;

    case "spotlight":
      content = deserializeSpotlightContent(
        ctx.field("content"),
        message.content
      );
      break;
  }

  ctx.warnOnUnknown(data, [
    "id",
    "template",
    "content",
    "targeting",
    "groups",
    "trigger",
    "frequency",
    "priority",
    "order",
  ]);

  return {
    id: message.id,
    template: message.template,
    formData: {
      content,
      meta: deserializeBaseMessage(ctx, message),
    },
    warnings: ctx.warnings,
  };
}

export function deserializeBaseMessage(
  ctx: DeserializationContext,
  data: BaseMessage
): WizardFormData["meta"] {
  const hasPriority = typeof data.priority !== "undefined";
  return {
    targeting: data.targeting,
    groups: data.groups ?? [],
    trigger: data.trigger ? JSON.stringify(data.trigger, null, 2) : "",
    frequency: {
      lifetime: {
        enabled: !!data.frequency?.lifetime,
        value: data.frequency?.lifetime ?? 1,
      },
      custom: data.frequency?.custom ?? [],
    },
    priority: {
      enabled: hasPriority,
      value: data.priority ?? 0,
      order: hasPriority ? data.order ?? 0 : 0,
    },
  };
}
