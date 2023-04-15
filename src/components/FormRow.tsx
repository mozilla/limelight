/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import classNames from "classnames";
import React from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

export interface FormRowProps {
  label: string;
  controlId?: string;
  helpText?: string;
  column?: boolean;
  containerClassName?: string;
}

export default function FormRow({
  label,
  controlId,
  children,
  helpText,
  column = false,
  containerClassName,
}: React.PropsWithChildren<FormRowProps>) {
  const Container = controlId ? Form.Group : column ? Col : Row;
  const containerProps = controlId
    ? {
        as: column ? Col : Row,
        controlId,
      }
    : undefined;

  const className = column ? "form-col" : "form-row";

  return (
    <Container {...containerProps} className={className}>
      <Form.Label>{label}</Form.Label>
      <div className={classNames("form-input", containerClassName)}>
        {children}
      </div>
      {helpText && <Form.Text className="row-help-text">{helpText}</Form.Text>}
    </Container>
  );
}
