import { default as GlobalStore } from "./globalStore";
import { default as UserStore } from "./userStore";
import { default as HomeStore } from "./homeStore";
import { default as PartnerStore } from "./partnerStore";
import { default as GroupStore } from "./groupStore";
class RootStore {
  constructor() {
    this.globalStore = new GlobalStore(this);
    this.userStore = new UserStore(this);
    this.homeStore = new HomeStore(this);
    this.partnerStore = new PartnerStore(this);
    this.groupStore = new GroupStore(this);
  }
}

export default new RootStore();
