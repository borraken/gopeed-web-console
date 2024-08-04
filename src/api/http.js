import api from './api.json'
import { ElMessage } from 'element-plus'


const request = async (url='',method='get',param={},id='',data=null)=>{
    let baseUrl = localStorage.getItem("baseUrl") || '127.0.0.1:9999'
    let apiKey = localStorage.getItem("apiKey") || ''
    let res = await fetch("http://"+baseUrl+url.replace("{id}",id)+"?"+new URLSearchParams(param).toString(),{method,mode:"cors",headers:{'X-Api-Token':apiKey,"Content-Type": "application/json",},body:data?JSON.stringify(data):null,})
    // console.log(res);
    res = await res.json()
    // console.log(res);
    if(res.code===0){
        return res.data
    }else{
        ElMessage.error(res?.msg||'请求失败')
    }
}

// let summary2ApiName = (summary='')=>summary.split(" ").reduce((t,v,i)=>t+((i?v[0]?.toUpperCase():v[0]?.toLowerCase())||"")+v.slice(1),'')
// let apis = Object.assign({},...Object.entries(swagger.paths).map(([url, urlValue])=>Object.entries(urlValue).map(([method, methodValue])=>({[summary2ApiName(methodValue.summary||methodValue.description)]:request(method,url)}))).flat(Infinity))
// export default apis

let apis = Object.assign({},...Object.entries(api).map(([apiName, apiObj])=>({[apiName]:(json,id)=>request(apiObj.url,apiObj.method,json,id)})))
// console.log(apis);
export default apis