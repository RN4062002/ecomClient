import React, { useContext, useState, useEffect } from 'react';
import { useAuth } from '../../contexts/authContext';
import Loader from '../Items/Loader';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const Login = () => {
    const { login, loader, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (user) {
            if (from !== "/") {
                navigate(from, { replace: true });
            } else if (user.UserType == "Admin") {
                navigate("/Admin/ProductList");
            } else {
                navigate("/ProductList");
            }
        }
    }, [user, navigate, from]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(userName, password);
        if (success) {}
    };

    return (
        <div className="login-container">
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                    <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Login</h2>
                    {loader && <Loader/>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                                UserName
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                required
                                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
      </div>
    )
};

export default Login;