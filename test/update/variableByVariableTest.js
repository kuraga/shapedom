import test from 'tapes';

import Shapedom, { Variable } from '../../dist/shapedom';

test('shapedom.update variable by variable', function (t) {
  let shapedom;
  let variable;
  let variableNode, root;

  t.beforeEach(function (t) {
    shapedom = new Shapedom(document);

    root = document.createElement('div');

    variable = shapedom.createTemplate(new Variable('hi there'));
    variableNode = shapedom.render(variable);
    root.appendChild(variableNode);

    t.end();
  });

  t.test('with the same text', function (t) {
    let anotherVariableTemplate = shapedom.createTemplate(new Variable('hi there'));

    let result = shapedom.update(variableNode, anotherVariableTemplate);

    t.is(root.childNodes[0], result);
    t.assert(result instanceof Text);
    t.is(result.wholeText, 'hi there');

    t.end();
  });

  t.test('with another text', function (t) {
    let anotherVariableTemplate = shapedom.createTemplate(new Variable('new variable'));

    let result = shapedom.update(variableNode, anotherVariableTemplate);

    t.is(root.childNodes[0], result);
    t.assert(result instanceof Text);
    t.is(result.wholeText, 'new variable');

    t.end();
  });

  t.end();
});
