describe('GameAudio service', function () {

    beforeEach(module('game'));

    beforeEach(inject(function (_GameAudio_) {
        GameAudio = _GameAudio_;
    }));

    it('should have a isPlaying flag set to false', function () {
        expect(GameAudio.flags.isPlaying).toBe(true);
    });



});

//     var getAudioPlayer = function () {
//         return document.getElementsByTagName('audio')[0];
//     };

//     self.stopAudio = function () {
//         var audioPlayer = getAudioPlayer();
//         audioPlayer.pause();
//         self.flags.isPlaying = false;
//     };

//     self.playAudio = function () {
//         var audioPlayer = getAudioPlayer();
//         audioPlayer.play();
//         self.flags.isPlaying = true;
//     };


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

        GameUI.cleanClassPlayer('test')
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

//     self.dimVideoAndDIv = function () {
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
