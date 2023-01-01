import Database from "../lib/Database"

export default {
    getOpen: async() => {
        return new Promise(async(resolve, reject) => {
            try {
                Database.connect( err => {
                    if (err) {
                        console.log(err);
                        return reject(err);
                    };

                    Database.query('SELECT id, description, register, date FROM championships WHERE register = 1', async(err, championship) => {
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
                Database.connect( err => {
                    if (err) {
                        console.log(err);
                        return reject(err);
                    };

                    Database.query('SELECT id FROM championships WHERE register = 1', async(err, championship) => {
                        if (err) {
                            console.log(err);
                            return reject(err);
                        };
                        return resolve(championship[0].id);
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
                Database.connect( err => {
                    if (err) {
                        console.log(err);
                        return reject(err);
                    };
                    Database.query('SELECT COUNT(id) AS "boolean" FROM championships WHERE register = 1', async(err, championship) => {
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