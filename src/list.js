export function li (childNode) {
  var element = document.createElement("li");
  element.appendChild(childNode);
  return element
}

export function ul () {
  var ul  = document.createElement("ul");
  return ul
}

