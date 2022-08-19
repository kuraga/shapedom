export interface Shape {
    tag: string;
    attrs: {
        [key: string]: string | Variable;
    };
    children?: (string | Variable | Shape | Template)[];
}
export declare class Template {
    uuid: string;
    tag: string;
    attrs: {
        [key: string]: string | Variable;
    };
    children: (string | Variable | Template)[];
    constructor(uuid: string, tag: string, attrs: {
        [key: string]: string | Variable;
    }, children?: (string | Variable | Template)[]);
}
export declare class Variable {
    protected __value: string;
    constructor(value: string);
    set(value: string): this;
    get(): string;
}
export default class Shapedom {
    document: Document;
    protected __templates: WeakMap<Node, string | Variable | Template>;
    constructor(document: Document);
    createTemplate(stringOrVariableOrShapeOrTemplate: string | Variable | Shape | Template): string | Variable | Template;
    protected __removeNode(node: Node): void;
    protected __removeChildNodes(node: Node): void;
    protected __replaceNode(oldNode: Node, newNode: Node, newStringOrVariableOrTemplate: string | Variable | Template): Node;
    protected __appendNode(parent: Node, newNode: Node, stringOrVariableOrTemplate: string | Variable | Template): Node;
    protected __createText(textOrVariable: string | Variable): Text;
    protected __createElement(template: Template): Element;
    protected __createNode(stringOrVariableOrTemplateOrFragment: string | Variable | Template): Node;
    protected __updateTextByText(textNode: Text, newTextStringOrVariable: string | Variable): Text;
    protected __updateTextByTemplate(textNode: Text, newTemplate: Template): Element;
    protected __updateElementByText(element: Element, newTextStringOrVariable: string | Variable): Text;
    protected __updateElementBySameTemplate(element: Element, newTemplate: Template): Element;
    protected __updateChildren(element: Element, newChildren: (string | Variable | Template)[]): NodeList;
    protected __updateElementByDifferentTemplateSameTag(element: Element, newTemplate: Template): Element;
    protected __updateElementByDifferentTemplateDifferentTag(element: Element, newTemplate: Template): Element;
    protected __updateElementByDifferentTemplate(element: Element, newTemplate: Template): Element;
    protected __updateNode(node: Node, newTemplate: string | Variable | Template): Node;
    render(template: Template): Node;
    update(node: Node, template: Template): Node;
}
