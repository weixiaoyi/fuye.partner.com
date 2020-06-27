import { observer, inject } from "mobx-react";
import moment from "moment";
import store from "store";
import queryString from "query-string";
import device from "current-device";
import { _ } from "./index";

export const Inject = func => {
  return c => {
    return inject(func)(observer(c));
  };
};

export const formatTime = time => moment(time).format("YYYY-MM-DD HH:mm:ss");

export const localSave = {
  get: (key, defaultValue) => {
    return store.get(key) || defaultValue;
  },
  set: (key, value) => {
    store.set(key, value);
  },
  remove: key => {
    store.remove(key);
  },
  clearAll: () => {
    store.clearAll();
  }
};

export const isEmpty = value =>
  value === undefined ||
  value === null ||
  value === "" ||
  (_.isObject(value) && JSON.stringify(value) === "{}");

export const parseString = search => queryString.parse(search);

export const updateSearch = (search = "", newSearch = {}) => {
  const parsed = parseString(search);
  return queryString.stringify({
    ...parsed,
    ...newSearch
  });
};

export const groupArrayByCount = (array = [], count) => {
  const prevArrays = [...array];
  const result = [];
  let newArray = [];
  while (prevArrays.length && count) {
    if (newArray.length < count) {
      newArray.push(prevArrays.shift());
    } else {
      result.push(newArray.slice());
      newArray = [];
    }
  }
  if (newArray.length) {
    result.push(newArray);
  }

  return result;
};

export const isMobile = device.type === "mobile" || device.type === "tablet";
