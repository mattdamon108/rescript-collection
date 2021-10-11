// Generated by ReScript, PLEASE EDIT WITH CARE

import * as Hamt from "./impl/Hamt.js";
import * as Hash from "./impl/Hash.js";
import * as Belt_Array from "@rescript/std/lib/es6/belt_Array.js";

function get(param, k) {
  return Hamt.find(param.root, 0, Hash.hashString(k), k);
}

function set(m, k, v) {
  var root$p = Hamt.assoc(m.root, 0, Hash.hashString, Hash.hashString(k), k, v);
  if (root$p !== undefined) {
    return {
            root: root$p,
            count: m.count + 1 | 0
          };
  } else {
    return m;
  }
}

function remove(m, k) {
  var root$p = Hamt.dissoc(m.root, 0, Hash.hashString(k), k);
  if (root$p !== undefined) {
    return {
            root: root$p,
            count: m.count - 1 | 0
          };
  } else {
    return m;
  }
}

function size(m) {
  return m.count;
}

function fromArray(ar) {
  var empty_root = Hamt.empty(undefined);
  var empty = {
    root: empty_root,
    count: 0
  };
  return Belt_Array.reduceU(ar, empty, (function (m, param) {
                return set(m, param[0], param[1]);
              }));
}

export {
  get ,
  set ,
  remove ,
  size ,
  fromArray ,
  
}
/* Hash Not a pure module */
