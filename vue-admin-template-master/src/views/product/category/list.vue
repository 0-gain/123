<template>
  <el-table
    border
    lazy
    :data="categorys"
    :load="load"
    style="width: 900px; margin-bottom: 20px"
    :row-key="getRowKey"
    :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    :row-class-name="tableRowClassName"
  >
    <el-table-column prop="id" label="分类ID" align="center" width="150">
    </el-table-column>
    <el-table-column prop="name" label="分类名称" sortable> </el-table-column>
    <el-table-column label="操作" width="250" align="center">
      <template slot="header">
        <el-input placeholder="按Enter键添加一级分类"></el-input>
      </template>

      <template>
        <el-tooltip
          class="item"
          effect="dark"
          content="添加子分类"
          placement="top"
        >
          <el-button icon="el-icon-plus" type="primary" size="mini"></el-button>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          content="修改分类"
          placement="top"
        >
          <el-button icon="el-icon-edit" type="warning" size="mini"></el-button>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          content="删除分类"
          placement="top"
        >
          <el-button
            icon="el-icon-delete"
            type="danger"
            size="mini"
          ></el-button>
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: "CateGory",
  data() {
    return {
      categorys:[],//一级列表分类的数据
    };
  },
  mounted(){
    this.getCategorys1()
  },
  methods:{
    // 查找一级列表
    async getCategorys1() {
      const result = await this.$API.category.reqCategorys1()
      const categorys = result.data
      categorys.forEach(c =>{
        c.hasChildren = true
        c.level = 1
      })
      this.categorys = categorys
    },
    // 查找二级分类列表
    async getCategorys2(row){
      return this.$API.category.reqCategorys2(row.id).then(result=>{
        const categorys2 = result.data
        if(categorys2 && categorys2.length > 0){
          categorys2.forEach(item=>{
            // 表示有子分类
            item.hasChildren = true
            item.level = 2
          })
          return categorys2
        }else {
          row.hasChildren = false
          return []
        }
      })
    },
    // 查找三级分类列表
    async getCategorys3(row){
      const result = await this.$API.category.reqCategorys3(row.id)
      const categorys3 = result.data
      if (categorys3 && categorys3.length>0){
        return categorys3
      }else {
        row.hasChildren = false
        return []
      }
    },
    // 异步加载下一级分类列表显示
    async load(row,treeNode, resolve) {
      // console.log(row,treeNode,resolve)
      if(row.level === 1){
        const categorys2 = await this.getCategorys2(row)
        resolve(categorys2)
      }else if (row.level === 2){
        const categorys3 = await this.getCategorys3(row)
        resolve(categorys3)
      }
    },
    /* 
      动态确定当前行的唯一key
    */
    getRowKey(row){
      return row.level +'-'+ row.id 
    },

    /* 
      返回二级分类列表的类名
    */
    tableRowClassName({row, rowIndex}) {
      if (row.level === 2) {
        return 'level2-row'
      } 
    },
  }
};
</script>
