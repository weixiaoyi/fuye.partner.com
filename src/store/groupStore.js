import { observable } from "mobx";
import ModelExtend from "./modelExtend";
import { getGroup } from "../services";

export default class GroupStore extends ModelExtend {
  constructor(rootStore) {
    super(rootStore);
    this.rootStore = rootStore;
  }

  @observable name = "groupStore";
  @observable groups = [];

  getGroup = async () => {
    const res = await getGroup().catch(this.handleError);
    if (res && res.data) {
      this.commit("groups", res.data);
    }
  };
}
