import request from '@/utils/request'

const api_name = '/admin/product'
export default{
    // 三级联动 
    // GET  /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
    reqAttrInfoList(category1Id,category2Id,category3Id) {
        return request.get(`${api_name}/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)
    },

    // 获取一级分类     GET /admin/product/getCategory1
    reqCategory1(){
        return request.get('/admin/product/getCategory1')
    },

    //  获取二级分类    GET /admin/product/getCategory2/{category1Id}
    reqCategory2(category1Id) {
        return request.get(`${api_name}/getCategory2/${category1Id}`)
    },

    //  获取三级分类    GET /admin/product/getCategory3/{category2Id}
    reqCategory3(category2Id) {
        return request.get(`${api_name}/getCategory3/${category2Id}`)
    },

    // 添加属性   POST  /admin/product/saveAttrInfo
    reqSaveAttrInfo(attrList) {
        return request.post('/admin/product/saveAttrInfo',attrList)
    },

    // 删除属性 DELETE /admin/product/deleteAttr/{attrId}
    reqDeleteAttr(attrId) {
        return request.delete(`${api_name}/deleteAttr/${attrId}`)
    }
}