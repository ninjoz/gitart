import { hashToClassName } from './util';

function appendChildren(el, children) {
  children.forEach((child) => {
    if (child instanceof Node) {
      el.appendChild(child);
    } else if (typeof child === 'string' || typeof child === 'number') {
      el.appendChild(document.createTextNode(child));
    } else if (Array.isArray(child)) {
      appendChildren(el, child);
    }
  });
}

export default (tag, attrs, ...children) => {
  if (typeof tag === 'function') {
    return tag(Object.assign({}, attrs, { children }));
  }


  if (typeof tag !== 'string') {
    // so that we can use h() to convert html string
    // into node like <div>{h(props.region)}</div>
    return null;
  }

  if (tag.startsWith('<')) {
    // TODO make sure this is valid HTML
    const container = document.createElement('div');

    container.innerHTML = tag;

    return Array.from(container.childNodes);
  }

  const el = document.createElement(tag);

  appendChildren(el, children);

  if (attrs) {
    Object.keys(attrs).forEach((key) => {
      let value = attrs[key];

      if (!value && value !== 0) return;

      if (key === 'className') key = 'class';

      if (key === 'class') {
        if (Array.isArray(value)) {
          value = value.filter((value) => value).join(' ');
        } else if (typeof value === 'object') {
          value = hashToClassName(value);
        }
      }

      el.setAttribute(key, value);
    });
  }

  return el;
};
