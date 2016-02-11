import test from 'tapes';

import ShapeDom from '../../../../../shapedom';

test('shapedom.update element template by text template', function (t) {
  let shapedom;
  let elementTemplate;
  let elementNode, root;

  t.beforeEach(function (t) {
    shapedom = new ShapeDom(document);

    root = document.createElement('div');

    elementTemplate = shapedom.createTemplate({
      tag: 'div',
      attrs: {
        id: 'box123',
        class: 'box cube'
      },
      children: [
        {
          text: 'content'
        }
      ]
    });
    elementNode = shapedom.render(elementTemplate);
    root.appendChild(elementNode);

    t.end();
  });

  t.test('non-empty text', function (t) {
    let textTemplate = shapedom.createTemplate({
      text: 'hi there'
    });

    let result = shapedom.update(elementNode, textTemplate);

    t.is(root.childNodes[0], result);
    t.assert(result instanceof Text);
    t.is(result.wholeText, 'hi there');

    t.end();
  });

  t.end();
});
