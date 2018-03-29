import $ from 'jquery'
import config from './config'
import Header from './modules/header'

class App {
  el = config.app
  header = new Header($('.js-header'))

  onResize(width, height) {
    this.header.resize(width, height)
  }
}

export default () => new App()
