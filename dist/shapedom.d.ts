export interface Shape {
    tag: string;
    attrs: {
        [key: string]: string | Variable;
    };
    children?: Shape[];
}
export declare class Template {
    uuid: string;
    tag: string;
    attrs: {
        [key: string]: string | Variable;
    };
    children: (Template | string | Variable)[];
}
export declare class Variable {
    private __value;
    constructor(value: string);
    set(value: string): this;
    get(): string;
}
export default class Shapedom {
    document: Document;
    private __templates;
    constructor(document: Document);
    createTemplate(shapeOrStringOrVariable: Shape | string | Variable): Template | string;
    __createText(textOrVariable: string | Variable): Text;
    __createElement(template: Template): Element;
    __createNode(templateOrStringOrVariable: Template | string | Variable): Node;
    __updateTextByText(textNode: Text, newTextStringOrVariable: string | Variable): Text;
    __updateTextByElement(textNode: Text, newTemplate: Template): Element;
    __updateElementByText(element: Element, newTextStringOrVariable: string | Variable): Text;
    __removeNode(node: Node): void;
    __removeChildren(node: Node): void;
    __updateElementByElementSameTemplate(element: Element, newTemplate: Template): Element;
    __updateChildren(element: Element, newChildren: (Template | string | Variable)[]): NodeList;
    __updateElementByElementDifferentTemplateSameTag(element: Element, newTemplate: Template): Element;
    __updateElementByElementDifferentTemplateDifferentTag(element: Element, newTemplate: Template): Element;
    __updateElementByElementDifferentTemplate(element: Element, newTemplate: Template): Element;
    __updateNode(node: Node, newTemplate: Template | string | Variable): Node;
    render(template: Template): Node;
    update(node: Node, template: Template): Node;
}
