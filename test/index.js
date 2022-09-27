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
  assert.equal(v, 'latest');
});

test('miniflux#me', async () => {
  const me = await miniflux.me();
  assert.ok(me);
  assert.equal(me.username, 'song940');
});

test('mimniflux#discover', async () => {
  const feeds = await miniflux.discover('https://github.com/song940');
  assert.ok(feeds);
  assert.ok(Array.isArray(feeds));
  assert.equal(feeds[0].type, 'atom');
  assert.equal(feeds[0].url, 'https://github.com/feed/');
});

test('mimniflux#feeds', async () => {
  const feeds = await miniflux.feeds();
  assert.ok(feeds);
  assert.ok(Array.isArray(feeds));
});

test('mimniflux#get_category_feeds', async () => {
  const feeds = await miniflux.get_category_feeds(1);
  assert.ok(feeds);
  assert.ok(Array.isArray(feeds));
});

test('mimniflux#get_feed', async () => {
  const feed = await miniflux.get_feed(1);
  assert.ok(feed);
});


test('mimniflux#get_feed_icon', async () => {
  const icon = await miniflux.get_feed_icon(2);
  assert.ok(icon);
  assert.equal(icon.mime_type, 'image/png');
});

test('mimniflux#get_feeds_by_category', async () => {
  const feeds = await miniflux.get_feeds_by_category(1);
  assert.ok(feeds);
});

test('mimniflux#get_entries', async () => {
  const entries = await miniflux.get_entries(1);
  console.log(entries);
  assert.ok(entries);
});