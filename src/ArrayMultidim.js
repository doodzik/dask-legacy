import ArrayPersist from './ArrayPersist'
import _ from 'lodash'

// behaves like a stack
export default class ArrayMultidim {

  constructor (arr) {
    this.storeOriginal = arr
    this.store =  _.cloneDeep(arr)
    this.index = new ArrayPersist("index")
    if(!this.index.includes(false)) {
      this.recoverFromIndex()
    }
  }

  calcIndex() {
    var currentStore = this.store
    this.index.reset()
    if(typeof currentStore[0] == "undefined") {
      this.index.add(false)
      return
    }
    while(true) {
      if(typeof currentStore[0] == 'string') {
        break
      }
      this.index.add(currentStore.length)
      currentStore = currentStore[0]
    }
  }

  recoverFromIndex () {
    var currentStore  = _.cloneDeep(this.storeOriginal)
    this.store        = currentStore

    var index = this.index.get()
    index.forEach((value, i) => {
      var countToRemove = currentStore.length - index[i]
      Array.from(Array(countToRemove)).forEach(() => currentStore.shift())
      currentStore = currentStore[0]
    })
    
  }

  next () {
    var currentStore  = this.store
    var previousStore = currentStore

    while(true) {
      if(typeof currentStore[0][0] == 'string') {
        currentStore.shift()

        if(typeof currentStore !== "undefined" && currentStore.length === 0) {
          previousStore.shift()
        }

        this.calcIndex()
        break
      }
      previousStore = currentStore
      currentStore  = currentStore[0]
    }
  }

  get current () {
    var currentStore = this.store
    if(typeof currentStore == 'undefined' || typeof currentStore[0] == 'undefined' || typeof currentStore[0][0] == 'undefined') {
      this.reset()
      return []
    }
    while(true) {
      if(typeof currentStore[0] == 'string') {
        return currentStore
      }
      currentStore = currentStore[0]
    }
  }

  reset () {
    this.index.reset()
  }
}
