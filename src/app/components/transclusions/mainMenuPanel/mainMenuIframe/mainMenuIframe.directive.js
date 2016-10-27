angular.module('mainMenuIframe')
    .directive('mainMenuIframe', [ '$location',
        function($location) {
            return {
                templateUrl: 'components/transclusions/mainMenuPanel/mainMenuIframe/mainMenuIframe.html',
                restrict: 'A',
                link: function(scope){
                    var getUrl = function () {
                        return $location.absUrl();
                    };

                    scope.getIframe = function () {
                        var url=getUrl() + '&type=1';
                        if (scope.useMarker){
                            url+='&marker_lat=' + scope.activePosition.lat + '&marker_lon=' + scope.activePosition.lon;
                        }
                        scope.iframe='<iframe src="' + url + '" width="134" height="108" title="" longdesc=""></iframe>';
                        scope.iframeUrl=url;
                    };
                }
            };
        }]);