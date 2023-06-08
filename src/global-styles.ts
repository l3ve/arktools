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
    height: 100%;
    background: #f2f2f2;
  }

  body {
    height: 100%;
    overflow: hidden;
    margin: 0;
    font-family: system-ui, sans-serif;
  }
`;

export const globalCSS = css`
  #container {
    box-sizing: border-box;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
`;
