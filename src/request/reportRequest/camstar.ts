import axios from 'axios'


const service = axios.create({
    // baseURL: 'http://172.20.99.29',
     baseURL: 'http://172.20.99.27:8080/xymes/api',
    // timeout: 5000, // request timeout
    // headers:{
    //     'Content-Type': 'application/soap+xml;utf-8',
    // }
})
export default service