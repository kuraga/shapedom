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
    protected __value: string;
    constructor(value: string);
    set(value: string): this;
    get(): string;
}
export default class Shapedom {
    document: Document;
    protected __templates: WeakMap<Node, Template | string>;
    constructor(document: Document);
    createTemplate(shapeOrStringOrVariable: Shape | string | Variable): Template | string;
    protected __createText(textOrVariable: string | Variable): Text;
    protected __createElement(template: Template): Element;
    protected __createNode(templateOrStringOrVariable: Template | string | Variable): Node;
    protected __updateTextByText(textNode: Text, newTextStringOrVariable: string | Variable): Text;
    protected __updateTextByElement(textNode: Text, newTemplate: Template): Element;
    protected __updateElementByText(element: Element, newTextStringOrVariable: string | Variable): Text;
    protected __removeNode(node: Node): void;
    protected __removeChildren(node: Node): void;
    protected __updateElementByElementSameTemplate(element: Element, newTemplate: Template): Element;
    protected __updateChildren(element: Element, newChildren: (Template | string | Variable)[]): NodeList;
    protected __updateElementByElementDifferentTemplateSameTag(element: Element, newTemplate: Template): Element;
    protected __updateElementByElementDifferentTemplateDifferentTag(element: Element, newTemplate: Template): Element;
    protected __updateElementByElementDifferentTemplate(element: Element, newTemplate: Template): Element;
    protected __updateNode(node: Node, newTemplate: Template | string | Variable): Node;
    render(template: Template): Node;
    update(node: Node, template: Template): Node;
}
