import { css } from "@emotion/react";

import * as style from "./style";

const GlobalStyles = css`
  html,
  body,
  #root,
  .MuiContainer-root {
    height: 100%;
    margin: 0;
    padding: 0;
    font-family: ${style.fontFamily};
    background-color: #fffbff;
  }
`;

export default GlobalStyles;
