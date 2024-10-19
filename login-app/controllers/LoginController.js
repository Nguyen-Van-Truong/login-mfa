// login-app\controllers\LoginController.js
angular.module('loginApp.controllers')
    .controller('LoginController', function ($scope, AuthService, $window) {
        $scope.loginData = {};
        $scope.mfaStep = false;
        $scope.message = '';

        $scope.login = function () {
            AuthService.login($scope.loginData)
                .then(function () {
                    $scope.mfaStep = true;
                    $scope.email = $scope.loginData.username;
                    $scope.message = 'Đã đăng nhập thành công. Vui lòng nhập mã MFA được gửi đến email.';
                })
                .catch(function () {
                    $scope.message = 'Sai tài khoản hoặc mật khẩu.';
                });
        };

        $scope.setMfaCode = function (event) {
            $scope.mfaCode = event.target.value;
        };

        $scope.verifyMFA = function () {
            if (!$scope.mfaCode || $scope.mfaCode === '') {
                $scope.message = 'Vui lòng nhập mã MFA.';
                return;
            }

            AuthService.verifyMFA($scope.mfaCode, $scope.email)
                .then(function () {
                    $window.location.href = '/login-app/public/login_success.html';
                })
                .catch(function () {
                    $scope.message = 'Mã MFA không hợp lệ.';
                });
        };
    });
