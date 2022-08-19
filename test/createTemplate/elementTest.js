import test from 'tapes';

import Shapedom, { Variable, Template } from '../../dist/shapedom';

test('shapedom.createTemplate with element shape', function (t) {
  let shapedom;

  t.beforeEach(function (t) {
    shapedom = new Shapedom(document);

    t.end();
  });

  t.test('without children', function (t) {
    const result = shapedom.createTemplate({
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
    const anotherElementTemplate = shapedom.createTemplate({
      tag: 'div',
      attrs: {
        id: 'someId'
      }
    });
    const result = shapedom.createTemplate({
      tag: 'div',
      attrs: {
        id: 'someId',
        class: 'someClass anotherClass'
      },
      children: [
        'header',
        {
          tag: 'span',
          attrs: {
            class: 'content'
          }
        },
        anotherElementTemplate,
        new Variable('footer')
      ]
    });

    t.assert(result instanceof Template);

    t.end();
  });

  t.test('identifiers', function (t) {
    const tag = 'tag',
      attrs = {};
    let result;

    t.beforeEach(function (t) {
      result = shapedom.createTemplate({
        tag: tag,
        attrs: attrs
      });

      t.end();
    });

    t.test('are strings', function (t) {
      t.equal(typeof result.uuid, 'string');

      t.end();
    });

    t.test('are different', function (t) {
      const result2 = shapedom.createTemplate({
        tag: tag,
        attrs: attrs
      });

      t.notEqual(result.uuid, result2.uuid);

      t.end();
    });

    t.end();
  });

  t.end();
});
