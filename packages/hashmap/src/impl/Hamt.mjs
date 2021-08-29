// Generated by ReScript, PLEASE EDIT WITH CARE

import * as Curry from "@rescript/std/lib/es6/curry.js";
import * as JsArray from "./JsArray.mjs";
import * as Caml_obj from "@rescript/std/lib/es6/caml_obj.js";
import * as Caml_option from "@rescript/std/lib/es6/caml_option.js";

function make(hash, entries) {
  return {
          hash: hash,
          entries: entries
        };
}

function findIndex(param, key) {
  return param.entries.findIndex(function (param) {
              return Caml_obj.caml_equal(param[0], key);
            });
}

function find(param, key) {
  var match = param.entries.find(function (param) {
        return Caml_obj.caml_equal(param[0], key);
      });
  if (match !== undefined) {
    return Caml_option.some(match[1]);
  }
  
}

function assoc(self, key, value) {
  var idx = findIndex(self, key);
  if (idx === -1) {
    return {
            hash: self.hash,
            entries: JsArray.cloneAndAdd(self.entries, [
                  key,
                  value
                ])
          };
  } else {
    return self;
  }
}

function dissoc(self, key) {
  var entries = self.entries;
  var idx = findIndex(self, key);
  if (idx === -1) {
    return self;
  } else if (entries.length === 1) {
    return ;
  } else {
    return {
            hash: self.hash,
            entries: JsArray.cloneWithout(entries, idx)
          };
  }
}

var HashCollision = {
  make: make,
  findIndex: findIndex,
  find: find,
  assoc: assoc,
  dissoc: dissoc
};

function make$1(bitmap, data) {
  return {
          bitmap: bitmap,
          data: data
        };
}

function ctpop(v) {
  var v$1 = v - ((v >>> 1) & 1431655765) | 0;
  var v$2 = (v$1 & 858993459) + ((v$1 >>> 2) & 858993459) | 0;
  var v$3 = v$2 + (v$2 >>> 4) & 252645135;
  return (Math.imul(v$3, 16843009) >>> 24);
}

function mask(hash, shift) {
  return (hash >>> shift) & 3;
}

function bitpos(hash, shift) {
  return (1 << mask(hash, shift));
}

function indexAtBitmapTrie(bitmap, bit) {
  return ctpop(bitmap & (bit - 1 | 0));
}

function find$1(_param, _shift, hash, key) {
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
    switch (child.TAG | 0) {
      case /* BitmapIndexed */0 :
          _shift = shift + 2 | 0;
          _param = child._0;
          continue ;
      case /* MapEntry */1 :
          var match$1 = child._0;
          if (Caml_obj.caml_equal(match$1[0], key)) {
            return Caml_option.some(match$1[1]);
          } else {
            return ;
          }
      case /* HashCollision */2 :
          return find(child._0, key);
      
    }
  };
}

function assoc$1(self, shift, hasher, hash, key, value) {
  var data = self.data;
  var bitmap = self.bitmap;
  var bit = bitpos(hash, shift);
  var idx = indexAtBitmapTrie(bitmap, bit);
  var match = bitmap & bit;
  if (match !== 0) {
    var child = data[idx];
    switch (child.TAG | 0) {
      case /* BitmapIndexed */0 :
          var trie = child._0;
          var newChild = assoc$1(trie, shift + 2 | 0, hasher, hash, key, value);
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
      case /* MapEntry */1 :
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
          var leaf = makeNode(shift + 2 | 0, hasher, Curry._1(hasher, k), k, v, hash, key, value);
          return {
                  bitmap: bitmap,
                  data: JsArray.cloneAndSet(data, idx, leaf)
                };
      case /* HashCollision */2 :
          var node = child._0;
          if (node.hash === hash) {
            var newChild$1 = assoc(node, key, value);
            if (newChild$1 === node) {
              return self;
            } else {
              return {
                      bitmap: bitmap,
                      data: JsArray.cloneAndSet(data, idx, {
                            TAG: /* HashCollision */2,
                            _0: newChild$1
                          })
                    };
            }
          }
          var newChild$2 = assoc$1({
                bitmap: bitpos(node.hash, shift + 2 | 0),
                data: [{
                    TAG: /* HashCollision */2,
                    _0: node
                  }]
              }, shift + 2 | 0, hasher, hash, key, value);
          return {
                  bitmap: bitmap,
                  data: JsArray.cloneAndSet(data, idx, {
                        TAG: /* BitmapIndexed */0,
                        _0: newChild$2
                      })
                };
      
    }
  } else {
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
}

function makeNode(shift, hasher, h1, k1, v1, h2, k2, v2) {
  if (h1 === h2) {
    return {
            TAG: /* HashCollision */2,
            _0: {
              hash: h1,
              entries: [
                [
                  k1,
                  v1
                ],
                [
                  k2,
                  v2
                ]
              ]
            }
          };
  } else {
    return {
            TAG: /* BitmapIndexed */0,
            _0: assoc$1(assoc$1({
                      bitmap: 0,
                      data: []
                    }, shift, hasher, h1, k1, v1), shift, hasher, h2, k2, v2)
          };
  }
}

function dissoc$1(self, shift, hash, key) {
  var data = self.data;
  var bitmap = self.bitmap;
  var bit = bitpos(hash, shift);
  var match = bitmap & bit;
  if (match === 0) {
    return self;
  }
  var idx = indexAtBitmapTrie(bitmap, bit);
  var child = data[idx];
  switch (child.TAG | 0) {
    case /* BitmapIndexed */0 :
        var trie = child._0;
        var newChild = dissoc$1(trie, shift + 2 | 0, hash, key);
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
        } else {
          return unset(self, bit, idx);
        }
    case /* MapEntry */1 :
        if (Caml_obj.caml_equal(child._0[0], key)) {
          return unset(self, bit, idx);
        } else {
          return self;
        }
    case /* HashCollision */2 :
        var node = child._0;
        var newChild$1 = dissoc(node, key);
        if (newChild$1 !== undefined) {
          if (newChild$1 === node) {
            return self;
          } else {
            return {
                    bitmap: bitmap,
                    data: JsArray.cloneAndSet(data, idx, {
                          TAG: /* HashCollision */2,
                          _0: newChild$1
                        })
                  };
          }
        } else {
          return unset(self, bit, idx);
        }
    
  }
}

function unset(param, bit, idx) {
  var bitmap = param.bitmap;
  if (bitmap === bit) {
    return ;
  } else {
    return {
            bitmap: bitmap ^ bit,
            data: JsArray.cloneWithout(param.data, idx)
          };
  }
}

var BitmapIndexed = {
  make: make$1,
  ctpop: ctpop,
  mask: mask,
  bitpos: bitpos,
  indexAtBitmapTrie: indexAtBitmapTrie,
  find: find$1,
  assoc: assoc$1,
  makeNode: makeNode,
  dissoc: dissoc$1,
  unset: unset
};

var A;

var numBits = 2;

var maskBits = 3;

export {
  A ,
  numBits ,
  maskBits ,
  HashCollision ,
  BitmapIndexed ,
  
}
/* No side effect */
