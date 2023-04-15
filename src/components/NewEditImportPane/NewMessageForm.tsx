/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";

import FormRow from "../FormRow";
import { MessageTemplate } from "../Wizard/messageTypes";
import {
  RegisteredFormControl,
  RegisteredFormCheck,
} from "../RegisteredFormControl";
import { NewMessageFormProps } from "./propTypes";

interface NewMessageFormData {
  id: string;
  template: MessageTemplate;
}

export default function NewMessageForm({ onNewMessage }: NewMessageFormProps) {
  const formContext = useForm<NewMessageFormData>({ mode: "onChange" });
  const {
    register,
    handleSubmit,
    formState: { isDirty, isValid },
  } = formContext;

  const onSubmit: SubmitHandler<NewMessageFormData> = (data) => {
    onNewMessage(data.id, data.template);
  };

  return (
    <>
      <Card.Title>Create a New Message</Card.Title>
      <Form onSubmit={handleSubmit(onSubmit)} className="new-form">
        <FormProvider {...formContext}>
          <FormRow label="Message ID" controlId="id">
            <RegisteredFormControl
              name="id"
              register={register}
              registerOptions={{ required: true }}
              type="text"
              className="input-monospace"
            />
          </FormRow>

          <FormRow label="Template">
            <RegisteredFormCheck
              name="template"
              register={register}
              registerOptions={{ required: true }}
              type="radio"
              label="CFR"
              value="cfr"
              id="message-template-cfr"
              disabled
            />
            <RegisteredFormCheck
              name="template"
              register={register}
              registerOptions={{ required: true }}
              type="radio"
              label="InfoBar"
              value="infobar"
              id="message-template-infobar"
              defaultChecked
            />
            <RegisteredFormCheck
              name="template"
              register={register}
              registerOptions={{ required: true }}
              type="radio"
              label="Multi-Stage Spotlight"
              value="spotlight"
              id="message-template-multistage-spotlight"
            />
            <RegisteredFormCheck
              name="template"
              register={register}
              registerOptions={{ required: true }}
              type="radio"
              label="Private Browsing New Tab"
              value="pbnewtab"
              id="message-template-pbnewtab"
              disabled
            />
          </FormRow>

          <div className="form-row form-buttons">
            <Button type="submit" disabled={!isDirty || !isValid}>
              Next
            </Button>
          </div>
        </FormProvider>
      </Form>
    </>
  );
}
