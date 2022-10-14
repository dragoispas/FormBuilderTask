// src/server/router/index.ts
import { t } from "../trpc";

import { exampleRouter } from "./example";
import { formsRouter } from "./forms";

export const appRouter = t.router({
  example: exampleRouter,
  forms: formsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
