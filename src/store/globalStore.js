import { observable } from "mobx";
import { notification, Modal } from "antd";
import moment from "moment";
import ModelExtend from "./modelExtend";
import { getWebsiteConfig } from "../services";
import { _ } from "../utils";

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

  getWebsiteConfig = async () => {
    const res = await getWebsiteConfig({
      domain: this.domain
    }).catch(this.handleError);
    if (res && res.code && res.data) {
      const notifies = _.get(res, "data.detail.notifies").filter(
        item =>
          item &&
          item.date &&
          moment(Date.now()).isAfter(moment(item.date[0])) &&
          moment(Date.now()).isBefore(moment(item.date[1]))
      );
      if (notifies.length) {
        const messages = notifies.filter(item => item.type === "message");
        if (messages.length) {
          messages.forEach(item => {
            notification.info({
              message: item.title || "通知",
              description: item.content
            });
          });
        }

        const modals = notifies.filter(item => item.type === "modal");
        if (modals.length) {
          Modal.warning({
            title: modals[0].title || "通知",
            content: modals[0].content,
            centered: true
          });
        }
      }
    }
  };

  saveHistory = payload => {
    const { history } = payload;
    this.commit("history", history);
  };
}
