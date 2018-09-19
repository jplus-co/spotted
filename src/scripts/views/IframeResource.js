import Barba from 'barba.js'
import $ from 'jquery'
import * as resizer from 'iframe-resizer'

const IframeResource = Barba.BaseView.extend({
  namespace: 'iframe-resource',

  onEnter() {
    this.$iframe = $(this.container).find('iframe')
    this.iframeResizer = resizer.iframeResizer(
      { heightCalculationMethod: 'documentElementScroll' },
      this.$iframe[0],
    )
  },

  onEnterCompleted() {},

  onLeave() {
    this.$iframe[0].iFrameResizer.close()
  },

  onLeaveCompleted() {},
})

export default IframeResource
