(function() {
  var breakfast = [
    [
      [ "take out a bowl", "take out a cutting board", "take out small plate", "take out a cup" ],
      [ "take out a knife", "take out a spoon" ],
      [ "take out a tea bag & put into cup", "milk", "oat", "banana" ]
    ],
    ["put water in the kettle", "put oat in bowl", "put milk into the bowl", "Put the bowl into the microwave for 2 minutes at 700W"],
    ["pour hot water into the cup", "Put plate on cup", "Set an alarm for 8 minutes"],
    ["Cut the banana", "Throw the banana peal away", "put banana into the bowl", "stir the oat with the spoon"],
    ["put away dried dishes"],
    ["Clean the cutting board", "Clean the knife"],
    ["put away oat", "put away milk", "put away phone"],
    ["breathing exercises", "throw tea bag away"],
    ["Put away phone & eat"],
    ["clean bowl", "clean spoon", "clean cup", "clean table"]
  ]

  var store = breakfast

  var index;

  var date = new Date();
  date.setHours(5);

  if (date > new Date()) {
    localStorage.removeItem("index")
    localStorage.removeItem("checkedElements")
  }

  if(!localStorage.getItem('index')) {
    index = deepIndex([])
  }
  else {
    index = JSON.parse(localStorage.getItem("index"));
  }

  var checkedElements;
  if(!localStorage.getItem('checkedElements')) {
    checkedElements = []
  }
  else {
    checkedElements = JSON.parse(localStorage.getItem("checkedElements"));
  }

  var list = document.getElementById("list");

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

  function findIndex(index) {
    return index.reduce(function(a, b) {
      return a[b] || []
    }, store)
  }

  function initFromIndex () {
    var value = findIndex(index)
    value.forEach(function (value, i) {
      if (!checkedElements.includes(i)) {
        newElement(value, i)
      }
    })
    if(list.childNodes.length === 0) {
      newElement("no more tasks", 0, true)
    }
  }

  function deepIndex (i) {
    var currentStore = findIndex(i)
    var newI = []

    while(true) {
      if(typeof currentStore[0] == 'string') {
        break
      }
      newI.push(0)
      currentStore = currentStore[0]
    }
    return i.concat(newI)
  }

  function incIndex (i) {
    i[i.length - 1] = i[i.length - 1] + 1
    var exists  = findIndex(i).length != 0
    if (exists) {
      return deepIndex(i)
    }
    if(typeof i.pop() == "undefined" || i.length === 0) {
      return false
    }
    return incIndex(i)
  }

  function moveIndex () {
    var res = incIndex(index)
    if (res) {
      index = res
      localStorage.setItem("index", JSON.stringify(index));
      checkedElements = []
      localStorage.setItem("checkedElements", JSON.stringify(checkedElements));
      initFromIndex()
    }
    else {
      newElement("no more tasks", 0, true)
    }
  }

  function newElement (content, index, noClick) {
    var element = document.createElement("li");
    element.onclick = function() {
      if(!!noClick) {
        return
      }

      checkedElements.push(index)
      localStorage.setItem("checkedElements", JSON.stringify(checkedElements));

      var self = this
      var parentNode = this.parentNode

      this.classList.add('removed')

      setTimeout(function() {
        parentNode.removeChild(self);
        if(!parentNode.childNodes.length) {
          moveIndex()
        }
      }, 150)
    }

    // element.classList.add('active')
    element.appendChild(document.createTextNode(content));
    list.appendChild(element);
  }

  initFromIndex()
})()
