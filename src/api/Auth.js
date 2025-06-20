import { http } from "./Http";

export const AuthApi = {
    login: (username, password) =>
        http.post("/auth/test-log-in", { username, password }),

    resetPassword: (username, email) =>
        http.post("/auth/reset-password", null, {
            params: { username, email },
        }),
};
