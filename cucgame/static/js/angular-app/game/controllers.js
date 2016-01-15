angular.module('game')
    .controller('MainController', MainController);


function MainController(GameManager) {
    var self = this;
}

MainController.$inject = ['GameManager'];