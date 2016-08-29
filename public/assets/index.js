// glaswasser trinken
// kegels
// chinease app to anki
// anki
// meditieren
// training
// kegels
// arbeiten
// schlafen geh routine

// every four days
// bio trash
// flowers
//
// twice a week
// wash
//
// every week
// trash
// vacum
// shopping
// pump ball
// shave
// clean bathroom
//
// once two weeks
// change bed sheets
//
// every two weeks
// vacum corners
// cut fingernails
//
// once a month
// wasserkocherentkalken
// photo review
// cut footnails
//
// every three months
// change toothbrush head

(function() {

  function deepCopy(obj) {
    if (typeof obj == 'object') {
      if (Array.isArray(obj)) {
        var l = obj.length;
        var r = new Array(l);
        for (var i = 0; i < l; i++) {
          r[i] = deepCopy(obj[i]);
        }
        return r;
      } else {
        var r = {};
        r.prototype = obj.prototype;
        for (var k in obj) {
          r[k] = deepCopy(obj[k]);
        }
        return r;
      }
    }
    return obj;
  }

  if (!Array.prototype.getFirstDeepIndex ) {
    Array.prototype.getFirstDeepIndex = function(index) {
      'use strict';
      if (this == null) {
        throw new TypeError('Array.prototype.getFirstDeepIndex called on null or undefined');
      }

      var list = Object(this);

      var currentStore = list.findByIndex(index)
      var newI = []

      while(true) {
        if(typeof currentStore[0] == 'string') {
          break
        }
        newI.push(0)
        currentStore = currentStore[0]
      }
      return index.concat(newI)
    }
  }

  if (!Array.prototype.findByIndex) {
    Array.prototype.findByIndex = function(index) {
      'use strict';
      if (this == null) {
        throw new TypeError('Array.prototype.findByIndex called on null or undefined');
      }

      var list = Object(this);

      return index.reduce(function(a, b) {
        return a[b] || []
      }, list)

    };
  }

  // Store

  var store = [
    [
      [ "take out a bowl", "take out a cutting board", "take out small plate", "take out a cup" ],
      [ "take out a knife", "take out a spoon" ],
      [ "take out a tea bag & put into cup", "milk", "oat", "banana" ]
    ],
    ["put water in the kettle", "put oat in bowl", "put milk into the bowl", "Put the bowl into the microwave for 2 minutes at 700W"],
    ["pour hot water into the cup", "Put plate on cup", "Set an alarm for 8 minutes"],
    // ["Cut the banana", "Throw the banana peal away", "put banana into the bowl", "stir the oat with the spoon"],
    // ["put away dried dishes"],
    // ["Clean the cutting board", "Clean the knife"],
    // ["put away oat", "put away milk", "put away phone"],
    // ["breathing exercises", "throw tea bag away"],
    // ["Put away phone & eat"],
    // ["clean bowl", "clean spoon", "clean cup", "clean table"]
  ]

  class Index {

    constructor (store) {
      this._store = store

      if(!localStorage.getItem('index')) {
        this._index = this._store.getFirstDeepIndex([])
      }
      else {
        this._index = JSON.parse(localStorage.getItem("index"));
      }

    }

    inc (_i) {
      var i = _i || this._index
      i[i.length - 1] = i[i.length - 1] + 1

      var tasks = this._store.findByIndex(i)
      var exists  = tasks.length != 0
      if (exists) {
        return this._store.getFirstDeepIndex(i)
      }
      if(typeof i.pop() == "undefined" || i.length === 0) {
        return false
      }
      return this.inc(i)
    }

    move () {
      var res = this.inc()
      if (res) {
        this._index = res

        localStorage.setItem("index", JSON.stringify(this._index));

        task.currentElements.reset()

        var tasks = store.findByIndex(this._index)

        ul.dispatchEvent(new CustomEvent('new', { 'detail': tasks }))
      }
      else {
        ul.dispatchEvent(new CustomEvent('new', { 'detail': [] }))
      }
    }

    reset () {
      localStorage.removeItem("index")
      this._index = store.getFirstDeepIndex([])
    }
  }

  class CurrentElements {
    constructor () {
      if(!localStorage.getItem('checkedElements')) {
        this._checkedElements = []
      }
      else {
        this._checkedElements = JSON.parse(localStorage.getItem("checkedElements"));
      }
    }

    add (index) {
      this._checkedElements.push(index)
      localStorage.setItem("checkedElements", JSON.stringify(this._checkedElements));
    }

    includes (i) {
      return this._checkedElements.includes(i)
    }

    reset () {
      localStorage.removeItem("checkedElements")
      this._checkedElements = []
    }
  }

  // Service

  class TaskList {

    constructor(store) {
      this.index           = new Index(store)
      this.currentElements = new CurrentElements()
      this.store           = store
    }

    check(task_id) {
      this.currentElements.add(task_id)

      if (this.current.length === 0) {
        this.index.move()
      }

      ul.dispatchEvent(new CustomEvent('remove', { 'detail': task_id }))
    }

    get current () {

      // reset if new day
      var date = new Date();
      date.setHours(5);
      if (date > new Date()) {
      // TODO fix reset bug
      // if (date < new Date()) {
        this.reset()
      }

      var self  = this
      var tasks = this.store.findByIndex(this.index._index)
      tasks     = tasks.filter(function (value, i) {
        return !self.currentElements.includes(i)
      })
      return tasks
    }

    reset () {
      this.currentElements.reset()
      this.index.reset()
    }
  }

  // View

  var ul      = document.createElement("ul");
  var content = document.getElementById("content");
  content.appendChild(ul);

  function li (childNode) {
    var element = document.createElement("li");
    element.appendChild(childNode);
    return element
  }

  function taskElement (content, index) {
    var element = li(document.createTextNode(content))
    element.dataset.index = index
    element.onclick = function() {
      var task_id = +element.dataset.index
      task.check(task_id)
    }
    return element
  }

  ul.addEventListener('new', function(e) {
    var tasks = e.detail

    if(tasks.length === 0) {
      var element = li(document.createTextNode("no more tasks"))
      ul.appendChild(element);
    }
    else {
      tasks.forEach(function (value, i) {
        var element = taskElement(value, i)
        ul.appendChild(element);
      })
    }
  })

  ul.addEventListener('remove', function(e) {
    var task = ul.querySelectorAll("[data-index='" + e.detail + "']")[0]

    task.classList.add('removed')

    setTimeout(function() {
      ul.removeChild(task);
    }, 150)
  })

  // Init

  var task = new TaskList(store)

  ul.dispatchEvent(new CustomEvent('new', { 'detail': task.current }))

})()
