import {
  TextTemplate, ElementTemplate
} from '../../dist/shapedom';

export default function cloneTemplate(template) {
  let clonedTemplate;

  if (template instanceof TextTemplate) {
    clonedTemplate = new TextTemplate();
    clonedTemplate.text = template.text;
  } else if (template instanceof ElementTemplate) {
    clonedTemplate = new ElementTemplate();
    clonedTemplate.tag = template.tag;
    clonedTemplate.attrs = Object.assign({}, template.attrs);
    clonedTemplate.children = template.children.map((child) => ( cloneTemplate(child) ));
  } else {
    throw new Error(`Invalid template type.`);
  }

  clonedTemplate.uuid = template.uuid;

  return clonedTemplate;
}
