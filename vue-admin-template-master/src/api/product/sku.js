import request from "@/utils/request";

export default {
  /* 
  根据SKU的id查询SKU的详细信息
  GET /admin/product/getSkuById/{skuId}
  */
  get (skuId) {
    return request.get(`/admin/product/getSkuById/${skuId}`)
  },

  /* 
        通过分页器显示页面
        GET     /admin/product/list/{page}/{limit}
    */
  reqList(page, limit) {
    return request.get(`/admin/product/list/${page}/${limit}`);
  },

  /* 
   根据id删除sku
        delete /admin/product/deleteSku/{skuId}
   */
  reqDeleteSku(skuId) {
    return request.delete(`/admin/product/deleteSku/${skuId}`);
  },

  /* 
    根据skuId上架
        GET /admin/product/onSale/{skuId}
   */
  reqOnSale(skuId) {
    return request.get(`/admin/product/onSale/${skuId}`);
  },
  /* 
  下架SKU
  GET /admin/product/cancelSale/{skuId}
  */
  cancelSale(skuId) {
    return request.get(`/admin/product/cancelSale/${skuId}`);
  },

  /* 
    保存SKU
      POST  /admin/product/saveSkuInfo
  */
  reqSaveSkuInfo(skuInfo) {
    return request.post("/admin/product/saveSkuInfo", skuInfo);
  },
};
