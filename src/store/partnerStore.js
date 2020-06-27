import { autorun, observable } from "mobx";
import { message } from "antd";
import ModelExtend from "./modelExtend";
import {
  getIdeasPreview,
  publishIdea,
  getIdeaDetail,
  editIdea,
  getIdeaComments,
  publishIdeaComment,
  getInterest,
  operationInterest,
  getMyIdea,
  getIdeaInterester,
  deleteIdeaComment,
  deleteIdea
} from "../services";
import { localSave } from "../utils";

export default class PartnerStore extends ModelExtend {
  constructor(rootStore) {
    super(rootStore);
    this.rootStore = rootStore;
    this.resetIdeasPagination = () => ({
      pageSize: 20,
      current: 1,
      total: 0
    });
    this.resetMyInterestsPagination = () => ({
      pageSize: 20,
      current: 1,
      total: 0
    });
    this.resetMyIdeasPagination = () => ({
      pageSize: 20,
      current: 1,
      total: 0
    });
    this.resetIdeaCommentsPagination = () => ({
      pageSize: 10,
      current: 1,
      total: 0
    });
    this.resetIdeaInterestersPagination = () => ({
      pageSize: 60,
      current: 1,
      total: 0
    });
    autorun(() => {
      localSave.set("localIdea", this.localIdea);
    });
  }

  @observable name = "partnerStore";
  @observable ideas = [];
  @observable ideasPagination = this.resetIdeasPagination();
  @observable detailIdea = {};

  @observable myInterests = [];
  @observable myInterestsPagination = this.resetMyInterestsPagination();

  @observable myIdeas = [];
  @observable myIdeasPagination = this.resetMyIdeasPagination();

  @observable ideaComments = [];
  @observable ideaCommentsPagination = this.resetIdeaCommentsPagination();

  @observable ideaInteresters = [];
  @observable ideaInterestersPagination = this.resetIdeaInterestersPagination();

  @observable localIdea = localSave.get("localIdea") || {};

  getIdeaComments = async payload => {
    const { id } = payload;
    const res = await getIdeaComments({
      page: this.ideaCommentsPagination.current,
      pageSize: this.ideaCommentsPagination.pageSize,
      ...(payload && payload.pageSize ? { pageSize: payload.pageSize } : {}),
      ...(payload && payload.page ? { page: payload.page } : {}),
      online: "on",
      ideaId: id
    }).catch(this.handleError);
    if (res && res.data) {
      this.commit({
        ideaComments: res.data,
        ideaCommentsPagination: {
          current: res.current,
          pageSize: res.pageSize,
          total: res.total
        }
      });
    }
  };

  getIdeasPreview = async payload => {
    const res = await getIdeasPreview({
      page: this.ideasPagination.current,
      pageSize: this.ideasPagination.pageSize,
      ...(payload && payload.pageSize ? { pageSize: payload.pageSize } : {}),
      ...(payload && payload.page ? { page: payload.page } : {}),
      ...(payload && payload.title ? { title: payload.title } : {}),
      online: "on"
    }).catch(this.handleError);
    if (res && res.data) {
      this.commit({
        ideas: res.data,
        ideasPagination: {
          current: res.current,
          pageSize: res.pageSize,
          total: res.total
        }
      });
    }
  };

  getMyIdeas = async payload => {
    if (!this.isLogin()) return;
    const res = await getMyIdea({
      page: this.myIdeasPagination.current,
      pageSize: this.myIdeasPagination.pageSize,
      ...(payload && payload.pageSize ? { pageSize: payload.pageSize } : {}),
      ...(payload && payload.page ? { page: payload.page } : {}),
      ...(payload && payload.title ? { title: payload.title } : {}),
      online: "on"
    }).catch(this.handleError);
    if (res && res.data) {
      this.commit({
        myIdeas: res.data,
        myIdeasPagination: {
          current: res.current,
          pageSize: res.pageSize,
          total: res.total
        }
      });
    }
  };

  getInterest = async payload => {
    if (!this.isLogin()) return;
    const res = await getInterest({
      page: this.myInterestsPagination.current,
      pageSize: this.myInterestsPagination.pageSize,
      ...(payload && payload.pageSize ? { pageSize: payload.pageSize } : {}),
      ...(payload && payload.page ? { page: payload.page } : {}),
      ...(payload && payload.title ? { title: payload.title } : {}),
      online: "on"
    }).catch(this.handleError);
    if (res && res.data) {
      this.commit({
        myInterests: res.data,
        myInterestsPagination: {
          current: res.current,
          pageSize: res.pageSize,
          total: res.total
        }
      });
    }
  };

  getIdeaDetail = async payload => {
    const { from, id } = payload;
    const res = await getIdeaDetail({ id }).catch(this.handleError);
    if (res && res.data) {
      if (from === "partnerDetail") {
        this.commit("detailIdea", res.data);
      }
      return res.data;
    }
  };

