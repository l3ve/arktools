import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Global } from "@emotion/react";
import { readText, writeText } from "@tauri-apps/api/clipboard";
import { listen, emit } from "@tauri-apps/api/event";
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/api/notification";
// @ts-ignore
window.emit = emit;
import {
  delay,
  genID,
  TxtItem,
  addSave,
  getSave,
  removeSave,
  topSave,
} from "./utils";
import { globalCSS, resetCSS } from "./global-styles";
import {
  Container,
  Title,
  SrcollBox,
  SrcollPlaceholder,
  Item,
  Txt,
  FunBox,
  DelBtn,
  TopBtn,
  SaveBtn,
  Line,
} from "./component";

function ArkTools() {
  let [dataList, setDataList] = useState<TxtItem>(getSave());

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
      sendNotification(`已复制：${txt}`);
    }
  }

  async function handle(
    e: React.MouseEvent<HTMLDivElement>,
    type: "top" | "delete" | "save",
    id: string
  ) {
    e.stopPropagation();
    let i = dataList.findIndex((item) => {
      return item.id === id;
    });
    if (i === -1) {
      return;
    }
    let newData: TxtItem;
    let target = dataList[i];
    if (type === "delete") {
      newData = dataList.slice(0, i).concat(dataList.slice(i + 1));
      removeSave(target);
    }
    if (type === "top") {
      let target = dataList.splice(i, 1);
      newData = target.concat(dataList);
      topSave(target[0]);
    }
    if (type === "save") {
      target.isSave = !target.isSave;
      let isSave = target.isSave;
      if (isSave) {
        addSave(target);
      } else {
        removeSave(target);
      }
      newData = [target]
        .concat(dataList.slice(0, i))
        .concat(dataList.slice(i + 1));
    }
    setDataList(newData!);
  }
  return (
    <>
      <Global styles={resetCSS} />
      <Global styles={globalCSS} />
      <Title data-tauri-drag-region>历史记录</Title>
      <Container>
        <SrcollBox>
          <SrcollPlaceholder>
            {dataList
              .filter((item) => {
                return item.isSave;
              })
              .map((item) => {
                return (
                  <Item onClick={() => setClipboard(item.text)} key={item.id}>
                    <Txt className="txt">{item.text}</Txt>
                    <FunBox className="fun-box">
                      <TopBtn onClick={(e) => handle(e, "top", item.id)} />
                      <DelBtn onClick={(e) => handle(e, "delete", item.id)} />
                      <SaveBtn
                        onClick={(e) => handle(e, "save", item.id)}
                        className={item.isSave ? "save" : ""}
                      >
                        ☆
                      </SaveBtn>
                    </FunBox>
                  </Item>
                );
              })}

            {dataList.filter((item) => {
              return item.isSave;
            }).length > 0 &&
            dataList.filter((item) => {
              return !item.isSave;
            }).length > 0 ? (
              <Line />
            ) : (
              <></>
            )}
            {dataList
              .filter((item) => {
                return !item.isSave;
              })
              .map((item) => {
                return (
                  <Item onClick={() => setClipboard(item.text)} key={item.id}>
                    <Txt className="txt">{item.text}</Txt>
                    <FunBox className="fun-box">
                      <TopBtn onClick={(e) => handle(e, "top", item.id)} />
                      <DelBtn onClick={(e) => handle(e, "delete", item.id)} />
                      <SaveBtn
                        onClick={(e) => handle(e, "save", item.id)}
                        className={item.isSave ? "save" : ""}
                      >
                        ☆
                      </SaveBtn>
                    </FunBox>
                  </Item>
                );
              })}
          </SrcollPlaceholder>
        </SrcollBox>
      </Container>
    </>
  );
}

const container = document.getElementById("container")!;
const root = createRoot(container);
root.render(<ArkTools />);
