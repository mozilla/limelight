/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useFormContext } from "react-hook-form";

import FormRow from "../FormRow";
import InfoBarButtonsInput from "../inputs/InfoBarButtonsInput";
import LocalizableTextInput from "../inputs/LocalizableTextInput";
import InfoBarWizardFormData from "./formData";
import {
  RegisteredFormCheck,
  RegisteredFormRange,
} from "../RegisteredFormControl";
import TabOrGlobalInput from "../inputs/TabOrGlobalInput";
import { WizardSection } from "../Wizard/WizardSections";

const PRIORITIES = [
  "System",
  "Info (Low)",
  "Info (Medium)",
  "Info (High)",
  "Warning (Low)",
  "Warning (Medium)",
  "Warning (High)",
  "Critical (Low)",
  "Critical (Medium)",
  "Critical (High)",
];

export default function InfoBarWizard() {
  const { register, watch } = useFormContext<InfoBarWizardFormData>();
  const priority = watch("content.priority") ?? { enabled: false, value: 0 };

  return (
    <WizardSection label="InfoBar Content">
      <LocalizableTextInput
        controlPrefix="content.text"
        label="Text"
        helpText="The text of the infobar. Localized text uses a Fluent string ID."
        required
      />

      <InfoBarButtonsInput />

      <TabOrGlobalInput controlId="content.type" label="Type" />

      <FormRow
        label="Priority"
        controlId="content-priority"
        containerClassName="form-input-range infobar-priority-input"
      >
        <Row>
          <div>
            <RegisteredFormCheck
              name="content.priority.enabled"
              register={register}
              label="Set Priority"
            />
          </div>
        </Row>
        <Row>
          <div className="priority-input">
            <RegisteredFormRange
              name="content.priority.value"
              register={register}
              registerOptions={{ valueAsNumber: true }}
              min={0}
              max={9}
              defaultValue={0}
              disabled={!priority.enabled}
            />
          </div>
          <Form.Text className="priority-text">
            {PRIORITIES[priority?.value ?? 0]}
          </Form.Text>
          <Form.Text>
            Determines the appearance of the notification, based on the
            severity. Only the notification with the highest severity is
            displayed.
          </Form.Text>
        </Row>
      </FormRow>
    </WizardSection>
  );
}
