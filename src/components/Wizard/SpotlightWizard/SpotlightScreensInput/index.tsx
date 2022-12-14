/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFormContext } from "react-hook-form";
import TabbedInput, { TabInputProps } from "../../TabbedInput";

import FormRow from "../../FormRow";
import SpotlightWizardFormData, { SpotlightScreenFormData } from "../formData";
import { RegisteredFormControl } from "../../../RegisteredFormControl";
import ScreenPicker from "./ScreenPicker";
import { SpotlightScreenKind } from "./screens";
import LogoAndTitleScreen from "./LogoAndTitleScreen";
import ErrorMessage from "../../../ErrorMessage";

function defaults(): SpotlightScreenFormData {
  return {
    kind: undefined,
  };
}

const controlPrefix = "content.screens";

const SCREEN_COMPONENTS = {
  [SpotlightScreenKind.LogoAndTitle]: LogoAndTitleScreen,
} as const;

export default function SpotlightScreensInput() {
  const { formState, getFieldState } =
    useFormContext<SpotlightWizardFormData>();
  const { error } = getFieldState(`content.screens`, formState);

  const renderTab = ({ field, index, handleDelete }: TabInputProps) => (
    <ScreenInput key={field.id} index={index} handleDelete={handleDelete} />
  );

  const emptyTabs = () => {
    const className = error ? "is-invalid" : undefined;
    return (
      <>
        <span className={className}>There are no screens</span>
        <ErrorMessage name="content.screens.root" />
      </>
    );
  };

  return (
    <TabbedInput
      controlPrefix="content.screens"
      emptyTabs={emptyTabs}
      addText="Add screen"
      renderTab={renderTab}
      defaults={defaults}
      rules={{ required: "You must create at least one screen" }}
    />
  );
}

interface ScreenInputProps {
  index: number;
  handleDelete: (index: number) => void;
}

function ScreenInput({ index, handleDelete }: ScreenInputProps) {
  const { register, watch } = useFormContext<SpotlightWizardFormData>();
  const screenControlPrefix = `${controlPrefix}.${index}` as const;

  const kind = watch(`${screenControlPrefix}.kind`);

  if (typeof kind === "undefined") {
    return <ScreenPicker index={index} />;
  }

  const Component = SCREEN_COMPONENTS[kind];

  return (
    <>
      <FormRow label="Screen ID" controlId={`${screenControlPrefix}.screenId`}>
        <RegisteredFormControl
          name={`${screenControlPrefix}.screenId`}
          className="input-monospace"
          register={register}
          registerOptions={{ required: true }}
        />
      </FormRow>

      <Component controlPrefix={`${screenControlPrefix}.content`} />

      <Row className="form-row form-buttons">
        <Col>
          <Button variant="danger" onClick={() => handleDelete(index)}>
            <FontAwesomeIcon icon={faTrash} /> Delete
          </Button>
        </Col>
      </Row>
    </>
  );
}
