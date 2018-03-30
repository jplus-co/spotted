export default function focus() {
  window.setInterval(() => console.log(document.activeElement), 250)
}
