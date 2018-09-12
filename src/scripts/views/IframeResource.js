import Barba from 'barba.js'
import $ from 'jquery'
import * as resizer from 'iframe-resizer'

const IframeResource = Barba.BaseView.extend({
  namespace: 'iframe-resource',

  onEnter() {
    this.$iframe = $(this.container).find('iframe')
    this.iframeResizer = resizer.iframeResizer(
      { heightCalculationMethod: 'documentElementScroll', log: true },
      this.$iframe[0],
    )
  },

  onEnterCompleted() {},

  onLeave() {
    this.iframeResizer.close()
  },

  onLeaveCompleted() {},
})

export default IframeResource
