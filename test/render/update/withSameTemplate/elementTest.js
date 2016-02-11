import test from 'tapes';
import cloneTemplate from '../../../helpers/cloneTemplate';

import ShapeDom from '../../../../shapedom';

test('shapedom.update element template by same template', function (t) {
  let shapedom;
  let elementTemplate, clonedElementTemplate;
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
    elementNode = shapedom.render(elementTemplate);
    root.appendChild(elementNode);

    clonedElementTemplate = cloneTemplate(elementTemplate);

    t.end();
  });

  t.test('with exactly the same template instance', function (t) {
    let result = shapedom.update(elementNode, elementTemplate);

    t.is(root.childNodes[0], result);
    t.assert(result instanceof Element);
    t.is(result.outerHTML, '<div id="box123" class="box cube"><span class="content">some text</span>another text</div>');

    t.end();
  });

  t.test('with no changes', function (t) {
    let result = shapedom.update(elementNode, clonedElementTemplate);

    t.assert(result instanceof Element);
    t.is(result.outerHTML, '<div id="box123" class="box cube"><span class="content">some text</span>another text</div>');

    t.end();
  });

  t.test('attributes', function (t) {
    t.test('attribute changed', function (t) {
      clonedElementTemplate.attrs.id = 'bag123';
      clonedElementTemplate.attrs.class = 'bag';

      let result = shapedom.update(elementNode, clonedElementTemplate);

      t.is(root.childNodes[0], result);
      t.assert(result instanceof Element);
      t.is(result.outerHTML, '<div id="bag123" class="bag"><span class="content">some text</span>another text</div>');

      t.end();
    });

    t.end();
  });

  t.test('child changed', function (t) {
    t.test('child\'s text changed', function (t) {
      clonedElementTemplate.children[1].text = 'another helpful text';

      let result = shapedom.update(elementNode, clonedElementTemplate);

      t.is(root.childNodes[0], result);
      t.assert(result instanceof Element);
      t.is(result.outerHTML, '<div id="box123" class="box cube"><span class="content">some text</span>another helpful text</div>');

      t.end();
    });

    t.test('child\'s attribute changed', function (t) {
      clonedElementTemplate.children[0].attrs.class = 'seriousContent';

      let result = shapedom.update(elementNode, clonedElementTemplate);

      t.is(root.childNodes[0], result);
      t.assert(result instanceof Element);
      t.is(result.outerHTML, '<div id="box123" class="box cube"><span class="seriousContent">some text</span>another text</div>');

      t.end();
    });

    t.test('child\'s child changed', function (t) {
      clonedElementTemplate.children[0].children[0].text = 'total new text';

      let result = shapedom.update(elementNode, clonedElementTemplate);

      t.is(root.childNodes[0], result);
      t.assert(result instanceof Element);
      t.is(result.outerHTML, '<div id="box123" class="box cube"><span class="content">total new text</span>another text</div>');

      t.end();
    });

    t.end();
  });

  t.end();
});
