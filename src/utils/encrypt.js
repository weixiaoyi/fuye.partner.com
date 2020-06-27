import * as bip39 from "bip39";
import CryptoJS from "crypto-js";

export const encryptString = string => {
  return CryptoJS.AES.encrypt(string, "weixiaoyi").toString();
};

export const generateAccessToken = () => {
  const mnemonic = bip39.generateMnemonic();
  return encryptString(`${mnemonic} ${Date.now()}`);
};
