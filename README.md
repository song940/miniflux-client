## miniflux

> Miniflux Client API

https://miniflux.app/docs/api.html

### Installation

```bash
$ npm i @song940/miniflux
```

### Example

```js
import Miniflux from '@song940/miniflux';

const miniflux = new Miniflux({
  username: '',
  password: '',
  token: '',
  endpoint: `https://read.lsong.me`,
});

(async () => {

  const me = await miniflux.me();
  console.log(me);

  const feeds = await miniflux.feeds();
  console.log(feeds);

  const version = await miniflux.version();
  console.log(version);

})();
```

### Contributing
- Fork this Repo first
- Clone your Repo
- Install dependencies by `$ npm install`
- Checkout a feature branch
- Feel free to add your features
- Make sure your features are fully tested
- Publish your local branch, Open a pull request
- Enjoy hacking <3

### MIT

This work is licensed under the [MIT license](./LICENSE).

---