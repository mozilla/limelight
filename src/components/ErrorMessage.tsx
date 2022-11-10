/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Form from "react-bootstrap/Form";
import { ErrorMessage as BaseErrorMessage } from "@hookform/error-message";

interface ErrorMessageProps {
  name: string;
}

export default function ErrorMessage({ name }: ErrorMessageProps) {
  return (
    <BaseErrorMessage as={Form.Control.Feedback} type="invalid" name={name} />
  );
}
