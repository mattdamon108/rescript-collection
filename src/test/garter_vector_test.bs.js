// Generated by ReScript, PLEASE EDIT WITH CARE
'use strict';

var Belt_Array = require("bs-platform/lib/js/belt_Array.js");
var Garter_Vector = require("../Garter_Vector.bs.js");

if (Garter_Vector.length(Garter_Vector.make(undefined)) !== 0) {
  throw {
        RE_EXN_ID: "Assert_failure",
        _1: [
          "garter_vector_test.re",
          4,
          0
        ],
        Error: new Error()
      };
}

if (Garter_Vector.length(Garter_Vector.fromArray(Belt_Array.range(1, 13))) !== 13) {
  throw {
        RE_EXN_ID: "Assert_failure",
        _1: [
          "garter_vector_test.re",
          17,
          0
        ],
        Error: new Error()
      };
}

var n = 13;

exports.n = n;
/*  Not a pure module */
