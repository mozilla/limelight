/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useFormContext } from "react-hook-form";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import FormRow from "../FormRow";
import SpotlightWizardFormData from "./formData";
import {
  RegisteredFormCheck,
  RegisteredFormControl,
} from "../../RegisteredFormControl";
import ErrorMessage from "../../ErrorMessage";

interface SpotlightLogoInputProps {
  controlPrefix: `content.screens.${number}.content.logo`;
}

export default function SpotlightLogoInput({
  controlPrefix,
}: SpotlightLogoInputProps) {
  const { register, watch } = useFormContext<SpotlightWizardFormData>();
  const hasImageURL = watch(`${controlPrefix}.hasImageURL`);

  return (
    <FormRow label="Logo" containerClassName="form-input-check">
      <Row className="form-row">
        <Form.Group className="form-input-check">
          <RegisteredFormCheck
            name={`${controlPrefix}.hasImageURL`}
            register={register}
            label="Show logo?"
            className="input-form-check"
          />
          <Form.Text className="row-help-text">
            Whether to show the logo. If not shown, it will stil take up
            vertical space as dictated by the logo height field.
          </Form.Text>
        </Form.Group>
      </Row>
      <FormRow
        label="URL"
        controlId={`${controlPrefix}.imageURL`}
        helpText="The URL of the logo."
      >
        <RegisteredFormControl
          name={`${controlPrefix}.imageURL`}
          register={register}
          registerOptions={{
            required: hasImageURL,
            validate: hasImageURL ? validateAsUri : undefined,
          }}
          disabled={!hasImageURL}
          type="text"
        />
        <ErrorMessage name={`${controlPrefix}.imageURL`} />
      </FormRow>
      <FormRow
        label="Height"
        controlId={`${controlPrefix}.height`}
        helpText="The height of the image"
      >
        <RegisteredFormControl
          name={`${controlPrefix}.height`}
          register={register}
          type="text"
        />
      </FormRow>
    </FormRow>
  );
}

function validateAsUri(s: string) {
  try {
    new URL(s);
  } catch (ex) {
    return "Invalid URL.";
  }
}