  getIdeaInterester = async payload => {
    const { id } = payload;
    const res = await getIdeaInterester({
      page: this.ideaInterestersPagination.current,
      pageSize: this.ideaInterestersPagination.pageSize,
      ...(payload && payload.pageSize ? { pageSize: payload.pageSize } : {}),
      ...(payload && payload.page ? { page: payload.page } : {}),
      ideaId: id
    }).catch(this.handleError);
    if (res && res.data) {
      this.commit({
        ideaInteresters: res.data,
        ideaInterestersPagination: {
          current: res.current,
          pageSize: res.pageSize,
          total: res.total
        }
      });
    }
  };

  operationInterest = async payload => {
    if (!this.isLogin()) return;
    const { id, action, from, active } = payload;
    const res = await operationInterest({ ideaId: id, action }).catch(
      this.handleError
    );
    if (res && res.code && res.data) {
      message.success(action === "add" ? "关注成功" : "取消关注");
      this.updateListOrDetail({ from, active });
    }
  };

  publishIdeaComment = async payload => {
    if (!this.isLogin()) return;
    const { id, from, active, to, ...rest } = payload;
    const res = await publishIdeaComment({
      ...rest,
      ideaId: id,
      to
    }).catch(this.handleError);
    if (res && res.code && res.data) {
      res.data.online === "on"
        ? message.success(to ? "回复成功" : "评论成功")
        : message.warn(
            `您的${to ? "回复" : "评论"}已提交，等待审核中，请勿重新发送！`
          );
      this.dispatch({
        type: "getIdeaComments",
        payload: { id, page: 1 }
      });
      this.updateListOrDetail({ from, active, id });
      return res.data;
    }
  };

  deleteIdeaComment = async payload => {
    if (!this.isLogin()) return;
    const { commentId, from, active, id } = payload;
    const res = await deleteIdeaComment({
      commentId
    }).catch(this.handleError);
    if (res && res.code && res.data) {
      message.success("删除评论成功");
      this.dispatch({
        type: "getIdeaComments",
        payload: { id }
      });
      this.updateListOrDetail({ from, active, id });
      return res.data;
    }
  };

  publishIdea = async payload => {
    if (!this.isLogin()) return;
    const { from, active, ...rest } = payload;
    const res = await publishIdea(rest).catch(this.handleError);
    if (res && res.code && res.data) {
      res.data.online === "on"
        ? message.success("发布副业成功")
        : message.warn("您的副业已提交，等待审核中，请勿重新发送！");
      this.updateListOrDetail({ from, active, page: 1 });
      this.clearLocalIdea();
      this.closeModal();
    }
  };

  deleteIdea = async payload => {
    if (!this.isLogin()) return;
    const { ideaId } = payload;
    const res = await deleteIdea({ ideaId }).catch(this.handleError);
    if (res && res.code && res.data) {
      message.success("副业删除成功");
      return res.data;
    }
  };

  editIdea = async payload => {
    if (!this.isLogin()) return;
    const { from, active, id, ...rest } = payload;
    const res = await editIdea({ id, ...rest }).catch(this.handleError);
    if (res && res.code && res.data) {
      res.data.online === "on"
        ? message.success("修改副业成功")
        : message.warn("您的修改已提交，等待审核中，请勿重新发送！");
      this.updateListOrDetail({ id, from, active });
      this.closeModal();
    }
  };

  updateListOrDetail = payload => {
    const { from, active, id, ...rest } = payload;
    if (from === "partner") {
      this.dispatch({
        type:
          active === "all"
            ? "getIdeasPreview"
            : active === "interest"
            ? "getInterest"
            : "getMyIdeas",
        payload: {
          ...rest
        }
      });
    } else if (from === "partnerDetail") {
      this.dispatch({
        type: "getIdeaDetail",
        payload: {
          from,
          id,
          ...rest
        }
      });
    }
  };

  saveLocalBeforePublishIdea = payload => {
    const { title = "", content = "" } = payload;
    this.commit("localIdea", {
      title,
      content
    });
    message.success("已经保存到本地草稿");
  };

  reset = payload => {
    if (typeof payload !== "object") return;
    this.commit({
      ...(payload.ideaComments
        ? {
            ideaComments: [],
            ideaCommentsPagination: this.resetIdeaCommentsPagination()
          }
        : {}),
      ...(payload.detailIdea
        ? {
            detailIdea: {}
          }
        : {}),
      ...(payload.ideaInterester
        ? {
            ideaInteresters: [],
            ideaInterestersPagination: this.resetIdeaInterestersPagination()
          }
        : {})
    });
  };

  clearLocalIdea = () => {
    this.commit("localIdea", {});
  };
}
