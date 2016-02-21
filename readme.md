#Quick start for simple web projects
My personal boilerplate for web development based partially on Google's [Web Starter Kit](https://developers.google.com/web/starter-kit) 


## Getting started
1. `npm install` to install the node dependencies
2. `bower install` to install the front-end dependencies
3. `gulp serve` to preview


### Distribution build
* `gulp` to create the distribution build
* `gulp serve:dist` to preview the distribution build


### Features
| Feature                  | Summary                                                                                                                         |
|--------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| Jade compilation         | Automagically compile Jade files with `.jade` extension                                                                         |
| Sass compilation         | Automagically compile Sass with libsass. Supports `.scss` but default is `.sass `                                               |
| Source maps              | Adds source maps for development build                                                                                          |
| CSS auto prefixing       | Automatically add browser refixes to compiled Sass                                                                              |
| Bourbon and Neat         | Uses [Bourbon](http://bourbon.io) for Sass shortcuts and [Neat](http://neat.bourbon.io) for grids                               |
| Material design colors   | Includes Sass variables for Google's [Material design colors](https://www.google.com/design/spec/style/color.html)              |
| Code linting             | Uses JSHint for linting                                                                                                         |
| Live browser reloading   | Web server to preview locally; automatic refreshing when files change                                                           |
| Separated dist build     | Working development files (./app) are separated from the final distribution build (./dist)                                      |
| Performance optimization | Minify and concatenates JavaScript, CSS; Minifies HTML; Optimizes images using [imagemin](https://github.com/imagemin/imagemin) |