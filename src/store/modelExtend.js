import { action, observable } from "mobx";
import { message } from "antd";
import { isEmpty, analysis, _ } from "../utils";

export default class ModelExtend {
  constructor(rootStore) {
    this.rootStore = rootStore;
    this.domain = "fuye";
  }

  @observable loading = {};

  @action
  commit = (k, v, defaultValue = "") => {
    const change = (k, v, defaultValue) => {
      if (k) {
        _.set(this, `${k}`, _.isUndefined(v) ? v || defaultValue : v);
      } else {
        console.error("commit参数的k是必须参数");
      }
    };
    if (_.isObject(k)) {
      for (let i in k) {
        if (k.hasOwnProperty(i)) {
          change(i, k[i], defaultValue);
        }
      }
    } else {
      change(k, v, defaultValue);
    }
  };

  dispatch = (payloads = {}) => {
    const setLoading = (storeName, methodName, status) => {
      if (storeName) {
        this.commit(`rootStore.${storeName}.loading.${methodName}`, status);
      } else {
        this.commit(`loading.${methodName}`, status);
      }
    };
    const checkExistMethod = (storeName, methodName) => {
      console.error(
        `dispatch参数的type是必须参数,并且必须存在${
          storeName ? `${storeName}/${methodName}` : methodName
        }这个方法`
      );
      return Promise.reject(
        new Error("dispatch参数的type是必须参数,并且必须存在这个方法")
      );
    };
    const { type, payload = {} } = payloads;
    const splits = type.split("/");
    let [storeName, methodName] = [];
    let result;
    if (splits[1]) {
      [storeName, methodName] = splits;
      if (
        !this.rootStore[storeName] ||
        !this.rootStore[storeName][methodName]
      ) {
        checkExistMethod(storeName, methodName);
      } else {
        result = this.rootStore[storeName][methodName](payload);
      }
    } else {
      [methodName] = splits;
      storeName = undefined;
      if (!methodName || !this[methodName]) {
        checkExistMethod(storeName, methodName);
      } else {
        result = this[methodName](payload);
      }
    }

    setLoading(storeName, methodName, true);

    if (result && result.then) {
      return result
        .then(res => {
          setLoading(storeName, methodName, false);
          return res;
        })
        .catch(err => {
          setLoading(storeName, methodName, false);
          return Promise.reject(err);
        });
    } else {
      setLoading(storeName, methodName, false);
      return Promise.resolve(result);
    }
  };

  handleError = err => {
    if (
      _.get(err, "status") === 401 &&
      _.get(err, "data.msg") === "Unauthorized_RequiredLogin"
    ) {
      this.clearCurrentUser();
    } else if (_.get(err, "data.msg")) {
      message.error(_.get(err, "data.msg"));
    } else if (_.get(err, "errMsg")) {
      message.error(_.get(err, "errMsg"));
    } else {
      message.error("未知错误");
    }
    analysis.handleRequestError(err);
    return false;
  };

  clearCurrentUser = () => {
    this.commit("rootStore.userStore.userInfo", {});
  };

  isLogin = () => {
    return !isEmpty(this.rootStore.userStore.userInfo);
  };

  getHistory = () => this.rootStore.globalStore.history;

  openModal = (payload = {}) => {
    const { name, data } = payload;
    this.commit("rootStore.globalStore.modal", {
      show: true,
      name,
      data
    });
  };

  closeModal = () => {
    this.commit("rootStore.globalStore.modal", {
      show: false,
      name: "",
      data: ""
    });
  };
}
