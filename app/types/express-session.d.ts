/**
 * Naming this file express-session.d.ts causes imports from "express-session"
 * to reference this file and not the node_modules package.
 */

import { SessionData } from "express-session";

declare module "express-session" {
  interface SessionData {
    returnTo: string;
  }
}
