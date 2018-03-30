import Barba from 'barba.js'
import $ from 'jquery'
import config from '../config'
import fade from './fade'

const map = {
  default: fade,

  // Define transitions between views using namespaces
  // home: {
  //   single: fade,
  // },
  // single: {
  //   home: fade,
  // },
}

export default function transitionReducer() {
  return Barba.BaseTransition.extend({
    start() {
      // show spinner while new page is being fetched
      $(config.html).css({ cursor: 'wait' })
      this.newContainerLoading.then(() => {
        // remove spinner as soon as new content is ready
        $(config.html).css({ cursor: 'default' })
        const from = Barba.Pjax.History.prevStatus().namespace
        const to = Barba.Pjax.History.currentStatus().namespace
        return ((map[from] && map[from][to]) || map.default)(
          this.oldContainer,
          this.newContainer,
          this.done.bind(this),
        )
      })
    },
  })
}
