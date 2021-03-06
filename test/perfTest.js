"use strict";

var common = require("./common.js")
  , odbc = require("../")
  , db = new odbc.Database()
  , iterations = 100000
  ;

db.open(common.connectionString, function(err){
  if (err) {
    console.error(err);
    process.exit(1);
  }

  issueQuery2(function () {
    finish();
  });
});

function issueQuery2(done) {
  var count = 0
    , time = new Date().getTime();

  var stmt = db.prepareSync('select cast(? as integer) as test FROM SYSIBM.SYSDUMMY1');

  for (var x = 0; x < iterations; x++) {
    (function (x) {
      stmt.executeNonQuery([x], cb);
    })(x);
  }

  function cb (err, data) {

    if (err) {
      console.error(err);
      return finish();
    }

    if (++count == iterations) {
      var elapsed = new Date().getTime() - time;

      console.log("%d queries issued in %d seconds, %d/sec : Prepare - ExecuteNonQuery ", count, elapsed/1000, Math.floor(count/(elapsed/1000)));
      return done();
    }
  }
}

function finish() {
  db.close(function () {
    console.log("connection closed");
  });
}

