<template>
  <div v-show="visible">
    <el-form label-width="100px" class="demo-ruleForm">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spuInfo.spuName"></el-input>
      </el-form-item>

      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spuInfo.tmId">
          <el-option
            :label="item.tmName"
            :value="item.id"
            v-for="item in trademarkList"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          placeholder="SPU描述"
          v-model="spuInfo.description"
        ></el-input>
      </el-form-item>

      <el-form-item label="SPU图片">
        <el-upload
          :file-list="spuImageList"
          :action="`${$BASE_API}/admin/product/fileUpload`"
          :on-success="handleAvatarSuccess"
          :on-remove="handleRemove"
          :on-preview="handlePictureCardPreview"
          list-type="picture-card"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <!-- 大图 -->
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-select
          :placeholder="
            unUsedSaleAttrList.length
              ? '还有' + unUsedSaleAttrList.length + '可选择'
              : '没有啦！'
          "
          v-model="attrIdAttrName"
        >
          <el-option
            :label="item.name"
            :value="item.id + ':' + item.name"
            v-for="item in unUsedSaleAttrList"
            :key="item.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="attrIdAttrName ? false : true"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >
        <el-table
          border
          style="margin-top: 20px"
          :data="spuInfo.spuSaleAttrList"
        >
          <el-table-column label="序号" type="index" align="center" width="80">
          </el-table-column>
          <el-table-column label="属性名" width="150" prop="saleAttrName">
          </el-table-column>
          <el-table-column label="属性值名称列表">
            <template slot-scope="{ row, $index }">
              <el-tag
                :key="index"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="handleClose(tag, $index)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="row.isEdit"
                v-model="row.saleAttrValueName"
                :ref="$index"
                size="small"
                @keyup.enter.native="handleInputConfirm(row, $index)"
                @blur="handleInputConfirm(row, $index)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(row, $index)"
                >+添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="{ $index }">
              <el-tooltip
                class="item"
                effect="dark"
                content="删除"
                placement="top"
              >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="spuInfo.spuSaleAttrList.splice($index, 1)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="isShowSpuList">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dialogVisible: false, //大图的dilaog是否显示
      dialogImageUrl: "", //大图的url

      spuId: "",
      //spu详情信息对象
      spuInfo: {
        category3Id: null, //3级分类ID
        description: "", //spu描述
        spuName: "", //spu名称
        tmId: null, //spu名牌id
        spuImageList: [], //spu图片列表
        spuSaleAttrList: [], //spu的销售属性列表
      },
      attrIdAttrName: "", //收集销售属性id与name
      trademarkList: [], //收集品牌列表
      saleAttrList: [], //销售属性列表
      spuImageList: [], //spu图片列表
    };
  },
  props: {
    visible: Boolean,
  },
  methods: {
    /* 
    重置数据
    */
    resetData() {
      this.dialogImageUrl = ""; // 大图的url
      this.dialogVisible = false; // 标识大图dilaog是否显示

      this.spuId = ""; // SPU ID
      this.spuInfo = {
        // SPU详情信息对象
        category3Id: null, //3级分类ID
        description: "", //spu描述
        spuName: "", //spu名称
        tmId: null, //spu名牌id
        spuImageList: [], //spu图片列表
        spuSaleAttrList: [], //spu的销售属性列表
      };
      this.spuImageList = []; // SPU图片列表
      this.trademarkList = []; // 品牌列表
      this.saleAttrList = []; // 销售属性列表
      this.attrIdAttrName = ""; // 用来收集销售属性id与name   id:name
    },

    /* 
    请求加载更新界面初始显示需要的数据
    */
    initLoadUpdateData(spu) {
      // 保存spuId
      this.spuId = spu.id;
      // 发3个请求获取数据
      this.getSaleAttrList();
      this.getSpuBaseInfo();
      this.getSpuImageList();
    },

    /* 
    请求加载添加界面初始显示需要的数据
      1). 获取所有品牌的列表trademarkList 
      2). 获取所有销售属性的列表saleAttrList
    */
    initLoadAddData(category3Id) {
      this.spuInfo.category3Id = category3Id;
      this.getTrademarkList();
      this.getSaleAttrList();
    },

    // 获取品牌列表
    async getTrademarkList() {
      const result = await this.$API.trademark.getList();
      this.trademarkList = result.data;
    },

    // 获取页面已经选则的销售属性列表
    async getSpuBaseInfo() {
      const result = await this.$API.spu.reqSpuBaseInfo(this.spuId);
      this.spuInfo = result.data;
    },

    // 获取销售属性列表
    async getSaleAttrList() {
      const result = await this.$API.spu.reqSaleAttrList();
      let saleAttrList = result.data;
      this.saleAttrList = saleAttrList;
    },

    // 获取图片信息列表
    async getSpuImageList() {
      const result = await this.$API.spu.reqSpuImageList(this.spuId);
      const spuImage = result.data;
      /*  fileList: [{name: '', url: ''}] */

      spuImage.forEach((item) => {
        item.name = item.imgName;
        item.url = item.imgUrl;
      });
      this.spuImageList = spuImage;
      console.log(spuImage)
    },

    //   是否显示SPU列表
    isShowSpuList() {
      // 重置数据
      this.resetData();
      this.$emit("update:visible", false);
    },

    // 添加销售属性
    addSaleAttr() {
      const [baseSaleAttrId, saleAttrName] = this.attrIdAttrName.split(":");
      const attr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],//收集添加的属性值tag
        // 查看模式
        isEdit: false,
      };

      this.spuInfo.spuSaleAttrList.push(attr);
      this.attrIdAttrName = "";
    },

    // 添加或修改
    async addOrUpdateSpu() {
      const { spuInfo, spuImageList } = this;
      /* 
        	提交保存/更新SPU请求的图片对象的结构(目标):
			 {
			    "imgName": "下载 (1).jpg",
			    "imgUrl": "http://47.93.148.192:8080/xxx.jpg"
			 }
      */
      spuInfo.spuImageList = spuImageList.map((item) => ({
        imgName: item.name,
        imgUrl: item.response ? item.response.data : item.imgUrl,
      }));

      // 删除isEdit属性
      spuInfo.spuSaleAttrList = spuInfo.spuSaleAttrList.filter((item) => {
        delete item.isEdit;
        return true;
      });
      try {
        const result = await this.$API.spu.reqAddOrUpdate(spuInfo);

        this.$message.success(result.data || "保存SPU成功");

        // 改变visible为false
        this.$emit("update:visible", false);
        // 重新渲染页面
        this.$emit("success");
        // 重置数据
        this.resetData();
      } catch (error) {}
    },

    // 图片上传成功的回调
    handleAvatarSuccess(res, file, fileList) {
      this.spuImageList = fileList;
    },

    // 删除图片的回调
    handleRemove(file, fileList) {
      /* 
            file:被删除的图片
            fileList:剩下的图片数组
        */
      this.spuImageList = fileList;
    },

    /* 
      显示指定的大图片
      file:包含图片信息的对象
    */
    handlePictureCardPreview(file) {
      // 指定要显示的大图url
      this.dialogImageUrl = file.url;
      // 显示大图dilaog
      this.dialogVisible = true;
    },

    // 删除属性值的回调
    handleClose(tag, index) {
      this.spuInfo.spuSaleAttrList[index].spuSaleAttrValueList.splice(
        this.spuInfo.spuSaleAttrList[index].spuSaleAttrValueList.indexOf(tag),
        1
      );
    },

    // 显示input框
    showInput(spuSaleAttr, index) {
      if (spuSaleAttr.hasOwnProperty("isEdit")) {
        spuSaleAttr.isEdit = true;
      } else {
        this.$set(spuSaleAttr, "isEdit", true);
      }

      // 自动获取焦点
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },

    // input失焦和回车(需要确认是否重复)
    handleInputConfirm(spuSaleAttr, index) {
      const { saleAttrValueName, baseSaleAttrId } = spuSaleAttr;

      // 检查是否输入，否则变为查看模式
      if (!saleAttrValueName) {
        spuSaleAttr.isEdit = false;
        return;
      }
      // 确认是否重复
      const isRepeat = spuSaleAttr.spuSaleAttrValueList.some((value) => {
        return value.saleAttrValueName == saleAttrValueName;
      });
      if (isRepeat) {
        // 如果重复
        this.$message.warning("不能重复");

        // 当前input自动获取焦点
        this.$nextTick(() => this.$refs[index].focus());

        return;
      }

      // 插入属性名称
      spuSaleAttr.spuSaleAttrValueList.push({
        saleAttrValueName,
        baseSaleAttrId,
      });

      // 将input中的value值清空
      spuSaleAttr.saleAttrValueName = ''

      // 不显示input
      spuSaleAttr.isEdit = false;
    },
  },
  computed: {
    /* 
    未使用的销售属性的数组
    */
    unUsedSaleAttrList() {
      const { saleAttrList } = this;
      const { spuSaleAttrList } = this.spuInfo;
      const arr = saleAttrList.filter((attr) => {
        return !spuSaleAttrList.some((item) => {
          return attr.name === item.saleAttrName;
        });
      });
      return arr;
    },
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
