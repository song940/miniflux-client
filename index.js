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
      headers['Authorization'] = `Basic ${btoa(`${username}:${password}`)}`;
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
  async postJSON(path, payload) {
    const response = await this.post(path, payload);
    return response.json();
  }
  /**
   * Discover Subscriptions
   * https://miniflux.app/docs/api.html#endpoint-discover
   * @param {*} url 
   * @returns 
   */
  async discover(url) {
    return this.postJSON('/v1/discover', { url });
  }
  /**
   * Get Feeds
   * @docs https://miniflux.app/docs/api.html#endpoint-get-feeds
   */
  feeds() {
    return this.getJSON('/v1/feeds');
  }
  /**
   * Get Category Feeds
   * @docs https://miniflux.app/docs/api.html#endpoint-get-category-feeds
   */
  async get_category_feeds(category_id) {
    return this.getJSON(`/v1/categories/${category_id}/feeds`);
  }

  /**
   * Get Feed
   * @docs https://miniflux.app/docs/api.html#endpoint-get-feed
   * @param {*} id 
   * @returns 
   */
  get_feed(id) {
    return this.getJSON(`/v1/feeds/${id}`);
  }
  /**
   * @docs https://miniflux.app/docs/api.html#endpoint-get-feed-icon
   * @returns 
   */
  get_feed_icon(id) {
    return this.getJSON(`/v1/feeds/${id}/icon`);
  }
  /**
   * Get Category Feeds
   * @docs /v1/categories/40/feeds
   * @param {*} id 
   * @returns 
   */
  get_feeds_by_category(id) {
    return this.getJSON(`/v1/categories/${id}/feeds`);
  }
  /**
   * Create Feed
   * @docs https://miniflux.app/docs/api.html#endpoint-create-feed
   * @param {*} feed_url 
   * @param {*} category_id 
   * @returns 
   */
  create_feed(feed_url, category_id) {
    return this.postJSON(`/v1/feeds`, { feed_url, category_id });
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
  /**
   * Refresh Feed
   * @docs https://miniflux.app/docs/api.html#endpoint-refresh-feed
   * @param {*} id 
   * @returns 
   */
  remove_feed(id) {
    return this.request('DELETE', `/v1/feeds/${id}`);
  }
  /**
   * Get Feed Entry
   * @docs https://miniflux.app/docs/api.html#endpoint-get-feed-entry
   * @returns 
   */
  get_feed_entry(feed_id, entry_id) {
    return this.getJSON(`/v1/feeds/${feed_id}/entries/${entry_id}`);
  }
  /**
   * Fetch original article
   * @docs https://miniflux.app/docs/api.html#endpoint-fetch-content
   * @param {*} entry_id 
   */
  fetch_entry_content(entry_id) {
    return this.getJSON(`/entries/${entry_id}/fetch-content`);
  }
  /**
   * Get Category Entries
   * @docs https://miniflux.app/docs/api.html#endpoint-get-category-entries
   * @param {*} category_id 
   * @param {*} param1 
   * @returns 
   */
  get_category_entries(category_id, { limit = 1, order = 'id', direction = 'asc' } = {}) {
    return this.getJSON(`/v1/categories/${category_id}/entries?limit=${limit}&order=${order}&direction=${direction}`);
  }
  /**
   * Get Feed Entries
   * @docs https://miniflux.app/docs/api.html#endpoint-get-feed-entries
   */
  get_feed_entries(feed_id, { limit = 1, order = 'id', direction = 'asc' } = {}) {
    return this.getJSON(`/v1/feeds/${feed_id}/entries?limit=${limit}&order=${order}&direction=${direction}`);
  }
  /**
   * Get Entries 
   * @docs https://miniflux.app/docs/api.html#endpoint-get-entries
   * @param {*}
   */
  get_entries(status = 'unread', direction = 'desc') {
    return this.getJSON(`/v1/entries?status=${status}&direction=${direction}`);
  }
  /**
   * Update Entries
   * @docs https://miniflux.app/docs/api.html#endpoint-update-entries
   */
  async update_entries(entry_ids, status = 'unread') {
    const response = await this.request('PUT', '/v1/entries', { entry_ids, status });
    return response.status === 204;
  }
  /**
   * Toggle Entry Bookmark
   * @docs https://miniflux.app/docs/api.html#endpoint-toggle-
   */
  async toggle_entry_bookmark(entry_id) {
    const response = await this.request('PUT', `/v1/entries/${entry_id}/bookmark`);
    return response.status === 204;
  }
  /**
   * Create Category
   * @docs https://miniflux.app/docs/api.html#endpoint-create-category
   * @param {*} title 
   * @returns 
   */
  async create_category(title) {
    return this.postJSON('/v1/categories', { title });
  }
  /**
   * Update Category
   * @docs https://miniflux.app/docs/api.html#endpoint-update-category
   * @param {*} category_id 
   * @returns 
   */
  async update_category(category_id) {
    const response = await this.request('PUT', `/v1/categories/${category_id}`);
    return response.json();
  }
  /**
   * Delete Category
   * @docs https://miniflux.app/docs/api.html#endpoint-delete-category
   */
  async delete_category(category_id) {
    const response = await this.request('DELETE', `/v1/categories/${category_id}`);
    return response.status === 204;
  }
  /**
   * Mark Category Entries as Read
   * @docs https://miniflux.app/docs/api.html#endpoint-mark-category-entries-as-read
   * @param {*} category_id 
   * @returns 
   */
  async mark_category_entries_as_read(category_id) {
    const response = await this.request('PUT', `/v1/categories/${category_id}/mark-all-as-read`);
    return response.status === 204;
  }
  async export() {
    const response = await this.request('GET', '/v1/export');
    return response.text();
  }
  async import(opml) {
    const response = await this.request('/v1/import', opml);
    return response.status === 201;
  }
  /**
   * Create User
   * @docs https://miniflux.app/docs/api.html#endpoint-create-user
   * @param {*} user 
   * @returns 
   */
  async create_user(user) {
    return this.postJSON('/v1/users', user);
  }
  /**
   * Update User
   * @param {*} user_id 
   * @param {*} user 
   * @returns 
   */
  async update_user(user_id, user) {
    const response = await this.request('PUT', `/v1/users/${user_id}`, user);
    return response.json();
  }
  /**
   * Get Current User
   * @returns 
   */
  me() {
    return this.getJSON('/v1/me');
  }
  /**
   * Get User
   * @docs https://miniflux.app/docs/api.html#endpoint-get-user
   * @param {*} user_id 
   * @returns 
   */
  get_user(user_id) {
    return this.getJSON(`/v1/users/${user_id}`);
  }
  /**
   * Get Users
   * @docs https://miniflux.app/docs/api.html#endpoint-get-users
   * @returns 
   */
  get_users() {
    return this.getJSON('/v1/users');
  }
  /**
   * Delete User
   * @docs https://miniflux.app/docs/api.html#endpoint-delete-user
   * @param {*} user_id 
   * @returns 
   */
  async delete_user(user_id) {
    const response = await this.request('DELETE', `/v1/users/${user_id}`);
    return response.status === 204;
  }
  /**
   * Mark User Entries as Read
   * @docs https://miniflux.app/docs/api.html#endpoint-mark-user-entries-as-read
   * @param {*} user_id 
   * @returns 
   */
  async mark_user_entries_as_read(user_id) {
    const response = await this.request('PUT', `/v1/users/${user_id}/mark-all-as-read`);
    return response.status === 204;
  }
  /**
   * Fetch Read/Unread Counters
   * @docs https://miniflux.app/docs/api.html#endpoint-counters
   * @returns 
   */
  async fetch_counters() {
    return this.getJSON('/v1/feeds/counters');
  }
  /**
   * Healthcheck
   * @docs https://miniflux.app/docs/api.html#endpoint-healthcheck
   * @returns 
   */
  healthcheck() {
    return this.get('/v1/healthcheck');
  }
  /**
   * Version
   * @docs https://miniflux.app/docs/api.html#endpoint-version
   * @returns 
   */
  async version() {
    const response = await this.get('/version');
    if (response.status !== 200) throw new Error();
    return response.text();
  }
}

export default Miniflux;