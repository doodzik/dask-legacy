export default class ArrayPersist {
  constructor (persistName) {
    this._persistName = persistName
    this.lazyLoaded   = false
  }

  defaultValue () {
    return []
  }

  persist () {
    localStorage.setItem(this._persistName, JSON.stringify(this[this._persistName]));
  }

  set (arr) {
    this[this._persistName] = arr
    this.persist()
  }

  lazyLoad () {
    if(this.lazyLoaded) {
      return
    }
    if(!localStorage.getItem(this._persistName)) {
      this[this._persistName] = this.defaultValue()
    }
    else {
      this[this._persistName] = JSON.parse(localStorage.getItem(this._persistName));
    }
    this.lazyLoaded = true
  }

  get () {
    this.lazyLoad()
    return this[this._persistName]
  }

  add (index) {
    this.lazyLoad()
    this[this._persistName].push(index)
    this.persist()
  }

  includes (i) {
    this.lazyLoad()
    return this[this._persistName].includes(i)
  }

  reset () {
    localStorage.removeItem(this._persistName)
    this[this._persistName] = this.defaultValue()
  }

}
