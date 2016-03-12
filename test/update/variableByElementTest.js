import test from 'tapes';

import Shapedom, { Variable } from '../../dist/shapedom';

test('shapedom.update variable template by element template', function (t) {
  let shapedom;
  let variableTemplate;
  let variableNode, root;

  t.beforeEach(function (t) {
    shapedom = new Shapedom(document);

    root = document.createElement('div');

    variableTemplate = shapedom.createTemplate(new Variable('hi there'));
    variableNode = shapedom.render(variableTemplate);
    root.appendChild(variableNode);

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
        'another text',
        {
          tag: 'span',
          attrs: {
            class: 'content'
          },
          children: ['some text']
        },
        new Variable('yet another text')
      ]
    });

    let result = shapedom.update(variableNode, elementTemplate);

    t.is(root.childNodes[0], result);
    t.assert(result instanceof Element);
    t.is(result.outerHTML, '<div id="box123" class="box cube">another text<span class="content">some text</span>yet another text</div>');

    t.end();
  });

  t.end();
});
