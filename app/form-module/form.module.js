(function () {
    'use strict';
	var hook = {};
   
    angular
        .module('form-module', [])
		.config(function($provide){
            $provide.decorator('taOptions', ['taRegisterTool', '$delegate', function(taRegisterTool, taOptions){
                taRegisterTool('embedImage', {
                    iconclass: "fa fa-file-image-o",
                    action: function(){
                        var editor = this.$editor();

                        var input = document.createElement('input');
                        input.type='file';
                        input.addEventListener('change', function(){
                            if(input.files.length == 0){
                                return;
                            }

                            var file = input.files[0];
                            var reader = new FileReader();
                            reader.readAsDataURL(file);
                            reader.onload = function(){
                            var data = reader.result;
                                
                                var img = "<img src='"+data+"'/>"
                                editor.wrapSelection('insertHtml', img);

                                console.log('image embeded :'+data);
                            };

                            reader.onerror = function(er){
                                console.log('HTMLEditor error loading '+er);
                                alert('Error loading file');
                            };
                        });

                        input.click();
                    }
                });
				taRegisterTool('embedVideo', {
                    iconclass: "fa fa-file-video-o",
                    action: function(){
                        var editor = this.$editor();

                        var input = document.createElement('input');
                        input.type='file';
                        input.addEventListener('change', function(){
                            if(input.files.length == 0){
                                return;
                            }

                            var file = input.files[0];
                        	hook.uploadFile(file, {}, function(data){
                               //alert('video done');
							   //var img = "<video width='320' height='240' controls> <source src='"+data.file_url+"'></video>";
							   var img ="<img class='ta-insert-video' src='https://image.flaticon.com/icons/png/512/129/129464.png' ta-insert-video='"+data.file_url+"' allowfullscreen='true' width='300' frameborder='0' height='250'/>";
                               editor.wrapSelection('insertHtml', img);
							  //editor.wrapSelection('insertVideo', data.file_url);
                               console.log(data);
                            }, function(data){
                            });
                                
                        });

                        input.click();
                    }
                });
                taOptions.toolbar[1].push('embedImage');
                return taOptions;
            }]);
        })
        .factory('FormFactory', FormFactory);

  function FormFactory(
        $http, $state, $stateParams, $mdMedia, $mdDialog, $log, AppFactory, PermohonanIzinFactory, MenuService,
        Upload, EnvironmentConfig, APP_CONFIG, _
  ) {
		hook.uploadFile = function($files, data, afterComplete, onError) {
            console.log("masuk hook upload"); 
			if (!_.isNull($files)) {
                // fileList = $files;

console.log("masuk if"); 
                // upload started
                // data.upload_status = 'uploading';

                // $timeout(uploadComplete, 4000);

                Upload.upload({
                    url: EnvironmentConfig.api + 'Form/uploadFile',
                    data: {
                        file: $files
                    }
                }).then(function (resp) {
                    $log.info('Success ' + resp.data.data.file_name + ' uploaded. Response: ' + resp.data.message);
                    data.data = resp.data.data.file_name;
                    data.file_url = resp.data.data.file_url;
                    afterComplete(data);
                }, function (resp) { // Error Upload
                    $timeout(uploadReset(data), 3000);
                    $log.info('Error status: ' + resp.status);

                    var errorMessage = 'Terjadi kesalahan saat upload data. Mohon periksa setting server.';
                    if (resp.data && resp.data.message) {
                        errorMessage = resp.data.message;
                    }
                    AppFactory.showToast(errorMessage);
                    onError(resp);

                }, function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    $log.info('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                });
            }
        }

        function uploadReset(data) {
            data.upload_status = 'idle';
        }
		
        return {
            getForm: getForm,
            downloadData: downloadData,
            downloadReport: downloadReport,
            downloadReportPesan: downloadReportPesan,
            getGridData: getGridData,
            cancelAction: cancelAction,
            cancelView: cancelView,
            saveData: saveData,
            saveAndNext: saveAndNext,
            deleteData: deleteData,
            viewFile: viewFile
        };

        function getForm(id, keyId, withRecord, formType, filters) {
            var params = {};
            var dataUrl = EnvironmentConfig.api + 'form/getform/' + id;

            if (!_.isNull(keyId)) {
                dataUrl = EnvironmentConfig.api + 'form/getform/' + id + '/' + keyId;
            }

            if (angular.isString(formType)) {
                params['form_type'] = formType;
            }

            if (typeof (withRecord) === 'boolean') {
                if (withRecord) {
                    params['with_record'] = 'T';
                } else {
                    params['with_record'] = 'F';
                }
            }

            params = _.merge(params, filters);
            dataUrl += AppFactory.httpBuildQuery(params);

            // GET the Data
            var getDataReq = {
                method: 'GET',
                url: dataUrl,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(getDataReq)
                .error(function (err) {
                    if (err && err.hasOwnProperty('message')) {
                        AppFactory.showToast(err.message, 'error', err.errors);
                    }
                    $state.go('triangular.admin-default.home');
                });
        }

        /**
         * Function to save the displayed data
         * @param {*} id 
         * @param {*} keyId 
         * @param {*} outputType 
         * @param {*} filters 
         */
        function downloadData(id, keyId, outputType, filters) {
            var params = {};
            var dataUrl = EnvironmentConfig.api + 'form/downloadData/' + id;

            if (!_.isNull(keyId)) {
                dataUrl = EnvironmentConfig.api + 'form/downloadData/' + id + '/' + keyId;
            }

            if (angular.isString(outputType)) {
                params['output_type'] = outputType;
            }

            params = _.merge(params, filters);
            dataUrl += AppFactory.httpBuildQuery(params);

            // Open the report downloadData directly
            // window.open(dataUrl);

            // Use ajax request to get the data
            var req = {
                method: 'GET',
                url: dataUrl,
                transformResponse: undefined, // do not parse as JSON
                responseType: 'arraybuffer'
            };

            $http(req)
                .success(function (res, status, headers) {
                    var parsedStream = AppFactory.parseFileStream(res, status, headers);
                    saveAs(parsedStream.blob, parsedStream.name);
                });
            return;
        }

        /**
         * Function to download report from TemplateData with type 'dokumen-cetak'
         */
        function downloadReport(reportId, keyId, filters) {
            var dataUrl = EnvironmentConfig.api + 'TemplateData/generateReport/' + reportId;
            var params = {
                'key_id': keyId
            };

            if (filters) {
                params = _.merge(params, filters);
            }
            dataUrl += AppFactory.httpBuildQuery(params);

            var req = {
                method: 'GET',
                url: dataUrl,
                transformResponse: undefined, // do not parse as JSON
                responseType: 'arraybuffer'
            };

            $http(req)
                .success(function (res, status, headers) {
                    var parsedStream = AppFactory.parseFileStream(res, status, headers);
                    saveAs(parsedStream.blob, parsedStream.name);
                })
                .error(function (data) {
                    var decodedString = String.fromCharCode.apply(null, new Uint8Array(data));
                    var obj = angular.fromJson(decodedString);
                    if (obj.message) {
                        AppFactory.showToast(obj.message, 'error', obj.errors);
                    }
                });
            return;
        }

        function downloadReportPesan(paramReport) {
            var dataUrl = EnvironmentConfig.api + 'TemplateData/generateReport/' + paramReport;
            var req = {
                method: 'GET',
                url: dataUrl,
                transformResponse: undefined, // do not parse as JSON
                responseType: 'arraybuffer'
            };

            $http(req)
                .success(function (res, status, headers) {
                    var parsedStream = AppFactory.parseFileStream(res, status, headers);
                    saveAs(parsedStream.blob, parsedStream.name);
                })
                .error(function (data) {
                    var decodedString = String.fromCharCode.apply(null, new Uint8Array(data));
                    var obj = angular.fromJson(decodedString);
                    if (obj.message) {
                        AppFactory.showToast(obj.message, 'error', obj.errors);
                    }
                });
            return;
        }

        function getGridData(canvasId, query) {
            var queryString = AppFactory.httpBuildQuery(query);
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'form/getCanvasGridData/' + canvasId + queryString,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };

            return $http(req)
                .error(function (err) {
                    if (err.message) {
                        AppFactory.showToast(err.message, 'error', err.errors);
                    }
                });
        }

        function cancelAction() {
            $state.go('triangular.admin-default.proses-pengajuan');
        }

        function cancelView() {
            $state.go('triangular.admin-default.daftar-izin');
        }

        function saveData(formId, keyId, namaForm, canvasData, redirectLink, buttonId) {
            var data = sanitizeData(AppFactory.clone(canvasData));
            var apiUrl = EnvironmentConfig.api + 'form/saveform/' + formId;

            if (angular.isDefined(keyId) && !_.isNull(keyId)) {
                apiUrl += '/' + keyId;
            }

            var reqData = {
                id: null,
                nama_form: namaForm,
                canvas: data
            };

            if (buttonId) {
                reqData.button_id = buttonId;
            }

            var req = {
                method: 'POST',
                url: apiUrl,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };

            $http(req)
                .success(function (res) {
                    AppFactory.showToast(res.message);
                    if (angular.isUndefined(redirectLink)) {
                        $state.go('triangular.admin-default.proses-pengajuan');
                    } else {
                        MenuService.openLink(redirectLink);
                    }
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

        function saveAndNext(formId, keyId, namaForm, canvasData) {
            var data = sanitizeData(AppFactory.clone(canvasData));

            var reqData = {
                id: null,
                nama_form: namaForm,
                canvas: data
            };

            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'form/saveform/' + formId + '/' + keyId,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };

            $http(req)
                .success(function (res) {
                    AppFactory.showToast(res.message);

                    var prosesPermohonanId = (angular.isDefined($stateParams.proses_permohonan_id)) ? $stateParams.proses_permohonan_id : null;
                    PermohonanIzinFactory.getNextStep(keyId, prosesPermohonanId);
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

        function sanitizeData(canvasData) {
            // Parse the fields
            _.each(canvasData, function (canvas) {
                _.each(canvas.fields, function (record) {
                    _.each(record.field, function (field) {
                        // Convert date to string
                        if (field.data instanceof Date) {
                            field.data = moment(field.data).format(APP_CONFIG.datepickerFormat);
                        }
                    });
                });
            });

            return canvasData;
        }

        function deleteData(formId, datatabelId, keyId) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'form/deleteData/' + formId + '/' + datatabelId + '/' + keyId,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            };

            return $http(req)
                .success(function (res) {
                    AppFactory.showToast(res.message);
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

        function viewFile(filePath, scope, parent, folder) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && scope.customFullscreen;

            $mdDialog.show({
                controller: FileViewerDialogController,
                templateUrl: 'app/form-module/pdf-viewer-dialog.tmpl.html',
                parent: angular.element(parent),
                clickOutsideToClose: true,
                fullscreen: useFullScreen,
                locals: {
                    filePath: filePath,
                    folder: folder
                }
            });

            scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                scope.customFullscreen = (wantsFullScreen === true);
            });
        }
    }
})();

function FileViewerDialogController(
    $state, $scope, $window, $mdDialog, AppFactory, EnvironmentConfig, filePath, folder
) {
    'use strict';

    $scope.url = AppFactory.getDownloadURL(filePath, folder);
    $scope.isPDF = filePath.endsWith('.pdf');

    $scope.downloadFile = function() {
        AppFactory.downloadFile(filePath, folder);
    };

    $scope.hide = function() {
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };
}