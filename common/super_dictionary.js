"use strict";

var Contract = function () {
    LocalContractStorage.defineMapProperty(this, "user");
    LocalContractStorage.defineMapProperty(this, "auther");
};


Contract.prototype = {
    init() {
        // this.to = Blockchain.transaction.to;
        // this.from = Blockchain.transaction.from;
    },
    users(from, obj) {
        this.auther.set(from, obj)
    },
    set(from, data) {
        this.user.set(from, data)
    },
    get(from) {
        return this.user.get(from)
    },
    getusers(from) {
        return this.auther.get(from)
    },
};

module.exports = Contract;