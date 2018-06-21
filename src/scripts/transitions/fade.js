import anime from 'animejs'
import $ from 'jquery'

export default function fade(oldContainer, newContainer, done) {
  return animateOut()

  function animateOut() {
    return anime({
      targets: oldContainer,
      duration: 500,
      opacity: 0,
      easing: 'easeOutQuart',
    }).finished.then(() => {
      $(oldContainer).hide()
      animateIn()
    })
  }

  function animateIn() {
    $(window).scrollTop(0)
    $(newContainer).css({
      opacity: 0,
      visibility: 'visible',
    })
    return anime({
      targets: newContainer,
      duration: 500,
      opacity: 1,
      easing: 'easeOutQuart',
    }).finished.then(done)
  }
}
