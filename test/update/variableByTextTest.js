import test from 'tapes';

import Shapedom, { Variable } from '../../dist/shapedom';

test('shapedom.update variable template by text template', function (t) {
  let shapedom;
  let variableTemplate;
  let variableNode, root;

  t.beforeEach(function (t) {
    shapedom = new Shapedom(document);

    root = document.createElement('div');

    variableTemplate = shapedom.createTemplate(new Variable('hi there'));
    variableNode = shapedom.render(variableTemplate);
    root.appendChild(variableNode);

    t.end();
  });

  t.test('with the same text', function (t) {
    const textTemplate = shapedom.createTemplate('hi there');

    const result = shapedom.update(variableNode, textTemplate);

    t.is(root.childNodes[0], result);
    t.assert(result instanceof Text);
    t.is(result.wholeText, 'hi there');

    t.end();
  });

  t.test('with another text', function (t) {
    const textTemplate = shapedom.createTemplate('new text');

    const result = shapedom.update(variableNode, textTemplate);

    t.is(root.childNodes[0], result);
    t.assert(result instanceof Text);
    t.is(result.wholeText, 'new text');

    t.end();
  });

  t.end();
});
