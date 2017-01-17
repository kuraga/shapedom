// TODO: Namespaces
// TODO: properties vs attributes

// TODO: Keyed reordering
// TODO: Fragments (sequences of templates)


// TODO: Get rid of CommonJS API
declare var require: (id: string) => any;

const uuid = require('an-uuid');


export interface Shape {
  tag: string;
  attrs: { [key: string]: string | Variable };
  children?: (string | Variable | Shape | Template)[];
}


export class Template {
  uuid: string;
  tag: string;
  attrs: { [key: string]: string | Variable };
  children: (Template | string | Variable)[];
}


export class Variable {
  protected __value: string;

  constructor(value: string) {
    this.set(value);
  }

  set(value: string): this {
    this.__value = value;
    return this;
  }

  get(): string {
    return this.__value;
  }
}


function __getStringFromStringOrVariable(stringOrVariable: string | Variable): string {
  if (stringOrVariable instanceof Variable) {
    return stringOrVariable.get();
  } else {
    return stringOrVariable;
  }
}


export default class Shapedom {
  document: Document;
  protected __templates: WeakMap<Node, Template | string>;

  constructor(document: Document) {
    this.document = document;

    this.__templates = new WeakMap<Node, Template | string>();
  }

  createTemplate(shapeOrStringOrVariable: Shape | string | Variable): Template | string {
    if (typeof shapeOrStringOrVariable === 'string' || shapeOrStringOrVariable instanceof String || shapeOrStringOrVariable instanceof Variable) {
      return __getStringFromStringOrVariable(shapeOrStringOrVariable);
    } else {
      const template: Template = new Template();

      template.uuid = uuid();
      template.tag = shapeOrStringOrVariable.tag;
      template.attrs = Object.assign({}, shapeOrStringOrVariable.attrs);

      template.children = [];
      if ('children' in shapeOrStringOrVariable) {
        for (const childStringOrVariableOrShapeOrTemplate of shapeOrStringOrVariable.children) {
          const childTemplate = (childStringOrVariableOrShapeOrTemplate instanceof Template) ?
            childStringOrVariableOrShapeOrTemplate :
            this.createTemplate(childStringOrVariableOrShapeOrTemplate);
          template.children.push(childTemplate);
        }
      }

      return template;
    }
  }

  protected __createText(textOrVariable: string | Variable): Text {
    const text: string = __getStringFromStringOrVariable(textOrVariable);

    const textNode: Text = this.document.createTextNode(text);

    this.__templates.set(textNode, text);

    return textNode;
  }

  protected __createElement(template: Template): Element {
    const element: Element = this.document.createElement(template.tag);

    for (const attrName of Object.keys(template.attrs)) {
      const attrValue = __getStringFromStringOrVariable(template.attrs[attrName]);
      element.setAttribute(attrName, attrValue);
    }

    for (const child of template.children) {
      const childElement = this.__createNode(child);
      element.appendChild(childElement);
    }

    this.__templates.set(element, template);

    return element;
  }

  protected __createNode(templateOrStringOrVariable: Template | string | Variable): Node {
    if (typeof templateOrStringOrVariable === 'string' || templateOrStringOrVariable instanceof String || templateOrStringOrVariable instanceof Variable) {
      return this.__createText(templateOrStringOrVariable);
    } else if (templateOrStringOrVariable instanceof Template) {
      return this.__createElement(templateOrStringOrVariable);
    } else {
      throw new Error(`Invalid template type`);
    }
  }

