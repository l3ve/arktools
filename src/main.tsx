import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { css, Global } from "@emotion/react";
import styled from "@emotion/styled";
import { invoke } from "@tauri-apps/api/tauri";

// 加载 global 样式
const globalStyle = css`
  html {
    height: 100%;
    overflow: hidden;
    background: #f2f2f2;
  }
  body {
    box-sizing: border-box;
    height: 100%;
    margin: 0;
  }

  #container {
    box-sizing: border-box;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
`;

const List = styled.div``;

function ArkTools() {
  let [va, setva] = useState("");
  async function greet() {
    let v = await invoke<string>("get_clipboard", {
      name: "L3ve",
    });
    console.log("v", v);
    setva(v);
  }

  useEffect(() => {}, []);

  return (
    <>
      <Global styles={globalStyle}></Global>
      <List onClick={greet}>11111</List>
      <List>{va}</List>
    </>
  );
}

const container = document.getElementById("container")!;
const root = createRoot(container);
root.render(<ArkTools />);
