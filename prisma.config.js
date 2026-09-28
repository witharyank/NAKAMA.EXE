require('dotenv/config');
const { defineConfig, env } = require('prisma/config');

if (process.env.POSTGRES_PRISMA_URL) {
  process.env.DATABASE_URL = process.env.POSTGRES_PRISMA_URL;
}

module.exports = defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
