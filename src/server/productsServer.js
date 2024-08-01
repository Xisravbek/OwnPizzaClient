import axios from "axios";

const serverURL = process.env.REACT_APP_SERVER_URL;

const API = axios.create({baseURL: serverURL})

export const getAllProducts = async () => {
    let res = await API.get(`/products/`)
    return res.data;
}
export const getOneProduct = async (id) => {
    let res = await API.get(`/products/${id}`)
    return res.data;
}
export const addProduct = async (formData) => {
    const token = localStorage.getItem('token')
    let res = await API.post(`/products/`, formData , {headers: {token}})
    return res.data;
}

export const deleteProduct = async (id) => {
    const token = localStorage.getItem('token')
    let res = await API.delete(`/products/${id}` , {headers: {token}})
    return res.data;
}

