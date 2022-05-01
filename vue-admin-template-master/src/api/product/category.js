import request from '@/utils/request'

export default {

  /* 
  查找一级分类列表
  */
  reqCategorys1() {
    /* return request({
      url: '/admin/product/getCategory1',
      method: 'get'
    }) */
    // 修改为request.xxx()
    return request.get('/admin/product/getCategory1')
  },

  /* 
  查找二级分类列表
  */
  reqCategorys2(category1Id) {
    /* return request({
      url: '/admin/product/getCategory2/' + category1Id,
      method: 'get'
    }) */
    return request.get('/admin/product/getCategory2/' + category1Id)
  },

  /* 
  查找三级分类列表
  */
  reqCategorys3(category2Id) {
    /* return request({
      url: '/admin/product/getCategory3/' + category2Id,
      method: 'get'
    }) */
    return request.get('/admin/product/getCategory3/' + category2Id)
  }
}