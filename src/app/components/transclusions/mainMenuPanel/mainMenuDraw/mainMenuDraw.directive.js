angular.module('mainMenuDraw')
    .directive('mainMenuDraw', [ 'toolsFactory', 'ISY.EventHandler', '$location','mainAppService', '$http',
        function(toolsFactory, eventHandler, $location,mainAppService,$http) {
            return {
                templateUrl: 'components/transclusions/mainMenuPanel/mainMenuDraw/mainMenuDraw.html',
                restrict: 'A',
                link: function(scope){

                    /*
                     Measure tools start
                     */
                    function _startMeasure (style) {
                        var featureTool;
                        switch (style){
                            case "Line":
                                featureTool = toolsFactory.getToolById("MeasureLine");
                                toolsFactory.activateTool(featureTool);
                                break;
                            case "Polygon":
                                featureTool = toolsFactory.getToolById("Measure");
                                toolsFactory.activateTool(featureTool);
                                break;
                        }
                    }

                    scope.measureLine = function () {
                        _startMeasure("Line");
                    };

                    scope.measurePolygon = function () {
                        _startMeasure("Polygon");
                    };
                    /*
                     Measure tools end
                     */

                    /*
                     Draw start
                     */

                    var getDrawing = function (geoJSON) {
                        scope.GeoJSON=geoJSON;
                        console.log(geoJSON);
                    };

                    var _checkUrlForGeoJSON = function (drawFeatureTool) {
                        var url=$location.url();
                        var params=url.split('?')[1].split('&');
                        for(var i =0; i<params.length; i++){
                            var param=params[i].split('=');
                            if(param[0]=='drawing') {
                                _getGeoJSON(drawFeatureTool, param[1]);
                                return;
                            }
                        }
                        _activateDrawFeatureTool(drawFeatureTool);
                    };

                    var _getGeoJSON = function (drawFeatureTool, hash) {
                        var drawingUrl=mainAppService.generateGeoJSONUrl(hash);
                        $http.get(drawingUrl).then(function(result){_setGeoJSONOnScope(result);});
                    };

                    var _setGeoJSONOnScope = function(result){
                        scope.GeoJSON = result.data;
                        _activateDrawFeatureTool();
                    };

                    var _activateDrawFeatureTool = function (type) {
                        if(!type){
                            type='Point';
                        }
                        var drawFeatureTool = toolsFactory.getToolById("DrawFeature");
                        if(scope.GeoJSON){
                            drawFeatureTool.additionalOptions.GeoJSON=scope.GeoJSON;
                        }
                        drawFeatureTool.additionalOptions.type=type;
                        toolsFactory.deactivateTool(drawFeatureTool);
                        toolsFactory.activateTool(drawFeatureTool);
                    };

                    scope.drawFeature = function (type) {
                        _activateDrawFeatureTool(type);
                    };

                    scope.removeInfomarkers();
                    eventHandler.RegisterEvent(ISY.Events.EventTypes.DrawFeatureEnd, getDrawing);
                    _checkUrlForGeoJSON();
                    /*
                     Draw end
                     */

                }
            };
        }]);