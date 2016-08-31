import Checklist     from './checklist'
import ChecklistView from './checklist.view'
import ArrayMultidim from './ArrayMultidim'
import { store }     from './store'

export default class ChecklistController {
  constructor () {

    this.view = new ChecklistView(this)

    var content = document.getElementById("content");
    content.appendChild(this.view.toNode());

    this.checklist = new Checklist(new ArrayMultidim(store))

    // this.checklist.reset()
  }

  all () {
    this.view.new(this.checklist.current)
  }

  delete (task_id) {
    this.checklist.check(task_id) && this.all(this.view)
    this.view.delete(task_id)
  }
}
