import test from 'tapes';

import Shapedom from '../../dist/shapedom';

test('shapedom.update text template by element template', function (t) {
  let shapedom;
  let textTemplate;
  let textNode, root;

  t.beforeEach(function (t) {
    shapedom = new Shapedom(document);

    root = document.createElement('div');

    textTemplate = shapedom.createTemplate('hi there');
    textNode = shapedom.render(textTemplate);
    root.appendChild(textNode);

    t.end();
  });

  t.test('element template', function (t) {
    const elementTemplate = shapedom.createTemplate({
      tag: 'div',
      attrs: {
        id: 'box123',
        class: 'box cube'
      },
      children: [
        'another text',
        {
          tag: 'span',
          attrs: {
            class: 'content'
          },
          children: ['some text']
        },
        'yet another text'
      ]
    });

    const result = shapedom.update(textNode, elementTemplate);

    t.is(root.childNodes[0], result);
    t.assert(result instanceof Element);
    t.is(result.outerHTML, '<div id="box123" class="box cube">another text<span class="content">some text</span>yet another text</div>');

    t.end();
  });

  t.end();
});
