angular.module('game')
    .controller('MainController', MainController);


function MainController(GameManager) {
    var self = this;
    var mapping_attack;

    self.counter_default = GameManager.counter_default;

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

        var attack_method = mapping_attack[attack];

        target.hp = target.hp - attack_method();

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
            self.run_enemy_tour();
        }
    };

    self.random_songs = function () {
        self.song = _.shuffle(GameManager._all_songs)[0];
    };

    self.attack = function (target, attack) {
        target.hp = target.hp - GameManager.play_a_song();
    };

    self.play_song = function (song) {
        self.attack(target, attack);
        self.run_enemy_tour();
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
    };

    self.init();

}

MainController.$inject = ['GameManager'];