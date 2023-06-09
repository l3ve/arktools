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
import { delay, genID } from "./utils";
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

type TxtItem = {
  isSave: boolean;
  text: string;
  id: string;
}[];

function ArkTools() {
  let [dataList, setDataList] = useState<TxtItem>([
    { isSave: true, text: "1111111111", id: "13fkefi3f" },
    {
      isSave: false,
      text: "一二三四五六七八九十一二三四五六七八九十",
      id: "232fwfw",
    },
    { isSave: false, text: "4444433333", id: "13fkffawefi3f" },
    { isSave: true, text: "feefafaeg", id: "13fkf3refi3f" },
    { isSave: false, text: "1231gegefa23123123", id: "13fkg4gdsdqefi3f" },
    {
      isSave: true,
      text: "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
      id: "13fk123123efi3f",
    },
  ]);

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
    if (type === "delete") {
      newData = dataList.slice(0, i).concat(dataList.slice(i + 1));
    }
    if (type === "top") {
      let target = dataList.splice(i, 1);
      newData = target.concat(dataList);
    }
    if (type === "save") {
      let newObj = dataList[i];
      newObj.isSave = !newObj.isSave;
      let isSave = newObj.isSave;
      // await invoke("manage-data", newObj);
      if (isSave) {
        newData = [newObj]
          .concat(dataList.slice(0, i))
          .concat(dataList.slice(i + 1));
      } else {
        newData = [newObj]
          .concat(dataList.slice(0, i))
          .concat(dataList.slice(i + 1));
      }
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
