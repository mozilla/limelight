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
import { RegisteredFormControl } from "../../RegisteredFormControl";
import { validateJsonAsObject } from "../validators";
import deserialize from "../deserializers";
import ErrorMessage from "../../ErrorMessage";
import { useToastsContext } from "../../../hooks/useToasts";
import { ImportMessageFormProps } from "./propTypes";

interface JsonMessageImportFormData {
  messageJson: string;
}

export default function JsonMessageImportForm({
  onImportMessage,
}: ImportMessageFormProps) {
  const { addToast } = useToastsContext();
  const formContext = useForm<JsonMessageImportFormData>({ mode: "onChange" });
  const {
    register,
    handleSubmit,
    formState: { isDirty, isValid },
    setError,
  } = formContext;

  const onSubmit: SubmitHandler<JsonMessageImportFormData> = (
    data: JsonMessageImportFormData
  ) => {
    const json = JSON.parse(data.messageJson) as Record<string, unknown>;
    let result;

    try {
      result = deserialize(json);
    } catch (e) {
      setError("messageJson", {
        message: `Could not import message: ${String(e)}`,
      });
      console.error(e);
      return;
    }

    if (result.warnings.length) {
      console.warn(`Message ${result.id} imported with warnings: `);
      for (const { field, message } of result.warnings) {
        console.warn(`[${field}]: ${message}`);
      }

      addToast(
        "Message imported with warnings",
        "See browser console for full details"
      );
    }

    onImportMessage(result.id, result.template, result.formData);
  };

  return (
    <>
      <Card.Title>Import a Message</Card.Title>
      <Form onSubmit={handleSubmit(onSubmit)} className="import-form">
        <FormProvider {...formContext}>
          <Form.Group controlId="message-json">
            <FormRow label="Message JSON" controlId="messageJson">
              <RegisteredFormControl
                as="textarea"
                name="messageJson"
                register={register}
                registerOptions={{
                  required: true,
                  validate: validateJsonAsObject,
                }}
                className="input-monospace"
              />
              <ErrorMessage name="messageJson" />
            </FormRow>
          </Form.Group>

          <div className="form-row form-buttons">
            <Button type="submit" disabled={!isValid || !isDirty}>
              Next
            </Button>
          </div>
        </FormProvider>
      </Form>
    </>
  );
}
