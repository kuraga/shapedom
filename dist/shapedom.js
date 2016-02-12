// TODO: Namespaces
// TODO: properties vs attributes
const uuid = require('an-uuid');
export class Template {
}
export class ElementTemplate extends Template {
}
export class TextTemplate extends Template {
}
export default class Shapedom {
    constructor(document) {
        this.document = document;
        this.__templates = new WeakMap();
    }
    __createTextTemplate(shape) {
        const template = new TextTemplate();
        template.uuid = uuid();
        template.text = shape.text;
        return template;
    }
    __createElementTemplate(shape) {
        const template = new ElementTemplate();
        template.uuid = uuid();
        template.tag = shape.tag;
        template.attrs = Object.assign({}, shape.attrs);
        template.children = [];
        if ('children' in shape) {
            for (const childShape of shape.children) {
                const childTemplate = this.createTemplate(childShape);
                template.children.push(childTemplate);
            }
        }
        return template;
    }
    createTemplate(shape) {
        if (shape.text !== undefined) {
            return this.__createTextTemplate(shape);
        }
        else if (shape.tag !== undefined) {
            return this.__createElementTemplate(shape);
        }
        else {
            throw new Error(`Invalid shape type`);
        }
    }
    __createText(textTemplate) {
        const textNode = this.document.createTextNode(textTemplate.text);
        this.__templates.set(textNode, textTemplate);
        return textNode;
    }
    __createElement(elementTemplate) {
        const element = this.document.createElement(elementTemplate.tag);
        for (const attrName of Object.keys(elementTemplate.attrs)) {
            const attrValue = elementTemplate.attrs[attrName];
            element.setAttribute(attrName, attrValue);
        }
        for (const child of elementTemplate.children) {
            const childElement = this.__createNode(child);
            element.appendChild(childElement);
        }
        this.__templates.set(element, elementTemplate);
        return element;
    }
    __createNode(template) {
        if (template instanceof TextTemplate) {
            return this.__createText(template);
        }
        else if (template instanceof ElementTemplate) {
            return this.__createElement(template);
        }
        else {
            throw new Error(`Invalid template type`);
        }
    }
    __updateTextByText(textNode, newTextTemplate) {
        const oldTextTemplate = this.__templates.get(textNode);
        if (newTextTemplate.text === oldTextTemplate.text) {
            return textNode;
        }
        this.__templates.delete(textNode);
        const newTextNode = this.__createText(newTextTemplate);
        const parent = textNode.parentNode;
        parent.replaceChild(newTextNode, textNode);
        this.__templates.set(newTextNode, newTextTemplate);
        return newTextNode;
    }
    __updateTextByElement(textNode, newElementTemplate) {
        const oldTextTemplate = this.__templates.get(textNode);
        this.__templates.delete(textNode);
        const newElement = this.__createElement(newElementTemplate);
        const parent = textNode.parentNode;
        parent.replaceChild(newElement, textNode);
        return newElement;
    }
    __updateElementByText(element, newTextTemplate) {
        this.__removeChildren(element);
        this.__templates.delete(element);
        const newTextNode = this.__createText(newTextTemplate);
        const parent = element.parentNode;
        parent.replaceChild(newTextNode, element);
        return newTextNode;
    }
    __removeNode(node) {
        const parent = node.parentNode;
        parent.removeChild(node);
        this.__templates.delete(node);
    }
    __removeChildren(node) {
        for (const childNode of node.childNodes) {
            this.__removeNode(childNode);
        }
    }
    __updateElementByElementSameTemplate(element, newElementTemplate) {
        const oldElementTemplate = this.__templates.get(element);
        // Structure of newElementTemplate is the same as oldElementTemplate's,
        // so newElementTemplate.tag === oldElementTemplate.tag
        // Structure of newElementTemplate is the same as oldTemplate's,
        // so newElementTemplate.attrs === oldElementTemplate.attrs
        for (const newAttrName of Object.keys(newElementTemplate.attrs)) {
            const oldAttrValue = oldElementTemplate.attrs[newAttrName];
            const newAttrValue = newElementTemplate.attrs[newAttrName];
            if (newAttrValue !== oldAttrValue) {
                element.setAttribute(newAttrName, newAttrValue);
            }
        }
        this.__templates.set(element, newElementTemplate);
        // Structure of newElementTemplate is the same as oldElementTemplate's,
        // so newElementTemplate.children.length === oldElementTemplate.children.length
        // and newElementTemplate.children[i].uuid === oldElementTemplate.children[i].uuid
        const oldChildren = oldElementTemplate.children;
        const newChildren = newElementTemplate.children;
        for (let i = 0; i < oldChildren.length; ++i) {
            const newChildTemplate = newChildren[i];
            const childNode = element.childNodes[i]; // TODO: Refactor
            this.__updateNode(childNode, newChildTemplate);
        }
        return element;
    }
    __updateChildren(element, newChildren) {
        const elementTemplate = this.__templates.get(element);
        const oldChildren = elementTemplate.children;
        const childrenToUpdate = Math.min(oldChildren.length, newChildren.length);
        for (let i = 0; i < childrenToUpdate; ++i) {
            const newChildTemplate = newChildren[i];
            const childNode = element.childNodes[i]; // TODO: Refactor
            this.__updateNode(childNode, newChildTemplate);
        }
        if (oldChildren.length <= newChildren.length) {
            for (let i = childrenToUpdate; i < newChildren.length; ++i) {
                const newChild = newChildren[i];
                const newChildNode = this.__createNode(newChild);
                element.appendChild(newChildNode);
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
    __updateElementByElementDifferentTemplateSameTag(element, newElementTemplate) {
        const oldElementTemplate = this.__templates.get(element);
        for (const oldAttrName of Object.keys(oldElementTemplate.attrs)) {
            const newAttrValue = newElementTemplate.attrs[oldAttrName];
            if (!newAttrValue) {
                element.removeAttribute(oldAttrName);
            }
        }
        for (const newAttrName of Object.keys(newElementTemplate.attrs)) {
            const oldAttrValue = oldElementTemplate.attrs[newAttrName];
            const newAttrValue = newElementTemplate.attrs[newAttrName];
            if (newAttrValue !== oldAttrValue) {
                element.setAttribute(newAttrName, newAttrValue);
            }
        }
        const newChildren = newElementTemplate.children;
        this.__updateChildren(element, newChildren);
        this.__templates.set(element, newElementTemplate);
        return element;
    }
    __updateElementByElementDifferentTemplateDifferentTag(element, newElementTemplate) {
        const oldElementTemplate = this.__templates.get(element);
        this.__removeChildren(element);
        this.__templates.delete(element);
        const newElement = this.__createElement(newElementTemplate);
        const parent = element.parentNode;
        parent.replaceChild(newElement, element);
        return newElement;
    }
    __updateElementByElementDifferentTemplate(element, newElementTemplate) {
        const oldElementTemplate = this.__templates.get(element);
        if (newElementTemplate.tag === oldElementTemplate.tag) {
            return this.__updateElementByElementDifferentTemplateSameTag(element, newElementTemplate);
        }
        else {
            return this.__updateElementByElementDifferentTemplateDifferentTag(element, newElementTemplate);
        }
    }
    __updateNode(node, newTemplate) {
        const oldTemplate = this.__templates.get(node);
        if (newTemplate === oldTemplate) {
            return node;
        }
        if (newTemplate.uuid === oldTemplate.uuid) {
            if (oldTemplate instanceof TextTemplate && newTemplate instanceof TextTemplate) {
                return this.__updateTextByText(node, newTemplate);
            }
            else if (oldTemplate instanceof ElementTemplate && newTemplate instanceof ElementTemplate) {
                return this.__updateElementByElementSameTemplate(node, newTemplate);
            }
            else {
                throw new Error(`Invalid template types.`);
            }
        }
        else {
            if (oldTemplate instanceof TextTemplate) {
                if (newTemplate instanceof TextTemplate) {
                    return this.__updateTextByText(node, newTemplate);
                }
                else if (newTemplate instanceof ElementTemplate) {
                    return this.__updateTextByElement(node, newTemplate);
                }
                else {
                    throw new Error(`Invalid template types.`);
                }
            }
            else if (oldTemplate instanceof ElementTemplate) {
                if (newTemplate instanceof TextTemplate) {
                    return this.__updateElementByText(node, newTemplate);
                }
                else if (newTemplate instanceof ElementTemplate) {
                    return this.__updateElementByElementDifferentTemplate(node, newTemplate);
                }
                else {
                    throw new Error(`Invalid template types.`);
                }
            }
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
