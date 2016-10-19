angular.module("game")
    .factory("GameAudio", GameAudio)
    .factory("GameUI", GameUI)
    .factory("GameManager", GameManager)
    .factory("GameLogger", GameLogger);


// handles the audio commands
function GameAudio () {
    "use strict";
    var self = {};

    self.flags = {
        isPlaying: true  // because "autoplay"
    };

    var getAudioPlayer = function () {
        return document.getElementsByTagName('audio')[0];
    };

    self.stopAudio = function () {
        var audioPlayer = getAudioPlayer();
        audioPlayer.pause();
        self.flags.isPlaying = false;
    };

    self.playAudio = function () {
        var audioPlayer = getAudioPlayer();
        audioPlayer.play();
        self.flags.isPlaying = true;
    };

    return self;
}
GameAudio.$inject = [];


function GameUI ($timeout) {
    "use strict";
    var self = {};

    self.dimVideoAndDiv = function () {
        var row, videoElt, heightVideo, playerInVideo, enemyInVideo;
        $timeout(function () {
            row = angular.element(document.getElementById('main-row'))[0];
            videoElt = angular.element(document.getElementById('video-background'))[0];
            videoElt.setAttribute("style","width:" + row.offsetWidth + "px");
            heightVideo = videoElt.offsetHeight + 10;
            playerInVideo = angular.element(document.getElementById('playerInVideo'))[0];
            enemyInVideo = angular.element(document.getElementById('enemyInVideo'))[0];
            playerInVideo.setAttribute("style","min-height:" + heightVideo + "px");
            enemyInVideo.setAttribute("style","min-height:" + heightVideo + "px");
        }, 100);
        $timeout(function () {
            // image height so that feets are on the floor.
            var textHeight = angular.element(document.getElementById('textInVideoPlayer'))[0].offsetHeight;
            // 16/23 is the ratio taken by the ring on the image
            var newHeight = Math.round((heightVideo - 10) * (16/23) - textHeight) + 'px';

            angular.element(document.getElementById('player'))[0].setAttribute('style', 'height:'  + newHeight);
            angular.element(document.getElementById('playerImg'))[0].setAttribute('style', 'height:'  + newHeight);
            angular.element(document.getElementById('enemy'))[0].setAttribute('style', 'height:'  + newHeight);
            angular.element(document.getElementById('enemyImg'))[0].setAttribute('style', 'height:'  + newHeight);
        }, 100);
    };

    self.cleanClassPlayer = function (player) {
        var selector = "#" + player;
        angular.element(document.querySelector(selector)).removeClass('shake').removeClass('tada');
    };

    self.cleanClass = function () {
        self.cleanClassPlayer('enemy');
        self.cleanClassPlayer('player');
    };

    self.addStartAnimation = function () {
        angular.element(document.querySelector('#player')).addClass('fadeInLeft');
        angular.element(document.querySelector('#enemy')).addClass('fadeInRight');
    };

    self.cleanStartAnimation = function () {
        angular.element(document.querySelector('#player')).removeClass('fadeInLeft');
        angular.element(document.querySelector('#enemy')).removeClass('fadeInRight');
    };

    return self;
}
GameUI.$inject = ['$timeout'];


