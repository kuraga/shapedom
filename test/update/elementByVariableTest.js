import test from 'tapes';

import Shapedom, { Variable } from '../../dist/shapedom';

test('shapedom.update element template by variable template', function (t) {
  let shapedom;
  let elementTemplate;
  let elementNode, root;

  t.beforeEach(function (t) {
    shapedom = new Shapedom(document);

    root = document.createElement('div');

    elementTemplate = shapedom.createTemplate({
      tag: 'div',
      attrs: {
        id: 'box123',
        class: 'box cube'
      },
      children: ['content']
    });
    elementNode = shapedom.render(elementTemplate);
    root.appendChild(elementNode);

    t.end();
  });

  t.test('non-empty text', function (t) {
    let variableTemplate = shapedom.createTemplate(new Variable('hi there'));

    let result = shapedom.update(elementNode, variableTemplate);

    t.is(root.childNodes[0], result);
    t.assert(result instanceof Text);
    t.is(result.wholeText, 'hi there');

    t.end();
  });

  t.end();
});
