describe('GameAudio service', function () {

    beforeEach(module('game'));

    beforeEach(inject(function (_GameAudio_) {
        GameAudio = _GameAudio_;
    }));

    it('should have a isPlaying flag set to false', function () {
        expect(GameAudio.flags.isPlaying).toBe(true);
    });

    it('should play the audio and set the flag to true', function () {
        dummyAudioPlayer = document.createElement('audio');
        spyOn(document, 'getElementsByTagName').and.callFake(function () {
            return [dummyAudioPlayer];
        });

        spyOn(dummyAudioPlayer, 'play');

        GameAudio.flags.isPlaying = false;

        GameAudio.playAudio();

        expect(GameAudio.flags.isPlaying).toBe(true);
        expect(dummyAudioPlayer.play).toHaveBeenCalled();
    });

    it('should stop the audio and set the flag to false', function () {
        dummyAudioPlayer = document.createElement('audio');
        spyOn(document, 'getElementsByTagName').and.callFake(function () {
            return [dummyAudioPlayer];
        });

        spyOn(dummyAudioPlayer, 'pause');

        GameAudio.flags.isPlaying = true;

        GameAudio.stopAudio();

        expect(GameAudio.flags.isPlaying).toBe(false);
        expect(dummyAudioPlayer.pause).toHaveBeenCalled();
    });
});


describe('GameUI service', function () {

    beforeEach(module('game'));

    beforeEach(inject(function (_GameUI_) {
        GameUI = _GameUI_;
    }));

    it('should remove class shake or tada from player html', function () {
        var dummyPlayer = document.createElement('div');
        dummyPlayer.className += 'shake';
        dummyPlayer.className += ' tada';
        dummyPlayer.id = 'test';

        spyOn(document, 'querySelector').and.returnValue(dummyPlayer);

        GameUI.cleanClassPlayer('test');
        expect(dummyPlayer.className).toBe('');
    });

    it('should call cleanClassPlayer for enemy and player', function () {
        spyOn(GameUI, 'cleanClassPlayer');

        GameUI.cleanClass();

        expect(GameUI.cleanClassPlayer).toHaveBeenCalledWith('player');
        expect(GameUI.cleanClassPlayer).toHaveBeenCalledWith('enemy');
    });

    it('should add css animation for fading', function () {
        var dummyElt = document.createElement('div');
        var dummyElt1 = document.createElement('div');

        var mockElement = function (elt) {
            elt = elt.substring(1, elt.length);  // remove the #
            if (elt === 'player') {
                return dummyElt;
            } else {
                return dummyElt1;
            }
        };

        spyOn(document, 'querySelector').and.callFake(mockElement);

        GameUI.addStartAnimation();

        expect(dummyElt.className).toEqual('fadeInLeft');
        expect(dummyElt1.className).toEqual('fadeInRight');
    });

    it('should remove css animation for fading', function () {

        var dummyElt = document.createElement('div');
        dummyElt.className += 'fadeInLeft';
        var dummyElt1 = document.createElement('div');
        dummyElt1.className += 'fadeInRight';

        var mockElement = function (elt) {
            elt = elt.substring(1, elt.length);  // remove the #
            if (elt === 'player') {
                return dummyElt;
            } else {
                return dummyElt1;
            }
        };

        spyOn(document, 'querySelector').and.callFake(mockElement);

        GameUI.cleanStartAnimation();

        expect(dummyElt.className).toEqual('');
        expect(dummyElt1.className).toEqual('');

    });

});

//     self.dimVideoAndDiv = function () {
//         var row, videoElt, heightVideo, playerInVideo, enemyInVideo;
//         row = angular.element(document.getElementById('main-row'))[0];
//         videoElt = angular.element(document.getElementById('video-background'))[0];
//         videoElt.setAttribute("style","width:" + row.offsetWidth + "px");
//         heightVideo = videoElt.offsetHeight - 70;
//         playerInVideo = angular.element(document.getElementById('playerInVideo'))[0];
//         enemyInVideo = angular.element(document.getElementById('enemyInVideo'))[0];
//         playerInVideo.setAttribute("style","min-height:" + heightVideo + "px");
//         enemyInVideo.setAttribute("style","min-height:" + heightVideo + "px");
//     };


