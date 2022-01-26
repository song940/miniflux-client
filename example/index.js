const Miniflux = require('..');


const miniflux = new Miniflux({
  username: 'song940',
  password: 'lsong940',
  token: '',
  api: `https://reader.lsong.me`,
});

(async () => {

  const me = await miniflux.me();
  console.log(me);

  const feeds = await miniflux.feeds();
  console.log(feeds);

  const version = await miniflux.version();
  console.log(version);

})();