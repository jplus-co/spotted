# WP Boilerplate

A custom WordPress theme development boilerplate using Timber, Barba.js, Anime.js, Tachyons, and Webpack.

### Features

* CSS minified using cssnano and autoprefixed
* Scripts bundled using Webpack and Babel
* Browser & device detection
* Transition reducer for managing dynamic Barba transitions
* Window resize callback propogated through app and Barba views
* Track FPS using stats util for development

### Getting Started

1.  Set up a local instance of WordPress
2.  Install and activate [Timber](https://www.upstatement.com/timber/)
3.  Create a symlink to the built theme folder

```sh
# With a local WP install in ~/Documents/Sites/wordpress and this repo on your desktop:
ln -s ~/Desktop/wp-boilerplate/build ~/Documents/Sites/wordpress/wp-content/themes/wp-boilerplate
```

### Install dependencies from NPM:

```
npm i
```

### Start the development server

```
npm start
```

The project will be launched at http://localhost:3000/

### Build for production:

```
npm run build
```
