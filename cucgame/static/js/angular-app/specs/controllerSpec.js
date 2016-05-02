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
        init_player: function () {}
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
