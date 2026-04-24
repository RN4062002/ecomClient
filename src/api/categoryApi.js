import axiosInstance from "../services/axiosInstance";

export const getCategoriesApi = async () => {
    const response = await axiosInstance.get("Category/GetCategories");
    return response.data;
};

export const getCategoryByIdApi = async (id) => {
    const response = await axiosInstance.get(`Category/GetCategory/${id}`);
    return response.data;
};

export const addCategoryApi = async (categoryData) => {
    const response = await axiosInstance.post("Category/AddCategory", categoryData);
    return response.data;
};

export const updateCategoryApi = async (id, categoryData) => {
    const response = await axiosInstance.put(`Category/UpdateCategory/${id}`, categoryData);
    return response.data;
};

export const deleteCategoryApi = async (id) => {
    const response = await axiosInstance.delete(`Category/DeleteCategory/${id}`);
    return response.data;
};
