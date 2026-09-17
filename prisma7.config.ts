import { defineConfig } from "prisma/config";

import config from "./src/config";

export default defineConfig({
  schema: "prisma/model",

  migrations: {
    path: "prisma/migrations",
  },

  datasource: {
    url: config.dbUrl,
  },
});

