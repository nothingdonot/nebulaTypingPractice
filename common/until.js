"use strict";
import axios from "axios";
import {
  Loading,
  MessageBox,
  Notification,
} from 'element-ui';

let url = 'https://Mainnet.nebulas.io'

let nebulas = require("nebulas");
let Account = nebulas.Account;
let neb = new nebulas.Neb();
neb.setRequest(new nebulas.HttpRequest(url));
let from = Account.NewAccount().getAddressString();
let NebPay = require("nebpay"); //https://github.com/nebulasio/nebPay
let nebPay = new NebPay();
let time = null;



class Api {
  constructor(dappAddress) {
    // n1aQzxuEARSZnrwnmwrV7WScbfgsgq6DNGh  pro5626
    // n1ZJmF8TgaRLUjGnWbQB75mSa7yc4W8qt3x   pro1047
    this.dappAddress = dappAddress;
    // n1KSbe4BdBSDxBZBp3ruF3H5pn6TWgMA4VV   test2
    // n1YnxCTq2PPzTHH2d2MXTqBoLcg1Uj4851P
    // n1Fxu7qxPhXVsGgtKLtHgHfp7cgsfjyAyNH
    // n1Xrz4P8RScKffEL8sjRd9QPDPjfCPtWvbX    test2
    // this.getout();
  }
  getout() {
    if (typeof (webExtensionWallet) === "undefined") {
      MessageBox.alert("请先在谷歌浏览器安装星云链钱包插件", "提示", {
        confirmButtonText: "确定",
        callback: action => {
          if (action === "confirm") {
            window.open(
              "https://github.com/ChengOrangeJu/WebExtensionWallet"
            );
            return false;
          } else {
            this.getout();
          }
        }
      });
      return false
    }
    return true
  }
  init() {
    return new Promise((resole, reject) => {
      !this.getout() && reject()
      window.postMessage({
          target: "contentscript",
          data: {},
          method: "getAccount"
        },
        "*"
      );
      window.addEventListener("message", e => {
        if (e.data && e.data.data) {
          if (e.data.data.account) {
            resole(e.data.data.account);
            // api.login(this.from, 'cleartime');
            // this.getall();
          }
        }
      });
    })
  }
  set(f, obj) {
    return new Promise((resole, reject) => {
      !this.getout() && reject()
      
      this.loadingInstance = Loading.service({
        lock: true,
        text: '交易进行中，大约需要十秒，请等待',
        background: 'rgba(000,000,000,.5)'
      });
      let to = this.dappAddress;
      let func = "set";
      let value = "0";
      let para = JSON.stringify([f, obj]);
      // window.postMessage({
      //   "target": "contentscript",
      //   "data": {
      //     "to": to,
      //     "value": "0",
      //     "contract": { //"contract" is a parameter used to deploy a contract or call a smart contract function
      //       "function": func,
      //       "args": para
      //     }
      //   },
      //   "method": "neb_sendTransaction",
      // }, "*");
      nebPay.call(to, value, func, para)
      window.addEventListener("message", e => {
        if (e.data && e.data && e.data.resp && e.data.resp.txhash) {
          time = setInterval(() => {
            axios
              .post(`${url}/v1/user/getTransactionReceipt`, {
                hash: e.data.resp.txhash
              })
              .then(d => {
                if (d.data.result.status == 1) {
                  this.loadingInstance.close();
                  clearInterval(time)
                  time = null
                  resole()
                }
              });
          }, 3000)
        }
        if (e.data && e.data.resp === "Error: Transaction rejected by user") {
          this.loadingInstance.close();
          clearInterval(time)
          time = null
          Notification({
            title: `提示`,
            message: "您取消了本次交易!",
            type: "warning"
          });
          return
        }
      });
    })
  }
  get(f) {
    if(!this.getout()) return
    var value = "0";
    var nonce = "0"
    var arg = 'a'
    var gas_price = "1000000"
    var gas_limit = "2000000"
    var callFunction = "get";
    var callArgs = JSON.stringify([f]);
    var contract = {
      "function": callFunction,
      "args": callArgs
    }

    return new Promise((resole, reject) => {
      neb.api.call(from, this.dappAddress, value, nonce, gas_price, gas_limit, contract).then((res) => {
        res = JSON.parse(res.result);
        resole(res)
      }).catch((err) => {
        reject(err.message)
      })
    })
  }
}

export default Api