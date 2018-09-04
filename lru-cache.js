"use strict";

class LRU {
    constructor (options) {
        this.options = options = options || {};
        options.size = typeof(options.size) == 'number' ? options.size : 5;
        this.data = {};
        this.accessOrder = []; //position 0 is most-recent.
    }
    setHead (key) {
        let keyIndex = this.accessOrder.indexOf(key);
        this.accessOrder.unshift(keyIndex > -1 ? this.accessOrder.splice(keyIndex, 1)[0] : key);
        if (this.accessOrder.length > this.options.size) delete this.data[this.accessOrder.pop()];
    }
    set (key, value) {
        this.data[key] = value;
        this.setHead(key);
    }
    get (key) {
        if (this.data[key]) this.setHead(key);
        return this.data[key];
    }
}

module.exports = function (options) {
    return new LRU(options);
}
