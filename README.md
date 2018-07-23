# Spotted

A custom WordPress theme for Spotted using Timber, Barba.js, Anime.js, Tachyons, and Webpack.

### Setting up a local development environment

1.  Set up a local instance of WordPress using something like MAMP
2.  Use the WP Migrate DB plugin on the [production site](https://spotted.us) to export the production database with the URLs replaced to match your local environment. Please see [this tutorial](https://deliciousbrains.com/wp-migrate-db-pro/doc/migrating-to-http-or-back-to-https/) on the WP Migrate DB website for more info on moving between https -> http environments.
3.  Import the database file locally using PhpMyAdmin or the command line
4.  Access the hosting for the production site (go daddy) and zip up and download the entire `wp-content` directory.
5.  Unzip it, and replace your local `wp-content` with the production one
6.  In your locally environment, go to `wp-content/themes` and remove the spotted theme directory.
7.  Now clone this repository to the desired location.
8.  Move into the freshly cloned directory and install dependencies from NPM
```sh
npm i
```
9.  Run the build command to generate the `build` directory which contains the theme files
10.  Now create a symlink in the wordpress installation to the `build` directory like so:

```sh
ln -s ~/path/to/repo/spotted/build ~/path/to/wordpress-installation/spotted-wp/wp-content/themes/spotted
```
11.  Go to your wordpress themes directory to ensure the symlink was created successfully. You should see a `spotted` directory with a little black shortcut arrow in the corner.
12.  Now go back to the repository and open `webpack.development.js` and edit the `proxy` to reflect the URL of your local wordpress installation.
13.  Now start the development server and the project will be launched at http://localhost:3000/
```
npm start
```
14. If all of the above steps were completed correctly, everything should be 100% identical to production, but you may need to go to /wp-admin, login, and go to Appearance > Themes and ensure the spotted theme is activated.

