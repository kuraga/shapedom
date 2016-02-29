// TODO: Namespaces
// TODO: properties vs attributes

// TODO: Keyed reordering
// TODO: Fragments (sequences of templates)


// TODO: Get rid of CommonJS API
declare var require: (id: string) => any;

const uuid = require('an-uuid');


export interface Shape {
  tag: string;
  attrs: { [key: string]: string };
  // TODO: Also child can be a template
  children?: Shape[];
}


export class Template {
  uuid: string;
  tag: string;
  attrs: { [key: string]: string };
  children: (Template | string)[];
}


export default class Shapedom {
  document: Document;
  private __templates: WeakMap<Node, Template | string>;

  constructor(document: Document) {
    this.document = document;

    this.__templates = new WeakMap<Node, Template | string>();
  }

  createTemplate(shapeOrString: Shape | string): Template | string {
    if (typeof shapeOrString === 'string' || shapeOrString instanceof String) {
      return shapeOrString;
    } else {
      const template: Template = new Template();

      template.uuid = uuid();
      template.tag = shapeOrString.tag;
      template.attrs = Object.assign({}, shapeOrString.attrs);

      template.children = [];
      if ('children' in shapeOrString) {
        for (const childShape of shapeOrString.children) {
          const childTemplate = this.createTemplate(childShape);
          template.children.push(childTemplate);
        }
      }

      return template;
    }
  }

  __createText(text: string): Text {
    const textNode: Text = this.document.createTextNode(text);

    this.__templates.set(textNode, text);  

    return textNode;
  }

  __createElement(template: Template): Element {
    const element: Element = this.document.createElement(template.tag);

    for (const attrName of Object.keys(template.attrs)) {
      const attrValue = template.attrs[attrName];
      element.setAttribute(attrName, attrValue);
    }

    for (const child of template.children) {
      const childElement = this.__createNode(child);
      element.appendChild(childElement);
    }

    this.__templates.set(element, template);

    return element;
  }

  __createNode(templateOrString: Template | string): Node {
    if (typeof templateOrString === 'string' || templateOrString instanceof String) {
      return this.__createText(templateOrString);
    } else if (templateOrString instanceof Template) {
      return this.__createElement(templateOrString);
    } else {
      throw new Error(`Invalid template type`);
    }
  }

  __updateTextByText(textNode: Text, newText: string): Text {
    const oldText = this.__templates.get(textNode);

    if (newText === oldText) {
      return textNode;
    }

    this.__templates.delete(textNode);

    const newTextNode = this.__createText(newText);

    const parent = textNode.parentNode;
    parent.replaceChild(newTextNode, textNode);

    this.__templates.set(newTextNode, newText);

    return newTextNode;
  }

  __updateTextByElement(textNode: Text, newTemplate: Template): Element {
    this.__templates.delete(textNode);

    const newElement = this.__createElement(newTemplate);

    const parent = textNode.parentNode;
    parent.replaceChild(newElement, textNode);

    return newElement;
  }

  __updateElementByText(element: Element, newText: string): Text {
    this.__removeChildren(element);
    this.__templates.delete(element);

    const newTextNode = this.__createText(newText);

    const parent = element.parentNode;
    parent.replaceChild(newTextNode, element);

    return newTextNode;
  }

  __removeNode(node: Node): void {
    const parent = node.parentNode;

    parent.removeChild(node);

    this.__templates.delete(node);
  }

  __removeChildren(node: Node): void {
    for (const childNode of node.childNodes) {
      this.__removeNode(childNode);
    }
  }

  __updateElementByElementSameTemplate(element: Element, newTemplate: Template): Element {
    const oldTemplate = <Template> this.__templates.get(element);

    // Structure of newTemplate is the same as oldTemplate's,
    // so newTemplate.tag === oldTemplate.tag

    // Structure of newTemplate is the same as oldTemplate's,
    // so newTemplate.attrs === oldTemplate.attrs
    for (const newAttrName of Object.keys(newTemplate.attrs)) {
      const oldAttrValue = oldTemplate.attrs[newAttrName];
      const newAttrValue = newTemplate.attrs[newAttrName];
      if (newAttrValue !== oldAttrValue) {
        element.setAttribute(newAttrName, newAttrValue);
      }
    }

    this.__templates.set(element, newTemplate);

    // Structure of newTemplate is the same as oldTemplate's,
    // so newTemplate.children.length === oldTemplate.children.length
    // and newTemplate.children[i].uuid === oldTemplate.children[i].uuid
    const oldChildren = oldTemplate.children;
    const newChildren = newTemplate.children;

    for (let i = 0; i < oldChildren.length; ++i) {
      const newChildTemplate = newChildren[i];
      const childNode = element.childNodes[i];  // TODO: Refactor
      this.__updateNode(childNode, newChildTemplate);
    }

    return element;
  }

