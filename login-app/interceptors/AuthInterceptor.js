// login-app\interceptors\AuthInterceptor.js
angular.module('loginApp.interceptors')
    .factory('authInterceptor', function ($q, $window, $injector) {
        let isRefreshing = false;
        let refreshPromise;

        // Hàm xóa token khi phiên làm việc hết hạn hoặc refresh token không hợp lệ
        function clearSession() {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            $window.alert('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.');
            $window.location.href = '/login-app/public/index.html';
        }

        return {
            request: function (config) {
                const token = localStorage.getItem('accessToken');
                if (token) {
                    config.headers.Authorization = 'Bearer ' + token;
                }
                return config;
            },
            responseError: function (response) {
                const $http = $injector.get('$http');
                const refreshToken = localStorage.getItem('refreshToken');
                const isLoginOrMFA = response.config.url.includes('/login') || response.config.url.includes('/verify-mfa');

                if (isLoginOrMFA) {
                    return $q.reject(response);
                }

                // Nếu không có refresh token hoặc gặp lỗi 403 khi làm mới token, xóa session
                if (!refreshToken || (response.status === 403 && response.config.url.includes('/token'))) {
                    clearSession();
                    return $q.reject(response);
                }

                // Nếu lỗi 401 hoặc 403 do access token hết hạn
                if (response.status === 401 || response.status === 403) {
                    if (!isRefreshing) {
                        isRefreshing = true;
                        refreshPromise = $http.post('http://localhost:3000/token', { token: refreshToken })
                            .then(function (res) {
                                isRefreshing = false;
                                localStorage.setItem('accessToken', res.data.accessToken);
                                // Cập nhật lại header Authorization cho yêu cầu ban đầu
                                response.config.headers.Authorization = 'Bearer ' + res.data.accessToken;
                                return $http(response.config); // Thực hiện lại yêu cầu ban đầu
                            })
                            .catch(function (error) {
                                isRefreshing = false;
                                clearSession();  // Xóa session nếu làm mới token thất bại
                                return $q.reject(error);
                            });
                        return refreshPromise;
                    } else {
                        // Nếu đang làm mới token, đợi promise hoàn tất và thử lại yêu cầu
                        return refreshPromise.then(function () {
                            response.config.headers.Authorization = 'Bearer ' + localStorage.getItem('accessToken');
                            return $http(response.config);
                        });
                    }
                }

                return $q.reject(response);
            }
        };
    })
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    });
