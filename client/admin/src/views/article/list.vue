<template>
  <div class="app-container">
     <div class="filter-container">
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="文章标题 作者" v-model.trim="listQuery.keyword">
          <i slot="prefix" class="el-input__icon el-icon-tickets"></i>
        </el-input>
      
       <el-select v-model="listQuery.category" class="filter-item" placeholder="文章分类">
          <el-option label="所有分类" value=""></el-option>
          <el-option
            v-for="item in categoryList"
            :key="item.id"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-plus">添加</el-button>
      </div>
      <el-table :data="list" v-loading="listLoading" element-loading-text="loading" border fit highlight-current-row>
        <el-table-column align="center"  label="序号" width="70" >
          <template slot-scope="scope"> 
            <span>{{scope.$index+1}}</span>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
          </template>
        </el-table-column>
        <el-table-column align="left"  label="标题" >
          <template slot-scope="scope"> 
            <span>{{scope.row.title}}</span>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
          </template>
        </el-table-column>
        <el-table-column align="left"  label="作者" >
          <template slot-scope="scope"> 
            <span>{{scope.row.author}}</span>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
          </template>
        </el-table-column>
        <el-table-column align="left"  label="分类" >
          <template slot-scope="scope"> 
            <span>{{scope.row.category}}</span>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
          </template>
        </el-table-column>
        <el-table-column align="left"  label="创建时间" >
          <template slot-scope="scope"> 
            <span>{{scope.row.createdAt}}</span>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
          </template>
        </el-table-column>
        <el-table-column align="left"  label="修改时间" >
          <template slot-scope="scope"> 
            <span>{{scope.row.updatedAt}}</span>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
          </template>
        </el-table-column>
        <el-table-column align="left"  label="操作" width="160">
          <template slot-scope="scope">      
            <el-button size="mini" type="primary" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          class="fr"
          background
          @current-change="handleCurrentChange"
          :current-page.sync="listQuery.page"
          :page-size="listQuery.pageSize"
          layout="prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
      <!-- 删除弹框 -->
      <el-dialog
        title="删除"
        :visible.sync="deleteVisible"
        width="30%"
      >
        <span>确认删除文章 <span class="danger">{{deleteText}}</span></span>
        <div slot="footer">
          <el-button @click="deleteVisible = false">取 消</el-button>
          <el-button type="danger" @click="conformDelete">确 定</el-button>
        </div>
      </el-dialog>

  </div>
</template>
<script>
import { getArticleList, deleteArticle } from '@/api/article'
import { getCategoryList } from '@/api/category'
export default {
  data() {
    return {
      articleId: '',
      categoryList: null, // 分类列表
      deleteText: '', // 删除文章提示
      deleteVisible: false,
      listLoading: false,
      list: null,
      total: 1,
      listQuery: {
        page: 1,
        pageSize: 10,
        keyword: '',
        category: ''
      }
    }
  },
  created() {
    this.getList()
    this.getCategoryList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getArticleList(this.listQuery).then(res => {
        this.listLoading = false
        this.list = res.data.list
        this.total = res.data.totalCount
      })
    },
    handleFilter() {
      this.getList()
    },
    handleUpdate(row) {
      this.$router.push({path: '/article/update', query: { 'articleId': row.id }})
    },
    handleCreate() {
      this.$router.push({ path: '/article/add' })
    },
    handleDelete(row) {
      this.deleteVisible = true
      this.deleteText = row.title
      this.articleId = row.id
    },
    conformDelete() {
      deleteArticle(this.articleId).then(res => {
        this.$message({
          type: 'success',
          duration: 1000,
          message: res.msg
        })
        this.deleteVisible = false
        this.getList()
      })
    },
    getCategoryList() {
      getCategoryList().then(res => {
        this.categoryList = res.data.list
        
      })
    },
    handleCurrentChange(page) {
      this.listQuery.page = page
      this.getList()
    }
  }
}
</script>
<style>
.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style>


