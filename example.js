"use strict";

const lruCache = require('./lru-cache.js');
let lru = lruCache({size: 10}); //size is optional, default is 5.
lru.set(`testkey`, {value: 'test data'});
console.log(lru.get(`testkey`)); //{value: 'test data'};
