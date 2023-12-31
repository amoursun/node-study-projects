import Router from 'koa-router'
import axios from 'axios'
import { topbg, hot, slideshow, season, recommend } from './urlConfig.js'

const router = Router()

// 顶部背景图
router.get('/topbg', async (ctx, next) => {
  const response = await axios.get(topbg)
  ctx.body = response.data
})

// 各分类热门
router.get('/hot', async (ctx, next) => {
  const response = await axios.get(hot)
  ctx.body = response.data
})

// 番剧下方更新列表右侧新番放送表上侧
router.get('/slideshow', async (ctx, next) => {
  const response = await axios.get(slideshow)
  ctx.body = response.data
})

// 番剧下方更新列表右侧新番放送表下侧
router.get('/season', async (ctx, next) => {
  const response = await axios.get(season)
  ctx.body = response.data
})

// 最底部特别推荐
router.get('/recommend', async (ctx, next) => {
  const response = await axios.get(recommend)
  ctx.body = response.data
})

export default router
