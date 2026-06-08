import React, { createContext,useContext,useState,useEffect } from "react";
const AuthContext = createContext();
import {loginApi,registerApi} from "../api/authApi";
import { jwtDecode } from "jwt-decode";


export const AuthContextProvider = ({children}) =>{
    const [user,setUser] = useState(null);
    const [loader,setLoader] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decoded = jwtDecode(token);
            setUser(decoded);
        }
    }, []);

const register = async (formData) => {
    try 
    {
        debugger
        const payload = 
        {
            firstName: formData.firstName,
            lastName: formData.lastName,
            userName: formData.userName,
            email: formData.email,
            password: formData.password
        };
        const res = await registerApi(payload);
        return { success: true };
    } 
    catch (error) 
    {
        console.log(error);
        const message = error?.response?.data || error?.response?.data?.message || "Registration failed. Please try again.";
        return { success: false, message };
    }
};

 const login = async (userData, passData) => {
    try {
        setLoader(true);
        const data = await loginApi(userData, passData);
        localStorage.setItem("token", data.token);
        const decoded = jwtDecode(data.token);
        setUser(decoded);
        return { success: true };
    } catch (error) {
        console.log(error);
        const message = error?.response?.data || error?.response?.data?.message || "Something went wrong. Please try again.";
        return { success: false, message };
    } finally {
        setLoader(false); 
    }
};

    const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setLoader(false);
    return true;
  };

    return (
        <AuthContext.Provider value={{user,login,logout,loader,register}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
