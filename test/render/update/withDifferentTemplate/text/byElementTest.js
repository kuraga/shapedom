import test from 'tapes';

import ShapeDom from '../../../../../shapedom';

test('shapedom.update text template by element template', function (t) {
  let shapedom;
  let textTemplate, clonedTextTemplate;
  let textNode, root;

  t.beforeEach(function (t) {
    shapedom = new ShapeDom(document);

    root = document.createElement('div');

    textTemplate = shapedom.createTemplate({
      text: 'hi there'
    });
    textNode = shapedom.render(textTemplate);
    root.appendChild(textNode);

    t.end();
  });

  t.test('element template', function (t) {
    let elementTemplate = shapedom.createTemplate({
      tag: 'div',
      attrs: {
        id: 'box123',
        class: 'box cube'
      },
      children: [
        {
          tag: 'span',
          attrs: {
            class: 'content'
          },
          children: [
            {
              text: 'some text'
            }
          ]
        },
        {
          text: 'another text'
        }
      ]
    });

    let result = shapedom.update(textNode, elementTemplate);

    t.is(root.childNodes[0], result);
    t.assert(result instanceof Element);
    t.is(result.outerHTML, '<div id="box123" class="box cube"><span class="content">some text</span>another text</div>');

    t.end();
  });

  t.end();
});