describe('GameManager service', function () {

    beforeEach(module('game'));

    beforeEach(inject(function (_GameManager_) {
        GameManager = _GameManager_;
    }));


    it('should init hp player and counter', function () {
        character = {'max_hp': 100, 'counter_default': 'foobar'};

        GameManager.init_player(character);

        expect(character.hp).toEqual(100);
        expect(character.counter_default).toEqual(GameManager.counter_default);
    });

    it('should have 5 elements in counter_default', function () {
        expect(Object.keys(GameManager.counter_default).length).toEqual(5);
    });

    it('should have 22 songs', function () {
        expect(GameManager._all_songs.length).toEqual(22);
    });

    it('should have 26 different players', function () {
        var ids = [];
        var names = [];

        for (var i = 0; i < GameManager._all_characters.length; i++) {
            if (ids.indexOf(GameManager._all_characters[i].id) === -1) {
                ids.push(i);
            }
            if (ids.indexOf(GameManager._all_characters[i].name) === -1) {
                names.push(i);
            }
        }
        expect(ids.length).toEqual(26);
        expect(names.length).toEqual(26);
    });

    it('should return a number between 0 and 30', function () {
        expect(GameManager.play_a_song() >= 0 && GameManager.play_a_song() <= 30).toBe(true);
        expect(typeof GameManager.play_a_song()).toEqual(typeof 42);
    });

    it('should return a number between -30 and 0', function () {
        expect(GameManager.drink_a_beer() <= 0 && GameManager.drink_a_beer() >= -30).toBe(true);
        expect(typeof GameManager.drink_a_beer()).toEqual(typeof -42);
    });

    it('should return 0 (passive attacks)', function () {
        expect(GameManager.take_a_piss()).toEqual(0);
        expect(GameManager.tune()).toEqual(0);
    });

    it('should return a number between 0 and 50', function () {
        expect(GameManager.play_a_song() >= 0 && GameManager.play_a_song() <= 50).toBe(true);
        expect(typeof GameManager.play_a_song()).toEqual(typeof 42);
    });

});

describe('GameLogger service', function () {
    beforeEach(module('game'));

    beforeEach(inject(function (_GameLogger_) {
        GameLogger = _GameLogger_;
    }));

    it('should have null values or empty Arrays at first', function () {
        expect(GameLogger.player).toEqual(null);
        expect(GameLogger.enemy).toEqual(null);
        expect(GameLogger.playerActions).toEqual([]);
        expect(GameLogger.enemyActions).toEqual([]);
    });

    it('should init player and enemy values', function () {
        var player = {name: 'player'};
        var enemy = {name: 'enemy'};

        GameLogger.initPlayersAndActions(player, enemy);

        expect(GameLogger.player.name).toEqual('player');
        expect(GameLogger.enemy.name).toEqual('enemy');
        expect(GameLogger.playerActions).toEqual([]);
        expect(GameLogger.enemyActions).toEqual([]);
    });

    it('should log one action', function () {
        var player = {name: 'player'};
        GameLogger.player = player;
        target = player;
        typeAction = 'foo';
        description = '';
        damage = 45;

        GameLogger.logAction(player, target, typeAction, description, damage);

        expect(GameLogger.playerActions.length).toEqual(1);

    });

    it('should dump data in json for future post data', function () {
        var player = {name: 'player'};
        GameLogger.player = player;

        expect(typeof GameLogger.dump()).toEqual(typeof 'imAString');

        var data = GameLogger.dump();
        var decodedJson = JSON.parse(data);

        expect(decodedJson.player.name == player.name).toBe(true);
    });

});
