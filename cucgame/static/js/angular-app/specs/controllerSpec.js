describe('ReplayController:', function () {
  beforeEach(module('game'));

  var $controller;

  beforeEach(inject(function (_$controller_, _$httpBackend_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    $httpBackend = _$httpBackend_;
  }));

  describe('', function () {
    var $scope, controller;

    beforeEach(function () {
      GameUI = {
        dimVideoAndDiv: function () {},
        cleanClassPlayer: function () {},
        cleanClass: function () {},
        addStartAnimation: function () {}
      };
      GameAudio = {
        playAudio: function () {},
        flags: {isPlaying: true}
      };
      GameManager = {
        init_player: function () {},
      };
      spyOn(GameUI, 'dimVideoAndDiv').and.returnValue(undefined);
      spyOn(GameUI, 'cleanClassPlayer').and.returnValue(undefined);
      spyOn(GameUI, 'addStartAnimation').and.returnValue(undefined);
      spyOn(GameUI, 'cleanClass').and.returnValue(undefined);
      spyOn(GameAudio, 'playAudio').and.returnValue(undefined);
      spyOn(GameManager, 'init_player').and.returnValue(undefined);


      $scope = {};
      controller = $controller('ReplayController', {
        $scope: $scope,
        GameUI: GameUI,
        GameAudio: GameAudio,
        GameManager: GameManager,
        $routeParams: {token: 'foo'}
      });
    });

    beforeEach(function () {
        $httpBackend.expectGET('/api/fights/0/get_fight_data?uuid=foo').respond(200, {});
    });

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        // $httpBackend.verifyNoOutstandingRequest();
    });

    it('is initiated', function () {
      expect(GameUI.dimVideoAndDiv).toHaveBeenCalled();
      expect(GameAudio.playAudio).toHaveBeenCalled();

      expect(controller.audioFlags.isPlaying).toBe(true);
      expect(controller.replay).toBe(true);
      expect(controller.hide_everything).toBe(true);
      expect(controller.endOfGame).toBe(false);
    });

    it('load fight', function () {
      $httpBackend.flush();
      expect(controller.hide_everything).toEqual(false);
    });

    it('init() loads the game to be played', inject(function ($timeout) {
      var player = {hp: -5};
      var enemy = {hp: 42};
      var data = {player: player, enemy: enemy};

      controller.fight = function () {};

      controller.init(data);
      expect(controller.displayImg).toBe(false);
      expect(controller.loser).toBe(undefined);
      expect(controller.winner).toBe(undefined);
      expect(controller.hide_everything).toEqual(false);

      $timeout.flush();
      expect(controller.player.hp).toEqual(-5);
      expect(GameUI.addStartAnimation).toHaveBeenCalled();
      expect(controller.displayImg).toBe(true);

    }));

    it('should return if not in replay mode', function () {
      controller.player = {hp: -5};
      controller.enemy = {hp: 42};
      controller.replay = false;

      controller.fight({playerActions: [], enemyActions: []}, 0);

      expect(GameUI.cleanClass).toHaveBeenCalled();
      expect(controller.fight({}, 0)).toEqual(undefined);
    });

    it('should end fight if it was the last round', function () {
      controller.player = {hp: -5};
      controller.enemy = {hp: 42};
      spyOn(controller, 'endFight').and.returnValue(undefined);

      controller.fight({playerActions: [], enemyActions: []}, 0);

      expect(controller.endFight).toHaveBeenCalled();
    });

    it('should call next round if fight is not over', inject(function ($timeout) {
      controller.applyAction = function () {};

      controller.player = {hp: -5};
      controller.enemy = {hp: 42};
      spyOn(controller, 'endFight').and.returnValue(undefined);
      var data = {playerActions: ['foo', 'bar'], enemyActions: ['baz', 'ban']};
      controller.fight(data, 1);

      spyOn(controller, 'fight').and.returnValue(undefined);
      $timeout.flush();
      $timeout.flush();
      expect(controller.fight).toHaveBeenCalledWith(data, 2);
    }));

    it('should handle one attack (damage + animation)', inject(function ($timeout) {
      action = {description: 'foo', target: 'player', damage: 50};
      controller.player = {hp: -5};
      controller.enemy = {hp: 42};

      dummyElt = document.createElement('div');
      spyOn(document, 'querySelector').and.returnValue(dummyElt);

      controller.applyAction(action, 'player');

      expect(controller.player.hp).toEqual(-55);
      expect(dummyElt.className).toEqual('shake');

      $timeout.flush();
      expect(GameUI.cleanClassPlayer).toHaveBeenCalled();

    }));

    it('should set replay as done and set winner/loser', function () {
      controller.player = {hp: -5};
      controller.enemy = {hp: 42};

      controller.endFight();

      expect(controller.player.descriptionAttack).toEqual('');
      expect(controller.enemy.descriptionAttack).toEqual('');
      expect(controller.endOfGame).toBe(true);
      expect(controller.winner).toEqual(controller.enemy);

      // vengeance !!
      controller.player = {hp: 200};
      controller.enemy = {hp: -42};

      controller.endFight();

      expect(controller.winner).toEqual(controller.player);
    });

    it('stopReplay() set the boolean replay to false', function () {
      controller.stopReplay();
      expect(controller.replay).toBe(false);
    });

  });
});

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */

