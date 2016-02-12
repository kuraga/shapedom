import test from 'tapes';

import Shapedom from '../../dist/shapedom';

test('shapedom.render a new element template', function (t) {
  let shapedom;

  t.beforeEach(function (t) {
    shapedom = new Shapedom(document);

    t.end();
  });

  t.test('without children', function (t) {
    t.test('without attributes', function (t) {
      let elementTemplate = shapedom.createTemplate({
        tag: 'div',
        attrs: {}
      });

      let result = shapedom.render(elementTemplate);

      t.assert(result instanceof Element);
      t.is(result.outerHTML, '<div></div>');

      t.end();
    });

    t.test('with attributes', function (t) {
      let elementTemplate = shapedom.createTemplate({
        tag: 'div',
        attrs: {
          id: 'someId',
          class: 'someClass anotherClass'
        }
      });

      let result = shapedom.render(elementTemplate);

      t.assert(result instanceof Element);
      t.is(result.outerHTML, '<div id="someId" class="someClass anotherClass"></div>');

      t.end();
    });

    t.end();
  });

  t.test('with children', function (t) {
    let template = shapedom.createTemplate({
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
          attrs: {
            class: 'content'
          }
        },
        {
          text: 'footer'
        }
      ]
    });

    let result = shapedom.render(template);

    t.assert(result instanceof Element);
    t.is(result.outerHTML, '<div id="someId" class="someClass anotherClass">header<span class="content"></span>footer</div>');

    t.end();
  });

  t.end();
});
