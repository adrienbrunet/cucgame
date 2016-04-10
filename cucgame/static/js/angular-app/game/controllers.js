angular.module('game')
    .controller('MainController', MainController)
    .controller('ReplayController', ReplayController);


function MainController($scope, $timeout, $http, GameAudio, GameUI, GameManager, GameLogger) {
    var self = this;
    var mapping_attack;

    self.audioFlags = GameAudio.flags;

    self.stopAudio = GameAudio.stopAudio;
    self.playAudio = GameAudio.playAudio;

    $timeout(function () {
        GameUI.dimVideoAndDIv();
        GameAudio.playAudio();
    });

    self.counter_default = GameManager.counter_default;

    self.currentAttack = {'player': undefined, 'enemy': undefined};
    self.progressbar = {'player': "primary", 'enemy': "primary"};

    // Booleans for display purposes
    self.can_play = true;  // hide the action buttons during the "represailles"
    self.hide_everything = true;  // hide the game for "you win/you lost" screen

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
            $http.post('/api/fights/', data).then(
                function (rep) {
                    self.replayUrl = rep.data.uuid;
                }
            );
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
        var targetName = target === self.player ? "player" : "enemy";
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
        var targetClass = target === self.player ? "#player" : "#enemy";
        var classToAdd = attack_dmg > 0 ? "shake" : "tada";
        var elt = angular.element(document.querySelector(targetClass));
        elt.addClass(classToAdd);

        current_character.counter_default[attack] = current_character.counter_default[attack] - 1;

        self.updateCounter(current_character, attack);

        if (current_character === self.player) {
            $timeout(function () {
                self.random_songs();
                GameUI.cleanClass();
                self.run_enemy_tour();
            }, 800);
        } else {
            self.can_play = true;
        }


    };

    self.descriptionAttack = function (player, attack) {
        // Describe the attack. If the player is the enemy, update the variable so that the ui can display it!
        var isPlayer = player === self.player ? true : false;
        var description = player.name;
        if (attack === 'special_attack') {
            description += " utilise son attaque spéciale : " + player.special_attack;
        } else if (attack === 'play_a_song') {
            var song = isPlayer ? self.song : self.other_song;
            description += " joue " + song + " !!";
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
        self.replayUrl = "";
        self.enemyAttackDescription = "";

        $timeout(function () {
            self.players = _.shuffle(GameManager._all_characters);
            self.player = self.players[0];
            self.enemy = self.players[1];

            GameManager.init_player(self.player);
            GameManager.init_player(self.enemy);
            GameLogger.initPlayersAndActions(self.player, self.enemy);
            $timeout(function(){
                GameUI.cleanClass();
                GameUI.addStartAnimation();
            }, 0);
            self.displayImg = true;
            $timeout(function () {
                GameUI.cleanStartAnimation();
            }, 1000);

            self.currentAttack.enemy = undefined;
            self.can_play = true;

            self.random_songs();
        }, 0);

    };

    self.init();

}
MainController.$inject = ['$scope', '$timeout', '$http', 'GameAudio', 'GameUI', 'GameManager', 'GameLogger'];


function ReplayController ($routeParams, $timeout, GameAudio, GameUI, GameManager, Fight) {
    var self = this;

    // Audio
    self.audioFlags = GameAudio.flags;

    self.stopAudio = GameAudio.stopAudio;
    self.playAudio = GameAudio.playAudio;
    self.replay = true;

    // UI adjustements
    GameUI.dimVideoAndDIv();
    GameAudio.playAudio();

    self.hide_everything = true;
    self.endOfGame = false;

    // loads data
    var token = $routeParams.token;
    var fight = Fight.getFightData({pk: 0, uuid: token});
    fight.$promise.then(
        function (data) {
            self.init(data);
            self.hide_everything = false;
        },
        function (err) {
            alert("Une erreur malencontruse s'est produite. Désolé. C'est pas pour auourd'hui");
        }
    );

    self.init = function (data) {
        self.displayImg = false;
        self.loser = undefined;
        self.winner = undefined;
        self.hide_everything = false;

        $timeout(function () {
            self.player = data.player;
            self.enemy = data.enemy;

            GameManager.init_player(self.player);
            GameManager.init_player(self.enemy);
            GameUI.cleanClass();
            GameUI.addStartAnimation();
            self.displayImg = true;
            $timeout(function () {
                GameUI.cleanStartAnimation();
                self.fight(data);
            }, 1000);
        }, 0);

    };

    self.fight = function (data, round) {
        round = round | 0;
        if (!self.replay) {
            GameUI.cleanClass();
            return;
        }
        if (round == data.playerActions.length) {
            return self.endFight();
        } else {
            self.applyAction(data.playerActions[round], 'player');
        }
        $timeout(function () {
            if (round == data.enemyActions.length) {
                return self.endFight();
            } else {
                self.applyAction(data.enemyActions[round], 'enemy');
                $timeout(function(){
                    round++;
                    self.fight(data, round);
                }, 1500);
            }
        }, 1500);
    };

    self.applyAction = function (action, currentPlayer) {
        self[currentPlayer].descriptionAttack = action.description;
        var target = action.target === 'player' ? self.player : self.enemy;
        target.hp -= action.damage;
        var animation = action.damage > 0 ? 'shake' : 'tada';
        var elt = angular.element(document.querySelector("#" + action.target));
        elt.addClass(animation);
        $timeout(function(){
            GameUI.cleanClassPlayer(action.target);
        }, 1300);

    };

    self.endFight = function () {
        self.player.descriptionAttack = "";
        self.enemy.descriptionAttack = "";
        self.endOfGame = true;
        if (self.player.hp <= 0) {
            self.winner = self.enemy;
        } else {
            self.winner = self.player;
        }
    };

    self.stopReplay = function () {
        self.replay = false;
    };

}
ReplayController.$inject = ['$routeParams', '$timeout', 'GameAudio', 'GameUI', 'GameManager', 'Fight'];