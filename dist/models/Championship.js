"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _Database = require('../lib/Database'); var _Database2 = _interopRequireDefault(_Database);

exports. default = {
    getOpen: async() => {
        return new Promise(async(resolve, reject) => {
            try {
                _Database2.default.connect( err => {
                    if (err) {
                        console.log(err);
                        return reject(err);
                    };

                    _Database2.default.query('SELECT id, description, register, date FROM championships WHERE register = 1', async(err, championship) => {
                        if (err) {
                            console.log(err);
                            return reject(err);
                        };

                        return resolve(championship[0]);
                    });
                });
            } catch(e) {
                return reject(e);
            };
        });
    }
    ,
    getId: async() => {
        return new Promise(async(resolve, reject) => {
            try {
                _Database2.default.connect( err => {
                    if (err) {
                        console.log(err);
                        return reject(err);
                    };

                    _Database2.default.query('SELECT id FROM championships WHERE register = 1', async(err, championship) => {
                        if (err) {
                            console.log(err);
                            return reject(err);
                        };
                        return resolve(championship.length > 0 ? championship[0].id : false);
                    });
                });
            } catch(e) {
                return reject(e);
            };
        });
    },
    isOpen: async() => {
        return new Promise(async(resolve, reject) => {
            try {
                _Database2.default.connect( err => {
                    if (err) {
                        console.log(err);
                        return reject(err);
                    };
                    _Database2.default.query('SELECT COUNT(id) AS "boolean" FROM championships WHERE register = 1', async(err, championship) => {
                        if (err) {
                            console.log(err);
                            return reject(err);
                        };
                        return resolve(championship[0].boolean > 0 ? true : false);
                    });
                });
            } catch(e) {
                return reject(e);
            };
        });
    }
}