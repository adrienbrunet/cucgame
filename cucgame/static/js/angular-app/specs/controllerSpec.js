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

describe('MainController:', function () {
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
        _all_songs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18 ,19 ,20, 21, 22, 23, 24, 25],
         counter_default: {
          "play_a_song": 5,
          "drink_a_beer": 2,
          "take_a_piss": 0,
          "tune": 0,
          "special_attack": 1
        },
        tune: function () {}
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
      spyOn(controller, 'checkHP');
      $scope.$apply("ctrl.player = {hp: 100};");
      $scope.$apply("ctrl.enemy = {hp: 100};");
      expect(controller.checkHP).toHaveBeenCalledWith(100, 'player');
      expect(controller.checkHP).toHaveBeenCalledWith(100, 'enemy');
    });

    it('should handle a chosen attack', inject(function ($timeout) {
      controller.player = {hp:100, counter_default: GameManager.counter_default};
      controller.enemy = {hp:100, counter_default: GameManager.counter_default};

      spyOn(GameLogger, 'logAction');
      spyOn(controller, 'descriptionAttack');
      spyOn(controller, 'updateCounter');
      spyOn(controller, 'run_enemy_tour');

      var target = controller.player;
      var attack = 'tune';
      var current_character = controller.player;

      controller.command_attack(target, attack, current_character);

      expect(GameLogger.logAction).toHaveBeenCalled();
      expect(controller.descriptionAttack).toHaveBeenCalled();
      expect(controller.updateCounter).toHaveBeenCalled();

      $timeout.flush();
      expect(controller.run_enemy_tour).toHaveBeenCalled();

      controller.player = {hp: -1000, counter_default: GameManager.counter_default};
      current_character = controller.player;
      target = controller.player;
      controller.command_attack(target, attack, current_character);
      expect(controller.can_play).toBe(false);
    }));

    it('describe the attack', function () {
      attack = 'special_attack';
      player = {hp: 100, name: 'foo'};
      controller.player = player;

      expect(controller.descriptionAttack(player, attack).indexOf('foo') !== -1).toBe(true);

      enemy = {hp: 100, name: 'bar'};
      controller.enemy = enemy;

      expect(controller.descriptionAttack(enemy, attack).indexOf('bar') !== -1).toBe(true);
      expect(controller.descriptionAttack(enemy, attack).indexOf('attaque spéciale') !== -1).toBe(true);

      attack = 'play_a_song';
      expect(controller.descriptionAttack(enemy, attack).indexOf(' joue ') !== -1).toBe(true);

      attack = 'drink_a_beer';
      expect(controller.descriptionAttack(enemy, attack).indexOf('bourre la gueule') !== -1).toBe(true);

      attack = 'take_a_piss';
      expect(controller.descriptionAttack(enemy, attack).indexOf('pisse un coup') !== -1).toBe(true);

      attack = 'tune';
      expect(controller.descriptionAttack(enemy, attack).indexOf('accorde') !== -1).toBe(true);

      controller.enemyAttackDescription = null;
      controller.descriptionAttack(enemy, attack);
      expect(controller.enemyAttackDescription !== null).toBe(true);

    });

    it('should update the counter after each attack (side effect)', function () {
      player = {'counter_default': GameManager.counter_default};

      attack = 'take_a_piss';
      controller.updateCounter(player, attack);
      expect(player.counter_default.drink_a_beer).toEqual(2);
      expect(player.counter_default.take_a_piss).toEqual(0);

      attack = 'drink_a_beer';
      controller.updateCounter(player, attack);
      expect(player.counter_default.take_a_piss).toEqual(1);

      attack = 'play_a_song';
      controller.updateCounter(player, attack);
      expect(player.counter_default.tune).toEqual(1);

      attack = 'tune';
      controller.updateCounter(player, attack);
      expect(player.counter_default.play_a_song).toEqual(5);

      player.counter_default.play_a_song = 0;
      controller.updateCounter(player, attack);
      expect(player.counter_default.play_a_song).toEqual(3);

    });

    it('should give random songs', function () {
      controller.random_songs();
      expect(controller.song !== GameManager._all_songs[0]);
    });

    it('should chose an attack for the enemy according to hp', function () {
      controller.player = {};
      controller.enemy = {
        hp: 100,
        counter_default: {
          'special_attack': 0,
          'take_a_piss':0,
          'play_a_song': 1,
          'drink_a_beer': 1,
          'tune': 0
        }
      };

      var action, target;
      [action, target] = controller.chose_attack();
      expect(action).toEqual('play_a_song');
      expect(target).toEqual(controller.player);

      controller.enemy.counter_default = {
        'special_attack': 0,
        'take_a_piss':0,
        'play_a_song': 0,
        'drink_a_beer': 1,
        'tune': 0
      };
      [action, target] = controller.chose_attack();
      expect(action).toEqual('tune');
      expect(target).toEqual(controller.enemy);
    });

    it('should run the enemy tour', function () {
      spyOn(controller, 'command_attack');
      controller.chose_attack = function () {return ['foo', 'bar'];};
      controller.run_enemy_tour();

      expect(controller.currentAttack.enemy).toEqual('foo');
      expect(controller.command_attack).toHaveBeenCalled();
    });

    it('should called init (reset is an alias)', function () {
      spyOn(controller, 'init').and.returnValue(undefined);
      controller.reset();
      expect(controller.init).toHaveBeenCalled();
    });

    it('init the game', inject(function ($timeout) {

      spyOn(GameUI, 'cleanStartAnimation');
      controller.init();

      $timeout.flush();

      expect(typeof controller.player.id === typeof 42).toBe(true);

      $timeout.flush();

      expect(GameUI.cleanClass).toHaveBeenCalled();
      expect(GameUI.addStartAnimation).toHaveBeenCalled();
      expect(GameUI.cleanStartAnimation).toHaveBeenCalled();

      expect(controller.can_play).toBe(true);

    }));

 });
});