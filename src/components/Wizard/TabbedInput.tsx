/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import classNames from "classnames";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  useFieldArray,
  useFormContext,
  FieldArray,
  FieldArrayWithId,
  UseFieldArrayProps,
} from "react-hook-form";

import WizardFormData from "./formData";

type FieldNames = "content.buttons";

export interface TabInputProps {
  field: FieldArrayWithId<WizardFormData, FieldNames>;
  index: number;
  handleDelete: () => void;
}

interface TabbedInputProps {
  controlPrefix: FieldNames;
  className?: string;
  renderTab: (props: TabInputProps) => JSX.Element;
  emptyTabs: string | (() => JSX.Element);
  focusName?: string;
  defaults: () => FieldArray<WizardFormData, FieldNames>;
  addText: string;
  rules?: UseFieldArrayProps["rules"];
}

export default function TabbedInput({
  className = undefined,
  controlPrefix,
  emptyTabs,
  renderTab,
  focusName,
  defaults,
  addText,
  rules = {},
}: TabbedInputProps) {
  const { control } = useFormContext<WizardFormData>();
  const { fields, append, remove } = useFieldArray<WizardFormData, FieldNames>({
    control,
    name: controlPrefix,
    rules: rules,
  });

  // The currently active tab is stored as its index converted to a string.
  const [activeKey, setActiveKey] = useState<string | null>(
    fields.length ? "0" : null
  );

  const tabs = fields.map((field, idx) => (
    <Nav.Item key={field.id}>
      <Nav.Link eventKey={idx}>{idx}</Nav.Link>
    </Nav.Item>
  ));

  const handleAdd = () => {
    const index = fields.length.toString();
    setActiveKey(index);
    append(defaults(), {
      focusName: focusName
        ? `${controlPrefix}.${index}.${focusName}`
        : undefined,
    });
  };

  const tabContents = fields.length
    ? fields.map((field, index) => {
        const handleDelete = () => {
          if (activeKey && activeKey === String(index)) {
            if (index > 0) {
              setActiveKey((index - 1).toString());
            } else if (index === 0 && fields.length === 1) {
              setActiveKey(null);
            }
            // If we are deleting the first button and there is another button, we
            // just stay at the same tab and therefore don't have to change the
            // activeKey.
          }

          remove(index);
        };

        const content = renderTab({ field, handleDelete, index });
        return (
          <Tab.Pane eventKey={index} key={field.id} as="fieldset">
            {content}
          </Tab.Pane>
        );
      })
    : typeof emptyTabs === "string"
    ? emptyTabs
    : emptyTabs();

  return (
    <Card className={classNames("tabbed-input", className)}>
      <Tab.Container activeKey={activeKey ?? undefined} onSelect={setActiveKey}>
        <Card.Header>
          <Nav variant="tabs">
            {tabs}
            <div className="tabs-controls">
              <Nav.Item>
                <Button
                  onClick={handleAdd}
                  className="new-button"
                  title={addText}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </Button>
              </Nav.Item>
            </div>
          </Nav>
        </Card.Header>
        <Card.Body>
          <Tab.Content>{tabContents}</Tab.Content>
        </Card.Body>
      </Tab.Container>
    </Card>
  );
}
