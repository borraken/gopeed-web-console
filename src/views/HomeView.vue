// @ts-nocheck
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Setting from '../components/Setting.vue'
import Delete from '../components/Delete.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '../api/http'
const baseUrl = ref('')
const apiKey = ref('')
const settingComponent = ref(null)

onMounted(async ()=>{
  baseUrl.value = localStorage.getItem("baseUrl") || '127.0.0.1:9999'
  apiKey.value = localStorage.getItem("apiKey") || ''
  try {
    await getTaskList()
  } catch (error) {
    settingComponent.value.showSettingDialog = true
  }
})
// console.log(api);

let taskList = ref([])
let selectionTask = ref([])
const getTaskList = async ()=>{
  let res = await api.getTaskList()
  taskList.value = res.map(i=>({...i,...i.meta.opts,createdAt:new Date(i.createdAt),updatedAt:new Date(i.updatedAt)})).reverse()
  // console.log(new Set(taskList.value.map(i=>i.status)) );
  search.value = ''
  searchTask()
  return res
}

const continueTask = async ()=>{
  let res = await Promise.all(selectionTask.value.map(i=>api.continueATask({},i.id)))
  console.log(res);
  getTaskList()
}
const pauseTask = async ()=>{
  let res = await Promise.all(selectionTask.value.map(i=>api.pauseATask({},i.id)))
  console.log(res);
  getTaskList()
}


const search = ref('')
const searchTaskList = ref([])
const searchTask = ()=>{
  searchTaskList.value = search?taskList.value.filter(i=>new RegExp(search.value).test(i.name)):taskList.value
}

</script>

<template>
  <div class="bg">
    <header style="">
      <Setting @getTaskList="getTaskList" ref="settingComponent"/>
      <el-button type="primary" @click="getTaskList()" style="margin-left: 12px" >刷新</el-button>
      <Delete @getTaskList="getTaskList" :selectionTask="selectionTask"/>
      <el-button type="success" @click="continueTask()" >选中继续</el-button>
      <el-button type="warning" @click="pauseTask()" >选中暂停</el-button>
      <el-input v-model="search" @change="searchTask" style="width: 240px" placeholder="搜索筛选" />
    </header>
    <el-table :data="searchTaskList" border @selection-change="(val:[])=>selectionTask = val" style="width: 100%">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="任务名" min-width="280" />
      <el-table-column prop="updatedAt" sortable  label="更新时间" :formatter="(row)=>row.updatedAt.toLocaleString()" width="200" />
      <el-table-column prop="createdAt" sortable  label="创建时间" :formatter="(row)=>row.createdAt.toLocaleString()" width="200" />
      <el-table-column prop="status" label="任务状态" width="150" sortable 
        :filters="[
          { text: '下载中', value: 'running' },
          { text: '暂停', value: 'pause' },
          { text: '已完成', value: 'done' },
          { text: 'ready', value: 'ready' },
          { text: 'wait', value: 'wait' },
          { text: 'error', value: 'error' },
        ]" 
      :filter-method="(v,r)=>r.status===v"/>
    </el-table>
  </div>
  
</template>

<style scoped>
.bg{
  width: 100%;
}
header{
  display: flex;
  >*{
    /* margin-right: 20px; */
  }
}
</style>
