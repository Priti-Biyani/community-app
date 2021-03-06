(function(module) {
  mifosX.controllers = _.extend(module, {
    ViewUserController: function(scope, routeParams, route, location, resourceFactory, $modal ) {
        scope.user = [];
        resourceFactory.userListResource.get({userId: routeParams.id} , function(data) {
            scope.user = data;
        });
        scope.open = function () {
            $modal.open({
                templateUrl: 'password.html',
                controller: ModalInstanceCtrl
            });
        };
        var ModalInstanceCtrl = function ($scope, $modalInstance) {
            $scope.save = function (staffId) {
                resourceFactory.userListResource.update({'userId': routeParams.id},this.formData,function(data){
                    route.reload();
                });
                $modalInstance.close('activate');
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        };
        scope.deleteuser = function (){
          resourceFactory.userListResource.delete({userId: routeParams.id} , {} , function(data) {
                location.path('/users');
                // added dummy request param because Content-Type header gets removed 
                // if the request does not contain any data (a request body)        
          });
        };
    }
  });
  mifosX.ng.application.controller('ViewUserController', ['$scope', '$routeParams','$route', '$location', 'ResourceFactory','$modal', mifosX.controllers.ViewUserController]).run(function($log) {
    $log.info("ViewUserController initialized");
  });
}(mifosX.controllers || {}));
