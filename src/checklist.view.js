import { li, ul } from "./list"

export default class ChecklistView {
  constructor(controller) {
    this.controller = controller
    this.ul = ul()
  }

  element (content, index) {
    var element = li(document.createTextNode(content))
    element.dataset.index = index
    element.onclick = () => {
      var task_id = +element.dataset.index
      this.controller.delete(task_id)
    }
    return element
  }

  toNode() {
    return this.ul
  }

  new (tasks) {
    if(tasks.length === 0) {
      var element = li(document.createTextNode("no more tasks"))
      this.ul.appendChild(element);
    }
    else {
      tasks.forEach(task => {
        var element = this.element(task.name, task.index)
        this.ul.appendChild(element);
      })
    }
  }

  delete (index) {
    var task = this.ul.querySelectorAll("[data-index='" + index + "']")[0]

    task.classList.add('removed')

    setTimeout(() => {
      this.ul.removeChild(task)
    }, 150)
  }
}

