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
            'I need a hero',
            'Final Countdown',
            'Sur la planche',
            'Hey you',
            "What's my age again",
            'Od Skra',
            'All that she wants'
        ];

        self._all_characters = [
            {
                'id': 1,
                'name': 'Tagol',
                'special_attack': 'Blast de grosse caisse',
                'hp': 100,
                'max_hp': 100,
                'img': '/static/img/tg.png'
            },
            {
                'id': 2,
                'name': 'Chawee',
                'special_attack': 'Faire le chat',
                'hp': 100,
                'max_hp': 100,
                'img': '/static/img/chawee.png'
            },
            {
                'id': 3,
                'name': 'Rufa',
                'special_attack': 'Trombone Rules!',
                'hp': 100,
                'max_hp': 100,
                'img': '/static/img/rufa.png'
            },
            {
                'id': 4,
                'name': 'Moruna',
                'special_attack': 'Boobattack',
                'hp': 100,
                'max_hp': 100,
                'img': '/static/img/moruna.png'
            },
            {
                'id': 5,
                'name': 'Chapoune',
                'special_attack': 'Degeulissimo triple forte',
                'hp': 100,
                'max_hp': 100,
                'img': '/static/img/chapon.png'
            },
            {
                'id': 6,
                'name': 'Prary',
                'special_attack': "Jouer avec un accent af'icain",
                'hp': 100,
                'max_hp': 100,
                'img': '/static/img/prairie.png'
            },
            {
                'id': 7,
                'name': 'Couscous',
                'special_attack': 'Punch du président !',
                'hp': 100,
                'max_hp': 100,
                'img': '/static/img/couscous.png'
            },
            {
                'id': 8,
                'name': 'Phiniwn',
                'special_attack': 'Rhum arrangé au piment',
                'hp': 100,
                'max_hp': 100,
                'img': '/static/img/phiniwn.png'
            },
            {
                'id': 9,
                'name': 'Mapax',
                'special_attack': 'Uppercut!',
                'hp': 100,
                'max_hp': 100,
                'img': '/static/img/bite.png'
            },
            {
                'id': 10,
                'name': 'Kapok',
                'special_attack': 'Frapper à contre temps',
                'hp': 100,
                'max_hp': 100,
                'img': '/static/img/bite.png'
            },
            {
                'id': 11,
                'name': 'Maitresse',
                'special_attack': 'Des bisous !',
                'hp': 100,
                'max_hp': 100,
                'img': '/static/img/maitresse.png'
            },
            {
                'id': 12,
                'name': 'Neutron',
                'special_attack': 'Seringue usagée de MSF',
                'hp': 100,
                'max_hp': 100,
                'img': '/static/img/bite.png'
            },
            {
                'id': 13,
                'name': 'Boliane',
                'special_attack': 'Jouer de la banda !',
                'hp': 100,
                'max_hp': 100,
                'img': '/static/img/bite.png'
            },
            {
                'id': 14,
                'name': 'Zlip',
                'special_attack': 'Solo de basse canadienne',
                'hp': 100,
                'max_hp': 100,
                'img': '/static/img/zlip.png'
            },
            {
                'id': 15,
                'name': 'K',
                'special_attack': 'Armoire bancale !',
                'hp': 100,
                'max_hp': 100,
                'img': '/static/img/bite.png'
            },
            {
                'id': 16,
                'name': 'Bavette',
                'special_attack': 'Suivez le doigt !',
                'hp': 100,
                'max_hp': 100,
                'img': '/static/img/bavette.png'
            },
            {
                'id': 17,
                'name': 'Bruna',
                'special_attack': 'Boulettes de vin rouge brésilien',
                'hp': 100,
                'max_hp': 100,
                'img': '/static/img/bite.png'
            },
            {
                'id': 18,
                'name': 'Medor',
                'special_attack': 'Meuler comme un porc',
                'hp': 100,
                'max_hp': 100,
                'img': '/static/img/bite.png'
            },
            {
                'id': 19,
                'name': 'Brazik',
                'special_attack': 'Faire le beau gosse',
                'hp': 100,
                'max_hp': 100,
                'img': '/static/img/bite.png'
            },
            {
                'id': 20,
                'name': 'Kiche',
                'special_attack': 'Motorboat',
                'hp': 100,
                'max_hp': 100,
                'img': '/static/img/bite.png'
            },
            {
                'id': 21,
                'name': "Grap'",
                'special_attack': 'Encourager le CUC !',
                'hp': 100,
                'max_hp': 100,
                'img': '/static/img/bite.png'
            },
            {
                'id': 22,
                'name': 'GSM',
                'special_attack': 'Boire des queues de charrue',
                'hp': 100,
                'max_hp': 100,
                'img': '/static/img/bite.png'
            },
            {
                'id': 23,
                'name': 'Antigel',
                'special_attack': 'Attaque fourbe depuis Annecy',
                'hp': 100,
                'max_hp': 100,
                'img': '/static/img/bite.png'
            }
        ];

        self.play_a_song = function () {
            // TODO: actually play the song
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