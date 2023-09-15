// Source of truth for styles that are used between both Material UI theme and custom Emotion components

export const fontFamily = "Roboto";

interface ColorProps {
  [key: string]: string;
}

export const colors: ColorProps = {
  primary: "#6750A4",
  primaryContainer: "#EADDFF",
  onPrimaryContainer: "#21005D",
  secondary: "#625B71",
  error: "#B3261E",
};
