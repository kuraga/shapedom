import test from 'tapes';
import cloneTemplate from '../../helpers/cloneTemplate';

import Shapedom from '../../../dist/shapedom';

test('shapedom.update text template by same template', function (t) {
  let shapedom;
  let textTemplate, clonedTextTemplate;
  let textNode, root;

  t.beforeEach(function (t) {
    shapedom = new Shapedom(document);

    root = document.createElement('div');

    textTemplate = shapedom.createTemplate({
      text: 'hi there'
    });
    textNode = shapedom.render(textTemplate);
    root.appendChild(textNode);

    clonedTextTemplate = cloneTemplate(textTemplate);

    t.end();
  });

  t.test('with no changes', function (t) {
    let result = shapedom.update(textNode, clonedTextTemplate);

    t.is(root.childNodes[0], result);
    t.assert(result instanceof Text);
    t.is(result.wholeText, 'hi there');

    t.end();
  });

  t.test('text changed', function (t) {
    clonedTextTemplate.text = 'new text';

    let result = shapedom.update(textNode, clonedTextTemplate);

    t.is(root.childNodes[0], result);
    t.assert(result instanceof Text);
    t.is(result.wholeText, 'new text');

    t.end();
  });

  t.end();
});
