import axios from "axios";

const axiosinstance=axios.create({
    baseURL:'http://localhost:3200/api',
    withCredentials:true
})
export default axiosinstance