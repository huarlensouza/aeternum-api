import Database from "../lib/Database"

export default {
    getId: async() => {
        return new Promise(async(resolve, reject) => {
            Database.connect( err => {
                if (err) throw err;
                Database.query('SELECT * FROM aeternum.campeonato WHERE ativo = 1', async(err, registro) => {
                    if (err) throw err;
                    return resolve(registro);
                });
            });
        });
    }
}