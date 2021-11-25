#!/usr/bin/env node

import app from "./app";

let port = process.env.PORT || "3000";
app.set("port", port);

const server = app.listen(port);