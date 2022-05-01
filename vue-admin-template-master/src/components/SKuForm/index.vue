<template>
  <div>
    <el-form v-show="visible" ref="form" label-width="80px">
      <el-form-item label="SPU名称">{{ sku.spuName }}</el-form-item>
      <el-form-item label="活动名称">
        <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input placeholder="SKU价格" v-model="skuInfo.price"></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input placeholder="SKU重量" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input
          placeholder="SKU规格描述"
          type="textarea"
          v-model="skuInfo.skuDesc"
        ></el-input>
      </el-form-item>

      <el-form-item label="平台属性">
        <el-form inline label-width="100px">
          <el-form-item
            :label="item.attrName"
            style="margin: 5px 0"
            v-for="item in skuAttrValueList"
            :key="item.id"
          >
            <el-select v-model='item.attrIdValueId' placeholder="请输入" >
              <el-option
                :label="attr.valueName"
                :value="`${item.id}:${attr.id}`"
                v-for="attr in item.attrValueList"
                :key="attr.id"
                
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-form inline label-width="100px">
          <el-form-item
            :label="saleList.saleAttrName"
            v-for="saleList in skuSaleAttrList"
            :key="saleList.id"
          >
            <el-select v-model="saleList.skuSaleAttrValueList" placeholder="请输入">
              <el-option
                :label="saleValueList.saleAttrValueName"
                :value="`${saleList.id} : ${saleValueList.id}`"
                v-for="saleValueList in saleList.spuSaleAttrValueList"
                :key="saleValueList.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="图片列表">
        <el-table
          :data="skuImageList"
          border
          style="width: 100%"
          @selection-change="handleSelectionChange"
          v-model='skuInfo.skuAttrValueList'
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column label="图片">
            <template slot-scope="{ row }">
              <img :src="row.imgUrl" alt="" style="width: 50%; height: 50%" />
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="imgName"> </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{row}">
              <el-button type="success" plain disabled size=mini v-show="row.isDefault">默认</el-button>
              <el-button type="primary" v-show="!row.isDefault" @click="setDeFaultImg(row)" >设为默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="back">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      sku: {}, //收集到的Sku信息
      skuInfo: {
        // 从父组件中获取到的元素
        category3Id:null,
        spuId:null,
        tmId:null,
        skuAttrValueList: [], //平台属性
        skuImageList: [], //图片属性列表
        skuSaleAttrList: [], //获取销售属性
        skuDefaultImg:'',//获取默认的图片

        // v-model收集的数据
        skuName: null, //sku名称
        price: null, //sku价格
        weight: null, //sku重量
        skuDesc: null, //sku描述
      },

      skuAttrValueList: [], //平台属性
      skuImageList: [], //图片属性列表
      skuSaleAttrList: [], //获取销售属性
      multipleSelection: [], //添加sku的图片列表

    };
  },
  props: {
    visible: Boolean,
  },
  methods: {
    // 初始化,收集当前所点击的spu信息
    initLoadAddData(sku) {
      this.sku = sku;
      this.skuInfo.category3Id = sku.category3Id
      this.skuInfo.spuId = sku.id
      this.skuInfo.tmId = sku.tmId
      // 获取平台属性列表
      const { category1Id, category2Id, category3Id } = sku;

      this.getSkuAttrValueList(category1Id, category2Id, category3Id);

      // 获取图片列表
      this.getSkuImageList(sku.id);

      // 获取销售属性列表
      this.getSkuSaleAttrList(sku.id);
    },

    // 重置数据
    resetData(){
      sku = {}, //收集到的Sku信息
      skuInfo = {
        // 从父组件中获取到的元素
        category3Id:null,
        spuId:null,
        tmId:null,
        skuAttrValueList: [], //平台属性
        skuImageList: [], //图片属性列表
        skuSaleAttrList: [], //获取销售属性
        skuDefaultImg:'',//获取默认的图片

        // v-model收集的数据
        skuName: null, //sku名称
        price: null, //sku价格
        weight: null, //sku重量
        skuDesc: null, //sku描述
      },

      skuAttrValueList = [], //平台属性
      skuImageList = [], //图片属性列表
      skuSaleAttrList = [], //获取销售属性
      multipleSelection = [] //添加sku的图片列表
    },

    // ! 获取平台属性列表
    async getSkuAttrValueList(category1Id, category2Id, category3Id) {
      const result = await this.$API.attr.reqAttrInfoList(
        category1Id,
        category2Id,
        category3Id
      );
      this.skuAttrValueList = result.data;
    },

    // ! 获取图片列表信息
    async getSkuImageList(skuId) {
      const result = await this.$API.spu.reqSpuImageList(skuId);
      this.skuImageList = result.data;
    },

    // ! 获取销售属性列表
    async getSkuSaleAttrList(skuId) {
      const result = await this.$API.spu.reqSpuSaleAttrList(skuId);
      this.skuSaleAttrList = result.data;
    },

    // 收集添加Sku中所选择的图片
    handleSelectionChange(val) {
      this.skuInfo.skuImageList = val
    },

    // 设置默认图片
    setDeFaultImg(img){
      // * 先将所有的isDefaultImg都为false
      this.skuImageList.forEach(item=>{
        this.$set(item,"isDefault",false)
      })
      this.$set(img,"isDefault",true)

      this.skuInfo.skuDefaultImg = img.imgUrl
    },

    // ! 保存Sku
    async onSubmit() {

      // * 整理skuInfo.skuAttrValueList中被选中的值
      this.skuAttrValueList.forEach(item=>{
        if(item.hasOwnProperty('attrIdValueId')){
          const [attrId,valueId] = item.attrIdValueId.split(':')
          this.skuInfo.skuAttrValueList.push({
            attrId,
            valueId,
          })
        }
      })

      // * 整理skuInfo.skuSaleAttrList中被选中的值
      this.skuSaleAttrList.forEach(item=>{
        if(item.hasOwnProperty('skuSaleAttrValueList')){
          const [attrId,valueId] = item.skuSaleAttrValueList.split(':')
          this.skuInfo.skuSaleAttrList.push({
            attrId,
            valueId,
          })
        }
      })

      console.log(this.skuInfo)
      try {
        const result = await this.$API.sku.reqSaveSkuInfo(this.skuInfo)

        this.$message.success(result.data || '保存成功')
        console.log(result)
        // 改变visible为false
        this.$emit('update:visible',false)
        // 重新渲染页面
        this.$emit("success");
        // 重置数据
        this.resetData()
      } catch (error) {
        console.log(error)
      }
    },

    // 点击取消返回
    back() {
      this.$emit("update:visible", false);
    },
  },
};
</script>

<style></style>
