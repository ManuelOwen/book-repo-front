import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://backendbook.azurewebsites.net", 
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
