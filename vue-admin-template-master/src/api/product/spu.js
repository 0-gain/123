import request from "@/utils/request";

export default {
  /* 
    获取spu基本信息
        GET /admin/product/getSpuById/{spuId} 
        spuList: 包含多个spu简单信息的数组
        spuInfo: 包含一个spu详细信息的对象  
    */
  reqSpuBaseInfo(spuId) {
    return request.get(`/admin/product/getSpuById/${spuId}`);
  },
  /* 
        获取销售属性列表
        GET /admin/product/baseSaleAttrList     getBaseSaleAttrList
   */
  reqSaleAttrList() {
    return request.get("/admin/product/baseSaleAttrList");
  },
  /* 
        删除指定的SPU
         DELETE /admin/product/deleteSpu/{spuId}
   */
  reqDeleteAttrList(spuId) {
    return request.delete(`/admin/product/deleteSpu/${spuId}`);
  },
  /* 
    添加和修改SPU详情信息
    POST /admin/product/saveSpuInfo
    POST /admin/product/updateSpuInfo
  */
  reqAddOrUpdate(spuInfo) {
    return request.post(
      `/admin/product/${spuInfo.id ? "update" : "save"}SpuInfo`,
      spuInfo
    );
  },
  /* 
    GET /admin/product/{page}/{limit}
  */
  reqList(page, limit, category3Id) {
    return request.get(`/admin/product/${page}/${limit}`, {
      params: { category3Id },
    });
  },
  
  //  GET /admin/product/spuImageList/{spuId}
  reqSpuImageList(spuId) {
    return request.get(`/admin/product/spuImageList/${spuId}`);
  },

  // GET /admin/product/spuSaleAttrList/{spuId}
  reqSpuSaleAttrList(spuId) {
    return request.get(`/admin/product/spuSaleAttrList/${spuId}`);
  },
};
