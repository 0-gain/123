<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <el-select
          v-model="category1Id"
          placeholder="请选择"
          @change="handleCategory1Change"
          :disabled='isShowList'
        >
          <el-option
            :label="c1.name"
            :value="c1.id"
            v-for="c1 in category1List"
            :key="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          v-model="category2Id"
          placeholder="请选择"
          @change="handleCategory2Change"
          :disabled='isShowList'
        >
          <el-option
            :label="c2.name"
            :value="c2.id"
            v-for="c2 in category2List"
            :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          v-model="category3Id"
          placeholder="请选择"
          @change="handleCategory3Change"
          :disabled='isShowList'
        >
          <el-option
            :label="c3.name"
            :value="c3.id"
            v-for="c3 in category3List"
            :key="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: "CategorySelector",
  data() {
    return {
      category1List: [], // 一级分类列表
      category2List: [], // 二级分类列表
      category3List: [], // 三级分类列表
      category1Id: '', // 选择的一级分类id
      category2Id: '', // 选择的二级分类id
      category3Id: '', // 选择的三级分类id
    };
  },
  props:['isShowList'],
  mounted() {
    //   一级分类
    this.getCategory1List();
  },
  methods: {
    //   获取一级分类列表
    async getCategory1List() {
      const result = await this.$API.attr.reqCategory1();
      this.category1List = result.data
    },

    //   选择一级分类的ID的回调
    async handleCategory1Change(id) {
      // 点击第一分类时，要清空二三级分类的数据
      this.category3List = [] // 三级分类列表
      this.category2Id = ''// 选择的二级分类id
      this.category3Id = '' // 选择的三级分类id

      const result = await this.$API.attr.reqCategory2(this.category1Id);
      this.category2List = result.data
      this.$emit('categoryChange',{id,level:1})
    },

    //   选择二级分类的ID的回调
    async handleCategory2Change(id) {
      // 点击第二分类时，要清空三级分类的数据
      this.category3Id = '' // 选择的三级分类id
      const result = await this.$API.attr.reqCategory3(this.category2Id);
      this.category3List = result.data

      this.$emit('categoryChange',{id,level:2})
    },

    //    选择三界列表的ID的回调
    handleCategory3Change(id) {
      this.$emit('categoryChange',{id,level:3})
    },
  },
};
</script>

<style></style>
