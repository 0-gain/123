<template>
  <div>
    <el-card class="sku-list">
      <el-table border stripe :data="records" v-loading="loading">
        <el-table-column
          type="index"
          label="序号"
          align="center"
          width="80"
          row-key="id"
        >
        </el-table-column>
        <el-table-column label="名称" prop="skuName"> </el-table-column>
        <el-table-column label="描述" prop="skuDesc"> </el-table-column>
        <el-table-column label="默认图片" width="150" align="center">
          <template slot-scope="{ row }">
            <div class="info">
              <div class="pic">
                <img
                  :src="row.skuDefaultImg"
                  alt="商品图片"
                  style="width: 80px"
                />
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="重量(KG)" prop="weight"> </el-table-column>
        <el-table-column label="价格(元)" prop="price" width="80">
        </el-table-column>
        <el-table-column label="操作" width="250" align="center">
          <template slot-scope="{ row }">
            <!-- 上架 -->
            <el-tooltip
              effect="dark"
              content="上架"
              placement="top"
              v-if="row.isSale == 0"
            >
              <el-button
                type="info"
                icon="el-icon-top"
                size="mini"
                @click="getOnSale(row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="下架"
              placement="top"
              v-if="row.isSale == 1"
            >
              <el-button
                type="success"
                icon="el-icon-bottom"
                size="mini"
                @click="cancelSale(row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 修改 -->
            <el-tooltip effect="dark" content="修改" placement="top">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="toUpdateSku()"
              ></el-button>
            </el-tooltip>
            <!-- 查看详情 -->
            <el-tooltip effect="dark" content="查看详情" placement="top">
              <el-button
                type="info"
                icon="el-icon-info"
                size="mini"
                @click="showSkuInfo(row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 删除 -->
            <el-tooltip
              effect="dark"
              content="删除"
              placement="top"
              style="margin-left: 10px"
            >
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="deleteSku(row.id)"
              >
                <el-button
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                ></el-button>
              </el-popconfirm>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        style="text-align: center"
        :current-page="page"
        :page-sizes="[10, 20, 30]"
        :page-size="limit"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="prev, pager, next, jumper, ->, sizes, total"
      />

      <el-drawer :visible.sync="isShowSkuInfo" :with-header="false" size="50%">
        <el-row>
          <el-col :span="5">名称</el-col>
          <el-col :span="16">{{ skuInfo.skuName }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="5">描述</el-col>
          <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="5">价格</el-col>
          <el-col :span="16">{{ skuInfo.price }} 元</el-col>
        </el-row>

        <el-row>
          <el-col :span="5">平台属性</el-col>
          <el-col :span="18">
            <el-tag
              type="success"
              style="margin-right: 5px"
              v-for="value in skuInfo.skuAttrValueList"
              :key="value.id"
            >
              {{ value.attrId + "-" + value.valueId }}
            </el-tag>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="5">商品图片</el-col>
          <el-col :span="16">
            <el-carousel class="sku-carousel" trigger="click" height="400px">
              <el-carousel-item
                v-for="item in skuInfo.skuImageList"
                :key="item.id"
              >
                <img :src="item.imgUrl" alt="" />
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </el-drawer>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      page: 1, //当前页
      limit: 10, //每页所展示的数量
      total: 1, //总共的条数
      records: [], //根据分页器显示的当前页的列表

      loading: false, //是否显示loading遮罩层
      isOnSale: false, //是否上架，false为下架

      isShowSkuInfo: false,//是否显示skuInfo
      skuInfo:{},//收集当前所点击的sku的信息
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    //   获取页面列表
    async getList() {
      const { page, limit } = this;
      this.loading = true;
      const result = await this.$API.sku.reqList(page, limit);
      this.records = result.data.records;
      this.total = result.data.total;
      this.loading = false;
    },

    // ! 上架SKU
    getOnSale(skuId) {
      this.$API.sku.reqOnSale(skuId).then((result) => {
        console.log(result);
        this.$message.success(result.data || "上架成功");
      });
      this.getList();
    },

    // !下架
    cancelSale(skuId) {
      this.$API.sku.cancelSale(skuId).then((res) => {
        this.$message.success(res.data || "下架成功");
      });
      this.getList();
    },

    // 修改Sku
    toUpdateSku() {
      this.$message.info("正在开发中...");
    },

    // 显示skuInfo
    async showSkuInfo(skuId){
      this.isShowSkuInfo = true
      const result = await this.$API.sku.get(skuId)
      this.skuInfo = result.data
    },

    // 删除Sku
    async deleteSku(id) {
      try {
        const result = await this.$API.sku.reqDeleteSku(id);
        this.$message.success(result.data || "删除成功");

        /* 
            如果当前页只有一条数据则返回上一页
        */
        if (this.records.length === 1 && this.page != 1) {
          this.page -= 1;
        }
        // 重新渲染页面
        this.getList();
      } catch (error) {}
    },

    // 每页多少条
    handleSizeChange(limit) {
      this.limit = limit;
      this.getList();
    },

    // 当前页
    handleCurrentChange(page) {
      this.page = page;
      this.getList();
    },
  },
};
</script>

<style lang="scss" scoped>
/* 
    1. 为什么必须加 /deep/ 或者 ::v-deep 才能修改Carousel组件的样式?, 
      声明了scoped, 不用deep不能修改子组件的非标签样式(也就是Carousel组件内部的子标签样式)
      用了deep: 不会对目标标签有当前组件的data属性选择的要求
    2. 为什么不加/deep/能修改Row/Col组件的样式?
      我们修改的是Row/Col根标签样式(它有当前组件的data属性)
  */
.sku-list {
  .el-row {
    height: 40px;
    .el-col {
      line-height: 40px;
      &.el-col-5 {
        font-size: 18px;
        font-weight: bold;
        text-align: right;
        margin-right: 20px;
      }
    }
  }

  .sku-carousel {
    width: 400px;
    border: 1px solid #ccc;
    img {
      width: 400px;
      height: 400px;
    }
    ::v-deep .el-carousel__indicator {
      button {
        background-color: hotpink;
      }
      &.is-active {
        button {
          background-color: green;
        }
      }
    }
  }
}
</style>
