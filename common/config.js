"use strict";
// fac70b39f187253abf6cbcdf27e7f2c5efc4ae82e41d41c47838bc8f7d1dfc7b
var config = {
    dappAddress: 'n1wzxQbv16b1CBmCTGpa2KKcQQqrWfC49M4',
    // mode: 'https://testnet.nebulas.io',
    mode: 'https://Mainnet.nebulas.io',
}
let MessageBox = Vue.prototype.$message;
let Prompt =  Vue.prototype.$prompt;
let Loading = Vue.prototype.$loading;
let Notification = Vue.prototype.$notify;
var intervalQuery
let nebulas = require("nebulas");
let Account = nebulas.Account;
let neb = new nebulas.Neb();
let from = Account.NewAccount().getAddressString();
neb.setRequest(new nebulas.HttpRequest(config.mode));
// neb.setRequest(new nebulas.HttpRequest("https://Mainnet.nebulas.io"));
let NebPay = require("nebpay"); //https://github.com/nebulasio/nebPay
let nebPay = new NebPay();
let loadingInstance = null;

var dapp = {
    nickname: '',
    content: '',
    from: '',
    getout() {
        if (typeof webExtensionWallet === "undefined") {
        confirm('请先在谷歌浏览器安装星云链钱包插件', '');
        window.open(
            "https://github.com/ChengOrangeJu/WebExtensionWallet"
        );
        return false;
    }
    return true;
  },
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
            this.from = e.data.data.account
            resole()
          }
        }
      });
    })
  },
  detail(){
    if(status == 'ing' && getObj('btnStart').value == '结束保存至星云链'){
         btnStartClick(1)
        return
    }
    if(this.nickname){
        btnStartClick()
    }else{
        this.start().then(r=>{
            Notification({
                title: `提示`,
                message: "存储昵称成功,开始练习打字吧",
                type: "success"
              });
            btnStartClick()
        });
    }
 
  },
start() {
    return new Promise((resole, reject) => {
      !this.getout() && reject()
          
        Prompt('请输入昵称后练习打字', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[\w\u4e00-\u9fa5]{1,10}$/,
          inputErrorMessage: '昵称格式不正确，昵称由汉字字母数字下划线组成，6-8位'
        }).then(({ value }) => {
        loadingInstance = Loading({
            lock: true,
            text: '您的昵称正在存储于星云链上，请等待...',
            background: 'rgba(000,000,000,.75)'
          });
          let to = config.dappAddress;
          let func = "users";
          let para = JSON.stringify([this.from, value]);
          nebPay.call(to, "0", func, para)
          window.addEventListener("message", e => {
            if (e.data && e.data && e.data.resp && e.data.resp.txhash) {
              time = setInterval(() => {
                axios
                  .post(`${config.mode}/v1/user/getTransactionReceipt`, {
                    hash: e.data.resp.txhash
                  })
                  .then(d => {
                    if (d.data.result.status == 1) {
                      loadingInstance.close();
                      clearInterval(time)
                      time = null
                      resole()
                    }
                  });
              }, 3000)
            }
            if (e.data && e.data.resp === "Error: Transaction rejected by user") {
              loadingInstance.close();
              clearInterval(time)
              time = null
              Notification({
                title: `提示`,
                message: "您放弃了本次存储，很可惜!",
                type: "warning"
              });
              return
            }
          });


        }).catch(() => {
          MessageBox({
            type: 'info',
            message: '取消输入'
          });       
        });

     
    })
  },
  end(str) {
    return new Promise((resole, reject) => {
      !this.getout() && reject()

        loadingInstance = Loading({
            lock: true,
            text: '正在保存，请等待...',
            background: 'rgba(000,000,000,.5)'
          });
          let to = config.dappAddress;
          let func = "set";
          let para = JSON.stringify([this.from, str]);
          nebPay.call(to, "0", func, para)
          window.addEventListener("message", e => {
            if (e.data && e.data && e.data.resp && e.data.resp.txhash) {
              time = setInterval(() => {
                axios
                  .post(`${config.mode}/v1/user/getTransactionReceipt`, {
                    hash: e.data.resp.txhash
                  })
                  .then(d => {
                    if (d.data.result.status == 1) {
                      loadingInstance.close();
                      clearInterval(time)
                      time = null
                      resole()
                    }
                  });
              }, 3000)
            }
            if (e.data && e.data.resp === "Error: Transaction rejected by user") {
              loadingInstance.close();
              clearInterval(time)
              time = null
              Notification({
                title: `提示`,
                message: "您放弃了本次存储，很可惜!",
                type: "warning"
              });
              return
            }
          });

     
    })
  },
   getuser() {
    if(!this.getout()) return
    var value = "0";
    var nonce = "0"
    var arg = 'a'
    var gas_price = "1000000"
    var gas_limit = "2000000"
    var callFunction = "getusers";
    var callArgs = JSON.stringify([this.from]);
    var contract = {
      "function": callFunction,
      "args": callArgs
    }

    return new Promise((resole, reject) => {
      neb.api.call(from, config.dappAddress, value, nonce, gas_price, gas_limit, contract).then((res) => {
        res = JSON.parse(res.result);
        resole(res)
      }).catch((err) => {
        reject(err)
      })
    })
  },
   get() {
    if(!this.getout()) return
    var value = "0";
    var nonce = "0"
    var arg = 'a'
    var gas_price = "1000000"
    var gas_limit = "2000000"
    var callFunction = "get";
    var callArgs = JSON.stringify([this.from]);
    var contract = {
      "function": callFunction,
      "args": callArgs
    }

    return new Promise((resole, reject) => {
      neb.api.call(from, config.dappAddress, value, nonce, gas_price, gas_limit, contract).then((res) => {
        res = JSON.parse(res.result);
        resole(res)
      }).catch((err) => {
        reject(err)
      })
    })
  }
}



new Vue({
  el: '#app',
  mounted: function () {
  this.$nextTick(function () {
      dapp.init().then(()=>{
    loadingInstance = Loading({
            lock: true,
            text: '正在加载...',
            background: 'rgba(000,000,000,.75)'
          });
    Promise.all([dapp.getuser(), dapp.get()]).then(r=>{
        loadingInstance.close();
        let r1 = r[0];
        let r2 = r[1];
        dapp.nickname = r1;
        dapp.content = r2;

        if((r1 == 'null'  || r1 == null ) && (r2 == 'null' || r2 == null)){
            MessageBox({
              message: "您好，请开始使用星云打字练习工具吧",
              type: "warning"
            });
            return
        }
        if(r1 && (r2 == 'null' || r2 == null)){
            MessageBox({
              message: `${r1}您好，您上次练习的结果还没有保存呢，记得要点结束才能保存哦！`,
              type: "warning"
            });
            return
        }
        if(r2 && (r1 == 'null' || r1 == null)){
            MessageBox({
              message: `您好，您上次${r2}，继续加油！`,
              type: "success"
            });
            return
        }
        if(r1 && r2){
            MessageBox({
              message: `${r1}您好，您上次${r2}，继续加油！！`,
              type: "success"
            });
            return
        }
    })
})
    })
  }
})

