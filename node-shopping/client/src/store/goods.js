import {defineStore} from 'pinia'

const useGoodsStore=defineStore('goods',{
  state:()=>{  //放响应式数据源
    return{
      id:0
    }
  },
  actions:{
     changeId(id){
      this.id=id
    }
  }
})

export default useGoodsStore