<script setup lang="ts">
import { ref, onMounted,defineEmits } from 'vue'
const emit = defineEmits(["getTaskList"])
const baseUrl = ref('')
const apiKey = ref('')
const formData = ref({baseUrl:'',apiKey:''})
const showSettingDialog = ref(false)

onMounted(()=>{
  baseUrl.value = localStorage.getItem("baseUrl") || '127.0.0.1:9999'
  apiKey.value = localStorage.getItem("apiKey") || ''
  formData.value = {baseUrl:baseUrl.value,apiKey:apiKey.value}
})

const comfirm = async ()=>{
    baseUrl.value = formData.value.baseUrl
    apiKey.value = formData.value.apiKey
    localStorage.setItem("baseUrl", baseUrl.value)
    localStorage.setItem("apiKey", apiKey.value)
    emit('getTaskList')
    showSettingDialog.value = false
}

</script>

<template>
    <el-button type="primary" @click="showSettingDialog=true" >设置</el-button>
    <el-dialog
        v-model="showSettingDialog"
        title="设置"
        width="500"
    >
    
        <el-form :model="formData">
            <el-form-item label="baseUrl" label-width="100px">
                <el-input v-model="formData.baseUrl" autocomplete="off" />
            </el-form-item>
            <el-form-item label="apiKey" label-width="100px">
                <el-input v-model="formData.apiKey" autocomplete="off" />
            </el-form-item>
        </el-form>
        <template #footer>
        <div class="dialog-footer">
            <el-button @click="showSettingDialog = false">取消</el-button>
            <el-button type="primary" @click="comfirm">确定</el-button>
        </div>
        </template>
    </el-dialog>
  
</template>

<style scoped>

</style>
