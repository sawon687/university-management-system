import "dotenv/config";
import { defineConfig, env } from "prisma/config";
import config from '../univercity-management-system/src/config'

export default defineConfig({
  schema: "prisma/model",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: config.dbUrl,
  },
});

