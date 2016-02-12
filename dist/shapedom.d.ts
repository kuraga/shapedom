export interface Shape {
}
export interface ElementShape extends Shape {
    tag: string;
    attrs: {
        [key: string]: string;
    };
    children?: Shape[];
}
export interface TextShape extends Shape {
    text: string;
}
export declare abstract class Template {
    uuid: string;
}
export declare class ElementTemplate extends Template {
    tag: string;
    attrs: {
        [key: string]: string;
    };
    children: Template[];
}
export declare class TextTemplate extends Template {
    text: string;
}
export default class Shapedom {
    document: Document;
    private __templates;
    constructor(document: Document);
    __createTextTemplate(shape: TextShape): TextTemplate;
    __createElementTemplate(shape: ElementShape): ElementTemplate;
    createTemplate(shape: Shape): Template;
    __createText(textTemplate: TextTemplate): Text;
    __createElement(elementTemplate: ElementTemplate): Element;
    __createNode(template: Template): Node;
    __updateTextByText(textNode: Text, newTextTemplate: TextTemplate): Text;
    __updateTextByElement(textNode: Text, newElementTemplate: ElementTemplate): Element;
    __updateElementByText(element: Element, newTextTemplate: TextTemplate): Text;
    __removeNode(node: Node): void;
    __removeChildren(node: Node): void;
    __updateElementByElementSameTemplate(element: Element, newElementTemplate: ElementTemplate): Element;
    __updateChildren(element: Element, newChildren: Template[]): NodeList;
    __updateElementByElementDifferentTemplateSameTag(element: Element, newElementTemplate: ElementTemplate): Element;
    __updateElementByElementDifferentTemplateDifferentTag(element: Element, newElementTemplate: ElementTemplate): Element;
    __updateElementByElementDifferentTemplate(element: Element, newElementTemplate: ElementTemplate): Element;
    __updateNode(node: Node, newTemplate: Template): Node;
    render(template: Template): Node;
    update(node: Node, template: Template): Node;
}
