export default {
    getId: (weapon) => {
        const weapons = {
            "Arco":"1066379903198580797",
            "Bacamarte":"1066379905039859882",
            "Bastão Flamejante":"1066379906365272205",
            "Espada e Escudo":"1066379801721581598",
            "Espada Grande":"1066379902292598824",
            "Lança":"1066379898681311425",
            "Machadão":"1066379900107374592",
            "Machadinha":"1066379897691447306",
            "Manopla de Gelo":"1066379907820683386",
            "Manopla Imaterial":"1066380129238007870",
            "Martelo de Guerra":"1066379901185314957",
            "Mosquete":"1066379904087773184",
            "Rapieira":"1066379896043089941"
        };
    
        return weapons[weapon];
    }
}