import test from 'tapes';

import Shapedom, { Variable } from '../../dist/shapedom';

test('shapedom.render a new element template', function (t) {
  let shapedom;

  t.beforeEach(function (t) {
    shapedom = new Shapedom(document);

    t.end();
  });

  t.test('without children', function (t) {
    t.test('without attributes', function (t) {
      const elementTemplate = shapedom.createTemplate({
        tag: 'div',
        attrs: {}
      });

      const result = shapedom.render(elementTemplate);

      t.assert(result instanceof Element);
      t.is(result.outerHTML, '<div></div>');

      t.end();
    });

    t.test('with attributes', function (t) {
      const elementTemplate = shapedom.createTemplate({
        tag: 'div',
        attrs: {
          id: 'someId',
          class: new Variable('someClass anotherClass')
        }
      });

      const result = shapedom.render(elementTemplate);

      t.assert(result instanceof Element);
      t.is(result.outerHTML, '<div id="someId" class="someClass anotherClass"></div>');

      t.end();
    });

    t.end();
  });

  t.test('with children', function (t) {
    const anotherElementTemplate = shapedom.createTemplate({
      tag: 'div',
      attrs: {
        id: 'someId'
      }
    });
    const elementTemplate = shapedom.createTemplate({
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

    const result = shapedom.render(elementTemplate);

    t.assert(result instanceof Element);
    t.is(result.outerHTML, '<div id="someId" class="someClass anotherClass">header<span class="content"></span><div id="someId"></div>footer</div>');

    t.end();
  });

  t.end();
});
