import { observable } from "mobx";
import { message } from "antd";
import ModelExtend from "./modelExtend";
import {
  getAnswerDbs,
  getAnswers,
  voteAnswer,
  getAnswerComments,
  publishComment
} from "../services";
import { isEmpty, parseString } from "../utils";

export default class HomeStore extends ModelExtend {
  constructor(rootStore) {
    super(rootStore);
    this.rootStore = rootStore;
    this.resetAnswerPagination = () => ({
      pageSize: 1,
      current: 1,
      total: 0
    });
    this.resetCommentsPagination = () => ({
      pageSize: 10,
      current: 1,
      total: 0
    });
  }

  @observable name = "homeStore";
  @observable selectTheme = {};
  @observable themes = [];
  @observable themesPagination = {
    pageSize: 100,
    current: 1,
    total: 0
  };

  @observable answer = {};
  @observable answerPagination = this.resetAnswerPagination();

  @observable comments = [];
  @observable commentsPagination = this.resetCommentsPagination();

  getAnswerDbs = async () => {
    const history = this.getHistory();
    const theme = parseString(history.location.search).theme;
    const res =
      this.themes.length && !isEmpty(this.answer)
        ? await Promise.resolve(this.themes)
        : await getAnswerDbs({
            page: this.themesPagination.current,
            pageSize: this.themesPagination.pageSize,
            online: "on"
          }).catch(this.handleError);
    if (res && res.code && res.data && res.data.length) {
      this.commit("themes", res.data);
      const selectTheme =
        res.data.find(item => item.name === theme) || res.data[0];
      if (isEmpty(this.selectTheme)) {
        this.dispatch({
          type: "changeTheme",
          payload: {
            theme: selectTheme
          }
        });
      }
    }
  };

  changeTheme = async ({ theme }) => {
    if (!theme || theme.name === this.selectTheme.name) return;
    this.commit({
      answer: {},
      answerPagination: this.resetAnswerPagination(),
      comments: [],
      commentsPagination: this.resetCommentsPagination(),
      selectTheme: theme
    });
    this.dispatch({
      type: "getAnswers"
    });
  };

  getAnswers = async payload => {
    const history = this.getHistory();
    const page = parseString(history.location.search).page;
    const { name: dbName } = this.selectTheme;
    if (!dbName) return;
    const res = await getAnswers({
      page: page || this.answerPagination.current,
      pageSize: this.answerPagination.pageSize,
      ...(payload && payload.pageSize ? { pageSize: payload.pageSize } : {}),
      ...(payload && payload.page ? { page: payload.page } : {}),
      dbName,
      online: "on"
    }).catch(this.handleError);
    if (res && res.data) {
      this.commit({
        answer: {
          ...res.data[0],
          requiredInfo: res.requiredInfo
        },
        answerPagination: {
          current: res.current,
          pageSize: res.pageSize,
          total: res.total
        }
      });
      this.dispatch({
        type: "getAnswerComments"
      });
    }
  };

  getAnswerComments = async payload => {
    const { answerId } = this.answer;
    if (!answerId) return;
    const res = await getAnswerComments({
      page: this.commentsPagination.current,
      pageSize: this.commentsPagination.pageSize,
      ...(payload && payload.pageSize ? { pageSize: payload.pageSize } : {}),
      ...(payload && payload.page ? { page: payload.page } : {}),
      answerId,
      online: "on"
    }).catch(this.handleError);
    if (res && res.data) {
      this.commit({
        comments: res.data,
        commentsPagination: {
          current: res.current,
          pageSize: res.pageSize,
          total: res.total
        }
      });
    }
  };

  publishAnswerComments = async payload => {
    if (!this.isLogin()) return;
    const { answerId } = this.answer;
    if (!answerId) return;
    const res = await publishComment({
      answerId,
      ...payload
    }).catch(this.handleError);
    if (res && res.code && res.data) {
      res.data.online === "on"
        ? message.success("发布评论成功")
        : message.warn("您的评论已提交，等待审核中，请勿重新发送！");
      this.dispatch({
        type: "getAnswerComments"
      });
      return res.data;
    }
  };

  voteAnswer = async payload => {
    const { answerId } = payload;
    const res = await voteAnswer({
      answerId
    }).catch(this.handleError);
    if (res && res.code && res.data) {
      const { currentUpVoteNum } = res.data;
      this.commit("answer", {
        ...this.answer,
        currentUpVoteNum
      });
      message.success("感谢您的赞同");
    }
  };
}
