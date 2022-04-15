(function () {
    'use strict';

    angular
        .module('maps-module')
        .controller('MapsViewController', MapsViewController, ['$scope', '$http', 'leafletData']);

    /* @ngInject */
    function MapsViewController($scope, $http, $window, leafletData) {
        var addressPointsToMarkers = function (points) {
            return points.map(function (ap) {
                return {
                    layer: 'realworld',
                    lat: ap[0],
                    lng: ap[1]
                };
            });
        };

        angular.extend($scope, {
            center: {
                lat: -37.9212959167,
                lng: 175.5604435167,
                zoom: 11
            },
            watchOptions: {
                markers: {
                    type: null,
                    individual: {
                        type: null
                    }
                }
            },
            events: {
                map: {
                    enable: ['moveend', 'popupopen'],
                    logic: 'emit'
                },
                marker: {
                    enable: [],
                    logic: 'emit'
                }
            },
            layers: {
                baselayers: {
                    osm: {
                        name: 'OpenStreetMap',
                        type: 'xyz',
                        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    }
                },
                overlays: {
                    realworld: {
                        name: 'Real world data',
                        type: 'markercluster',
                        visible: true
                    }
                }
            }
        });

        $http.get('http://cors-anywhere.herokuapp.com/' +
          'http://angular-ui.github.io/ui-leaflet/examples/json/realworld.10000.json')
            .success(function (data) {
                leafletData.getDirectiveControls().then(function (controls) {
                    var markers = addressPointsToMarkers(data);
                    controls.markers.create(markers, $scope.markers);
                    $scope.markers = markers;
                });
            });
    }
})();
