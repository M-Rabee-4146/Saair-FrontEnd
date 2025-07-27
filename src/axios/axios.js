import axios from "axios";
const BaseURLs=['https://saair-backend-production.up.railway.app/api','http://localhost:3200/api']

const axiosinstance=axios.create({
    baseURL:BaseURLs,
    withCredentials:true
})
export default axiosinstance
