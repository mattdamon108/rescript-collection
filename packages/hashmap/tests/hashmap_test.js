// Generated by ReScript, PLEASE EDIT WITH CARE

import * as HashMap_String from "../src/HashMap_String.js";

var m = HashMap_String.fromArray([
      [
        "a",
        1
      ],
      [
        "b",
        2
      ]
    ]);

if (HashMap_String.size(HashMap_String.set(m, "a", 2)) !== 2) {
  throw {
        RE_EXN_ID: "Assert_failure",
        _1: [
          "hashmap_test.res",
          5,
          0
        ],
        Error: new Error()
      };
}

var M;

export {
  M ,
  m ,
  
}
/* m Not a pure module */
