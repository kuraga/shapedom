import test from 'tapes';

import Shapedom from '../../dist/shapedom';

test('shapedom.update unrendered node', function (t) {
  const shapedom = new Shapedom(document);

  const template = shapedom.createTemplate({
    tag: 'div',
    attrs: {}
  });

  const node = document.createElement('div');

  t.throws(() => {
    shapedom.update(node, template);
  }, /Node hasn't been rendered yet./);

  t.end();
});


test('shapedom.update unattached node', function (t) {
  const shapedom = new Shapedom(document);

  const template = shapedom.createTemplate({
    tag: 'div',
    attrs: {}
  });
  const anotherTemplate = shapedom.createTemplate({
    tag: 'span',
    attrs: {}
  });

  const element = shapedom.render(template);

  t.throws(() => {
    shapedom.update(element, anotherTemplate);
  }, /Can't update unattached node./);

  t.end();
});
