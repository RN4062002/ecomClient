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

    const register = async(formData) =>
    {
        try
        {
            const payload = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                userName: formData.userName,
                email: formData.email,
                password: formData.password
            };
            const res = await registerApi(payload);
            console.log(res);

        return true;
        }
        catch(error)
        {
            console.log(error);
        }
    }

    const login = async(userData,passData) => {
        debugger
        try
        {
            setLoader(true);
            const data = await loginApi(userData,passData);
            localStorage.setItem("token",data.token);
            const decoded = jwtDecode(data.token);
            console.log("user data log :",decoded);
            setUser(decoded);
           setLoader(false);
           return data.token;

        }
        catch(error)
        {
            console.log(error);
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
