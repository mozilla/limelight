/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

import { UseToasts } from "../hooks/useToasts";

interface ToastsProps {
  context: UseToasts;
}
export default function Toasts({ context }: ToastsProps) {
  const toasts = context.toasts.map((toast) => (
    <Toast key={toast.id} onClose={() => context.dismissToast(toast.id)}>
      <Toast.Header>
        <strong className="me-auto">{toast.title}</strong>
      </Toast.Header>
      <Toast.Body>
        {toast.body instanceof Function ? toast.body() : toast.body}
      </Toast.Body>
    </Toast>
  ));

  return (
    <ToastContainer position="bottom-end" className="me-2 mb-2">
      {toasts}
    </ToastContainer>
  );
}
