import { defineTheme } from "pinceau";
import colors from "tailwindcss/colors";

export default defineTheme({
  font: { sans: "Inter var" },
  color: {
    primary: {
      50: colors.indigo[50],
      100: colors.indigo[100],
      200: colors.indigo[200],
      300: colors.indigo[300],
      400: colors.indigo[400],
      500: colors.indigo[500],
      600: colors.indigo[600],
      700: colors.indigo[700],
      800: colors.indigo[800],
      900: colors.indigo[900],
    },
    gray: {
      50: colors.slate[50],
      100: colors.slate[100],
      200: colors.slate[200],
      300: colors.slate[300],
      400: colors.slate[400],
      500: colors.slate[500],
      600: colors.slate[600],
      700: colors.slate[700],
      800: colors.slate[800],
      900: colors.slate[900],
    },
  },
});
