const Storage = window.localStorage
const set = (name,value) => {
  Storage.setItem(name,JSON.stringify(value))
}

const get = (name) => {
  return JSON.parse(Storage.getItem(name))
}

const remove = (name) => {
  Storage.removeItem(name)
}

const clear = () => {
  Storage.clear()
}

export {set,get,remove,clear}