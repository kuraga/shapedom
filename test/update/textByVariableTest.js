import test from 'tapes';

import Shapedom, { Variable } from '../../dist/shapedom';

test('shapedom.update text by variable', function (t) {
  let shapedom;
  let text;
  let textNode, root;

  t.beforeEach(function (t) {
    shapedom = new Shapedom(document);

    root = document.createElement('div');

    text = shapedom.createTemplate('hi there');
    textNode = shapedom.render(text);
    root.appendChild(textNode);

    t.end();
  });

  t.test('with the same text', function (t) {
    let variableTemplate = shapedom.createTemplate(new Variable('hi there'));

    let result = shapedom.update(textNode, variableTemplate);

    t.is(root.childNodes[0], result);
    t.assert(result instanceof Text);
    t.is(result.wholeText, 'hi there');

    t.end();
  });

  t.test('with another text', function (t) {
    let variableTemplate = shapedom.createTemplate(new Variable('new text'));

    let result = shapedom.update(textNode, variableTemplate);

    t.is(root.childNodes[0], result);
    t.assert(result instanceof Text);
    t.is(result.wholeText, 'new text');

    t.end();
  });

  t.end();
});
