import request from '@/utils/request'

const api_name = '/admin/product/baseTrademark'

export default {
  /*
    获取品牌分页列表
        GET /admin/product/baseTrademark/{page}/{limit}
    获取所有品牌列表
        GET /admin/product/baseTrademark/getTrademarkList
    */
  getList(page, limit) {
    if (page && limit) {
      return request.get(`${api_name}/${page}/${limit}`)
    }
    return request.get(`${api_name}/getTrademarkList`)
  },
  // 删除品牌  /admin/product/baseTrademark/remove/{id}
  reqDeleteList(id) {
    return request.delete(`${api_name}/remove/${id}`)
  },
  reqAddOrUpdateList(trademark) {
    if (trademark.id) {
      return request.put(`${api_name}/update`,trademark)
    }else {
      return request.post(`${api_name}/save`,trademark)
    }
  },
  /* 
  根据category3Id获取可选品牌列表
    GET /admin/product/baseCategoryTrademark/findCurrentTrademarkList/{category3Id}
  */
 reqCurrentTrademarkList(category3Id){
      return request.get(`/admin/product/baseCategoryTrademark/findCurrentTrademarkList/${category3Id}`)
 }
}
