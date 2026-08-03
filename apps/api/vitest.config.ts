import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    env: {
      NODE_ENV: "test",
      DATABASE_URL: "postgresql://connosr:connosr@localhost:5432/connosr_test",
      JWT_ACCESS_SECRET: "test-access-secret-please-change",
      JWT_REFRESH_SECRET: "test-refresh-secret-please-change",
      S3_ENDPOINT: "http://localhost:9000",
      S3_BUCKET: "connosr-photos-test",
      S3_ACCESS_KEY_ID: "test",
      S3_SECRET_ACCESS_KEY: "test",
      S3_FORCE_PATH_STYLE: "true",
    },
  },
});
