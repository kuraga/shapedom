// TODO: Keyed reordering
const uuidv4 = require('an-uuid');
export class Template {
    constructor(uuid, tag, attrs, children = []) {
        this.uuid = uuid;
        this.tag = tag;
        this.attrs = attrs;
        this.children = children;
    }
}
export class Variable {
    constructor(value) {
        this.set(value);
    }
    set(value) {
        this.__value = value;
        return this;
    }
    get() {
        return this.__value;
    }
}
function __getStringFromStringOrVariable(stringOrVariable) {
    if (stringOrVariable instanceof Variable) {
        return stringOrVariable.get();
    }
    else {
        return stringOrVariable;
    }
}
export default class Shapedom {
    constructor(document) {
        this.document = document;
        this.__templates = new WeakMap();
    }
    createTemplate(stringOrVariableOrShapeOrTemplate) {
        if (typeof stringOrVariableOrShapeOrTemplate === 'string') {
            return stringOrVariableOrShapeOrTemplate;
        }
        else if (stringOrVariableOrShapeOrTemplate instanceof Variable) {
            return stringOrVariableOrShapeOrTemplate;
        }
        else if (stringOrVariableOrShapeOrTemplate instanceof Template) {
            return stringOrVariableOrShapeOrTemplate;
        }
        else {
            const uuid = uuidv4(), tag = stringOrVariableOrShapeOrTemplate.tag, attrs = Object.assign({}, stringOrVariableOrShapeOrTemplate.attrs), children = (stringOrVariableOrShapeOrTemplate.children !== undefined) ?
                stringOrVariableOrShapeOrTemplate.children.map((templateChild) => (templateChild instanceof Template) ?
                    templateChild :
                    this.createTemplate(templateChild)) :
                [];
            const template = new Template(uuid, tag, attrs, children);
            return template;
        }
    }
    __removeNode(node) {
        const parent = node.parentNode;
        if (parent !== null) {
            parent.removeChild(node);
        }
        this.__templates.delete(node);
    }
    __removeChildNodes(node) {
        for (const childNode of node.childNodes) {
            this.__removeNode(childNode);
        }
    }
    __replaceNode(oldNode, newNode, newStringOrVariableOrTemplate) {
        this.__removeChildNodes(oldNode);
        const parent = oldNode.parentNode;
        if (parent !== null) {
            parent.replaceChild(newNode, oldNode);
        }
        this.__templates.set(newNode, newStringOrVariableOrTemplate);
        this.__templates.delete(oldNode);
        return newNode;
    }
    __appendNode(parent, newNode, stringOrVariableOrTemplate) {
        parent.appendChild(newNode);
        this.__templates.set(newNode, stringOrVariableOrTemplate);
        return newNode;
    }
    __createText(textOrVariable) {
        const text = __getStringFromStringOrVariable(textOrVariable);
        const textNode = this.document.createTextNode(text);
        this.__templates.set(textNode, text);
        return textNode;
    }
    __createElement(template) {
        const element = this.document.createElement(template.tag);
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
    __createNode(stringOrVariableOrTemplateOrFragment) {
        if (typeof stringOrVariableOrTemplateOrFragment === 'string' || stringOrVariableOrTemplateOrFragment instanceof Variable) {
            return this.__createText(stringOrVariableOrTemplateOrFragment);
        }
        else if (stringOrVariableOrTemplateOrFragment instanceof Template) {
            return this.__createElement(stringOrVariableOrTemplateOrFragment);
        }
        else {
            throw new Error(`Invalid template type`);
        }
    }
    __updateTextByText(textNode, newTextStringOrVariable) {
        const oldText = this.__templates.get(textNode);
        const newText = __getStringFromStringOrVariable(newTextStringOrVariable);
        if (newText === oldText) {
            return textNode;
        }
        const newTextNode = this.__createText(newText);
        this.__replaceNode(textNode, newTextNode, newTextStringOrVariable);
        return newTextNode;
    }
    __updateTextByTemplate(textNode, newTemplate) {
        const newElement = this.__createElement(newTemplate);
        this.__replaceNode(textNode, newElement, newTemplate);
        return newElement;
    }
    __updateElementByText(element, newTextStringOrVariable) {
        const newText = __getStringFromStringOrVariable(newTextStringOrVariable);
        const newTextNode = this.__createText(newText);
        this.__replaceNode(element, newTextNode, newTextStringOrVariable);
        return newTextNode;
    }
    __updateElementBySameTemplate(element, newTemplate) {
        const oldTemplate = this.__templates.get(element);
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
            const childNode = element.childNodes[i]; // TODO: Refactor
            this.__updateNode(childNode, newChildTemplate);
        }
        return element;
    }
    __updateChildren(element, newChildren) {
        const template = this.__templates.get(element);
        const oldChildren = template.children;
        const childrenToUpdate = Math.min(oldChildren.length, newChildren.length);
        for (let i = 0; i < childrenToUpdate; ++i) {
            const newChildStringOrVariableOrTemplateOrFragment = newChildren[i];
            const childNode = element.childNodes[i]; // TODO: Refactor
            this.__updateNode(childNode, newChildStringOrVariableOrTemplateOrFragment);
        }
        if (oldChildren.length <= newChildren.length) {
            for (let i = childrenToUpdate; i < newChildren.length; ++i) {
                const newChildStringOrVariableOrTemplateOrFragment = newChildren[i];
                const newChildNode = this.__createNode(newChildStringOrVariableOrTemplateOrFragment);
                this.__appendNode(element, newChildNode, newChildStringOrVariableOrTemplateOrFragment);
            }
        }
        else {
            for (let i = childrenToUpdate; i < oldChildren.length; ++i) {
                // Pass the same index each time as element.childNodes is a *live* collection
                this.__removeNode(element.childNodes[childrenToUpdate]);
            }
        }
        return element.childNodes;
    }
    __updateElementByDifferentTemplateSameTag(element, newTemplate) {
        const oldTemplate = this.__templates.get(element);
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
    __updateElementByDifferentTemplateDifferentTag(element, newTemplate) {
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
    __updateElementByDifferentTemplate(element, newTemplate) {
        const oldTemplate = this.__templates.get(element);
        if (newTemplate.tag === oldTemplate.tag) {
            return this.__updateElementByDifferentTemplateSameTag(element, newTemplate);
        }
        else {
            return this.__updateElementByDifferentTemplateDifferentTag(element, newTemplate);
        }
    }
    __updateNode(node, newTemplate) {
        const oldTemplate = this.__templates.get(node);
        if (newTemplate === oldTemplate) {
            return node;
        }
        if (oldTemplate instanceof Template) {
            if (newTemplate instanceof Template) {
                if (newTemplate.uuid === oldTemplate.uuid) {
                    return this.__updateElementBySameTemplate(node, newTemplate);
                }
                else {
                    return this.__updateElementByDifferentTemplate(node, newTemplate);
                }
            }
            else if (typeof newTemplate === 'string' || newTemplate instanceof Variable) {
                return this.__updateElementByText(node, newTemplate);
            }
            else {
                throw new Error(`Invalid type`);
            }
        }
        else if (typeof oldTemplate === 'string' || oldTemplate instanceof String || oldTemplate instanceof Variable) {
            if (newTemplate instanceof Template) {
                return this.__updateTextByTemplate(node, newTemplate);
            }
            else if (typeof newTemplate === 'string' || newTemplate instanceof String || newTemplate instanceof Variable) {
                return this.__updateTextByText(node, newTemplate);
            }
            else {
                throw new Error(`Invalid type`);
            }
        }
        else {
            throw new Error(`Invalid type`);
        }
    }
    render(template) {
        const node = this.__createNode(template);
        return node;
    }
    update(node, template) {
        let newNode;
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
