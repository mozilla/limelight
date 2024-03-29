/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { PropsWithChildren } from "react";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

import { ToastsContext, UseToasts, useToastsContext } from "../hooks/useToasts";

interface ToastsProps {
  context: UseToasts;
}

function Toasts() {
  const context = useToastsContext();
  const defaultDelay = 3000;

  const toasts = context.toasts.map((toast) => (
    <Toast
      key={toast.id}
      onClose={() => context.dismissToast(toast.id)}
      autohide={toast.autohide}
      delay={defaultDelay}
    >
      <Toast.Header>
        <div className="toast-title">{toast.title}</div>
      </Toast.Header>
      <Toast.Body>
        {toast.body instanceof Function ? toast.body() : toast.body}
      </Toast.Body>
    </Toast>
  ));

  return (
    <ToastContainer
      position="bottom-end"
      className="me-2 mb-2"
      containerPosition="fixed"
    >
      {toasts}
    </ToastContainer>
  );
}

function ToastProvider({ context, children }: PropsWithChildren<ToastsProps>) {
  return (
    <ToastsContext.Provider value={context}>{children}</ToastsContext.Provider>
  );
}

export default Object.assign(Toasts, {
  Provider: ToastProvider,
});
