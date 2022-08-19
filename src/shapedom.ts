// TODO: Keyed reordering

// TODO: Namespaces


// TODO: Get rid of CommonJS API
declare var require: (id: string) => any;

const uuidv4 = require('an-uuid');


export interface Shape {
  tag: string;
  attrs: { [key: string]: string | Variable };
  children?: (string | Variable | Shape | Template)[];
}


export class Template {
  uuid: string;
  tag: string;
  attrs: { [key: string]: string | Variable };
  children: (string | Variable | Template)[];

  constructor(
    uuid: string, tag: string,
    attrs: { [key: string]: string | Variable }, children: (string | Variable | Template)[] = []
  ) {
    this.uuid = uuid;
    this.tag = tag;
    this.attrs = attrs;
    this.children = children;
  }
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
  protected __templates: WeakMap<Node, string | Variable | Template>;

  constructor(document: Document) {
    this.document = document;

    this.__templates = new WeakMap<Node, string | Variable | Template>();
  }

  createTemplate(stringOrVariableOrShapeOrTemplate: string | Variable | Shape | Template): string | Variable | Template {
    if (typeof stringOrVariableOrShapeOrTemplate === 'string') {
      return stringOrVariableOrShapeOrTemplate;
    } else if (stringOrVariableOrShapeOrTemplate instanceof Variable) {
      return stringOrVariableOrShapeOrTemplate;
    } else if (stringOrVariableOrShapeOrTemplate instanceof Template) {
      return stringOrVariableOrShapeOrTemplate;
    } else {
      const uuid: string = uuidv4(),
        tag = stringOrVariableOrShapeOrTemplate.tag,
        attrs = Object.assign({}, stringOrVariableOrShapeOrTemplate.attrs),
        children = (stringOrVariableOrShapeOrTemplate.children !== undefined) ?
          stringOrVariableOrShapeOrTemplate.children.map((templateChild) =>
            (templateChild instanceof Template) ?
              templateChild :
              this.createTemplate(templateChild)
          ) :
          [];
      const template: Template = new Template(uuid, tag, attrs, children);

      return template;
    }
  }

  protected __removeNode(node: Node): void {
    const parent = node.parentNode;

    if (parent !== null) {
      parent.removeChild(node);
    }

    this.__templates.delete(node);
  }

  protected __removeChildNodes(node: Node): void {
    for (const childNode of node.childNodes) {
      this.__removeNode(childNode);
    }
  }

  protected __replaceNode(oldNode: Node, newNode: Node, newStringOrVariableOrTemplate: string | Variable | Template) {
    this.__removeChildNodes(oldNode);

    const parent = oldNode.parentNode;
    if (parent !== null) {
      parent.replaceChild(newNode, oldNode);
    }

    this.__templates.set(newNode, newStringOrVariableOrTemplate);
    this.__templates.delete(oldNode);

    return newNode;
  }

