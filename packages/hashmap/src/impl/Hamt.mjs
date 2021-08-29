// Generated by ReScript, PLEASE EDIT WITH CARE

import * as Curry from "@rescript/std/lib/es6/curry.js";
import * as JsArray from "./JsArray.mjs";
import * as Caml_obj from "@rescript/std/lib/es6/caml_obj.js";
import * as Caml_option from "@rescript/std/lib/es6/caml_option.js";

function make(param) {
  return {
          bitmap: 0,
          data: []
        };
}

function ctpop(v) {
  var v$1 = v - ((v >>> 1) & 1431655765) | 0;
  var v$2 = (v$1 & 858993459) + ((v$1 >>> 2) & 858993459) | 0;
  var v$3 = v$2 + (v$2 >>> 4) & 252645135;
  return (Math.imul(v$3, 16843009) >>> 24);
}

function mask(hash, shift) {
  return (hash >>> shift) & 31;
}

function bitpos(hash, shift) {
  return (1 << mask(hash, shift));
}

function indexAtBitmapTrie(bitmap, bit) {
  return ctpop(bitmap & (bit - 1 | 0));
}

function find(_param, _shift, hash, key) {
  while(true) {
    var param = _param;
    var shift = _shift;
    var bitmap = param.bitmap;
    var bit = bitpos(hash, shift);
    var match = bitmap & bit;
    if (match === 0) {
      return ;
    }
    var idx = indexAtBitmapTrie(bitmap, bit);
    var child = param.data[idx];
    if (child.TAG === /* BitmapIndexed */0) {
      _shift = shift + 5 | 0;
      _param = child._0;
      continue ;
    }
    var match$1 = child._0;
    if (Caml_obj.caml_equal(match$1[0], key)) {
      return Caml_option.some(match$1[1]);
    } else {
      return ;
    }
  };
}

function assoc(self, shift, hasher, hash, key, value) {
  var data = self.data;
  var bitmap = self.bitmap;
  var bit = bitpos(hash, shift);
  var idx = indexAtBitmapTrie(bitmap, bit);
  var match = bitmap & bit;
  if (match !== 0) {
    var child = data[idx];
    if (child.TAG === /* BitmapIndexed */0) {
      var trie = child._0;
      var newChild = assoc(trie, shift + 5 | 0, hasher, hash, key, value);
      if (newChild === trie) {
        return self;
      } else {
        return {
                bitmap: bitmap,
                data: JsArray.cloneAndSet(data, idx, {
                      TAG: /* BitmapIndexed */0,
                      _0: newChild
                    })
              };
      }
    }
    var match$1 = child._0;
    var v = match$1[1];
    var k = match$1[0];
    if (Caml_obj.caml_equal(k, key)) {
      if (Caml_obj.caml_equal(v, value)) {
        return self;
      } else {
        return {
                bitmap: bitmap,
                data: JsArray.cloneAndSet(data, idx, {
                      TAG: /* MapEntry */1,
                      _0: [
                        k,
                        v
                      ]
                    })
              };
      }
    }
    var leaf = makeNode(shift, hasher, Curry._1(hasher, k), k, v, hash, key, value);
    return {
            bitmap: bitmap,
            data: JsArray.cloneAndSet(data, idx, {
                  TAG: /* BitmapIndexed */0,
                  _0: leaf
                })
          };
  }
  var n = ctpop(bitmap);
  var ar = Array(n + 1 | 0);
  JsArray.blit(data, 0, ar, 0, idx);
  ar[idx] = {
    TAG: /* MapEntry */1,
    _0: [
      key,
      value
    ]
  };
  JsArray.blit(data, idx, ar, idx + 1 | 0, n - idx | 0);
  return {
          bitmap: bitmap | bit,
          data: ar
        };
}

function makeNode(shift, hasher, h1, k1, v1, h2, k2, v2) {
  if (h1 === h2) {
    throw {
          RE_EXN_ID: "Assert_failure",
          _1: [
            "Hamt.res",
            145,
            4
          ],
          Error: new Error()
        };
  }
  return assoc(assoc({
                  bitmap: 0,
                  data: []
                }, shift + 5 | 0, hasher, h1, k1, v1), shift + 5 | 0, hasher, h2, k2, v2);
}

function dissoc(self, shift, hash, key) {
  var data = self.data;
  var bitmap = self.bitmap;
  var bit = bitpos(hash, shift);
  var match = bitmap & bit;
  if (match === 0) {
    return self;
  }
  var idx = indexAtBitmapTrie(bitmap, bit);
  var child = data[idx];
  if (child.TAG !== /* BitmapIndexed */0) {
    if (Caml_obj.caml_equal(child._0[0], key)) {
      if (bitmap === bit) {
        return ;
      } else {
        return {
                bitmap: bitmap ^ bit,
                data: JsArray.cloneWithout(data, idx)
              };
      }
    } else {
      return self;
    }
  }
  var trie = child._0;
  var newChild = dissoc(trie, shift + 5 | 0, hash, key);
  if (newChild !== undefined) {
    if (newChild === trie) {
      return self;
    } else {
      return {
              bitmap: bitmap,
              data: JsArray.cloneAndSet(data, idx, {
                    TAG: /* BitmapIndexed */0,
                    _0: newChild
                  })
            };
    }
  } else if (bitmap === bit) {
    return ;
  } else {
    return {
            bitmap: bitmap ^ bit,
            data: JsArray.cloneWithout(data, idx)
          };
  }
}

var BitmapIndexed = {
  make: make,
  ctpop: ctpop,
  mask: mask,
  bitpos: bitpos,
  indexAtBitmapTrie: indexAtBitmapTrie,
  find: find,
  assoc: assoc,
  makeNode: makeNode,
  dissoc: dissoc
};

var A;

var numBits = 5;

var maskBits = 31;

export {
  A ,
  numBits ,
  maskBits ,
  BitmapIndexed ,
  
}
/* No side effect */
