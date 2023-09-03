import { createApp } from 'vue'
import './assets/main.css'
import App from './App.vue'
import VueLazyload from 'vue-lazyload'  // 引入懒加载插件

import 'lib-flexible/flexible'

import router from './router'

import {createPinia} from 'pinia'  //use(createPinia())即得到一个仓库

import { 
  Overlay, PullRefresh, Cell, Switch, Popup,
  Area, AddressEdit, AddressList, ContactCard, TreeSelect,
  Divider,SubmitBar,Stepper,SwipeCell,Checkbox,
  CheckboxGroup, Card, ActionBar, ActionBarIcon, ActionBarButton,
  Tabbar, TabbarItem, Swipe, SwipeItem, Search,
  Icon, Button, Form, Field, CellGroup, NavBar,
} from 'vant';
import 'vant/lib/index.css';

const app=createApp(App)
app
  .use(createPinia())
  .use(Overlay)
  .use(PullRefresh)
  .use(Cell)
  .use(Switch)
  .use(Popup)
  .use(Area)
  .use(AddressEdit)
  .use(AddressList)
  .use(ContactCard)
  .use(TreeSelect)
  .use(Divider)
  .use(SubmitBar)
  .use(Stepper)
  .use(SwipeCell)
  .use(Checkbox)
  .use(CheckboxGroup)
  .use(Card)
  .use(ActionBar)
  .use(ActionBarIcon)
  .use(ActionBarButton)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Swipe)
  .use(SwipeItem)
  .use(Search)
  .use(NavBar)
  .use(Form)
  .use(Field)
  .use(CellGroup)
  .use(Icon)
  .use(Button)
  .use(router)
  .mount('#app')
app.use(VueLazyload,{
  preload:1,
  error:'https://android-artworks.25pp.com/fs08/2021/09/06/0/110_e249e87c9e14f6a0c992a1a42c5eb860_con_130x130.png',
  loading:'https://cos.56qq.com/fis/202101051636550301af130314d6edfe.gif',
  attempt:2
})