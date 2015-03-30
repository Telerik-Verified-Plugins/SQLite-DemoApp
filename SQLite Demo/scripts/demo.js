(function (global) {
    var DemoViewModel,
        app = global.app = global.app || {};

    var db = null;
    
    DemoViewModel = kendo.data.ObservableObject.extend({

        openDatabase: function () {
            if (!this.checkSimulator()) {
            	db = window.sqlitePlugin.openDatabase(
                    // options
                    {
                      name: "demo.db",
                      location: 1 // for iOS, see the doc for details
                    },
                    // success callback
                    function (msg) {
                        alert("success: " + JSON.stringify(msg));
                    },
                    // error callback
                    function (msg) {
                        alert("error: " + msg);
                    }
                );
            }
        },

        dropTable: function () {
            if (!this.checkSimulator()) {
                if (this.checkOpenedDatabase()) {
                    db.transaction(function(tx) {
                        tx.executeSql(
                            'DROP TABLE test',
                            [],
                            function(tx, res) {
                                alert('Table deleted');
                            },
                            // note: gets called when deleting table without having inserted rows,
                            //       to avoid this error use: 'DROP TABLE IF EXISTS test'
                            function(tx, res) {
                                alert('error: ' + res.message);
                            }
                        );
                    });
                }
            }
        },

        insertRecord: function () {
            if (!this.checkSimulator()) {
                if (this.checkOpenedDatabase()) {
                    db.transaction(function(tx) {
                        tx.executeSql("CREATE TABLE IF NOT EXISTS test (id integer primary key, data text, data_num integer)");
                        tx.executeSql(
                            "INSERT INTO test (data, data_num) VALUES (?,?)",
                            ["test", 100],
                            function(tx, res) {
                                alert("insertId: " + res.insertId + ", rows affected: " + res.rowsAffected);
	                        },
                            function(tx, res) {
                                alert('error: ' + res.message);
                            });
                    });
                }
            }
        },

        readRecords: function () {
            if (!this.checkSimulator()) {
                if (this.checkOpenedDatabase()) {
                    db.transaction(function(tx) {
                        tx.executeSql(
                            "select * from test;",
                            [],
                            function(tx, res) {
                                for (var i=0; i<res.rows.length; i++) {
                                    var row = res.rows.item(i);
                                    alert(
                                      "row " + i + ":\n" +
                                      " - id = " +  row.id + "\n" +
                                      " - data = " +  row.data + "\n" +
                                      " - data_num = " +  row.data_num
                                    );
                                }
                            },
                            function(tx, res) {
                                alert('error: ' + res.message);
                            });
                    });
                }
            }
        },

        countRecords: function () {
            if (!this.checkSimulator()) {
                if (this.checkOpenedDatabase()) {
                    db.transaction(function(tx) {
                        tx.executeSql(
                            "select count(id) as cnt from test;",
                            [],
                            function(tx, res) {
                                alert("rows: " + res.rows.item(0).cnt);
                            },
                            function(tx, res) {
                                alert('error: ' + res.message);
                            });
                    });
                }
            }
        },

        checkOpenedDatabase: function() {
            if (db == null) {
                // wrapping in a timeout so the button doesn't stay in 'pressed' state
                setTimeout(function() {
                    alert("open the database first");
                });
                return false;
            }
            return true;
        },

        checkSimulator: function() {
            if (window.navigator.simulator === true) {
                alert('This plugin is not available in the simulator.');
                return true;
            } else if (window.sqlitePlugin === undefined) {
                alert('Plugin not found. Maybe you are running in AppBuilder Companion app which currently does not support this plugin.');
                return true;
            } else {
                return false;
            }
        }

    });

    app.demoService = {
        viewModel: new DemoViewModel()
    };
})(window);