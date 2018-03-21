import config from './config'

class App {
  el = config.app

  onResize(width, height) {
    console.log(width, height)
  }
}

export default () => new App()
