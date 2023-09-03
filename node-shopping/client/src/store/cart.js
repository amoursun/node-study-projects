import {defineStore} from 'pinia'
import axios from 'axios'

const useCartStore=defineStore('cart',{
  state:()=>{  //放响应式数据源
    return{
      badge:0
    }
  },
  actions:{
    async changeBadge(){
      const res =await axios.post('/cartList', {  //获取购物车数据
        username: JSON.parse(sessionStorage.getItem('userInfo')).username
      })
      this.badge=res.data.length
    }
  }
})

export default useCartStore