const STATUS = {
  PENDING: 'PENDING',
  FULFILLED: 'FULFILLED',
  REJECTED: 'REJECTED'
}
class Promise{
  constructor(executor){
    this.status = STATUS.PENDING;
    this.value = undefined;
    this.reason = undefined;
    const resolve = (val) => {
      if(this.status == STATUS.PENDING){
        this.status = STATUS.FULFILLED;
        this.value = val;
      }
    }
    const reject = (reason) => {
      if(this.status == STATUS.PENDING){
        this.status = STATUS.REJECTED;
        this.reason = reason;
      }
    }
    try{
      executor(resolve,reject);
    }catch(e){
      reject(e)
    }
  }

  then(onFulfilled, onRejected){
    if(this.status == STATUS.FULFILLED){
      onFulfilled(this.value);
    }
    if(this.status == STATUS.REJECTED){
      onRejected(this.reason);
    }
  }
}
module.exports = Promise;