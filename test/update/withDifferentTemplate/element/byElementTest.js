import test from 'tapes';
import clone from 'clone';

import Shapedom from '../../../../dist/shapedom';

test('shapedom.update element template by same template', function (t) {
  let shapedom;
  let elementShape, clonedElementShape;
  let elementTemplate;
  let elementNode, root;

  t.beforeEach(function (t) {
    shapedom = new Shapedom(document);

    root = document.createElement('div');

    elementShape = {
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
    };
    elementTemplate = shapedom.createTemplate(elementShape);
    elementNode = shapedom.render(elementTemplate);
    root.appendChild(elementNode);

    clonedElementShape = clone(elementShape);

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
    let anotherElementTemplate = shapedom.createTemplate(clonedElementShape);

    let result = shapedom.update(elementNode, anotherElementTemplate);

    t.assert(result instanceof Element);
    t.is(result.outerHTML, '<div id="box123" class="box cube"><span class="content">some text</span>another text</div>');

    t.end();
  });

  t.test('attributes', function (t) {
    t.test('attribute changed', function (t) {
      clonedElementShape.attrs.id = 'bag123';
      clonedElementShape.attrs.class = 'bag';
      let anotherElementTemplate = shapedom.createTemplate(clonedElementShape);

      let result = shapedom.update(elementNode, anotherElementTemplate);

      t.is(root.childNodes[0], result);
      t.assert(result instanceof Element);
      t.is(result.outerHTML, '<div id="bag123" class="bag"><span class="content">some text</span>another text</div>');

      t.end();
    });

    t.test('attribute added', function (t) {
      clonedElementShape.attrs.style = 'border: solid 1px black;';
      let anotherElementTemplate = shapedom.createTemplate(clonedElementShape);

      let result = shapedom.update(elementNode, anotherElementTemplate);

      t.is(root.childNodes[0], result);
      t.assert(result instanceof Element);
      t.is(result.outerHTML, '<div id="box123" class="box cube" style="border: solid 1px black;"><span class="content">some text</span>another text</div>');

      t.end();
    });

    t.test('attribute removed', function (t) {
      delete clonedElementShape.attrs.class;
      let anotherElementTemplate = shapedom.createTemplate(clonedElementShape);

      let result = shapedom.update(elementNode, anotherElementTemplate);

      t.is(root.childNodes[0], result);
      t.assert(result instanceof Element);
      t.is(result.outerHTML, '<div id="box123"><span class="content">some text</span>another text</div>');

      t.end();
    });

    t.test('attribute added and removed', function (t) {
      clonedElementShape.attrs.style = 'border: solid 1px black;';
      delete clonedElementShape.attrs.class;
      let anotherElementTemplate = shapedom.createTemplate(clonedElementShape);

      let result = shapedom.update(elementNode, anotherElementTemplate);

      t.is(root.childNodes[0], result);
      t.assert(result instanceof Element);
      t.is(result.outerHTML, '<div id="box123" style="border: solid 1px black;"><span class="content">some text</span>another text</div>');

      t.end();
    });

    t.end();
  });

  t.test('tag changed', function (t) {
    clonedElementShape.tag = 'span';
    let anotherElementTemplate = shapedom.createTemplate(clonedElementShape);

    let result = shapedom.update(elementNode, anotherElementTemplate);

    t.assert(result instanceof Element);
    t.is(result.outerHTML, '<span id="box123" class="box cube"><span class="content">some text</span>another text</span>');

    t.end();
  });

  t.test('child changed', function (t) {
    t.test('child\'s text changed', function (t) {
      clonedElementShape.children[1].text = 'another helpful text';
      let anotherElementTemplate = shapedom.createTemplate(clonedElementShape);

      let result = shapedom.update(elementNode, anotherElementTemplate);

      t.is(root.childNodes[0], result);
      t.assert(result instanceof Element);
      t.is(result.outerHTML, '<div id="box123" class="box cube"><span class="content">some text</span>another helpful text</div>');

      t.end();
    });

    t.test('child\'s attributes changed', function (t) {
      t.test('child\'s attribute changed', function (t) {
        clonedElementShape.children[0].attrs.class = 'boxContent';
        let anotherElementTemplate = shapedom.createTemplate(clonedElementShape);

        let result = shapedom.update(elementNode, anotherElementTemplate);

        t.is(root.childNodes[0], result);
        t.assert(result instanceof Element);
        t.is(result.outerHTML, '<div id="box123" class="box cube"><span class="boxContent">some text</span>another text</div>');

        t.end();
      });

      t.test('child\'s attribute added', function (t) {
        clonedElementShape.children[0].attrs.style = 'border: solid 1px black;';
        let anotherElementTemplate = shapedom.createTemplate(clonedElementShape);

        let result = shapedom.update(elementNode, anotherElementTemplate);

        t.is(root.childNodes[0], result);
        t.assert(result instanceof Element);
        t.is(result.outerHTML, '<div id="box123" class="box cube"><span class="content" style="border: solid 1px black;">some text</span>another text</div>');

        t.end();
      });

      t.test('child\'s attribute removed', function (t) {
        delete clonedElementShape.children[0].attrs.class;
        let anotherElementTemplate = shapedom.createTemplate(clonedElementShape);

        let result = shapedom.update(elementNode, anotherElementTemplate);

        t.is(root.childNodes[0], result);
        t.assert(result instanceof Element);
        t.is(result.outerHTML, '<div id="box123" class="box cube"><span>some text</span>another text</div>');

        t.end();
      });

      t.test('child\'s attribute added and removed', function (t) {
        clonedElementShape.children[0].attrs.style = 'border: solid 1px black;';
        delete clonedElementShape.children[0].attrs.class;
        let anotherElementTemplate = shapedom.createTemplate(clonedElementShape);

        let result = shapedom.update(elementNode, anotherElementTemplate);

        t.is(root.childNodes[0], result);
        t.assert(result instanceof Element);
        t.is(result.outerHTML, '<div id="box123" class="box cube"><span style="border: solid 1px black;">some text</span>another text</div>');

        t.end();
      });

      t.end();
    });

    t.test('child\'s tag changed', function (t) {
      clonedElementShape.children[0].tag = 'div';
      let anotherElementTemplate = shapedom.createTemplate(clonedElementShape);

      let result = shapedom.update(elementNode, anotherElementTemplate);

      t.assert(result instanceof Element);
      t.is(result.outerHTML, '<div id="box123" class="box cube"><div class="content">some text</div>another text</div>');

      t.end();
    });

    t.test('child added', function (t) {
      clonedElementShape.children.push({
        tag: 'span',
        attrs: {},
        children: [
          {
            text: 'additional text'
          }
        ]
      });
      let anotherElementTemplate = shapedom.createTemplate(clonedElementShape);

      let result = shapedom.update(elementNode, anotherElementTemplate);

      t.assert(result instanceof Element);
      t.is(result.outerHTML, '<div id="box123" class="box cube"><span class="content">some text</span>another text<span>additional text</span></div>');

      t.end();
    });

    t.test('child removed', function (t) {
      clonedElementShape.children.splice(0, 1);
      clonedElementShape.children.push({
        tag: 'span',
        attrs: {},
        children: [
          {
            text: 'additional text'
          }
        ]
      });
      let anotherElementTemplate = shapedom.createTemplate(clonedElementShape);

      let result = shapedom.update(elementNode, anotherElementTemplate);

      t.assert(result instanceof Element);
      t.is(result.outerHTML, '<div id="box123" class="box cube">another text<span>additional text</span></div>');

      t.end();
    });

    t.test('child added and removed', function (t) {
      clonedElementShape.children.splice(0, 1);
      let anotherElementTemplate = shapedom.createTemplate(clonedElementShape);

      let result = shapedom.update(elementNode, anotherElementTemplate);

      t.assert(result instanceof Element);
      t.is(result.outerHTML, '<div id="box123" class="box cube">another text</div>');

      t.end();
    });

    t.test('child\'s child changed', function (t) {
      clonedElementShape.children[0].children[0] = {
        tag: 'span',
        attrs: {},
        children: [
          {
            text: 'total new text'
          }
        ]
      };
      let anotherElementTemplate = shapedom.createTemplate(clonedElementShape);

      let result = shapedom.update(elementNode, anotherElementTemplate);

      t.is(root.childNodes[0], result);
      t.assert(result instanceof Element);
      t.is(result.outerHTML, '<div id="box123" class="box cube"><span class="content"><span>total new text</span></span>another text</div>');

      t.end();
    });

    t.test('children reordered', function (t) {
      clonedElementShape.children.reverse();
      let anotherElementTemplate = shapedom.createTemplate(clonedElementShape);

      let result = shapedom.update(elementNode, anotherElementTemplate);

      t.is(root.childNodes[0], result);
      t.assert(result instanceof Element);
      t.is(result.outerHTML, '<div id="box123" class="box cube">another text<span class="content">some text</span></div>');

      t.end();
    });

    t.end();
  });

  t.end();
});
