import { hashToClassName } from './util';

const selfClosing = [
  'area',
  'base',
  'br',
  'col',
  'command',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
];

export default function h(tag, attrs, ...children) {
  if (typeof tag === 'function') {
    if (tag.prototype && tag.prototype.constructor && tag.prototype.render) {
      // eslint-disable-next-line new-cap
      const instance = new tag(Object.assign({}, attrs, { children }));
      return instance.render(instance.props, instance.state) || '';
    }

    return tag(Object.assign({}, attrs, { children }));
  }

  if (typeof tag !== 'string') {
    // so that we can use h() to convert html string
    // into node like <div>{h(props.region)}</div>
    return null;
  }

  let str = `<${tag}`;

  if (attrs) {
    Object.keys(attrs).forEach((key) => {
      let value = attrs[key];

      if (value != null && !(value instanceof Function)) {
        if (key === 'className') key = 'class';

        if (key === 'class') {
          if (Array.isArray(value)) {
            value = value.filter((value) => value).join(' ');
          } else if (typeof value === 'object') {
            value = hashToClassName(value);
          }
        }

        str += ` ${key}="${value}"`;
      }
    });
  }

  if (selfClosing.includes(tag)) {
    str += '/>';
    return str;
  }

  str += '>';

  while (children.length) {
    const child = children.shift();

    if (Array.isArray(child)) {
      children.unshift(...child);
    } else if (child != null && child !== false) {
      str += child;
    }
  }

  return `${str}</${tag}>`;
}
