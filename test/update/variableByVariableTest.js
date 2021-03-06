import test from 'tapes';

import Shapedom, { Variable } from '../../dist/shapedom';

test('shapedom.update variable template by variable template', function (t) {
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
    const anotherVariableTemplate = shapedom.createTemplate(new Variable('hi there'));

    const result = shapedom.update(variableNode, anotherVariableTemplate);

    t.is(root.childNodes[0], result);
    t.assert(result instanceof Text);
    t.is(result.wholeText, 'hi there');

    t.end();
  });

  t.test('with another text', function (t) {
    const anotherVariableTemplate = shapedom.createTemplate(new Variable('new variable'));

    const result = shapedom.update(variableNode, anotherVariableTemplate);

    t.is(root.childNodes[0], result);
    t.assert(result instanceof Text);
    t.is(result.wholeText, 'new variable');

    t.end();
  });

  t.end();
});
