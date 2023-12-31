// copied from preact/src/dom/index.js 20161103

// eslint-disable-next-line
export function hashToClassName(c) {
  let str = '';

  // eslint-disable-next-line
  for (let prop in c) {
    if (c[prop]) {
      if (str) str += ' ';

      str += prop;
    }
  }

  return str;
}
