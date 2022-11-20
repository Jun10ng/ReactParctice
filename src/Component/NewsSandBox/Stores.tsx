import {observable, action, computed, makeObservable} from 'mobx';

interface IStore{
  getCollasped():boolean
  setCollasped(b:boolean):void
}
export class TodoStore{
  constructor() {
    // mobx6.0后的版本都需要手动调用makeObservable(this)，不然会发现数据变了视图不更新
    makeObservable(this); 
  } 
    @observable
    collasped = false

    @computed 
    get getCollasped():boolean{
        return this.collasped
    }
    @action
    setCollasped(b:boolean){
      this.collasped = b
    }
}

export default new TodoStore();
