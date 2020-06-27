import UA from "ua-device";
import localforage from "localforage";
import moment from "moment";
import { localSave } from "./index";
import { recordAnalysis } from "../services";

class Analysis {
  constructor(domain) {
    if (!domain) return console.error("domain参数必须存在");
    this.domain = domain;
    this.startTime = Date.now();
  }

  init = () => {
    this.userAgent =
      window && window.navigator && window.navigator.userAgent
        ? new UA(navigator.userAgent)
        : null;
    this.dailyTask();
    if (!window.onerror) window.onerror = this.handleWindowError;
  };

  getStayTime = () => Date.now() - this.startTime;

  getBasicInfo = () => ({
    domain: this.domain,
    userAgent: this.userAgent
      ? {
          browser: this.userAgent.browser.name,
          device: this.userAgent.device,
          engine: this.userAgent.engine,
          os: this.userAgent.os
        }
      : {},
    userInfo: localSave.get("userInfo"),
    createTime: Date.now()
  });

  dailyTask = () => {
    const todayAnalysis = localSave.get("todayAnalysis");
    if (
      Number(todayAnalysis) &&
      moment(Number(todayAnalysis)).isSame(Date.now(), "day")
    )
      return;
    this.send(
      {
        ...this.getBasicInfo(),
        dataType: "userInfoAndAction"
      },
      "analysisRecords"
    ).then(() => {
      localSave.set("todayAnalysis", Date.now());
    });
  };

  handleWindowError = async (message, source, lineno, colno, error) => {
    const keyName = "analysisRecords";
    const saveRecords = await this.saveIndexDb(keyName, {
      createTime: Date.now(),
      url: window.location.href,
      message,
      source,
      lineno,
      colno,
      error
    });
    if (saveRecords && saveRecords.length >= 5) {
      this.send({
        ...this.getBasicInfo(),
        dataType: "error",
        records: saveRecords,
        stayTime: this.getStayTime()
      }).then(() => {
        localforage.removeItem(keyName);
      });
    }
  };

  handleRequestError = async error => {
    this.handleWindowError("handleRequestError", 0, 0, 0, error);
  };

  saveIndexDb = async (keyName, payload) => {
    let prev = await localforage.getItem(keyName).catch(() => "error");
    if (prev === "error") return;
    if (!prev) {
      prev = [];
    }
    if (payload) {
      prev.push(payload);
    }
    const saveRecords = await localforage
      .setItem(keyName, prev)
      .catch(() => "error");
    if (saveRecords === "error") return;
    return saveRecords;
  };

  send = async payload => recordAnalysis(payload);
}

export default new Analysis("fuye");
