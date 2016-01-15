angular.module('ground_station')
    .factory('GroundStationManager', GroundStationManager);


function GroundStationManager($q, GroundStation) {
    "use strict";
    var _GroundStationManager = function () {
        var self = this;

        self._all_ground_stations = [];

        self.getAll = function () {
            var ground_stations = GroundStation.query();
            ground_stations.$promise.then(function (data) {
                self._all_ground_stations = data;
            });
            return ground_stations;
        };

        self.getGroundStationById = function (id) {
            return _.find(self._all_ground_stations, function (gs) {
                return gs.pk === id;
            });
        };

        self.createRadioAmatorGroundStation = function (data, pk) {
            var newGroundStation = new GroundStation(data);

            if (angular.isDefined(pk)) {
                newGroundStation.pk = pk;
                return newGroundStation.$update().then(
                    function (res) {
                        self._all_ground_stations[_.findIndex(self._all_ground_stations, function (gs) {
                            return a.pk === pk;
                        })] = res;
                        return res;
                    },
                    function (res) {
                        return $q.reject(res);
                    }
                );
            } else {
                return newGroundStation.$save(
                    function (res) {
                        self._all_ground_stations.push(res);
                        return res;
                    },
                    function (res) {
                        return $q.reject(res);
                    }
                );
            }
        };

    };

    var am = new _GroundStationManager();
    return am;

}
GroundStationManager.$inject = ['$q', 'GroundStation'];