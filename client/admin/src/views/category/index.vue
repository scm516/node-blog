<template>
  <div class="app-container">
      <div class="filter-container">
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="属性名称" v-model.trim="listQuery.name">
          <i slot="prefix" class="el-input__icon el-icon-tickets"></i>
        </el-input>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-plus">添加</el-button>
      </div>
      <el-table :data="list" v-loading="listLoading" element-loading-text="loading" border fit highlight-current-row>
        <el-table-column align="center"  label="序号" width="70" >
          <template slot-scope="scope"> 
            <span>{{scope.$index+1}}</span>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
          </template>
        </el-table-column>
        <el-table-column align="left"  label="分类名称" >
          <template slot-scope="scope"> 
            <span>{{scope.row.name}}</span>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
          </template>
        </el-table-column>
        <el-table-column align="left"  label="操作" width="160">
          <template slot-scope="scope">      
            <el-button size="mini" type="primary" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
          </template>
        </el-table-column>
      </el-table>

      <!-- 编辑弹框 -->
      <el-dialog
        :title="statusTxet[status]"
        :visible.sync="dialogFormVisible"
        width="30%"
      >
          <el-form :model="temp" label-width="80px" ref="ruleForm">
            <el-form-item label="属性名称">
              <el-input v-model="temp.name"></el-input>
            </el-form-item>
          </el-form>
        <div slot="footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="conformChange">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 删除弹框 -->
      <el-dialog
        title="删除"
        :visible.sync="deleteVisible"
        width="30%"
      >
        <span>确认删除 <span class="danger">{{deleteText}}</span></span>
        <div slot="footer">
          <el-button @click="deleteVisible = false">取 消</el-button>
          <el-button type="danger" @click="conformDelete">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </template>

  </div>
</template>
<script>
import { getCategoryList, addCategory, updateCategory, deleteCategory } from '@/api/category'
export default {
  data() {
    return {
      statusTxet: {
        'add': '新增',
        'update': '编辑'
      },
      status: 'add',
      listQuery: {
        name: ''
      },
      temp: {
        name: ''
      },
      listLoading: false,
      dialogFormVisible: false, // add update弹框
      deleteVisible: false,
      list: null,
      deleteText: '', // 要删除category的name
      deleteId: ''
    } 
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      console.log(this.listQuery)
      getCategoryList(this.listQuery).then(res => {
        console.log(Array.isArray(res.data))
        this.list = res.data.list
      })
    },
    handleCreate() {
      this.status = 'add'
      this.restTemp()
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['ruleForm'].clearValidate()
      })
     
    },
    handleUpdate(row) {
      this.dialogFormVisible = true
      this.status = 'update'
      this.temp.id = row.id
      this.temp.name = row.name
    },
    handleDelete(row) {
      this.deleteVisible = true
      this.deleteText = row.name
      this.deleteId = row.id
    },
    conformChange() {
      // add / edit确认，请求接口
      if (this.status === 'add') {
        addCategory(this.temp).then(res => {
          this.dialogFormVisible = false
          this.$message({
            type: 'success',
            duration: 1000,
            message: res.msg
          })
          this.getList()
        })
      } else { // update
        updateCategory(this.temp).then(res => {
          this.dialogFormVisible = false
          this.$message({
            type: 'success',
            duration: 1000,
            message: res.msg
          })
          this.getList()
        })
      }
    },
    handleFilter() {
      // 条件搜索
      this.getList()
    },
    conformDelete() {
      deleteCategory(this.deleteId).then(res => {
        this.deleteVisible = false
        this.getList()
        this.$message({
          type: 'success',
          duration: 1000,
          message: res.msg
        })
      })
    },
    restTemp() {
      // 初始化temp
      this.temp = {
        name: ''
      }
    }
  }
}
</script>
