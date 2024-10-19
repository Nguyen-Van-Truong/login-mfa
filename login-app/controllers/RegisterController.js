// login-app\controllers\RegisterController.js
angular.module('loginApp.controllers')
    .controller('RegisterController', function ($scope, AuthService, $window) {
        $scope.registerData = {};
        $scope.message = '';

        $scope.register = function () {
            AuthService.register($scope.registerData)
                .then(function (response) {
                    $scope.message = 'Đăng ký thành công! Vui lòng đăng nhập.';
                    $window.location.href = 'index.html';
                })
                .catch(function (error) {
                    if (error.data && error.data.message) {
                        $scope.message = error.data.message;
                    } else {
                        $scope.message = 'Đăng ký thất bại. Vui lòng thử lại.';
                    }
                });
        };
    });
