/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";

import App from "./components/App";
import EditMessagePage from "./components/routes/EditMessagePage";
import HomePage from "./components/routes/HomePage";
import ImportMessagePage from "./components/routes/ImportMessagePage";
import NewMessagePage from "./components/routes/NewMessagePage";

// Parcel exposes environment variables via process.env.VAR.
// This must be kept in sync with the @parcel/transformer-js entry in
// package.json.
declare const process: {
  env: {
    SENTRY_DSN?: string;
    SENTRY_RELEASE?: string;
  };
};

document.addEventListener("DOMContentLoaded", () => {
  const appElement = document.getElementById("app");
  if (appElement) {
    const root = createRoot(appElement);
    const sentryConfig = {
      dsn: process.env.SENTRY_DSN,
      release: process.env.SENTRY_RELEASE,
    };

    const router = createHashRouter([
      {
        path: "/",
        element: <App sentryConfig={sentryConfig} />,
        children: [
          {
            path: "/",
            element: <HomePage />,
          },
          {
            path: "/new",
            element: <NewMessagePage />,
          },
          {
            path: "/edit/:messageId",
            element: <EditMessagePage />,
          },
          {
            path: "/import",
            element: <ImportMessagePage />,
          },
        ],
      },
    ]);

    root.render(<RouterProvider router={router} />);
  }
});