function GameManager(Character) {
    "use strict";
    var MyGameManager = function () {
        var self = this;

        self.init_player = function (character) {
            character.hp = character.max_hp;
            character.counter_default = angular.copy(self.counter_default);
        };

        self.counter_default = {
            "play_a_song": 5,
            "drink_a_beer": 2,
            "take_a_piss": 0,
            "tune": 0,
            "special_attack": 1
        };

        self._all_songs = [
            "CUC",
            "Marcia Baila",
            "I knew you were trouble",
            "Hit That",
            "Reptilia",
            "Dejeuner en paix",
            "Retour vers le futur",
            "Lumpy Gravy",
            "Chick Habit",
            "La Foule",
            "I need a hero",
            "Final Countdown",
            "Sur la planche",
            "Hey you",
            "What's my age again",
            "Od Skra",
            "All that she wants",
            "Simonarium",
            "Santeria",
            "Goletta",
            "Happy",
            "Counting Stars"
        ];

        self._all_characters = [
            {
                "id": 1,
                "name": "Tagol",
                "special_attack": "Blast de grosse caisse",
                "hp": 100,
                "max_hp": 100,
                "orientation": "left",
                "img": "/static/img/tg.png"
            },
            {
                "id": 2,
                "name": "Chawee",
                "special_attack": "Faire le chat",
                "hp": 100,
                "max_hp": 100,
                "orientation": "right",
                "img": "/static/img/chawee.png"
            },
            {
                "id": 3,
                "name": "Rufa",
                "special_attack": "Trombone Rules!",
                "hp": 100,
                "max_hp": 100,
                "orientation": "left",
                "img": "/static/img/rufa.png"
            },
            {
                "id": 4,
                "name": "Moruna",
                "special_attack": "Boobattack",
                "hp": 100,
                "max_hp": 100,
                "orientation": "right",
                "img": "/static/img/moruna.png"
            },
            {
                "id": 5,
                "name": "Chapoune",
                "special_attack": "Degeulissimo triple forte",
                "hp": 100,
                "max_hp": 100,
                "orientation": "left",
                "img": "/static/img/chapon.png"
            },
            {
                "id": 6,
                "name": "Prary",
                "special_attack": "Jouer avec un accent af'icain",
                "hp": 100,
                "max_hp": 100,
                "orientation": "right",
                "img": "/static/img/prairie.png"
            },
            {
                "id": 7,
                "name": "Couscous",
                "special_attack": "Punch du président !",
                "hp": 100,
                "max_hp": 100,
                "orientation": "left",
                "img": "/static/img/couscous.png"
            },
            {
                "id": 8,
                "name": "Phiniwn",
                "special_attack": "Rhum arrangé au piment",
                "hp": 100,
                "max_hp": 100,
                "orientation": "right",
                "img": "/static/img/phiniwn.png"
            },
            {
                "id": 9,
                "name": "Menon",
                "special_attack": "Uppercut!",
                "hp": 100,
                "max_hp": 100,
                "orientation": "right",
                "img": "/static/img/menon.png"
            },
            {
                "id": 10,
                "name": "Kapok",
                "special_attack": "Frapper à contre temps",
                "hp": 100,
                "max_hp": 100,
                "orientation": "right",
                "img": "/static/img/kapok.png"
            },
            {
                "id": 11,
                "name": "Maitresse",
                "special_attack": "Des bisous !",
                "hp": 100,
                "max_hp": 100,
                "orientation": "right",
                "img": "/static/img/maitresse.png"
            },
            {
                "id": 12,
                "name": "Neutron",
                "special_attack": "Seringue usagée de MSF",
                "hp": 100,
                "max_hp": 100,
                "orientation": "right",
                "img": "/static/img/neutron.png"
            },
            {
                "id": 13,
                "name": "Boliane",
                "special_attack": "Jouer de la banda !",
                "hp": 100,
                "max_hp": 100,
                "orientation": "left",
                "img": "/static/img/boliane.png"
            },
            {
                "id": 14,
                "name": "Zlip",
                "special_attack": "Solo de basse canadienne",
                "hp": 100,
                "max_hp": 100,
                "orientation": "right",
                "img": "/static/img/zlip.png"
            },
            {
                "id": 15,
                "name": "K",
                "special_attack": "Armoire bancale !",
                "hp": 100,
                "max_hp": 100,
                "orientation": "right",
                "img": "/static/img/k.png"
            },
            {
                "id": 16,
                "name": "Bavette",
                "special_attack": "Suivez le doigt !",
                "hp": 100,
                "max_hp": 100,
                "orientation": "left",
                "img": "/static/img/bavette.png"
            },
            {
                "id": 17,
                "name": "Pituite",
                "special_attack": "Boulettes de vin rouge brésilien",
                "hp": 100,
                "max_hp": 100,
                "orientation": "right",
                "img": "/static/img/bruna.png"
            },
            {
                "id": 18,
                "name": "Medor",
                "special_attack": "Meuler comme un porc",
                "hp": 100,
                "max_hp": 100,
                "orientation": "right",
                "img": "/static/img/medor.png"
            },
            {
                "id": 19,
                "name": "Brazik",
                "special_attack": "Faire le beau gosse",
                "hp": 100,
                "max_hp": 100,
                "orientation": "right",
                "img": "/static/img/brazik.png"
            },
            {
                "id": 20,
                "name": "Kiche",
                "special_attack": "Motorboat",
                "hp": 100,
                "max_hp": 100,
                "orientation": "right",
                "img": "/static/img/kiche.png"
            },
            {
                "id": 21,
                "name": "Grap'",
                "special_attack": "Encourager le CUC !",
                "hp": 100,
                "max_hp": 100,
                "orientation": "left",
                "img": "/static/img/grap.png"
            },
            {
                "id": 22,
                "name": "GSM",
                "special_attack": "Boire des queues de charrue",
                "hp": 100,
                "max_hp": 100,
                "orientation": "right",
                "img": "/static/img/gsm.png"
            },
            {
                "id": 23,
                "name": "Antigel",
                "special_attack": "Attaque fourbe depuis Annecy",
                "hp": 100,
                "max_hp": 100,
                "orientation": "right",
                "img": "/static/img/antigel.png"
            },
            {
                "id": 24,
                "name": "Chaboulasse",
                "special_attack": "Attaque Chaboulassssss",
                "hp": 100,
                "max_hp": 100,
                "orientation": "left",
                "img": "/static/img/chaboulasse.png"
            },
            {
                "id": 25,
                "name": "Merci",
                "special_attack": "Attaque Gros Musc'e",
                "hp": 100,
                "max_hp": 100,
                "orientation": "left",
                "img": "/static/img/merci.png"
            },
            {
                "id": 26,
                "name": "Thobbite",
                "special_attack": "Attaque cidre anglais de brooklin",
                "hp": 100,
                "max_hp": 100,
                "orientation": "left",
                "img": "/static/img/thobbite.png"
            },
            {
                "id": 27,
                "name": "Frotie",
                "special_attack": "Attaque rire hystérique !",
                "hp": 100,
                "max_hp": 100,
                "orientation": "left",
                "img": "/static/img/frotie.png"
            },
            {
                "id": 28,
                "name": "He Ben Voilà",
                "special_attack": "Dégustation de digestifs !",
                "hp": 100,
                "max_hp": 100,
                "orientation": "right",
                "img": "/static/img/hebenvoila.png"
            },
            {
                "id": 29,
                "name": "Adapteur",
                "special_attack": "Solo de sauvetage",
                "hp": 100,
                "max_hp": 100,
                "orientation": "left",
                "img": "/static/img/adapteur.png"
            },
            {
                "id": 30,
                "name": "Doofy",
                "special_attack": "Coup de moustache",
                "hp": 100,
                "max_hp": 100,
                "orientation": "left",
                "img": "/static/img/doofy.png"
            },
            {
                "id": 31,
                "name": "Watson",
                "special_attack": "Balékoouilles !",
                "hp": 100,
                "max_hp": 100,
                "orientation": "left",
                "img": "/static/img/watson.png"
            },
            {
                "id": 32,
                "name": "Hakuna",
                "special_attack": "Ondulation tentaculaire",
                "hp": 100,
                "max_hp": 100,
                "orientation": "right",
                "img": "/static/img/hakuna.png"
            },
            {
                "id": 33,
                "name": "Ze Big Dong",
                "special_attack": "Hey hey haaaa",
                "hp": 100,
                "max_hp": 100,
                "orientation": "left",
                "img": "/static/img/zebigdong.png"
            },
            {
                "id": 34,
                "name": "Demi",
                "special_attack": "Force du trouple",
                "hp": 100,
                "max_hp": 100,
                "orientation": "left",
                "img": "/static/img/demi.png"
            },
            {
                "id": 35,
                "name": "Moulinex",
                "special_attack": "Ascenceur émotionnel",
                "hp": 100,
                "max_hp": 100,
                "orientation": "left",
                "img": "/static/img/moulinex.png"
            },
            {
                "id": 36,
                "name": "Ketchup",
                "special_attack": "Besoin d'aide?",
                "hp": 100,
                "max_hp": 100,
                "orientation": "left",
                "img": "/static/img/ketchup.png"
            },
            {
                "id": 37,
                "name": "Pudubec",
                "special_attack": "Enjaillement fatal",
                "hp": 100,
                "max_hp": 100,
                "orientation": "left",
                "img": "/static/img/pudubec.png"
            },
            {
                "id": 38,
                "name": "C++",
                "special_attack": "Nique-tympans",
                "hp": 100,
                "max_hp": 100,
                "orientation": "left",
                "img": "/static/img/cpp.png"
            },
            {
                "id": 39,
                "name": "Flancoco",
                "special_attack": "Tempo Yolo",
                "hp": 100,
                "max_hp": 100,
                "orientation": "left",
                "img": "/static/img/flancoco.png"
            },
            {
                "id": 40,
                "name": "Luigi",
                "special_attack": "Do you feel good?",
                "hp": 100,
                "max_hp": 100,
                "orientation": "left",
                "img": "/static/img/luigi.png"
            },
            {
                "id": 41,
                "name": "Nean",
                "special_attack": "Pouet!",
                "hp": 100,
                "max_hp": 100,
                "orientation": "left",
                "img": "/static/img/nean.png"
            },
            {
                "id": 42,
                "name": "Porci",
                "special_attack": "Pet de cornichon",
                "hp": 100,
                "max_hp": 100,
                "orientation": "left",
                "img": "/static/img/porci.png"
            },
            {
                "id": 43,
                "name": "Fecalum",
                "special_attack": "Fécanon",
                "hp": 100,
                "max_hp": 100,
                "orientation": "left",
                "img": "/static/img/fecalum.png"
            },
            {
                "id": 44,
                "name": "Jet",
                "special_attack": "Dosage colorimétrique à la bière",
                "hp": 100,
                "max_hp": 100,
                "orientation": "left",
                "img": "/static/img/jet.png"
            },
            {
                "id": 45,
                "name": "Ringo",
                "special_attack": "Air trombone",
                "hp": 100,
                "max_hp": 100,
                "orientation": "left",
                "img": "/static/img/ringo.png"
            },
            {
                "id": 46,
                "name": "Quinouille",
                "special_attack": "Rage du mordor",
                "hp": 100,
                "max_hp": 100,
                "orientation": "left",
                "img": "/static/img/quinouille.png"
            },
            {
                "id": 47,
                "name": "Cersei",
                "special_attack": "Triplekiss",
                "hp": 100,
                "max_hp": 100,
                "orientation": "left",
                "img": "/static/img/cersei.png"
            },
            {
                "id": 48,
                "name": "Tchino",
                "special_attack": "Punchline urticante",
                "hp": 100,
                "max_hp": 100,
                "orientation": "right",
                "img": "/static/img/tchino.png"
            },
            {
                "id": 49,
                "name": "Pochère",
                "special_attack": "Sivouplé",
                "hp": 100,
                "max_hp": 100,
                "orientation": "left",
                "img": "/static/img/pochere.png"
            },
            {
                "id": 50,
                "name": "Chtouille",
                "special_attack": "Yeux du démon",
                "hp": 100,
                "max_hp": 100,
                "orientation": "right",
                "img": "/static/img/chtouille.png"
            },
            {
                "id": 51,
                "name": "Philly",
                "special_attack": "Trempette",
                "hp": 100,
                "max_hp": 100,
                "orientation": "left",
                "img": "/static/img/philly.png"
            },
            {
                "id": 52,
                "name": "Cocci",
                "special_attack": "Troll de soirée",
                "hp": 100,
                "max_hp": 100,
                "orientation": "left",
                "img": "/static/img/cocci.png"
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

    var gm = new MyGameManager();
    return gm;

}
GameManager.$inject = ["Character"];

function GameLogger() {
    "use strict";
    var MyGameLogger = function () {
        var self = this;

        self.player = null;
        self.enemy = null;
        self.playerActions = [];
        self.enemyActions = [];

        self.initPlayersAndActions = function (player, enemy) {
            self.player = player;
            self.enemy = enemy;
            self.playerActions = [];
            self.enemyActions = [];
        };

        self.logAction = function (player, target, typeAction, description, damage) {
            var action = {
                typeAction: typeAction,
                description: description,
                damage: damage,
                target: target
            };
            if (player === self.player) {
                self.playerActions.push(action);
            } else if (player === self.enemy) {
                self.enemyActions.push(action);
            }
        };

        self.dump = function () {
            var data = {
                player: self.player,
                enemy: self.enemy,
                playerActions: self.playerActions,
                enemyActions: self.enemyActions
            };
            return JSON.stringify(data);
        };

    };

    var logger = new MyGameLogger();
    return logger;
}
GameLogger.$inject = [];