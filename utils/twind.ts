import { IS_BROWSER } from "$fresh/runtime.ts";
import { Configuration, setup } from "twind";
export * from "twind";
export const config: Configuration = {
  darkMode: "class",
  mode: "silent",
  theme: {
    extend: {
      fontFamily: {
        sans: "Roboto, sans-serif",
        "lateef": '"Lateef", cursive',
      },
    },
  },
  preflight: {
    "@import":
      `url('https://fonts.googleapis.com/css2?family=Lateef&display=swap');`,
    // Declare font face
  },
};
if (IS_BROWSER) setup(config);
