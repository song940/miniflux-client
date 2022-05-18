import http from 'http';
import https from 'https';
import assert from 'assert';
import Stream from 'stream';

const request = (method, url, payload, headers) => {
  const client = url.startsWith('https://') ? https : http;
  return new Promise((resolve, reject) => {
    const req = client.request(url, {
      method,
      headers,
    }, resolve);
    req.once('error', reject);
    if (payload instanceof Stream) {
      payload.pipe(req);
    } else {
      req.end(payload);
    }
  });
};

const readStream = stream => {
  const buffer = [];
  return new Promise((resolve, reject) => {
    stream
      .on('error', reject)
      .on('data', chunk => buffer.push(chunk))
      .on('end', () => resolve(Buffer.concat(buffer)))
  });
};

const ensureStatusCode = expected => {
  if (!Array.isArray(expected))
    expected = [expected];
  return res => {
    const { statusCode } = res;
    assert.ok(expected.includes(statusCode), `status code must be "${expected}" but actually "${statusCode}"`);
    return res;
  };
};

export class Miniflux {
  constructor({ endpoint, token, username, password }) {
    this.api = endpoint;
    this.token = token;
    this.username = username;
    this.password = password;
  }
  request(method, path, payload) {
    const headers = {};
    const { api, token, username, password } = this;
    // https://miniflux.app/docs/api.html#authentication
    if (token) {
      headers['X-Auth-Token'] = token;
    } else {
      headers['Authorization'] = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
    }
    return request(method, api + path, payload, headers);
  }
  get(path) {
    return this.request('GET', path);
  }
  getJSON(path) {
    return Promise
      .resolve()
      .then(() => this.get(path))
      .then(ensureStatusCode(200))
      .then(readStream)
      .then(JSON.parse)
  }
  post(path, payload) {
    return this.request('POST', path, payload);
  }
  me() {
    return this.getJSON('/v1/me');
  }
  /**
   * Get Feeds
   * @docs https://miniflux.app/docs/api.html#endpoint-get-feeds
   */
  feeds() {
    return this.getJSON('/v1/feeds');
  }
  /**
   * Get Feed
   * @docs https://miniflux.app/docs/api.html#endpoint-get-feed
   * @param {*} id 
   * @returns 
   */
  feed(id) {
    return this.getJSON(`/v1/feeds/${id}`);
  }
  /**
   * @docs https://miniflux.app/docs/api.html#endpoint-get-feed-icon
   * @returns 
   */
  get_feed_icon(id) {
    return this.get(`/v1/feeds/${id}/icon`);
  }
  /**
   * Get Category Feeds
   * @docs /v1/categories/40/feeds
   * @param {*} id 
   * @returns 
   */
  get_feeds_by_category(id) {
    return this.get(`/v1/categories/${id}/feeds`);
  }
  /**
   * Create Feed
   * @docs https://miniflux.app/docs/api.html#endpoint-create-feed
   * @param {*} feed_url 
   * @param {*} category_id 
   * @returns 
   */
  create_feed(feed_url, category_id) {
    return this.post(`/v1/feeds`, { feed_url, category_id });
  }
  /**
   * Update Feed
   * @docs https://miniflux.app/docs/api.html#endpoint-update-feed
   * @param {*} id 
   * @param {*} feed 
   * @returns 
   */
  update_feed(id, feed) {
    return this.request('PUT', `/v1/feeds/${id}`, feed);
  }
  /**
   * Refresh Feed
   * @docs https://miniflux.app/docs/api.html#endpoint-refresh-feed
   * @param {*} id 
   * @returns 
   */
  refresh_feed(id) {
    return this.request('PUT', `/v1/feeds/${id}/refresh`);
  }
  /**
   * Refresh all Feeds
   * @docs https://miniflux.app/docs/api.html#endpoint-refresh-all-feeds
   * @returns 
   */
  refresh_all_feeds() {
    return this.request('PUT', '/v1/feeds/refresh');
  }
  remove_feed(id) {
    return this.request('DELETE', `/v1/feeds/${id}`);
  }
  healthcheck() {
    return this.get('/v1/healthcheck');
  }
  version() {
    return Promise
      .resolve()
      .then(() => this.get('/version'))
      .then(ensureStatusCode(200))
      .then(readStream)
      .then(String)
  }
}

export default Miniflux; 