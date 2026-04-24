import React, { useState } from 'react';
import { useAuth } from '../../contexts/authContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const {register} = useAuth();
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        userName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    
            const handleChange = (e) => {
                debugger
                const { name, value } = e.target;
                setFormData(prev => ({
                    ...prev,
                    [name]: value
                }));
            };
        
            const validateForm = () => {
                debugger
                const newErrors = {};
                
                if (!formData.firstName.trim()) newErrors.firstName = 'Name is required';
                if (!formData.lastName.trim()) newErrors.lastName = 'Last Name is required';
                if (!formData.userName.trim()) newErrors.userName = 'Username is required';
                if (!formData.email.trim()) newErrors.email = 'Em1ail is required';
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                    newErrors.email = 'Invalid email format';
                }
                if (formData.password.length < 6) {
                    newErrors.password = 'Password must be at least 6 characters';
                }
                if (formData.password !== formData.confirmPassword) {
                    newErrors.confirmPassword = 'Passwords do not match';
                }
        
                setErrors(newErrors);
                return Object.keys(newErrors).length === 0;
            };
        
            const handleSubmit = async (e) => {
                e.preventDefault();
               debugger
                if (!validateForm()) return;
            
                const success =  await register(formData);
            
                if (success) {
                    alert("User registered successfully");
                    navigate("/login");
                }
            };
        
            return (
                <div className="flex items-center justify-center min-h-screen bg-gray-100">
                    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Register</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
                                   Last Name
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="userName" className="block mb-2 text-sm font-medium text-gray-700">
                                   User Name
                                </label>
                                <input
                                    type="text"
                                    id="userName"
                                    name="userName"
                                    value={formData.userName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.userName && <p className="mt-1 text-sm text-red-500">{errors.userName}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                            </div>
                            <div className="mb-6">
                                <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
                            </div>
                            <button
                                type="submit"
                                className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Register
                            </button>
                        </form>
                    </div>
                </div>
            );
        };
        

export default Register;