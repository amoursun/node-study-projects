import {defineStore} from 'pinia'

const useBackgroundStore=defineStore('goods',{
  state:()=>{  //放响应式数据源
    return{
      loadUrl:null
    }
  },
  actions:{
     changeLoadUrl(loadUrl){
      this.loadUrl=loadUrl
    }
  }
})

export default useBackgroundStore