  __updateChildren(element: Element, newChildren: (Template | string)[]): NodeList {
    const template = <Template> this.__templates.get(element);
    const oldChildren = template.children;

    const childrenToUpdate = Math.min(oldChildren.length, newChildren.length);
    for (let i = 0; i < childrenToUpdate; ++i) {
      const newChildTemplate = newChildren[i];
      const childNode = element.childNodes[i];  // TODO: Refactor
      this.__updateNode(childNode, newChildTemplate);
    }

    if (oldChildren.length <= newChildren.length) {
      for (let i = childrenToUpdate; i < newChildren.length; ++i) {
        const newChild = newChildren[i];
        const newChildNode = this.__createNode(newChild);
        element.appendChild(newChildNode);
      }
    } else {
      for (let i = childrenToUpdate; i < oldChildren.length; ++i) {
        // Pass the same index each time as element.childNodes is a *live* collection
        this.__removeNode(element.childNodes[childrenToUpdate]);
      }
    }

    return element.childNodes;
  }

  __updateElementByElementDifferentTemplateSameTag(element: Element, newTemplate: Template): Element {
    const oldTemplate = <Template> this.__templates.get(element);

    for (const oldAttrName of Object.keys(oldTemplate.attrs)) {
      const newAttrValue = newTemplate.attrs[oldAttrName];
      if (!newAttrValue) {
        element.removeAttribute(oldAttrName);
      }
    }

    for (const newAttrName of Object.keys(newTemplate.attrs)) {
      const oldAttrValue = oldTemplate.attrs[newAttrName];
      const newAttrValue = newTemplate.attrs[newAttrName];
      if (newAttrValue !== oldAttrValue) {
        element.setAttribute(newAttrName, newAttrValue);
      }
    }

    const newChildren = newTemplate.children;
    this.__updateChildren(element, newChildren);

    this.__templates.set(element, newTemplate);

    return element;
  }

  __updateElementByElementDifferentTemplateDifferentTag(element: Element, newTemplate: Template): Element {
    const oldTemplate = this.__templates.get(element);

    this.__removeChildren(element);

    this.__templates.delete(element);

    const newElement = this.__createElement(newTemplate);

    const parent = element.parentNode;
    parent.replaceChild(newElement, element);

    return newElement;
  }

  __updateElementByElementDifferentTemplate(element: Element, newTemplate: Template): Element {
    const oldTemplate = <Template> this.__templates.get(element);

    if (newTemplate.tag === oldTemplate.tag) {
      return this.__updateElementByElementDifferentTemplateSameTag(element, newTemplate);
    } else {
      return this.__updateElementByElementDifferentTemplateDifferentTag(element, newTemplate);
    }
  }

  __updateNode(node: Node, newTemplate: Template | string): Node {
    const oldTemplate = this.__templates.get(node);

    if (newTemplate === oldTemplate) {
      return node;
    }

    if (oldTemplate instanceof Template) {
      if (newTemplate instanceof Template) {
        if (newTemplate.uuid === oldTemplate.uuid) {
          return this.__updateElementByElementSameTemplate(<Element> node, newTemplate);
        } else {
          return this.__updateElementByElementDifferentTemplate(<Element> node, newTemplate);
        }
      } else if (typeof newTemplate === 'string' || newTemplate instanceof String) {
        return this.__updateElementByText(<Element> node, newTemplate);
      }
    } else if (typeof oldTemplate === 'string' || oldTemplate instanceof String) {
      if (newTemplate instanceof Template) {
        return this.__updateTextByElement(<Text> node, newTemplate);
      } else if (typeof newTemplate === 'string' || newTemplate instanceof String) {
        return this.__updateTextByText(<Text> node, newTemplate);
      }
    }
  }

  render(template: Template): Node {
    const node = this.__createNode(template);

    return node;
  }

  update(node: Node, template: Template): Node {
    let newNode: Node;

    if (!this.__templates.has(node)) {
      throw new Error(`Node hasn't been rendered yet.`);
    }

    if (!node.parentNode) {
      throw new Error(`Can't update unattached node.`);
    }

    newNode = this.__updateNode(node, template);

    return newNode;
  }
}
