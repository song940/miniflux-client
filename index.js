import 'isomorphic-fetch';

export class Miniflux {
  constructor({ endpoint, token, username, password }) {
    this.api = endpoint;
    this.token = token;
    this.username = username;
    this.password = password;
  }
  request(method, path, body) {
    const headers = {};
    const { api, token, username, password } = this;
    // https://miniflux.app/docs/api.html#authentication
    if (token) {
      headers['X-Auth-Token'] = token;
    } else {
      headers['Authorization'] = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
    }
    return fetch(api + path, {
      method,
      headers,
      body: body && JSON.stringify(body),
    });
  }
  get(path) {
    return this.request('GET', path);
  }
  async getJSON(path) {
    const response = await this.get(path);
    return response.json();
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
  async version() {
    const response = await this.get('/version');
    if(response.status !== 200) throw new Error();
    return response.text();
  }
}

export default Miniflux;