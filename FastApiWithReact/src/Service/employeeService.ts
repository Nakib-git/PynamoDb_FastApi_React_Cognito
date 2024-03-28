
import axios from 'axios';
import { API_URL } from '../Utility/common';

export const getAllEmployees = async () => {
  const response = await axios.get(`${API_URL}/getAllEmployees`);
  return response.data;
};

export const addEmployee = async (employee: any) => {
  const response = await axios.post(`${API_URL}/addEmployee/`, employee);
  return response.data;
};

export const updateEmployee = async (employeeId: string, createDate: Date, employee: any) => {
  const response = await axios.put(`${API_URL}/updateEmployee/${employeeId}/${createDate}`, employee);
  return response.data;
};

export const deleteEmployee = async (employeeId: string, createDate: Date,) => {
  const response = await axios.delete(`${API_URL}/deleteEmployee/${employeeId}/${createDate}`);
  return response.data;
};
export const filterEmployeeByName = async (name: string) => {
  const response = await axios.get(`${API_URL}/getEmployeeListByName/${name}`);
  return response.data;
};
export const filterEmployeeByDateRange = async (fromDate: string, toDate: string) => {
  const response = await axios.get(`${API_URL}/getEmployeeListByDateRange/?start_date=${fromDate}&end_date=${toDate}`);
  return response.data;
};

export type Employee = {
  employeeId: string
  name: string,
  phoneNo: string,
  age: number,
  createDate: Date
}
