import test from 'tapes';

import ShapeDom, { ElementTemplate } from '../../shapedom';

test('shapedom.createTemplate with element shape', function (t) {
  let shapedom;

  t.beforeEach(function (t) {
    shapedom = new ShapeDom(document);

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

    t.assert(result instanceof ElementTemplate);

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
        {
          text: 'header'
        },
        {
          tag: 'span',
          attrs: {}
        },
        {
          text: 'footer'
        }
      ]
    });

    t.assert(result instanceof ElementTemplate);

    t.end();
  });

  t.end();
});
