import axios from "services/axios.customize.ts";

const loginAPI = (username: string, password: string) => {
    const urlBackend = "/api/v1/auth/login";
    const data = {username, password}
    return axios.post<IBackendRes<ILogin>>(urlBackend, data, {
        headers: {
            delay: 2000
        }
    });
}

const registerAPI = (fullName: string, email: string, password: string, phone: number) => {
    const urlBackend = "/api/v1/user/register";
    const data = {fullName, email, password, phone}
    return axios.post<IBackendRes<IRegister>>(urlBackend, data);
}

const logoutAPI = () => {
    const urlBackend = "/api/v1/auth/logout";
    return axios.post<IBackendRes<ILogin>>(urlBackend);
}

const fetchAccountAPI = () => {
    const urlBackend = "/api/v1/auth/account";
    return axios.get<IBackendRes<IFetchAccount>>(urlBackend, {
        headers: {
            delay: 1500
        }
    });
}

const getUsersAPI = (query: string)=>{
    const urlBackend = `/api/v1/user?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IUserTable>>>(urlBackend);
}

export {
    loginAPI, registerAPI, fetchAccountAPI, logoutAPI, getUsersAPI
}