  protected __updateTextByText(textNode: Text, newTextStringOrVariable: string | Variable): Text {
    const oldText = this.__templates.get(textNode);
    const newText = __getStringFromStringOrVariable(newTextStringOrVariable);

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

  protected __updateTextByElement(textNode: Text, newTemplate: Template): Element {
    this.__templates.delete(textNode);

    const newElement = this.__createElement(newTemplate);

    const parent = textNode.parentNode;
    parent.replaceChild(newElement, textNode);

    return newElement;
  }

  protected __updateElementByText(element: Element, newTextStringOrVariable: string | Variable): Text {
    const newText = __getStringFromStringOrVariable(newTextStringOrVariable);

    this.__removeChildren(element);
    this.__templates.delete(element);

    const newTextNode = this.__createText(newText);

    const parent = element.parentNode;
    parent.replaceChild(newTextNode, element);

    return newTextNode;
  }

  protected __removeNode(node: Node): void {
    const parent = node.parentNode;

    parent.removeChild(node);

    this.__templates.delete(node);
  }

  protected __removeChildren(node: Node): void {
    for (const childNode of node.childNodes) {
      this.__removeNode(childNode);
    }
  }

  protected __updateElementByElementSameTemplate(element: Element, newTemplate: Template): Element {
    const oldTemplate = <Template> this.__templates.get(element);

    // Structure of newTemplate is the same as oldTemplate's,
    // so newTemplate.tag === oldTemplate.tag

    // Structure of newTemplate is the same as oldTemplate's,
    // so newTemplate.attrs === oldTemplate.attrs
    for (const newAttrName of Object.keys(newTemplate.attrs)) {
      const oldAttrValue = __getStringFromStringOrVariable(oldTemplate.attrs[newAttrName]);
      const newAttrValue = __getStringFromStringOrVariable(newTemplate.attrs[newAttrName]);
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

  protected __updateChildren(element: Element, newChildren: (Template | string | Variable)[]): NodeList {
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

  protected __updateElementByElementDifferentTemplateSameTag(element: Element, newTemplate: Template): Element {
    const oldTemplate = <Template> this.__templates.get(element);

    for (const oldAttrName of Object.keys(oldTemplate.attrs)) {
      const newAttrValue = __getStringFromStringOrVariable(newTemplate.attrs[oldAttrName]);
      if (newAttrValue === undefined) {
        element.removeAttribute(oldAttrName);
      }
    }

    for (const newAttrName of Object.keys(newTemplate.attrs)) {
      const oldAttrValue = __getStringFromStringOrVariable(oldTemplate.attrs[newAttrName]);
      const newAttrValue = __getStringFromStringOrVariable(newTemplate.attrs[newAttrName]);
      if (newAttrValue !== oldAttrValue) {
        element.setAttribute(newAttrName, newAttrValue);
      }
    }

    const newChildren = newTemplate.children;
    this.__updateChildren(element, newChildren);

    this.__templates.set(element, newTemplate);

    return element;
  }

  protected __updateElementByElementDifferentTemplateDifferentTag(element: Element, newTemplate: Template): Element {
    const oldTemplate = this.__templates.get(element);

    this.__removeChildren(element);

    this.__templates.delete(element);

    const newElement = this.__createElement(newTemplate);

    const parent = element.parentNode;
    parent.replaceChild(newElement, element);

    return newElement;
  }

  protected __updateElementByElementDifferentTemplate(element: Element, newTemplate: Template): Element {
    const oldTemplate = <Template> this.__templates.get(element);

    if (newTemplate.tag === oldTemplate.tag) {
      return this.__updateElementByElementDifferentTemplateSameTag(element, newTemplate);
    } else {
      return this.__updateElementByElementDifferentTemplateDifferentTag(element, newTemplate);
    }
  }

  protected __updateNode(node: Node, newTemplate: Template | string | Variable): Node {
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
      } else if (typeof newTemplate === 'string' || newTemplate instanceof String || newTemplate instanceof Variable) {
        return this.__updateElementByText(<Element> node, newTemplate);
      } else {
        throw new Error(`Invalid type`);
      }
    } else if (typeof oldTemplate === 'string' || oldTemplate instanceof String || oldTemplate instanceof Variable) {
      if (newTemplate instanceof Template) {
        return this.__updateTextByElement(<Text> node, newTemplate);
      } else if (typeof newTemplate === 'string' || newTemplate instanceof String || newTemplate instanceof Variable) {
        return this.__updateTextByText(<Text> node, newTemplate);
      } else {
        throw new Error(`Invalid type`);
      }
    } else {
      throw new Error(`Invalid type`);
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
