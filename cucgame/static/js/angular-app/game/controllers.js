angular.module('game')
    .controller('MainController', MainController);


function MainController($scope, $timeout, GameManager) {
    var self = this;
    var mapping_attack;

    self.counter_default = GameManager.counter_default;

    self.currentAttack = {'player': undefined, 'enemy': undefined};
    self.progressbar = {'player': "primary", 'enemy': "primary"};

    self.can_play = true;

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

    self.command_attack = function (target, attack, current_character) {
        if (angular.isUndefined(current_character)|| current_character === null) {
            current_character = self.player;
        }

        if (current_character === self.player) {
            self.can_play = false;
            self.currentAttack.player = undefined;
            self.currentAttack.enemy = undefined;
        }

        // $watch()
        $scope.$watch('self.player.hp', function () {
            var hp = self.player.hp;
            if (hp < 20) {
                self.progressbar.player = 'danger';
            } else if (20 <= hp && hp < 40) {
                self.progressbar.player = 'warning';
            } else {
                self.progressbar.player = 'primary';
            }
        }, true);
        $scope.$watch('self.enemy.hp', function () {
            var hp = self.enemy.hp;
            if (hp < 20) {
                self.progressbar.enemy = 'danger';
            } else if (20 <= hp && hp < 40) {
                self.progressbar.enemy = 'warning';
            } else {
                self.progressbar.enemy = 'primary';
            }
        }, true);

        var attack_method = mapping_attack[attack];

        attack_dmg = attack_method();
        target.hp = target.hp - attack_dmg;
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

        if (attack === 'take_a_piss') {
            current_character.counter_default['drink_a_beer'] = current_character.counter_default['drink_a_beer'] + 2;
            current_character.counter_default['take_a_piss'] = 0;
        } else if (attack === 'drink_a_beer') {
            current_character.counter_default['take_a_piss'] = 1;
        } else if (attack === 'play_a_song') {
            current_character.counter_default['tune'] = 1;
        } else if (attack === 'tune') {
            current_character.counter_default['play_a_song'] = current_character.counter_default['play_a_song'] + 3;
        }

        self.random_songs();

        if (current_character === self.player) {
            $timeout(function (){
                angular.element(document.querySelector('#player')).removeClass('shake').removeClass('tada');
                angular.element(document.querySelector('#enemy')).removeClass('shake').removeClass('tada');
                self.run_enemy_tour();
            }, 800);
        } else {
            self.can_play = true;
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
        console.log(self.currentAttack);

        self.command_attack(target, attack, self.enemy);
    };

    self.reset = function () {
        self.init();
    };

    self.init = function () {
        self.players = _.shuffle(GameManager._all_characters);
        self.player = self.players[0];
        self.enemy = self.players[1];

        self.init_player(self.player);
        self.init_player(self.enemy);

        self.random_songs();

        self.progressbar.player = "primary";
        self.progressbar.enemy = "primary";
    };

    self.init();

}

MainController.$inject = ['$scope', '$timeout', 'GameManager'];