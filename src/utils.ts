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
