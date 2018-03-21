import anime from 'animejs'

export default function fade(oldContainer, newContainer, done) {
  return animateOut()

  function animateOut() {
    return anime({
      targets: oldContainer,
      duration: 500,
      opacity: 0,
      easing: 'easeOutQuart',
    }).finished.then(() => {
      oldContainer.style.display = 'none'
      animateIn()
    })
  }

  function animateIn() {
    newContainer.style.opacity = 0
    newContainer.style.visibility = 'visible'
    return anime({
      targets: newContainer,
      duration: 500,
      opacity: 1,
      easing: 'easeOutQuart',
    }).finished.then(done)
  }
}
