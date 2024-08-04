<script setup lang="ts">
import { ref, onMounted,defineEmits } from 'vue'
const emit = defineEmits(["getTaskList"])
import api from '../api/http'
const forusDelete = ref(false)
const showDelDialog = ref(false)
const props = defineProps(['selectionTask'])

onMounted(()=>{
    forusDelete.value = localStorage.getItem("forusDelete")=='true' || false
})

const comfirm = async ()=>{
    localStorage.setItem("forusDelete", forusDelete.value+'')
    console.log(props.selectionTask);
    let res = await Promise.all(props.selectionTask.map(i=>api.deleteATask({force:forusDelete.value},i.id)))
    console.log(res);
    emit('getTaskList')
    showDelDialog.value = false
}

</script>

<template>
    <el-button type="danger" @click="showDelDialog=true" >选中删除</el-button>
    <el-dialog
        v-if="showDelDialog"
        v-model="showDelDialog"
        :title="`确认删除?`"
        width="500"
    >
        
        
        <p><el-switch v-model="forusDelete"/> Also delete files</p>
        <p>已选中{{props.selectionTask.length}}项</p>
        <!-- <p v-for="props.selectionTask"> </p> -->
        <template #footer>
        <div class="dialog-footer">
            <el-button @click="showDelDialog = false">取消</el-button>
            <el-button type="primary" @click="comfirm">确定</el-button>
        </div>
        </template>
    </el-dialog>
  
</template>

<style scoped>

</style>
