import { Template } from '../../dist/shapedom';

export default function cloneTemplate(templateOrString) {
  if (typeof templateOrString === 'string' || templateOrString instanceof String) {
    return templateOrString;
  } else if (templateOrString instanceof Template) {
    let clonedTemplate = new Template();

    clonedTemplate.uuid = templateOrString.uuid;
    clonedTemplate.tag = templateOrString.tag;
    clonedTemplate.attrs = Object.assign({}, templateOrString.attrs);

    clonedTemplate.children = templateOrString.children.map((child) => ( cloneTemplate(child) ));

    return clonedTemplate;
  } else {
    throw new Error(`Invalid template type.`);
  }
}
