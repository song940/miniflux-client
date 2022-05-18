import assert from 'assert';
import { test } from './test.js';
import { Miniflux } from '../index.js';

const miniflux = new Miniflux({
  username: 'song940',
  password: 'lsong940',
  token: '',
  endpoint: `http://read.lsong.one:8888`,
});

test('first test', () => {
  assert.ok(true);
});

test('miniflux#version', async () => {
  const v = await miniflux.version();
  assert.equal(v, '2.0.34');
});

test('miniflux#me', async () => {
  const me = await miniflux.me();
  assert.ok(me);
  assert.equal(me.username, 'song940');
});

test('mimniflux#feeds', async () => {
  const feeds = await miniflux.feeds();
  assert.ok(feeds);
  assert.ok(Array.isArray(feeds));
});