<template>
  <div>
    <CategorySelector @categoryChange="categoryChange" :isShowList='isShowList'/>
    <el-card class="box-card">
      <!-- 添加属性组件 -->
      <div v-show="isShowList">
        <el-form :inline="true">
          <el-form-item label="属性名">
            <el-input
              el-input
              placeholder="请输入属性值"
              v-model="attrs.attrName"
            ></el-input>
          </el-form-item>
        </el-form>

        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrs.attrName"
          @click="addAttrValue"
          >添加属性值</el-button
        >
        <el-button @click="isShowList = false">取消</el-button>

        <el-table
          border
          style="width: 100%; margin: 20px 0"
          :data="attrs.attrValueList"
        >
          <el-table-column label="序号" type="index" width="80" align="center">
          </el-table-column>
          <el-table-column label="属性值名称">
            <template slot-scope="{ row, $index }">
              <el-input
                :ref="$index"
                placeholder="请输入名称"
                size="mini"
                v-model="row.valueName"
                @blur="onBlur(row)"
                @keyup.enter.native="onBlur(row)"
                v-if="row.edit"
              ></el-input>
              <span v-else @click="toEdit(row, $index)">{{
                row.valueName
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row, $index }">
              <el-tooltip content="删除" placement="top" effect="light">
                <el-popconfirm
                  :title="`确定删除${row.valueName}吗？`"
                  @onConfirm="attrs.attrValueList.splice($index, 1)"
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

        <el-button
          type="primary"
          @click="addOrUpdateAttr"
          :disabled="!attrs.attrName || attrs.attrValueList.length === 0"
          >保存</el-button
        >
        <el-button @click="isShowList = false">取消</el-button>
      </div>

      <!-- 展示list -->
      <div v-show="!isShowList">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttr"
          :disabled="!category3Id"
          >添加属性</el-button
        >
        <el-table border style="width: 100%; margin: 20px 0" :data="attrList">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80"
          ></el-table-column>
          <el-table-column
            label="属性名称"
            width="150"
            prop="attrName"
          ></el-table-column>
          <el-table-column label="属性值列表">
            <template slot-scope="{ row }">
              <el-tag
                type="info"
                v-for="item in row.attrValueList"
                :key="item.id"
                >{{ item.valueName }}</el-tag
              >
            </template>
          </el-table-column>

          <el-table-column label="操作" width="150">
            <template slot-scope="{ row }">
              <el-tooltip content="修改属性" placement="top" effect="light" style="margin-right:10px">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editAttr(row)"
                ></el-button>
              </el-tooltip>

              <el-tooltip content="删除" placement="top" effect="light">
                <el-popconfirm
                  :title="`确定删除${row.attrName}吗？`"
                  @onConfirm="deleteAttr(row.id)"
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
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      category1Id: null, // 选择的一级分类id
      category2Id: null, // 选择的二级分类id
      category3Id: null,
      attrList: [], //需要渲染的列表
      // 添加属性
      attrs: {
        attrName: "",
        attrValueList: [],
        categoryId: null,
        categoryLevel: null,
      },
      isShowList: false, //是否显示添加属性组件
    };
  },
  methods: {
    //   展示列表
    categoryChange(val) {
      const { id, level } = val;
      if (level === 1) {
        this.attrList = []; //重置属性列表
        this.category2Id = null;
        this.category3Id = null;

        this.category1Id = id;
      } else if (level === 2) {
        this.attrList = []; //重置属性列表
        this.category3Id = null;

        this.category2Id = id;
      } else {
        this.category3Id = id;
        // 发请求
        this.getAttrInfoList();

        this.attrs.categoryId = id;
        this.attrs.categoryLevel = level;
      }
    },

    // 发请求
    async getAttrInfoList() {
      const { category1Id, category2Id, category3Id } = this;
      const result = await this.$API.attr.reqAttrInfoList(
        category1Id,
        category2Id,
        category3Id
      );
      this.attrList = result.data;
    },

    addAttr() {
      // 清空所添加的属性值列表
      this.attrs.attrName = "";
      this.attrs.attrValueList = [];

      this.isShowList = true;
    },

    //添加属性值
    addAttrValue() {
      // 点击一次就push一个对象
      let valueList = {
        valueName: "",
        edit: true,
      };

      this.attrs.attrValueList.push(valueList);

      // 让最后一个输入框自动获得焦点(插入的元素永远在最后一个)

      this.$nextTick(() =>
        this.$refs[this.attrs.attrValueList.length - 1].focus()
      );
    },

    // 失焦
    onBlur(val) {
      if (val.valueName.trim() === "") return;
      // 是否重复，重复了还是编辑模式并提示
      const isRepeat = this.attrs.attrValueList.some((item) => {
        if (val !== item) {
          return val.valueName == item.valueName;
        }
      });

      val.edit = false;

      if (isRepeat) {
        this.$message.warning("属性名称不能重复");
        val.valueName = "";
        val.edit = true;
      }
    },

    // 删除属性值的回调
    async deleteAttr(id) {
      const result = await this.$API.attr.reqDeleteAttr(id)
      this.$message.success(result.data || '删除属性成功！')
      this.getAttrInfoList()
    },

    // 添加或修改
    async addOrUpdateAttr() {
      // 对属性值列表进行过滤: 过滤掉属性值名称为''
      const { attrs } = this;
      attrs.attrValueList = attrs.attrValueList.filter((item) => {
        if (item.valueName) {
          return true;
        }
        return false;
      });
      // 成功的回调(如果为空则不发请求)
      if (attrs.attrValueList.length) {
        try {
          await this.$API.attr.reqSaveAttrInfo(attrs);

          this.$message.success("保存属性成功！");

          this.isShowList = false;

          // 发请求
          this.getAttrInfoList();
        } catch (error) {}
      } else {
        this.$message.warning("至少指定一个属性值名称");
      }
    },

    // 编辑属性
    editAttr(attr) {
      // 显示更新界面
      this.isShowList = true;

      // 深克隆
      // this.attrs = JSON.parse(JSON.stringify(val));

      // 使用lodash进行深克隆
      this.attrs = cloneDeep(attr);
    },

    // 修改编辑
    toEdit(val, index) {
      if (val.hasOwnProperty("edit")) {
        val.edit = true;
      } else {
        this.$set(val, "edit", true);
      }

      this.$nextTick(() => this.$refs[index].focus());
    },

    
  },
};
</script>

<style>
.box-card {
  margin-top: 20px;
}
</style>
