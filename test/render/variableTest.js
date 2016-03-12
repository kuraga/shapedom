import test from 'tapes';

import Shapedom, { Variable } from '../../dist/shapedom';

test('shapedom.render a new variable template', function (t) {
  let shapedom;

  t.beforeEach(function (t) {
    shapedom = new Shapedom(document);

    t.end();
  });

  t.test('non-empty variable', function (t) {
    let variableTemplate = shapedom.createTemplate(new Variable('hi there'));

    let result = shapedom.render(variableTemplate);

    t.assert(result instanceof Text);
    t.is(result.wholeText, 'hi there');

    t.end();
  });

  t.test('empty variable', function (t) {
    let variableTemplate = shapedom.createTemplate(new Variable(''));

    let result = shapedom.render(variableTemplate);

    t.assert(result instanceof Text);
    t.is(result.wholeText, '');

    t.end();
  });

  t.end();
});
