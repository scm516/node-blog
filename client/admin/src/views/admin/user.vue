<template>
  <div class="app-container">
      <div class="filter-container">
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="用户名" v-model.trim="listQuery.username">
          <i slot="prefix" class="el-input__icon el-icon-tickets"></i>
        </el-input>
        <!-- <el-select v-model="listQuery.role" class="filter-item">
          <el-option value="admin" label="admin"></el-option>
          <el-option  value="user" label="user"></el-option>
        </el-select> -->
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <!-- <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-plus">添加</el-button> -->
      </div>
      <el-table :data="list" v-loading="listLoading" element-loading-text="loading" border fit highlight-current-row>
        <el-table-column align="center"  label="序号" width="70" >
          <template slot-scope="scope"> 
            <span>{{scope.$index+1}}</span>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
          </template>
        </el-table-column>
        <el-table-column align="left"  label="用户名" >
          <template slot-scope="scope"> 
            <span>{{scope.row.name}}</span>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
          </template>
        </el-table-column>
        <el-table-column align="left"  label="角色" >
          <template slot-scope="scope"> 
            <span>{{scope.row.role}}</span>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
          </template>
        </el-table-column>
        <el-table-column align="center"  label="操作" width="160">
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
        custom-class="width-400"
      >
          <el-form :model="temp" class="user-form" label-width="80px" ref="ruleForm" >
            <el-form-item label="用户名">
              <el-input v-model="temp.username"></el-input>
            </el-form-item>
            <el-form-item label="角色">
              <el-select v-model="temp.role" class="filter-item">
                <el-option value="admin" label="admin"></el-option>
                <el-option  value="user" label="user"></el-option>
              </el-select>
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

<script>
import { getUserList, updateUser, deleteUser } from '@/api/user'
export default {
  data() {
    return {
      statusTxet: {
        'add': '新增',
        'update': '编辑'
      },
      status: 'add',
      listQuery: {
        username: '',
        role: ''
      },
      temp: {
        username: '',
        role: ''
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
      getUserList(this.listQuery).then(res => {
        this.list = res.data
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
      this.temp.username = row.name
      this.temp.role = row.role
    },
    handleDelete(row) {
      this.deleteVisible = true
      this.deleteText = row.name
      this.deleteId = row.id
    },
    conformChange() {
      // add / edit确认，请求接口
      updateUser(this.temp).then(res => {
        this.dialogFormVisible = false
        this.$message({
          type: 'success',
          duration: 1000,
          message: res.msg
        })
        this.getList()
      })
    },
    handleFilter() {
      // 条件搜索
      this.getList()
    },
    conformDelete() {
      deleteUser(this.deleteId).then(res => {
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
        username: '',
        role: ''
      }
    }
  }
}
</script>
<style>
.width-500 {
  max-width: 400px !important;
}
.user-form .el-select{
  width: 100%;
}
</style>
