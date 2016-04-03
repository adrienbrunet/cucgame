angular.module('game')
    .controller('MainController', MainController)
    .controller('ReplayController', ReplayController);


function MainController($scope, $timeout, $http, GameManager, GameLogger) {
    var self = this;
    var mapping_attack;

    self.isAudioPlaying = true;  // because "autoplay"

    var getAudioPlayer = function () {
        return document.getElementsByTagName('audio')[0];
    };

    self.stopAudio = function () {
        var audioPlayer = getAudioPlayer();
        audioPlayer.pause();
        self.isAudioPlaying = false;
    };

    self.playAudio = function () {
        var audioPlayer = getAudioPlayer();
        audioPlayer.play();
        self.isAudioPlaying = true;
    };

    var dimVideoAndDIv = function () {
        var row, videoElt, heightVideo, playerInVideo, enemyInVideo;
        row = angular.element(document.getElementById('main-row'))[0];
        videoElt = angular.element(document.getElementById('video-background'))[0];
        videoElt.setAttribute("style","width:" + row.offsetWidth + "px");
        heightVideo = videoElt.offsetHeight - 70;
        playerInVideo = angular.element(document.getElementById('playerInVideo'))[0];
        enemyInVideo = angular.element(document.getElementById('enemyInVideo'))[0];
        playerInVideo.setAttribute("style","min-height:" + heightVideo + "px");
        enemyInVideo.setAttribute("style","min-height:" + heightVideo + "px");
    };

    dimVideoAndDIv();

    self.counter_default = GameManager.counter_default;

    self.currentAttack = {'player': undefined, 'enemy': undefined};
    self.progressbar = {'player': "primary", 'enemy': "primary"};

    // Booleans for display purposes
    self.can_play = true;  // hide the action buttons during the "represailles"
    self.hide_everything = true;  // hide the game for "you win/you lost" screen

    self.init_player = function (character) {
        character.hp = character.max_hp;
        character.counter_default = angular.copy(self.counter_default);
    };

    mapping_attack = {
        'play_a_song': GameManager.play_a_song,
        'drink_a_beer': GameManager.drink_a_beer,
        'take_a_piss': GameManager.take_a_piss,
        'tune': GameManager.tune,
        'special_attack': GameManager.special_attack
    };

    self.update_class_progressbar = function (hp) {
        if (hp < 20 && hp > 0) {
            return 'danger';
        } else if (20 <= hp && hp < 40) {
            return 'warning';
        } else {
            return 'primary';
        }
    };

    self.switchPlayer = function (player) {
        if (player == 'player') {
            return 'enemy';
        } else {
            return 'player';
        }
    };

    self.end_game = function (win_or_lose) {
        $timeout(function () {
            self.hide_everything = true;
            self.loser = win_or_lose;
            self.winner = self.switchPlayer(self.loser);
            data = {
                winner: self[self.winner].id,
                loser: self[win_or_lose].id,
                data: GameLogger.dump()
            };
            $http.post('/api/fights/', data);
        }, 1500);
    };

    self.checkHP = function (hp, player_or_enemy) {
         if (hp <= 0) {
            self.end_game(player_or_enemy);
        } else {
            self.progressbar[player_or_enemy] = self.update_class_progressbar(hp);
        }
    };

    $scope.$watch('ctrl.player.hp', function (hp) {
        self.checkHP(hp, 'player');
    }, true);
    $scope.$watch('ctrl.enemy.hp', function (hp) {
        self.checkHP(hp, 'enemy');
    }, true);

    self.command_attack = function (target, attack, current_character) {
        if (angular.isUndefined(current_character)|| current_character === null) {
            current_character = self.player;
        }

        if (current_character === self.player) {
            self.can_play = false;
            self.currentAttack.player = undefined;
            self.currentAttack.enemy = undefined;
        }

        var attack_method = mapping_attack[attack];

        attack_dmg = attack_method();

        var description = self.descriptionAttack(current_character, attack);

        // log attack info
        if (target === self.player) {
            targetName = 'player';
        } else {
            targetName = 'enemy';
        }
        GameLogger.logAction(current_character, targetName, attack, description, attack_dmg);

        result = target.hp - attack_dmg;
        if (result > 100) {
            target.hp = 100;
        } else if (result <= 0) {
            target.hp = result;
            return;
        } else {
            target.hp = result;
        }
        if (target === self.player) {
            if (attack_dmg > 0) {
                angular.element(document.querySelector('#player')).addClass('shake');
            } else if (attack_dmg < 0) {
                angular.element(document.querySelector('#player')).addClass('tada');
            }
        } else {
            if (attack_dmg > 0) {
                angular.element(document.querySelector('#enemy')).addClass('shake');
            } else if (attack_dmg < 0) {
                angular.element(document.querySelector('#enemy')).addClass('tada');
            }
        }

        current_character.counter_default[attack] = current_character.counter_default[attack] - 1;

        self.updateCounter(current_character, attack);

        if (current_character === self.player) {
            $timeout(function () {
                self.random_songs();
                angular.element(document.querySelector('#player')).removeClass('shake').removeClass('tada');
                angular.element(document.querySelector('#enemy')).removeClass('shake').removeClass('tada');
                self.run_enemy_tour();
            }, 800);
        } else {
            self.can_play = true;
        }


    };

    self.descriptionAttack = function (player, attack) {
        // Describe the attack. If the player is the enemy, update the variable so that the ui can display it!
        var description = player.name;
        if (attack === 'special_attack') {
            description += " utilise son attaque spéciale : " + player.special_attack;
        } else if (attack === 'play_a_song') {
            description += " joue " + self.other_song + " !!";
        } else if (attack === 'drink_a_beer') {
            description += " se bourre la gueule et gagne des HP !";
        } else if (attack === 'take_a_piss') {
            description += " pisse un coup !";
        } else if (attack === 'tune') {
            description += " s'accorde (ou fait semblant) avant de rejouer !";
        }

        if (player === self.enemy) {
            self.enemyAttackDescription = description;
        }

        return description;
    };

    self.updateCounter = function (character, attack) {
        if (attack === 'take_a_piss') {
            character.counter_default['drink_a_beer'] = 2;
            character.counter_default['take_a_piss'] = 0;
        } else if (attack === 'drink_a_beer') {
            character.counter_default['take_a_piss'] = 1;
        } else if (attack === 'play_a_song') {
            character.counter_default['tune'] = 1;
        } else if (attack === 'tune') {
            character.counter_default['play_a_song'] = Math.min(5, character.counter_default['play_a_song'] + 3);
        }
    };

    self.random_songs = function () {
        self.song = _.shuffle(GameManager._all_songs)[0];
        self.other_song = _.shuffle(GameManager._all_songs)[0];
    };

    self.chose_attack = function () {
        var attacks = [];
        var target;
        if (self.enemy.counter_default.special_attack > 0) {
            attacks.push('special_attack');
        }
        if (self.enemy.counter_default.play_a_song === 0) {
            attacks.push('tune');
        }
        if (self.enemy.counter_default.drink_a_beer === 0) {
            attacks.push('take_a_piss');
        }
        if (self.enemy.hp > 50) {
            if (self.enemy.counter_default.play_a_song > 0) {
                angular.forEach(['play_a_song', 'play_a_song', 'play_a_song'], function (attack) {
                    attacks.push(attack);
                });
            }
        } else {
            if (self.enemy.counter_default.drink_a_beer > 0) {
                angular.forEach(['drink_a_beer', 'drink_a_beer'], function (attack) {
                    attacks.push(attack);
                });
            }
            if (self.enemy.counter_default.play_a_song > 0) {
                attacks.push('play_a_song');
            }
        }

        action = _.shuffle(attacks)[0];
        if (action === 'play_a_song' || action === 'special_attack') {
            target = self.player;
        } else {
            target = self.enemy;
        }
        return [action, target];
    };

    self.run_enemy_tour = function () {
        res = self.chose_attack();
        attack = res[0];
        target = res[1];

        self.currentAttack.enemy = attack;

        self.command_attack(target, attack, self.enemy);
    };

    self.reset = function () {
        self.init();
    };

    self.displayImg = true;

    self.init = function () {
        self.displayImg = false;
        self.loser = undefined;
        self.winner = undefined;
        self.hide_everything = false;
        self.enemyAttackDescription = "";

        $timeout(function () {
            self.players = _.shuffle(GameManager._all_characters);
            self.player = self.players[0];
            self.enemy = self.players[1];

            self.init_player(self.player);
            self.init_player(self.enemy);
            GameLogger.initPlayersAndActions(self.player, self.enemy);
        }, 0);

        angular.element(document.querySelector('#player')).removeClass('shake').removeClass('tada');
        angular.element(document.querySelector('#enemy')).removeClass('shake').removeClass('tada');
        angular.element(document.querySelector('#player')).addClass('fadeInLeft');
        angular.element(document.querySelector('#enemy')).addClass('fadeInRight');
        self.displayImg = true;
        $timeout(function () {
            angular.element(document.querySelector('#player')).removeClass('fadeInLeft');
            angular.element(document.querySelector('#enemy')).removeClass('fadeInRight');
        }, 1000);



        self.currentAttack.enemy = undefined;
        self.can_play = true;

        self.random_songs();
    };

    self.init();

}
MainController.$inject = ['$scope', '$timeout', '$http', 'GameManager', 'GameLogger'];


function ReplayController ($routeParams, Fight) {
    var self = this;

    self.hide_everything = true;

    var token = $routeParams.token;
    var fight = Fight.getFightData({pk: 0, uuid: token});

    self.init = function () {

    };

    self.init();
}
ReplayController.$inject = ['$routeParams', 'Fight'];