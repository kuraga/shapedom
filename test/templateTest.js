import test from 'tapes';

import { Template } from '../dist/shapedom';

test('Template', function (t) {
  t.test('constructor', function (t) {
    const uuid = 'uuid',
      tag = 'tag',
      attrs = {},
      children = [];

    t.test('construct an instance of Template', function (t) {
      const result = new Template(uuid, tag, attrs, children);

      t.assert(result instanceof Template);

      t.end();
    });

    t.test('store parameters', function (t) {
      const result = new Template(uuid, tag, attrs, children);

      t.strictEqual(result.uuid, uuid);
      t.strictEqual(result.tag, tag);
      t.strictEqual(result.attrs, attrs);
      t.strictEqual(result.children, children);

      t.end();
    });

    t.test('store parameters if children argument is ommited', function (t) {
      const result = new Template(uuid, tag, attrs);

      t.strictEqual(result.uuid, uuid);
      t.strictEqual(result.tag, tag);
      t.strictEqual(result.attrs, attrs);
      t.deepEqual(result.children, []);

      t.end();
    });

    t.end();
  });

  t.end();
});
