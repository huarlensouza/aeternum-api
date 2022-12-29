import Database from '../lib/Database'

export default {
    register: async(value) => {
        return new Promise(async(resolve, reject) => {
            Database.connect( err => {
                if (err) throw err;
                Database.query('SELECT * FROM aeternum.cadastro WHERE email = (?) AND id_championship = (SELECT id FROM aeternum.campeonato WHERE ativo = 1)', [value], async(err, registro) => {
                    if (err) throw err;
    
                    if(registro.length > 0) {
                        return resolve(true)
                    }

                    return resolve(false);
                });
            });
        });
    }
};