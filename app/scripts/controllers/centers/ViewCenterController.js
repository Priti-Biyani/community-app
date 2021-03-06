(function(module) {
    mifosX.controllers = _.extend(module, {
        ViewCenterController: function(scope, routeParams , route, location, resourceFactory,$modal) {
            scope.center = [];

            resourceFactory.centerResource.get({centerId: routeParams.id,associations:'groupMembers,collectionMeetingCalendar'} , function(data) {
                scope.center = data;
                scope.meeting = data.collectionMeetingCalendar;
            });
            resourceFactory.runReportsResource.get({reportSource: 'GroupSummaryCounts',genericResultSet: 'false',R_groupId: routeParams.id} , function(data) {
                scope.summary = data[0];
            });
            resourceFactory.centerAccountResource.get({centerId: routeParams.id} , function(data) {
                scope.accounts = data;
            });
            resourceFactory.groupNotesResource.getAllNotes({groupId: routeParams.id} , function(data) {
                scope.notes = data;
            });
            scope.deleteCenter = function () {
                $modal.open({
                    templateUrl: 'delete.html',
                    controller: ModalInstanceDeleteCtrl
                });
            };
            scope.unassignStaffCenter = function () {
                $modal.open({
                    templateUrl: 'unassignstaff.html',
                    controller: ModalInstanceUnassignCtrl
                });
            };
            var ModalInstanceDeleteCtrl = function ($scope, $modalInstance) {
                $scope.delete = function () {
                    resourceFactory.centerResource.delete({centerId: routeParams.id}, {}, function(data) {
                        location.path('/centers');
                    });
                    $modalInstance.close('activate');

                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };
            var ModalInstanceUnassignCtrl = function ($scope, $modalInstance) {
                $scope.unassign = function (staffId) {
                    var staffData = new Object();
                    staffData.staffId = staffId;
                    resourceFactory.groupResource.save({centerId: routeParams.id,anotherresource: 'unassignStaff'}, staffData, function(data) {
                        route.reload();
                    });
                    $modalInstance.close('activate');
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };
            scope.saveNote = function() {
                resourceFactory.groupNotesResource.save({groupId: routeParams.id}, this.formData,function(data){
                    var today = new Date();
                    temp = { id: data.resourceId , note : scope.formData.note , createdByUsername : "test" , createdOn : today } ;
                    scope.notes.push(temp);
                    scope.formData.note = "";
                    scope.predicate = '-id';
                });
            }

            resourceFactory.DataTablesResource.getAllDataTables({apptable: 'm_center'} , function(data) {
                scope.centerdatatables = data;
            });

            scope.dataTableChange = function(datatable) {
                resourceFactory.DataTablesResource.getTableDetails({datatablename: datatable.registeredTableName, entityId: routeParams.id, genericResultSet: 'true'} , function(data) {
                    scope.datatabledetails = data;
                    scope.datatabledetails.isData = data.data.length > 0 ? true : false;
                    scope.datatabledetails.isMultirow = data.columnHeaders[0].columnName == "id" ? true : false;

                    for(var i in data.columnHeaders) {
                        if (scope.datatabledetails.columnHeaders[i].columnCode) {
                            for (var j in scope.datatabledetails.columnHeaders[i].columnValues){
                                for(var k in data.data) {
                                    if (data.data[k].row[i] == scope.datatabledetails.columnHeaders[i].columnValues[j].id) {
                                        data.data[k].row[i] = scope.datatabledetails.columnHeaders[i].columnValues[j].value;
                                    }
                                }
                            }
                        } 
                    }
                });
            };

            scope.deleteAll = function (apptableName, entityId) {
                resourceFactory.DataTablesResource.delete({datatablename:apptableName, entityId:entityId, genericResultSet:'true'}, {}, function(data){
                    route.reload();
                });
            };
        }
    });
    mifosX.ng.application.controller('ViewCenterController', ['$scope', '$routeParams', '$route', '$location', 'ResourceFactory','$modal', mifosX.controllers.ViewCenterController]).run(function($log) {
        $log.info("ViewCenterController initialized");
    });
}(mifosX.controllers || {}));

