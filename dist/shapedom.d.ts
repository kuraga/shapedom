export interface Shape {
    tag: string;
    attrs: {
        [key: string]: string;
    };
    children?: Shape[];
}
export declare class Template {
    uuid: string;
    tag: string;
    attrs: {
        [key: string]: string;
    };
    children: (Template | string)[];
}
export default class Shapedom {
    document: Document;
    private __templates;
    constructor(document: Document);
    createTemplate(shapeOrString: Shape | string): Template | string;
    __createText(text: string): Text;
    __createElement(template: Template): Element;
    __createNode(templateOrString: Template | string): Node;
    __updateTextByText(textNode: Text, newText: string): Text;
    __updateTextByElement(textNode: Text, newTemplate: Template): Element;
    __updateElementByText(element: Element, newText: string): Text;
    __removeNode(node: Node): void;
    __removeChildren(node: Node): void;
    __updateElementByElementSameTemplate(element: Element, newTemplate: Template): Element;
    __updateChildren(element: Element, newChildren: (Template | string)[]): NodeList;
    __updateElementByElementDifferentTemplateSameTag(element: Element, newTemplate: Template): Element;
    __updateElementByElementDifferentTemplateDifferentTag(element: Element, newTemplate: Template): Element;
    __updateElementByElementDifferentTemplate(element: Element, newTemplate: Template): Element;
    __updateNode(node: Node, newTemplate: Template | string): Node;
    render(template: Template): Node;
    update(node: Node, template: Template): Node;
}
