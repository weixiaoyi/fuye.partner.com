import { autorun, observable } from "mobx";
import { message } from "antd";
import ModelExtend from "./modelExtend";
import { localSave, encryptString } from "../utils";
import {
  login,
  register,
  getUserInfo,
  loginOut,
  getCaptcha,
} from "../services";

export default class UserStore extends ModelExtend {
  constructor(rootStore) {
    super(rootStore);
    this.rootStore = rootStore;
    autorun(() => {
      const { accountId, name } = this.userInfo;
      localSave.set("userInfo", { accountId, name });
    });
  }

  @observable name = "userStore";
  @observable userInfo = localSave.get("userInfo") || {};
  @observable userMemberInfo = {};

  setUserInfo = (info) => {
    const { accountId, name, ...rest } = info;
    this.commit("userInfo", {
      accountId,
      name,
      ...rest,
    });
  };

  login = async (payload) => {
    const { name, password } = payload;
    const res = await login({
      name,
      password: encryptString(password),
      domain: this.domain,
    }).catch(this.handleError);
    if (res && res.code && res.data) {
      this.setUserInfo(res.data);
      message.success("登陆成功");
      return res.data;
    }
  };

  register = async (payload) => {
    const { name, password, captcha } = payload;
    const res = await register({
      name,
      password: encryptString(password),
      userAgent: "pc",
      domain: this.domain,
      captcha,
    }).catch(this.handleError);
    if (res && res.code && res.data) {
      this.setUserInfo(res.data);
      message.success("注册成功");
      return res.data;
    }
  };

  getUserInfo = async () => {
    if (this.isLogin()) {
      const res = await getUserInfo().catch(this.handleError);
      if (res && res.code && res.data) {
        this.setUserInfo(res.data);
        return res.data;
      }
    }
  };

  getCaptcha = async () => {
    const res = await getCaptcha().catch(this.handleError);
    if (res && res.code && res.data) {
      return res.data;
    }
  };

  loginOut = async () => {
    if (this.isLogin()) {
      this.setUserInfo({});
      this.commit("userMemberInfo", {});
      loginOut().catch((err) => this.handleError(err));
    }
  };
}
