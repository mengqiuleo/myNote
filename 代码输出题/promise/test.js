var a = 1
function foo () {
  var a = 2
  function inner () { 
    console.log(this)
    console.log(this.a)
  }
  inner()
}

foo()