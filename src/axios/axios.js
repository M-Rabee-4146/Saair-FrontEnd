import axios from "axios";

const axiosinstance=axios.create({
    baseURL:'https://saair-backend-production.up.railway.app/api',
    withCredentials:true
})
export default axiosinstance