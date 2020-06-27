import { observable } from "mobx";
import { notification, Modal } from "antd";
import ModelExtend from "./modelExtend";

export default class GlobalStore extends ModelExtend {
  constructor(rootStore) {
    super(rootStore);
    this.rootStore = rootStore;
  }

  @observable name = "globalStore";
  @observable modal = {
    show: true,
    name: "",
    data: ""
  };
  @observable history = {};


  saveHistory = payload => {
    const { history } = payload;
    this.commit("history", history);
  };
}