describe('ReplayController:', function () {
  beforeEach(module('game'));

  var $controller;

  beforeEach(inject(function (_$controller_, _$httpBackend_, _$rootScope_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
  }));

  describe('', function () {
    var $scope, controller;

    beforeEach(function () {

      $scope = $rootScope.$new();

      GameUI = {
        dimVideoAndDiv: function () {},
        cleanClassPlayer: function () {},
        cleanClass: function () {},
        addStartAnimation: function () {},
        cleanStartAnimation: function () {}
      };
      GameAudio = {
        playAudio: function () {},
        flags: {isPlaying: true}
      };
      GameManager = {
        init_player: function () {},
        _all_characters: [{id: 0}, {id: 1}],
        _all_songs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18 ,19 ,20, 21, 22, 23, 24, 25]
      };
      GameLogger = {
        logAction: function () {},
        dump: function () {},
        initPlayersAndActions: function () {}
      };
      spyOn(GameUI, 'dimVideoAndDiv').and.returnValue(undefined);
      spyOn(GameUI, 'cleanClassPlayer').and.returnValue(undefined);
      spyOn(GameUI, 'addStartAnimation').and.returnValue(undefined);
      spyOn(GameUI, 'cleanClass').and.returnValue(undefined);
      spyOn(GameAudio, 'playAudio').and.returnValue(undefined);
      spyOn(GameManager, 'init_player').and.returnValue(undefined);
      spyOn(GameLogger, 'initPlayersAndActions').and.returnValue(undefined);

      controller = $controller('MainController', {
        $scope: $scope,
        GameUI: GameUI,
        GameAudio: GameAudio,
        GameManager: GameManager,
        GameLogger: GameLogger
      });
    });

    beforeEach(function () {
        // $httpBackend.expectGET('/api/fights/0/get_fight_data?uuid=foo').respond(200, {});
    });

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        // $httpBackend.verifyNoOutstandingRequest();
    });

    it('is initiated', inject(function ($timeout) {
      $timeout.flush();
      expect(GameUI.dimVideoAndDiv).toHaveBeenCalled();
      expect(GameAudio.playAudio).toHaveBeenCalled();
      expect(GameLogger.initPlayersAndActions).toHaveBeenCalled();

      expect(controller.audioFlags.isPlaying).toBe(true);
      expect(controller.hide_everything).toBe(false);

      expect(controller.counter_default).toEqual(GameManager.counter_default);
    }));

    it('should return a class corresponding to the amount of hp provided', function () {
      expect(controller.update_class_progressbar(5)).toEqual('danger');
      expect(controller.update_class_progressbar(35)).toEqual('warning');
      expect(controller.update_class_progressbar(80)).toEqual('primary');
    });

    it('should return "player" if input is "enemy" or the inverse', function () {
      expect(controller.switchPlayer('player')).toEqual('enemy');
      expect(controller.switchPlayer('enemy')).toEqual('player');
    });

    it('should end game', inject(function ($timeout) {
      controller.player = {name: 'foo', id: 1};
      controller.enemy = {name: 'foo', id: 2};

      $timeout.flush();
      $httpBackend.expectPOST('/api/fights/').respond(200, {uuid: 'foo'});
      controller.end_game('player');
      $timeout.flush();
      $httpBackend.flush();

      expect(controller.hide_everything).toBe(true);
      expect(controller.replayUrl).toEqual('foo');

    }));

    it('should take action according to remaining hp (end game of update progress bar)', function () {
      spyOn(controller, 'end_game');
      controller.checkHP(-5, 'enemy');
      expect(controller.end_game).toHaveBeenCalledWith('enemy');

      spyOn(controller, 'update_class_progressbar');
      controller.checkHP(10, 'enemy');
      expect(controller.update_class_progressbar).toHaveBeenCalledWith(10);
    });

    it('test hp watchers', function () {

//     $scope.$watch('ctrl.player.hp', function (hp) {
//         self.checkHP(hp, 'player');
//     }, true);
//     $scope.$watch('ctrl.enemy.hp', function (hp) {
//         self.checkHP(hp, 'enemy');
//     }, true);

    });





//     self.command_attack = function (target, attack, current_character) {
//         if (angular.isUndefined(current_character) || current_character === null) {
//             current_character = self.player;
//         }

//         if (current_character === self.player) {
//             self.can_play = false;
//             self.currentAttack.player = undefined;
//             self.currentAttack.enemy = undefined;
//         }

//         var attack_method = mapping_attack[attack];

//         attack_dmg = attack_method();

//         var description = self.descriptionAttack(current_character, attack);

//         // log attack info
//         var targetName = target === self.player ? "player" : "enemy";
//         GameLogger.logAction(current_character, targetName, attack, description, attack_dmg);

//         result = target.hp - attack_dmg;
//         if (result > 100) {
//             target.hp = 100;
//         } else if (result <= 0) {
//             target.hp = result;
//             return;
//         } else {
//             target.hp = result;
//         }
//         var classToAdd = attack_dmg > 0 ? "shake" : "tada";
//         var elt = angular.element(document.querySelector('#' + targetName));
//         elt.addClass(classToAdd);

//         current_character.counter_default[attack] = current_character.counter_default[attack] - 1;

//         self.updateCounter(current_character, attack);

//         if (current_character === self.player) {
//             $timeout(function () {
//                 self.random_songs();
//                 GameUI.cleanClass();
//                 self.run_enemy_tour();
//             }, 800);
//         } else {
//             self.can_play = true;
//         }

//     };

//     self.descriptionAttack = function (player, attack) {
//         // Describe the attack. If the player is the enemy, update the variable so that the ui can display it!
//         var isPlayer = player === self.player ? true : false;
//         var description = player.name;
//         if (attack === 'special_attack') {
//             description += " utilise son attaque spéciale : " + player.special_attack;
//         } else if (attack === 'play_a_song') {
//             var song = isPlayer ? self.song : self.other_song;
//             description += " joue " + song + " !!";
//         } else if (attack === 'drink_a_beer') {
//             description += " se bourre la gueule et gagne des HP !";
//         } else if (attack === 'take_a_piss') {
//             description += " pisse un coup !";
//         } else if (attack === 'tune') {
//             description += " s'accorde (ou fait semblant) avant de rejouer !";
//         }

//         if (player === self.enemy) {
//             self.enemyAttackDescription = description;
//         }

//         return description;
//     };

//     self.updateCounter = function (character, attack) {
//         if (attack === 'take_a_piss') {
//             character.counter_default['drink_a_beer'] = 2;
//             character.counter_default['take_a_piss'] = 0;
//         } else if (attack === 'drink_a_beer') {
//             character.counter_default['take_a_piss'] = 1;
//         } else if (attack === 'play_a_song') {
//             character.counter_default['tune'] = 1;
//         } else if (attack === 'tune') {
//             character.counter_default['play_a_song'] = Math.min(5, character.counter_default['play_a_song'] + 3);
//         }
//     };


    it('should give random songs', function () {
      controller.random_songs();
      expect(controller.song !== GameManager._all_songs[0]);
    });

//     self.chose_attack = function () {
//         var attacks = [];
//         var target;
//         if (self.enemy.counter_default.special_attack > 0) {
//             attacks.push('special_attack');
//         }
//         if (self.enemy.counter_default.play_a_song === 0) {
//             attacks.push('tune');
//         }
//         if (self.enemy.counter_default.drink_a_beer === 0) {
//             attacks.push('take_a_piss');
//         }
//         if (self.enemy.hp > 50) {
//             if (self.enemy.counter_default.play_a_song > 0) {
//                 attacks.concat(['play_a_song', 'play_a_song', 'play_a_song']);
//             }
//         } else {
//             if (self.enemy.counter_default.drink_a_beer > 0) {
//                 attacks.concat(['drink_a_beer', 'drink_a_beer']);
//             }
//             if (self.enemy.counter_default.play_a_song > 0) {
//                 attacks.push('play_a_song');
//             }
//         }

//         action = _.shuffle(attacks)[0];
//         if (action === 'play_a_song' || action === 'special_attack') {
//             target = self.player;
//         } else {
//             target = self.enemy;
//         }
//         return [action, target];
//     };

//     self.run_enemy_tour = function () {
//         res = self.chose_attack();
//         attack = res[0];
//         target = res[1];

//         self.currentAttack.enemy = attack;

//         self.command_attack(target, attack, self.enemy);
//     };

    it('should called init (reset is an alias)', function () {
      spyOn(controller, 'init').and.returnValue(undefined);
      controller.reset();
      expect(controller.init).toHaveBeenCalled();
    });


//     self.displayImg = true;

//     self.init = function () {
//         self.displayImg = false;
//         self.loser = undefined;
//         self.winner = undefined;
//         self.hide_everything = false;
//         self.replayUrl = "";
//         self.enemyAttackDescription = "";

//         $timeout(function () {
//             self.players = _.shuffle(GameManager._all_characters);
//             self.player = self.players[0];
//             self.enemy = self.players[1];

//             GameManager.init_player(self.player);
//             GameManager.init_player(self.enemy);
//             GameLogger.initPlayersAndActions(self.player, self.enemy);
//             $timeout(function(){
//                 GameUI.cleanClass();
//                 GameUI.addStartAnimation();
//             }, 0);
//             self.displayImg = true;
//             $timeout(function () {
//                 GameUI.cleanStartAnimation();
//             }, 1000);

//             self.currentAttack.enemy = undefined;
//             self.can_play = true;

//             self.random_songs();
//         }, 0);

//     };

 });
});