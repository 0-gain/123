<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="addTrademarkList"
      >添加</el-button
    >
    <!-- dialog -->
    <el-dialog
      :title="formInfo.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-form
        :rules="rules"
        ref="ruleForm"
        :model="formInfo"
        label-width="100px"
        style="width: 80%"
      >
        <el-form-item label="品牌名称" prop="tmName">
          <el-input v-model="formInfo.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            :action="`${$BASE_API}/admin/product/fileUpload`"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="formInfo.logoUrl"
              :src="formInfo.logoUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">
              只能上传jpg/png文件，且不超过50kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addOrUpdateTrademark('ruleForm')"
          >确定</el-button
        >
      </div>
    </el-dialog>

    <el-table :data="records" v-loading="loading" border style="margin: 20px 0">
      <el-table-column label="序号" width="80px" type="index" align="center" />
      <el-table-column label="品牌名称" prop="tmName" />
      <el-table-column label="品牌LOGO">
        <template slot-scope="scope">
          <img :src="scope.row.logoUrl" style="width: 100px; height: 60px" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button
            type="warning"
            size="mini"
            icon="el-icon-edit"
            @click="updateTrademarkList(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-edit"
            @click="deleteTrademark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="text-align: center"
      :current-page="page"
      :page-sizes="[3, 6, 9]"
      :page-size="limit"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      layout="prev, pager, next, jumper, ->, sizes, total"
    />
  </div>
</template>

<script>
export default {
  name: "Trademark",
  data() {
    return {
      page: 1, //当前页
      limit: 3, //每页所展示的数量
      total: 1, //总共的条数
      records: [], //需要展示的数量
      loading: true, //是否加载
      dialogVisible: false, //显示dialog
      formInfo: {
        tmName: "",
        logoUrl: "",
      },
      rules: {
        tmName: [
          { required: true, message: "请输入名称" },
          // {min:3,max:5, message:'长度在3到5个字符',trigger:'blur'}
          // 使用自定义校验
          { validator: this.validateTmName, trigger: "blur" },
        ],
        logoUrl: [{ required: true, message: "LOGO必须指定" }],
      },
    };
  },
  mounted() {
    this.getTrademarks();
  },
  methods: {
    /* 自定义校验品牌名称
      value: 需要进行校验的数据值
      callback: 用来指定校验是否通过的函数, 如果执行没有传递参数代表通过, 如果传递了代表不通过, 且指定的就是错误信息
      */
    validateTmName(rule, value, callback) {
      if (value.length < 2 || value.length > 6) {
        callback(new Error("名称必须在2-6个字符"));
      } else {
        callback(); //通过
      }
    },
    // 上传图片成功
    handleAvatarSuccess(res, file) {
      this.formInfo.logoUrl = res.data;
    },
    // 在上传之前的规则
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 获取trademark列表数据
    async getTrademarks() {
      const { page, limit } = this;
      const result = await this.$API.trademark.getList(page, limit);
      // 成功之后
      if (result.code === 200) {
        const { records, total } = result.data;
        this.loading = false;
        this.records = records;
        this.total = total;
      }
    },
    // 一页展示多少条数据
    handleSizeChange(val) {
      this.limit = val;
      this.loading = true;
      this.getTrademarks();
    },
    // 当前是第几页
    handleCurrentChange(val) {
      this.page = val;
      this.loading = true;
      this.getTrademarks();
    },
    // 添加品牌
    addTrademarkList() {
      // 清空formInfo
      this.formInfo = {
        tmName: "",
        logoUrl: "",
      };
      // 显示dialog
      this.dialogVisible = true;

      this.$nextTick(() => {
        // 回调函数是迟延到界面更新后执行的 clearValidate:移除该表单项的校验结果
        this.$refs.ruleForm.clearValidate();
      });
    },
    // 修改品牌
    updateTrademarkList(trademark) {
      /*
        对trademark进行一个浅拷贝
      */
      this.formInfo = {
        ...trademark,
      };
      this.dialogVisible = true;
    },
    // 添加或修改品牌
    addOrUpdateTrademark(ruleForm) {
      this.$refs[ruleForm].validate(async (valid) => {
        if (valid) {
          this.dialogVisible = false;
          //校验完成的回调
          this.$API.trademark.reqAddOrUpdateList(this.formInfo).then((res)=>{
            if(this.formInfo.id) {
              this.$message.success(res.data || '修改成功')
            }else {
              if(this.records.length == this.limit)
                this.page += 1 
              this.$message.success(res.data || '添加成功')
            }
            /* 
              修改或者添加成功后重新获取当前列表，
            */
            this.getTrademarks() 
          }).catch((error)=>{})
        } else {
          console.log("校验不通过");
        }
      })
    },
    // 删除品牌
    deleteTrademark(trademark) {
      this.$confirm(`确定删除${trademark.tmName}吗？`, "提示", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(async () => {
          await this.$API.trademark.reqDeleteList(trademark.id);
          this.$message({
            type: "success",
            message: "删除成功！",
          });
          /* 
            如果当前页只有一条则回到前一页
          */
          const {page, records} = this;
          if (records.length == 1 && page != 1){
            this.page -= 1;
          }
          this.getTrademarks()
      }).catch((error) => {
          if (error === "cancel"){
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          }
      });
       
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
