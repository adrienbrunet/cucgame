angular.module('game')
    .factory('GameManager', GameManager);


function GameManager($q, Character) {
    "use strict";
    var _GameManager = function () {
        var self = this;

        self._all_characters = [];

        self.getAll = function () {
            var characters = Character.query();
            characters.$promise.then(function (data) {
                self._all_characters = data;
            });
            return characters;
        };

        self.getCharacterById = function (id) {
            return _.find(self._all_characters, function (c) {
                return c.pk === id;
            });
        };

    };

    var gm = new _GameManager();
    return gm;

}
GameManager.$inject = ['$q', 'Character'];