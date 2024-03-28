import axios from "axios"
import { API_URL } from "../Utility/common"

export type User = {
  userId: string
  name: string,
  email: string,
  password: string,
  createDate: Date
  organization: UserOrganization | null
  contactList: UserContact[]
}
export type UserContact = {
  userId: string
  contactId: string,
  relation: string,
  name: string,
  createDate: Date
}
export type UserOrganization = {
  orgId: string
  orgName: string,
  orgAddress:string
  createDate: Date
}
export type EmailVerfication = {
  verficationCode: string
  email: string
}
export type Login = {
  id:string
  email: string
  password: string,
}


export const getAllUser = async () => {
  const response = await axios.get(`${API_URL}/getAllUser`);
  return response.data;
};
export const getUserById = async (userId: string, createDate: any) => {
  const response = await axios.get(`${API_URL}/getById/${userId}/date/${createDate}`);
  return response.data;
};
export const addUser = async (user: User) => {
  const response = await axios.post(`${API_URL}/addUser/`, user);
  return response.data;
};

export const updateUser = async (userId: string, createDate: Date, user: User) => {
  const response = await axios.put(`${API_URL}/updateUser/${userId}/${createDate}`, user);
  return response.data;
};

export const deleteUser = async (userId: string, createDate: Date,) => {
  const response = await axios.delete(`${API_URL}/deleteUser/${userId}/${createDate}`);
  return response.data;
};

export const filterUserByName = async (name: string) => {
  const response = await axios.get(`${API_URL}/getUserListByName/${name}`);
  return response.data;
};
export const filterUserByDateRange = async (fromDate: string, toDate: string) => {
  const response = await axios.get(`${API_URL}/getUserListByDateRange/?start_date=${fromDate}&end_date=${toDate}`);
  return response.data;
};

//auth
export const signUpUser = async (user: User) => {
  const response = await axios.post(`${API_URL}/signup`, user);
  return response.data;
};
export const verificationEmail = async (data: EmailVerfication) => {
  const response = await axios.post(`${API_URL}/verification`, data);
  return response.data;
};
export const loginUser = async (data: Login) => {
  const response = await axios.post(`${API_URL}/login`, data);
  return response.data;
};