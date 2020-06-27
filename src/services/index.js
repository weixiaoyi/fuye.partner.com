import { request } from "../utils";
const baseUrl = "/fuye1000/api";

export const payMember = payload =>
  request({
    url: `/api/pay/getPayImageUrl`,
    method: "get",
    params: payload
  });

export const login = payload =>
  request({
    url: `/api/user/login`,
    method: "post",
    data: payload
  });

export const loginOut = () =>
  request({
    url: "/api/user/loginOut"
  });

export const register = payload =>
  request({
    url: "/api/user/register",
    method: "post",
    data: payload
  });

export const getUserInfo = () =>
  request({
    url: "/api/user/getUserInfo",
    method: "get"
  });

export const getUserMemberInfo = payload =>
  request({
    url: `/api/user/getUserMemberInfo`,
    method: "get",
    params: payload
  });

export const getCaptcha = payload =>
  request({
    url: `/api/captcha/getCaptcha`,
    method: "get",
    params: payload
  });

export const getWebsiteConfig = payload =>
  request({
    url: `/api/websiteConfig/getWebsiteConfig`,
    method: "get",
    params: payload
  });

export const recordAnalysis = payload =>
  request({
    url: `/api/analysis/recordAnalysis`,
    method: "post",
    data: payload
  });

export const getAnswerDbs = payload =>
  request({
    url: `${baseUrl}/answerDbs/getAnswerDbs`,
    method: "get",
    params: payload
  });

export const getAnswers = payload =>
  request({
    url: `${baseUrl}/answers/getAnswers`,
    method: "get",
    params: payload
  });

export const voteAnswer = payload =>
  request({
    url: `${baseUrl}/answers/voteAnswer`,
    method: "post",
    data: payload
  });

export const getAnswerComments = payload =>
  request({
    url: `${baseUrl}/answerComments/getComments`,
    method: "get",
    params: payload
  });

export const publishComment = payload =>
  request({
    url: `${baseUrl}/answerComments/publishComment`,
    method: "post",
    data: payload
  });

export const getIdeasPreview = payload =>
  request({
    url: `${baseUrl}/ideas/getIdeasPreview`,
    method: "get",
    params: payload
  });

export const getMyIdea = payload =>
  request({
    url: `${baseUrl}/ideas/getMyIdeas`,
    method: "get",
    params: payload
  });

export const getIdeaDetail = payload =>
  request({
    url: `${baseUrl}/ideas/getIdeaDetail`,
    method: "get",
    params: payload
  });

export const publishIdea = payload =>
  request({
    url: `${baseUrl}/ideas/publishIdea`,
    method: "post",
    data: payload
  });

export const editIdea = payload =>
  request({
    url: `${baseUrl}/ideas/editIdea`,
    method: "put",
    data: payload
  });

export const deleteIdea = payload =>
  request({
    url: `${baseUrl}/ideas/deleteIdea`,
    method: "delete",
    data: payload
  });

export const operationInterest = payload =>
  request({
    url: `${baseUrl}/ideaInterest/operationInterest`,
    method: "post",
    data: payload
  });

export const getInterest = payload =>
  request({
    url: `${baseUrl}/ideaInterest/getInterest`,
    method: "get",
    params: payload
  });

export const getIdeaInterester = payload =>
  request({
    url: `${baseUrl}/ideaInterest/getIdeaInterester`,
    method: "get",
    params: payload
  });

export const getIdeaComments = payload =>
  request({
    url: `${baseUrl}/ideaComments/getComments`,
    method: "get",
    params: payload
  });

export const publishIdeaComment = payload =>
  request({
    url: `${baseUrl}/ideaComments/publishComment`,
    method: "post",
    data: payload
  });

export const deleteIdeaComment = payload =>
  request({
    url: `${baseUrl}/ideaComments/deleteComment`,
    method: "delete",
    data: payload
  });

export const getGroup = payload =>
  request({
    url: `${baseUrl}/group/getGroups`,
    method: "get",
    params: payload
  });
