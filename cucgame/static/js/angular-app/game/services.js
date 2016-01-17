angular.module('game')
    .factory('GameManager', GameManager);


function GameManager($q, Character) {
    "use strict";
    var _GameManager = function () {
        var self = this;

        self.counter_default = {
            'play_a_song': 5,
            'drink_a_beer': 2,
            'take_a_piss': 0,
            'tune': 0,
            'special_attack': 1
        };

        self._all_songs = [
            'CUC',
            'Marcia Baila',
            'I knew you were trouble',
            'Hit That',
            'Reptilia',
            'Dejeuner en paix',
            'Retour vers le futur',
            'Lumpy Gravy',
            'Chick Habit',
            'La Foule',
            'Final Countdown',
            'Sur la planche',
            'All that she wants'
        ];

        self._all_characters = [
            {
                'id': 1,
                'name': 'Tagol',
                'img': 1,
                'special_attack': 'Blast de grosse caisse',
                'hp': 100,
                'max_hp': 100,
            },
            {
                'id': 2,
                'name': 'Chawee',
                'img': 2,
                'special_attack': 'Faire le chat',
                'hp': 100,
                'max_hp': 100,
            },
            {
                'id': 3,
                'name': 'Rufa',
                'img': 2,
                'special_attack': 'Trombone Rules!',
                'hp': 100,
                'max_hp': 100,
            },
            {
                'id': 4,
                'name': 'Moruna',
                'img': 2,
                'special_attack': 'Boobattack',
                'hp': 100,
                'max_hp': 100,
            },
            {
                'id': 5,
                'name': 'Chapoune',
                'img': 2,
                'special_attack': 'Degeulissimo triple forte',
                'hp': 100,
                'max_hp': 100,
            },
            {
                'id': 6,
                'name': 'Prary',
                'img': 2,
                'special_attack': "Jouer avec un accent af'icain",
                'hp': 100,
                'max_hp': 100,
            },
            {
                'id': 7,
                'name': 'Couscous',
                'img': 2,
                'special_attack': 'Punch du président !',
                'hp': 100,
                'max_hp': 100,
            },
            {
                'id': 8,
                'name': 'Phiniwn',
                'img': 2,
                'special_attack': 'Rhum arrangé au piment',
                'hp': 100,
                'max_hp': 100,
            },
            {
                'id': 9,
                'name': 'Mapax',
                'img': 2,
                'special_attack': 'Uppercut!',
                'hp': 100,
                'max_hp': 100,
            },
            {
                'id': 10,
                'name': 'Kapok',
                'img': 2,
                'special_attack': 'Frapper à contre temps',
                'hp': 100,
                'max_hp': 100,
            },
            {
                'id': 11,
                'name': 'Maitresse',
                'img': 2,
                'special_attack': 'Des bisous !',
                'hp': 100,
                'max_hp': 100,
            },
            {
                'id': 12,
                'name': 'Neutron',
                'img': 2,
                'special_attack': 'Seringue usagée de MSF',
                'hp': 100,
                'max_hp': 100,
            },
            {
                'id': 13,
                'name': 'Boliane',
                'img': 2,
                'special_attack': 'Jouer de la banda !',
                'hp': 100,
                'max_hp': 100,
            },
            {
                'id': 14,
                'name': 'Zlip',
                'img': 2,
                'special_attack': 'Solo de basse canadienne',
                'hp': 100,
                'max_hp': 100,
            },
            {
                'id': 15,
                'name': 'K',
                'img': 2,
                'special_attack': 'Armoire bancale !',
                'hp': 100,
                'max_hp': 100,
            },
            {
                'id': 16,
                'name': 'Bavette',
                'img': 2,
                'special_attack': 'Suivez le doigt !',
                'hp': 100,
                'max_hp': 100,
            },
            {
                'id': 17,
                'name': 'Bruna',
                'img': 2,
                'special_attack': 'Boulettes de vin rouge brésilien',
                'hp': 100,
                'max_hp': 100,
            },
            {
                'id': 18,
                'name': 'Medor',
                'img': 2,
                'special_attack': 'Meuler comme un porc',
                'hp': 100,
                'max_hp': 100,
            },
            {
                'id': 19,
                'name': 'Brazik',
                'img': 2,
                'special_attack': 'Faire le beau gosse',
                'hp': 100,
                'max_hp': 100,
            },
            {
                'id': 20,
                'name': 'Kiche',
                'img': 2,
                'special_attack': 'Motorboat',
                'hp': 100,
                'max_hp': 100,
            },
            {
                'id': 21,
                'name': "Grap'",
                'img': 2,
                'special_attack': 'Encourager le CUC !',
                'hp': 100,
                'max_hp': 100,
            },
            {
                'id': 22,
                'name': 'GSM',
                'img': 2,
                'special_attack': 'Boire des queues de charrue',
                'hp': 100,
                'max_hp': 100,
            },
        ];

        self.play_a_song = function () {
            // actually play the song
            return Math.round(30 * Math.random());
        };

        self.drink_a_beer = function () {
            return - Math.round(30 * Math.random());
        };

        self.take_a_piss = function () {
            return 0;
        };

        self.tune = function () {
            return 0;
        };

        self.special_attack = function () {
            return Math.round(50 * Math.random());
        };

    };

    var gm = new _GameManager();
    return gm;

}
GameManager.$inject = ['$q', 'Character'];