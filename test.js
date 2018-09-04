"use strict";

const assert = require('assert');
const lruCache = require('./lru-cache.js');

describe(`Least Recently-Used Cache`, function() {
    describe(`Set key`, function() {
        let lru = lruCache();
        lru.set(`testkey-0`, {value: 'testval'});
        it(`One key exists in data`, function() {
            assert.equal(Object.keys(lru.data).length, 1);
        });
        it(`Correct key is set`, function() {
            assert.equal(lru.data['testkey-0'].value, 'testval');
            assert.equal(lru.accessOrder[0], 'testkey-0');
        });
    });
    describe(`Get key`, function() {
        let lru = lruCache();
        lru.set(`testkey-0`, {value: 'testval'});
        it(`Returns correct data for existing key`, function() {
            let val = lru.get(`testkey-0`);
            assert.equal(val.value, 'testval');
        });
        it(`Returns undefined for non-existant key`, function() {
            let val = lru.get(`should-not-exist`);
            assert.equal(val, undefined);
        });
    });
    describe(`Cache size is respected`, function() {
        let lru = lruCache();
        for (let i = 0; i <= (lru.options.size + 1); i++) {
            lru.set(`size-${i}`, {value: i});
        }
        it(`Cache is maximum size`, function() {
            assert.equal(lru.accessOrder.length, lru.options.size);
            assert.equal(Object.keys(lru.data).length, lru.options.size);
        });
    });
    describe(`Get and Set re-order cache`, function() {
        let lru = lruCache();
        for (let i = 0; i <= lru.options.size; i++) {
            lru.set(`order-${i}`, {value: i});
        }
        it(`Last-set is most recent`, function() {
            assert.equal(lru.accessOrder[0], `order-5`);
        });
        it(`First-set is oldest`, function() {
            assert.equal(lru.accessOrder[lru.accessOrder.length - 1], `order-1`);
        });
        it(`Get brings key to front`, function() {
            let val = lru.get(`order-1`);
            assert.equal(lru.accessOrder[0], `order-1`);
            assert.equal(val.value, 1);
        });
        it(`Second-oldest is now the oldest`, function() {
            assert.equal(lru.accessOrder[lru.accessOrder.length - 1], `order-2`);
        });
        it(`Set brings existing key to the front`, function() {
            lru.set(`order-3`, {value: 'new3'});
            assert.equal(lru.accessOrder[0], `order-3`);
        });
        it(`Still has the right oldest variable`, function() {
            assert.equal(lru.accessOrder[lru.accessOrder.length - 1], `order-2`);
        });
        it(`Set new variable brings new key to the front`, function() {
            lru.set(`thenewguy`, {value: 'big data'});
            assert.equal(lru.accessOrder[0], `thenewguy`);
        });
        it(`New key removed oldest`, function() {
            assert.notEqual(lru.accessOrder[lru.accessOrder.length - 1], `order-2`);
            let val = lru.get(`order-2`);
            assert.equal(val, undefined);
        });
        it(`Get of non-existant key does not change accessOrder`, function() {
            let val = lru.get(`order-2`);
            assert.equal(val, undefined);
            assert.equal(lru.accessOrder[0], `thenewguy`);
            assert.equal(lru.accessOrder[lru.accessOrder.length - 1], `order-4`);
        });
    });
});
