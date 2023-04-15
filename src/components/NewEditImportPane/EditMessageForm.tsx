/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import FormRow from "../FormRow";
import { RegisteredFormCheck } from "../RegisteredFormControl";
import { EditMessageFormProps } from "./propTypes";

interface EditMessageFormData {
  id: string;
}

export default function EditMessageForm({
  onEditMessage,
  onDeleteMessage,
  messages,
}: EditMessageFormProps) {
  const formContext = useForm<EditMessageFormData>({ mode: "onChange" });
  const {
    register,
    handleSubmit,
    formState: { isDirty, isValid },
  } = formContext;

  const onSubmit: SubmitHandler<EditMessageFormData> = (data) => {
    onEditMessage(data.id);
  };

  const messageIds = Object.keys(messages);

  return (
    <>
      <Card.Title>Edit an Existing Message</Card.Title>

      <Form onSubmit={handleSubmit(onSubmit)} className="edit-form">
        <FormProvider {...formContext}>
          {messageIds.length ? (
            <FormRow
              label="Select Message"
              containerClassName="form-input-check"
            >
              {messageIds.map((id) => (
                <Row className="edit-entry" key={id}>
                  <RegisteredFormCheck
                    name="id"
                    register={register}
                    registerOptions={{ required: true }}
                    type="radio"
                    key={id}
                    label={id}
                    value={id}
                    id={`message-select-${id}`}
                  />
                  <div className="delete-col">
                    <Button
                      key={`delete-${id}`}
                      type="button"
                      variant="danger"
                      onClick={() => onDeleteMessage(id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </div>
                </Row>
              ))}
            </FormRow>
          ) : (
            <Card.Text>There are no messages saved.</Card.Text>
          )}
        </FormProvider>

        <div className="form-row form-buttons">
          <Button type="submit" disabled={!isDirty || !isValid}>
            Next
          </Button>
        </div>
      </Form>
    </>
  );
}
