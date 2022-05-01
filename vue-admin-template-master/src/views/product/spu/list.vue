<template>
  <div>
    <!-- 三级联动 -->
    <CategorySelector @categoryChange="categoryChange" />

    <el-card style="margin-top: 20px">
      <!-- SPU 渲染 -->
      <div v-show="!isShowSpuForm && !isShowSkuForm">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="showAdd"
          >添加SPU</el-button
        >
        <el-table border style="width: 100%" :data="records">
          <el-table-column type="index" label="序号" align="center" width="80">
          </el-table-column>
          <el-table-column label="SPU名称" prop="spuName"> </el-table-column>
          <el-table-column label="SPU描述" prop="description">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row }">
              <!-- 添加SKU -->
              <el-tooltip effect="dark" content="添加SKU" placement="top">
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  size="mini"
                  @click="showSku(row)"
                ></el-button>
              </el-tooltip>
              <!-- 修改SPU -->
              <el-tooltip effect="dark" content="修改SPU" placement="top">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showUpdate(row)"
                ></el-button>
              </el-tooltip>
              <!-- 查看SKU列表 -->
              <el-tooltip effect="dark" content="查看SKU列表" placement="top">
                <el-button
                  type="info"
                  icon="el-icon-info"
                  size="mini"
                  @click="showSkuInfo(row)"
                ></el-button>
              </el-tooltip>
              <!-- 删除SPU -->
              <el-tooltip
                effect="dark"
                content="删除SPU"
                placement="top"
                style="margin-left: 10px"
              >
                <el-popconfirm
                  :title="`确定删除${row.spuName}吗？`"
                  @onConfirm="deleteSpu(row.id)"
                >
                  <el-button
                    type="danger"
                    slot="reference"
                    icon="el-icon-delete"
                    size="mini"
                  ></el-button>
                </el-popconfirm>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

        <!-- pagination -->
        <el-pagination
          style="text-align: center"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[5, 10, 15]"
          :page-size="limit"
          layout="prev, pager, next, jumper,->, sizes, total"
          :total="total"
        >
        </el-pagination>
      </div>

      <!-- 添加或修改SPU -->
      <SpuForm :visible.sync="isShowSpuForm" ref="spuForm" @success="success" />

      <!-- SKu -->
      <SkuForm :visible.sync="isShowSkuForm" ref="skuForm" @success="success"/>

      <!-- 查看SKU -->
      <el-dialog
        :title="`${spu.spuName} => SKU列表`"
        :visible.sync="isShowDialog"
      >
        <el-table :data="skuList" v-loading="isLoading">
        <el-table-column prop="skuName" label="名称"></el-table-column>
        <el-table-column property="price" label="价格(元)"></el-table-column>
        <el-table-column property="weight" label="重量(KG)"></el-table-column>
        <el-table-column label="默认图片">
          <template slot-scope="{row}">
            <img :src="row.skuDefaultImg" alt="" style="width:100px;height:100px;">
          </template>
        </el-table-column>
      </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import CategorySelector from "@/components/CategorySelector";
import SpuForm from "@/components/SpuForm";
import SkuForm from "@/components/SKuForm";
export default {
  name: "Spu",
  data() {
    return {
      category1Id: null, // 选择的一级分类id
      category2Id: null, // 选择的二级分类id
      category3Id: null, // 选择的三级分类id
      page: 1, //当前页
      limit: 5, //每页所展示的数量
      total: 0, //总数量
      records: [], //当前页spu列表的信息
      isShowSpuForm: false, // 是否显示Spu的添加/修改界面
      isShowSkuForm: false,

      isLoading:false,
      isShowDialog:false,//是否显示查看sku信息dialog
      skuList:[],//查看sku中的信息列表
      spu: {}, // 要显示sku列表的spu对象
    };
  },
  methods: {
    // 查看skuInfo
    async showSkuInfo(spu){
      this.isShowDialog = true
      this.spu = spu
      this.isLoading = true 
      try {
        const result = await this.$API.sku.reqBySpuId(spu.id)
        this.skuList = result.data

        this.isLoading = false
      } catch (error) {
        
      }
    },
    /* 
        根据指定的页面获取列表
            page,limit,category3Id
    */
    async getSpuList() {
      const { page, limit, category3Id } = this;
      const result = await this.$API.spu.reqList(page, limit, category3Id);
      this.records = result.data.records;
      this.total = result.data.total;
    },

    // 用来获取categoryId的回调
    categoryChange({ id, level }) {
      if (level === 1) {
        this.category2Id = "";
        this.category3Id = "";
        // 清空records
        this.records = [];

        this.category1Id = id;
      } else if (level === 2) {
        this.category3Id = "";
        // 清空records
        this.records = [];

        this.category2Id = id;
      } else {
        this.category3Id = id;

        this.getSpuList();
      }
    },

    // 一页展示多少条数据
    handleSizeChange(val) {
      this.limit = val;

      // 重新渲染页面
      this.getSpuList();
    },

    // 当前是第几页
    handleCurrentChange(val) {
      this.page = val;

      // 重新渲染页面
      this.getSpuList();
    },

    // 显示修改页面
    showUpdate(spu) {
      this.isShowSpuForm = true;
      this.$refs.spuForm.initLoadUpdateData(spu);
    },

    // 现实spu添加页面
    showAdd() {
      this.isShowSpuForm = true;
      this.$refs.spuForm.initLoadAddData(this.category3Id);
    },

    // 删除Spu
    async deleteSpu(spuId) {
      try {
        const result = await this.$API.spu.reqDeleteAttrList(spuId);
        this.$message.success(result.data || "删除成功！");

        const { page, records } = this;

        /* 
            如果当前页只有一条则回到前一页
          */
        if (records.length === 1 && page != 1) {
          this.page -= 1;
        }
      } catch (error) {}

      // 重新渲染页面
      this.getSpuList();
    },

    // 子组件保存成功后，重新渲染页面
    success() {
      this.getSpuList();
    },

    // 点击显示SkuForm
    showSku(sku) {
      this.isShowSkuForm = true;
      sku.category1Id = this.category1Id;
      sku.category2Id = this.category2Id;
      // 初始化SkuForm组件
      this.$refs.skuForm.initLoadAddData(sku);
    },
  },
  components: {
    CategorySelector,
    SpuForm,
    SkuForm,
  },
};
</script>

<style></style>
