import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Global } from "@emotion/react";
import { invoke } from "@tauri-apps/api/tauri";
import { readText, writeText } from "@tauri-apps/api/clipboard";
import { listen, emit } from "@tauri-apps/api/event";
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/api/notification";
// @ts-ignore
window.emit = emit;
import { delay, limitTxt, genID } from "./utils";
import { globalCSS, resetCSS } from "./global-styles";
import {
  Title,
  SrcollBox,
  Item,
  Txt,
  FunBox,
  DelBtn,
  TopBtn,
} from "./component";

function ArkTools() {
  let [dataList, setDataList] = useState<
    {
      isSave: boolean;
      text: string;
      id: string;
    }[]
  >([{ isSave: false, text: "123123123123", id: "13fkefi3f" }]);
  async function get_clipboard() {
    let v = await invoke<string>("get_clipboard");
    console.log("v", v);
  }

  useEffect(() => {
    let unlisten = () => {};
    async function listenClipboard() {
      unlisten = await listen<void>("clipboard-change", async () => {
        await delay(100);
        let txt = await readText();
        if (txt) {
          let newData = [{ text: txt, isSave: false, id: genID() }].concat(
            dataList
          );
          setDataList(newData);
        }
      });
    }
    listenClipboard();
    return () => {
      unlisten();
    };
  }, [dataList]);

  async function setClipboard(txt: string) {
    await writeText(txt);
    let permissionGranted = await isPermissionGranted();
    if (!permissionGranted) {
      const permission = await requestPermission();
      permissionGranted = permission === "granted";
    }
    if (permissionGranted) {
      sendNotification(`已复制：${limitTxt(txt)}`);
    }
  }

  function deleteItem(e: React.MouseEvent<HTMLDivElement>, id: string) {
    e.stopPropagation();
    let i = dataList.findIndex((item) => {
      return item.id === id;
    });
    if (i === -1) {
      return;
    }
    let newData = dataList.slice(0, i).concat(dataList.slice(i + 1));
    setDataList(newData);
  }

  function topItem(e: React.MouseEvent<HTMLDivElement>, id: string) {
    e.stopPropagation();
    let i = dataList.findIndex((item) => {
      return item.id === id;
    });
    if (i === -1) {
      return;
    }

    let target = dataList.splice(i, 1);
    let newData = target.concat(dataList)
    setDataList(newData);
  }

  return (
    <>
      <Global styles={resetCSS} />
      <Global styles={globalCSS} />
      <Title>历史记录</Title>
      <SrcollBox>
        {dataList.map((item) => {
          return (
            <Item onClick={() => setClipboard(item.text)} key={item.id}>
              <Txt className="txt">{limitTxt(item.text)}</Txt>
              <FunBox className="fun-box">
                <TopBtn onClick={(e) => topItem(e, item.id)} />
                <DelBtn onClick={(e) => deleteItem(e, item.id)} />
                <TopBtn />
              </FunBox>
            </Item>
          );
        })}
      </SrcollBox>
    </>
  );
}

const container = document.getElementById("container")!;
const root = createRoot(container);
root.render(<ArkTools />);
