/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useFormContext } from "react-hook-form";

import InfoBarButtonsInput from "./InfoBarButtonsInput";
import LocalizableTextInput from "../../LocalizableTextInput";
import InfoBarWizardFormData from "./formData";
import {
  RegisteredFormCheck,
  RegisteredFormRange,
} from "../../RegisteredFormControl";

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
    <>
      <LocalizableTextInput
        controlPrefix="content.text"
        label="Text"
        helpText="The text of the infobar. Localized text uses a Fluent string ID."
        required
      />

      <InfoBarButtonsInput />

      <Row className="form-row">
        <span className="form-label">Type</span>
        <div className="form-input form-input-check">
          <div>
            <RegisteredFormCheck
              name="content.type"
              register={register}
              id="content-type-tab"
              type="radio"
              label="Tab"
              value="tab"
              defaultChecked
            />
            <Form.Text>The InfoBar will be shown on a single tab.</Form.Text>
          </div>
          <div>
            <RegisteredFormCheck
              name="content.type"
              register={register}
              id="content-type-global"
              type="radio"
              label="Global"
              value="global"
            />
            <Form.Text>
              The InfoBar will be shown browser-wide, across all tabs.
            </Form.Text>
          </div>
        </div>
      </Row>

      <Form.Group as={Row} controlId="content-priority" className="form-row">
        <Form.Label>Priority</Form.Label>
        <div className="form-input form-input-range infobar-priority-input">
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
        </div>
      </Form.Group>
    </>
  );
}