  protected __appendNode(parent: Node, newNode: Node, stringOrVariableOrTemplate: string | Variable | Template) {
    parent.appendChild(newNode);

    this.__templates.set(newNode, stringOrVariableOrTemplate);

    return newNode;
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

  protected __createNode(stringOrVariableOrTemplateOrFragment: string | Variable | Template): Node {
    if (typeof stringOrVariableOrTemplateOrFragment === 'string' || stringOrVariableOrTemplateOrFragment instanceof Variable) {
      return this.__createText(stringOrVariableOrTemplateOrFragment);
    } else if (stringOrVariableOrTemplateOrFragment instanceof Template) {
      return this.__createElement(stringOrVariableOrTemplateOrFragment);
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

    const newTextNode = this.__createText(newText);

    this.__replaceNode(textNode, newTextNode, newTextStringOrVariable);

    return newTextNode;
  }

  protected __updateTextByTemplate(textNode: Text, newTemplate: Template): Element {
    const newElement = this.__createElement(newTemplate);

    this.__replaceNode(textNode, newElement, newTemplate);

    return newElement;
  }

  protected __updateElementByText(element: Element, newTextStringOrVariable: string | Variable): Text {
    const newText = __getStringFromStringOrVariable(newTextStringOrVariable);
    const newTextNode = this.__createText(newText);

    this.__replaceNode(element, newTextNode, newTextStringOrVariable);

    return newTextNode;
  }

  protected __updateElementBySameTemplate(element: Element, newTemplate: Template): Element {
    const oldTemplate = this.__templates.get(element) as Template;

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

  protected __updateChildren(element: Element, newChildren: (string | Variable | Template)[]): NodeList {
    const template = this.__templates.get(element) as Template;
    const oldChildren = template.children;

    const childrenToUpdate = Math.min(oldChildren.length, newChildren.length);
    for (let i = 0; i < childrenToUpdate; ++i) {
      const newChildStringOrVariableOrTemplateOrFragment = newChildren[i];
      const childNode = element.childNodes[i];  // TODO: Refactor
      this.__updateNode(childNode, newChildStringOrVariableOrTemplateOrFragment);
    }

    if (oldChildren.length <= newChildren.length) {
      for (let i = childrenToUpdate; i < newChildren.length; ++i) {
        const newChildStringOrVariableOrTemplateOrFragment = newChildren[i];
        const newChildNode = this.__createNode(newChildStringOrVariableOrTemplateOrFragment);
        this.__appendNode(element, newChildNode, newChildStringOrVariableOrTemplateOrFragment);
      }
    } else {
      for (let i = childrenToUpdate; i < oldChildren.length; ++i) {
        // Pass the same index each time as element.childNodes is a *live* collection
        this.__removeNode(element.childNodes[childrenToUpdate]);
      }
    }

    return element.childNodes;
  }

  protected __updateElementByDifferentTemplateSameTag(element: Element, newTemplate: Template): Element {
    const oldTemplate = this.__templates.get(element) as Template;

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

  protected __updateElementByDifferentTemplateDifferentTag(element: Element, newTemplate: Template): Element {
    const oldTemplate = this.__templates.get(element);

    this.__removeChildNodes(element);

    this.__templates.delete(element);

    const newElement = this.__createElement(newTemplate);

    const parent = element.parentNode;
    if (parent !== null) {
      parent.replaceChild(newElement, element);
    }

    return newElement;
  }

  protected __updateElementByDifferentTemplate(element: Element, newTemplate: Template): Element {
    const oldTemplate = this.__templates.get(element) as Template;

    if (newTemplate.tag === oldTemplate.tag) {
      return this.__updateElementByDifferentTemplateSameTag(element, newTemplate);
    } else {
      return this.__updateElementByDifferentTemplateDifferentTag(element, newTemplate);
    }
  }

  protected __updateNode(node: Node, newTemplate: string | Variable | Template): Node {
    const oldTemplate = this.__templates.get(node);

    if (newTemplate === oldTemplate) {
      return node;
    }

    if (oldTemplate instanceof Template) {
      if (newTemplate instanceof Template) {
        if (newTemplate.uuid === oldTemplate.uuid) {
          return this.__updateElementBySameTemplate(node as Element, newTemplate);
        } else {
          return this.__updateElementByDifferentTemplate(node as Element, newTemplate);
        }
      } else if (typeof newTemplate === 'string' || newTemplate instanceof Variable) {
        return this.__updateElementByText(node as Element, newTemplate);
      } else {
        throw new Error(`Invalid type`);
      }
    } else if (typeof oldTemplate === 'string' || oldTemplate instanceof String || oldTemplate instanceof Variable) {
      if (newTemplate instanceof Template) {
        return this.__updateTextByTemplate(node as Text, newTemplate);
      } else if (typeof newTemplate === 'string' || newTemplate instanceof String || newTemplate instanceof Variable) {
        return this.__updateTextByText(node as Text, newTemplate);
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
