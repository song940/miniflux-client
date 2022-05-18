import Miniflux from '../index.js';

const miniflux = new Miniflux({
  username: 'song940',
  password: 'lsong940',
  token: '',
  endpoint: `http://read.lsong.one:8888`,
});

(async () => {

  const me = await miniflux.me();
  console.log(me);

  const feeds = await miniflux.feeds();
  console.log(feeds);

  const version = await miniflux.version();
  console.log(version);

})();