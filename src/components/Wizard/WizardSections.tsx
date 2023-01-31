/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { useFormContext } from "react-hook-form";

import FrequencyInput from "./FrequencyInput";
import MessageGroupsInput from "./MessageGroupsInput";
import PriorityInput from "./PriorityInput";
import { RegisteredFormControl } from "../RegisteredFormControl";
import {
  validateJexl,
  validateJsonAsObject,
  validateJsonAsObjectOptional,
} from "./validators";
import ErrorMessage from "../ErrorMessage";
import WizardFormData from "./formData";
import FormRow from "./FormRow";

export interface WizardSectionProps {
  label: string;
}

export function WizardSection({
  label,
  children,
}: React.PropsWithChildren<WizardSectionProps>) {
  return (
    <>
      <ListGroup.Item className="wizard-section-header">{label}</ListGroup.Item>
      <ListGroup.Item>{children}</ListGroup.Item>
    </>
  );
}

export interface WizardMetaSectionProps {
  triggerRequired: boolean;
}

export function WizardMetaSection({
  triggerRequired = false,
}: WizardMetaSectionProps) {
  const { register } = useFormContext<WizardFormData>();

  return (
    <WizardSection label="Metadata">
      <FormRow
        label="Targeting Expression"
        controlId="targeting"
        helpText="The JEXL targeting expression for the message."
      >
        <RegisteredFormControl
          name="meta.targeting"
          register={register}
          registerOptions={{
            required: true,
            validate: validateJexl,
          }}
          as="textarea"
          className="input-monospace"
          defaultValue="true"
        />
        <ErrorMessage name="meta.targeting" />
      </FormRow>

      <MessageGroupsInput />

      <FormRow
        label="Trigger"
        controlId="trigger"
        helpText="The trigger that will show this message."
      >
        <RegisteredFormControl
          name="meta.trigger"
          register={register}
          registerOptions={{
            required: triggerRequired,
            validate: triggerRequired
              ? validateJsonAsObject
              : validateJsonAsObjectOptional,
          }}
          as="textarea"
          rows={3}
          className="input-monospace"
          defaultValue="{}"
        />
        <ErrorMessage name="meta.trigger" />
      </FormRow>

      <FrequencyInput />

      <PriorityInput />
    </WizardSection>
  );
}
