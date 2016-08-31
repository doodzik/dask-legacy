import ArrayPersist from './ArrayPersist'

export default class Checklist {
  constructor(store) {
    this.store = store
    this.currentElements = new ArrayPersist("checkedElements")
  }

  check(task_id) {
    this.currentElements.add(task_id)
    var emptyTaskList = this.current.length === 0

    if (emptyTaskList) {
      this.currentElements.reset()
      this.store.next()
    }

    return emptyTaskList
  }

  get current () {
    return this.store.current
      .map((name, index) => { return { name, index } })
      .filter(task => {
      return !this.currentElements.includes(task.index)
    })
  }

  resetNewDay () {
    // reset if new day
    var date = new Date();
    date.setHours(5);
    if (date > new Date()) {
      // TODO fix reset bug
      // if (date < new Date()) {
      this.reset()
    }
  }

  reset () {
    this.store.reset()
    this.currentElements.reset()
  }
}

