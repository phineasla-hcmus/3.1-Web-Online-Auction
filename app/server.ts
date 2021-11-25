#!/usr/bin/env node

import errorhandler from "errorhandler";
import app from "./app";

if (process.env.NODE_ENV === "development") {
  // Only use in development
  app.use(errorhandler());
}

const port = process.env.PORT || "3000";
app.set("port", port);

const server = app.listen(port, () => {
  if (process.env.NODE_ENV === "development")
    console.log("App is running at http://localhost:%d", port);
});

export default server;
