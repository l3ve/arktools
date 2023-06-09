import { css } from "@emotion/react";

export const resetCSS = css`
  input,
  button,
  div,
  p {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  button,
  input {
    outline: none;
    border: 0;
    background-color: #0000;
  }

  html {
    background: #f2f2f2;
  }

  body {
    margin: 0;
    overflow: hidden;
    font-family: system-ui, sans-serif;
  }
`;

export const globalCSS = css`
  #container {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
  }
`;
