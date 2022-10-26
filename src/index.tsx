/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createRoot } from "react-dom/client";

import App from "./components/App";

document.addEventListener("DOMContentLoaded", () => {
  const appElement = document.getElementById("app");
  if (appElement) {
    const root = createRoot(appElement);
    root.render(<App />);
  }
});
