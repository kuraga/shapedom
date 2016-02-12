import test from 'tapes';

import Shapedom from '../../../shapedom';

test('shapedom.update unrendered node', function (t) {
  let shapedom = new Shapedom(document);

  let template = shapedom.createTemplate({
    tag: 'div',
    attrs: {}
  });

  let node = document.createElement('div');

  t.throws(() => {
    shapedom.update(node, template);
  }, /Node hasn't been rendered yet./);

  t.end();
});


test('shapedom.update unattached node', function (t) {
  let shapedom = new Shapedom(document);

  let template = shapedom.createTemplate({
    tag: 'div',
    attrs: {}
  });
  let anotherTemplate = shapedom.createTemplate({
    tag: 'span',
    attrs: {}
  });

  let element = shapedom.render(template);

  t.throws(() => {
    shapedom.update(element, anotherTemplate);
  }, /Can't update unattached node./);

  t.end();
});
