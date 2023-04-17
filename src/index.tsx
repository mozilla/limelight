/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect, useRef } from "react";
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

    let nimbusEditor = undefined;
    const searchParams = new URLSearchParams(window.location.search);

    if (searchParams.has("nimbus-editor") && searchParams.get("nimbus-branch-slug") /* && window.opener */) {
      nimbusEditor = {
        branchSlug: searchParams.get("nimbus-branch-slug")!,
      };
    }

    const router = createHashRouter([
      {
        path: "/",
        element: <App sentryConfig={sentryConfig} nimbusEditor={nimbusEditor} />,
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
      {
        path: "/test-editor",
        element: <TestEditor />
      },
    ]);

    root.render(<RouterProvider router={router} />);
  }
});

function TestEditor() {
  const jsonRef = useRef<HTMLTextAreaElement>(null);
  const slugRef = useRef<HTMLInputElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const winRef = useRef<Window | null>(null);

  useEffect(() => {
    window.addEventListener("message", event =>  {
      console.log(event.data.type);
      if ("branchSlug" in event.data) {
        jsonRef.current!.value = JSON.stringify(event.data.json, null, 2);
        alert(event.data.branchSlug);
      }
    });
  }, []);

  function onClick() {
    winRef.current = window.open(`http://localhost:1234/?nimbus-editor&nimbus-branch-slug=${slugRef.current!.value}`, "_blank");
    btnRef.current!.disabled = true;

    let data = {};
    try {
      data = JSON.parse(jsonRef.current!.value);
    } catch (e) {}

    function onReady(event) {
      console.log(event.data.type);
      if (!("type" in event.data) || event.data.type !== "limelight:ready") {
        return;
      }
      console.log("postmessage nimbus:edit");

      window.removeEventListener("message", onReady);
      winRef.current!.postMessage({
        type: "nimbus:edit",
        json: data,
      });
    };
    window.addEventListener("message", onReady);
  }

  return (
    <>
      <textarea name="json" ref={jsonRef} />
      <input type="text" name="branchSlug" ref={slugRef} />
      <button onClick={onClick} ref={btnRef}>
        open
      </button>
    </>
  );
}
