import test from 'tapes';

import Shapedom from '../../../shapedom';

test('shapedom.render a new text template', function (t) {
  let shapedom;

  t.beforeEach(function (t) {
    shapedom = new Shapedom(document);

    t.end();
  });

  t.test('non-empty text', function (t) {
    let textTemplate = shapedom.createTemplate({
      text: 'hi there'
    });

    let result = shapedom.render(textTemplate);

    t.assert(result instanceof Text);
    t.is(result.wholeText, 'hi there');

    t.end();
  });

  t.test('empty text', function (t) {
    let textTemplate = shapedom.createTemplate({
      text: ''
    });

    let result = shapedom.render(textTemplate);

    t.assert(result instanceof Text);
    t.is(result.wholeText, '');

    t.end();
  });

  t.end();
});
