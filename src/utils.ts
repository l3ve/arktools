export type TxtItem = {
  isSave: boolean;
  text: string;
  id: string;
}[];

let ARKTOOLS_SAVE = "arktools-save";

export function delay(time: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

export function limitTxt(txt: string): string {
  if (txt.length < 17) {
    return txt;
  }
  return txt.slice(0, 17) + "...";
}

export function deleteFirstOne() {}

export function genID() {
  let t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
  let a = t.length;
  let n = "";
  for (let i = 0; i < 16; i++) n += t.charAt(Math.floor(Math.random() * a));
  return n;
}

export function addSave(item: TxtItem[0]) {
  let data = localStorage.getItem(ARKTOOLS_SAVE) || "[]";
  let new_data = JSON.parse(data) as TxtItem;
  new_data = [item].concat(new_data);

  localStorage.setItem(ARKTOOLS_SAVE, JSON.stringify(new_data));
}

export function getSave() {
  let data = localStorage.getItem(ARKTOOLS_SAVE) || "[]";
  let allData = JSON.parse(data) as TxtItem;
  return allData;
}

export function topSave(item: TxtItem[0]) {
  let data = localStorage.getItem(ARKTOOLS_SAVE) || "[]";
  let allData = JSON.parse(data) as TxtItem;
  allData = allData.filter((data) => {
    return data.id !== item.id;
  });
  allData = [item].concat(allData);
  localStorage.setItem(ARKTOOLS_SAVE, JSON.stringify(allData));
}

export function removeSave(item: TxtItem[0]) {
  let data = localStorage.getItem(ARKTOOLS_SAVE) || "[]";
  let new_data = JSON.parse(data) as TxtItem;
  new_data = new_data.filter((data) => {
    return data.id !== item.id;
  });
  localStorage.setItem(ARKTOOLS_SAVE, JSON.stringify(new_data));
}
