describe('GameAudio service', function () {

    beforeEach(module('game'));

    beforeEach(inject(function (_GameAudio_) {
        GameAudio = _GameAudio_;
    }));

    it('should have a isPlaying flag set to false', function () {
        expect(GameAudio.flags.isPlaying).toBe(true);
    });



});

// // handles the audio commands
// function GameAudio () {
//     "use strict";
//     var self = {};

//     self.flags = {
//         isPlaying: true  // because "autoplay"
//     };

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

//     return self;
// }