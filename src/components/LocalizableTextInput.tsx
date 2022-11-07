/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

interface AsProp<As extends React.ElementType = React.ElementType> {
  as?: As;
}

interface LocalizableTextInputProps
  extends AsProp,
    React.HTMLAttributes<HTMLElement> {
  controlPrefix: string;
  required?: boolean;
}

export default function LocalizableTextInput({
  controlPrefix,
  as: Component = "div",
  required = false,
  ...props
}: LocalizableTextInputProps) {
  const [localized, setLocalized] = useState(false);

  return (
    <Component {...props}>
      <Row>
        <div className="localized-input">
          <Form.Group controlId={`${controlPrefix}.localized`}>
            <Form.Check
              name={`${controlPrefix}.localized`}
              label="Localized?"
              checked={localized}
              onChange={(e) => setLocalized(e.target.checked)}
            />
          </Form.Group>
        </div>
      </Row>
      <Row>
        {localized ? (
          <Form.Group
            controlId={`${controlPrefix}.stringId`}
            as={React.Fragment}
          >
            <Form.Label>String ID</Form.Label>
            <div>
              <Form.Control
                type="text"
                name={`${controlPrefix}.stringId`}
                className="input-monospace"
                key="string-id"
                required={required}
              />
            </div>
          </Form.Group>
        ) : (
          <Form.Group controlId={`${controlPrefix}.text`} as={React.Fragment}>
            <Form.Label>Text</Form.Label>
            <div>
              <Form.Control
                as="textarea"
                name={`${controlPrefix}.text`}
                key="text"
                rows={1}
                required={required}
              />
            </div>
          </Form.Group>
        )}
      </Row>
    </Component>
  );
}
