import test from 'tapes';

import Shapedom from '../../dist/shapedom';

test('shapedom.update text template by text template', function (t) {
  let shapedom;
  let textTemplate;
  let textNode, root;

  t.beforeEach(function (t) {
    shapedom = new Shapedom(document);

    root = document.createElement('div');

    textTemplate = shapedom.createTemplate('hi there');
    textNode = shapedom.render(textTemplate);
    root.appendChild(textNode);

    t.end();
  });

  t.test('with the same text', function (t) {
    const anotherTextTemplate = shapedom.createTemplate('hi there');

    const result = shapedom.update(textNode, anotherTextTemplate);

    t.is(root.childNodes[0], result);
    t.assert(result instanceof Text);
    t.is(result.wholeText, 'hi there');

    t.end();
  });

  t.test('with another text', function (t) {
    const anotherTextTemplate = shapedom.createTemplate('new text');

    const result = shapedom.update(textNode, anotherTextTemplate);

    t.is(root.childNodes[0], result);
    t.assert(result instanceof Text);
    t.is(result.wholeText, 'new text');

    t.end();
  });

  t.end();
});
