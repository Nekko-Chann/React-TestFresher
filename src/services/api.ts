import axios from "services/axios.customize.ts";

const loginAPI = (username: string, password: string)=>{
    const urlBackend = "/api/v1/auth/login";
    const data = {username, password}
    return axios.post<IBackendRes<ILogin>>(urlBackend, data,{
        headers:{
            delay: 3000
        }
    });
}

const registerAPI = (fullName: string, email: string, password: string, phone: number)=>{
    const urlBackend = "/api/v1/user/register";
    const data = {fullName, email, password, phone}
    return axios.post<IBackendRes<IRegister>>(urlBackend, data);
}

export {
    loginAPI, registerAPI
}