import axios from "axios";

let axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  (config) => {
    let token = window.localStorage.getItem("accessToken");
    config.headers["Authorization"] = "Bearer " + token;
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default axiosInstance;