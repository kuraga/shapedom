import test from 'tapes';

import Shapedom, { Template } from '../../dist/shapedom';

test('shapedom.createTemplate with element shape', function (t) {
  let shapedom;

  t.beforeEach(function (t) {
    shapedom = new Shapedom(document);

    t.end();
  });

  t.test('without children', function (t) {
    let result = shapedom.createTemplate({
      tag: 'div',
      attrs: {
        id: 'someId',
        class: 'someClass anotherClass'
      }
    });

    t.assert(result instanceof Template);

    t.end();
  });

  t.test('with children', function (t) {
    let result = shapedom.createTemplate({
      tag: 'div',
      attrs: {
        id: 'someId',
        class: 'someClass anotherClass'
      },
      children: [
        'header',
        {
          tag: 'span',
          attrs: {}
        },
        'footer'
      ]
    });

    t.assert(result instanceof Template);

    t.end();
  });

  t.end();
});
