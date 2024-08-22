/// <reference types="vitest" />
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    globals: true,
    include: ["./src/scripts/**/*.{test,spec}.?(c|m)[jt]s?(x)"],
  },
});
