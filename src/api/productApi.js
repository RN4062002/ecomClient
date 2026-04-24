import axiosInstance from "../services/axiosInstance";

export const getAllProductsApi = async (categoryId = null, pageNumber = 1, pageSize = 10, search = "") => {
    let url = `Product/GetAllProducts?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    if (categoryId) {
        url += `&categoryId=${categoryId}`;
    }
    if (search) {
        url += `&search=${encodeURIComponent(search)}`;
    }
    const response = await axiosInstance.get(url);
    return response.data;
};

export const getProductByIdApi = async (productId) => {
    const response = await axiosInstance.get(`Product/GetProduct/${productId}`);
    return response.data;
};

export const insertProductApi = async (formData) => {
    // Note: Letting Axios set the Content-Type automatically for FormData
    const response = await axiosInstance.post("Product/InsertProduct", formData);
    return response.data;
};

export const updateProductApi = async (formData) => {
    // Note: Letting Axios set the Content-Type automatically for FormData
    const response = await axiosInstance.put("Product/UpdateProduct", formData);
    return response.data;
};

export const deleteProductApi = async (productId) => {
    const response = await axiosInstance.delete(`Product/DeleteProduct/${productId}`);
    return response.data;
};
