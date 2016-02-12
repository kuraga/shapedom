import test from 'tapes';

import Shapedom, { TextTemplate } from '../../dist/shapedom';

test('shapedom.createTemplate with text shape', function (t) {
  let shapedom;

  t.beforeEach(function (t) {
    shapedom = new Shapedom(document);

    t.end();
  });

  t.test('text shape', function (t) {
    let result = shapedom.createTemplate({
      text: 'hi there'
    });

    t.assert(result instanceof TextTemplate);

    t.end();
  });

  t.end();
});
