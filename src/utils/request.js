import axios from "axios";
import { stringify } from "qs";
import { generateAccessToken } from "./encrypt";

axios.defaults.withCredentials = true;
axios.defaults.crossDomain = true;
axios.defaults.maxContentLength = 20000000;

axios.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export const request = (options = {}) => {
  const {
    url = "",
    method = "get",
    formData = false,
    params,
    data,
    timeout = 10000,
    ...rest
  } = options;
  return axios({
    ...{
      headers: {
        Authorization: generateAccessToken()
      },
      method,
      params,
      data,
      url,
      baseURL: "",
      timeout
    },
    ...(formData
      ? {
          transformRequest: [
            (data, headers) => {
              headers["Content-Type"] = "application/x-www-form-urlencoded";
              data = stringify(data);
              return data;
            }
          ]
        }
      : {}), // forData完全可以不需要，post如果传递的是param默认就是基本模式，如果是data就是json模式
    ...rest
  })
    .then(res => {
      const { status, data = {} } = res || {};
      return {
        ...data,
        status
      };
    })
    .catch(error => {
      if (error.response) {
        const { data, status } = error.response;
        return Promise.reject({
          data,
          status,
          errMsg: error.message
        });
      } else {
        if (error && error.message) {
          if (/timeout/.test(error.message)) {
            return Promise.reject({
              errMsg: "请求超时"
            });
          } else {
            return Promise.reject({
              errMsg: error.message
            });
          }
        } else {
          return Promise.reject({
            errMsg: "未知错误类型"
          });
        }
      }
    });
};
