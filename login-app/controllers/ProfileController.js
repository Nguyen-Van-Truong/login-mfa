angular.module('loginApp.controllers')
    .controller('ProfileController', function ($scope, AuthService, $window) {
        $scope.userInfo = {};

        $scope.getProfile = function () {
            AuthService.getProfile()
                .then(function (response) {
                    $scope.userInfo = response.data;
                })
                .catch(function (error) {
                    console.log('Lỗi khi lấy thông tin người dùng:', error);
                });
        };

        $scope.getProfile();

        $scope.logout = function () {
            AuthService.logout();
            $window.location.href = '/login-app/public/index.html';
        };
    });
