export default function clipPathShapeSupport() {
  const base = 'clipPath'
  const prefixes = ['webkit', 'moz', 'ms', 'o']
  const testElement = document.createElement('testelement')
  const attribute = 'polygon(50% 0%, 0% 100%, 100% 100%)'

  let properties = [base]

  // Push the prefixed properties into the array of properties.
  for (let i = 0, l = prefixes.length; i < l; i++) {
    const prefixedProperty =
      prefixes[i] + base.charAt(0).toUpperCase() + base.slice(1) // remember to capitalize!
    properties.push(prefixedProperty)
  }

  // Interate over the properties and see if they pass two tests.
  for (let i = 0, l = properties.length; i < l; i++) {
    const property = properties[i]

    // First, they need to even support clip-path (IE <= 11 does not)...
    if (testElement.style[property] === '') {
      // Second, we need to see what happens when we try to create a CSS shape...
      testElement.style[property] = attribute
      if (testElement.style[property] !== '') {
        return true
      }
    }
  }
  return false
}
