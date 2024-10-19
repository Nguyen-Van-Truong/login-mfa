// login-app\services\AuthService.js
angular.module('loginApp.services')
    .factory('AuthService', function ($http, $window) {
        const apiBaseUrl = 'http://localhost:3000';

        function login(data) {
            return $http.post(`${apiBaseUrl}/login`, data);
        }

        function verifyMFA(mfaCode, email) {
            return $http.post(`${apiBaseUrl}/verify-mfa`, { mfaCode, email })
                .then(function (response) {
                    localStorage.setItem('accessToken', response.data.accessToken);
                    localStorage.setItem('refreshToken', response.data.refreshToken);
                });
        }

        function getProfile() {
            const accessToken = localStorage.getItem('accessToken');
            return $http.get(`${apiBaseUrl}/profile`, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
        }

        function logout() {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            $window.location.href = '/login-app/public/index.html';
        }

        function register(data) {
            return $http.post(`${apiBaseUrl}/register`, data);
        }

        // Thêm hàm làm mới token
        function refreshToken() {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                return Promise.reject('No refresh token available');
            }

            // Gửi yêu cầu làm mới token
            return $http.post(`${apiBaseUrl}/token`, { token: refreshToken })
                .then(function (response) {
                    localStorage.setItem('accessToken', response.data.accessToken);
                    return response.data.accessToken;
                })
                .catch(function (error) {
                    console.error('Error refreshing token:', error);
                    logout();  // Đăng xuất nếu làm mới token thất bại
                    return Promise.reject(error);
                });
        }

        return {
            login,
            verifyMFA,
            getProfile,
            logout,
            register,
            refreshToken 
        };
    });
