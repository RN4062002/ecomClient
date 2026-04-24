import axiosInstance from "../services/axiosInstance";

export const loginApi = async (userName,password) => { 
    const response = await axiosInstance.post("Auth/login",{
        userName,
        password,
    });
    return response.data;
}


export const registerApi = async (data) => {
    const response = await axiosInstance.post("Auth/register",
        data,
    );
    return response.data;
}