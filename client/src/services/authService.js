import axios from 'axios'
import api from '../utils/axios'

const apiUrl = 'http://localhost:5000/api/auth'

export const login = async (email, password) => {
  try {

    const { data } = await axios.post(`${apiUrl}/login`, { email, password })

    localStorage.setItem('token', data.token)
    const user = data.user
    localStorage.setItem('user', JSON.stringify(user))

    return user
  } catch (error) {
    console.error('Login failed:', error)
    return null
  }
}

export const register = async(name,role,department) => {
  try {
    const {data} = await api.post(`auth/register`,{name,email:`${name}@iitk.ac.in`,role,department,password:name});
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

export const fetchUsers = async()=>{
  try {
    const {data} = await api.get(`auth/users`);
    // console.log(data);
    return data.users;
  } catch (error) {
    console.log(error)
    return null
  }
}

export const getRegistrationStatus = async()=>{
  try {
    const response = await api.get('/auth/get-registration-status');
    return response.data
  } catch (error) {
    console.log('Error Fetching Registataion Status');
    throw error;
  }
}

export const setRegistrationStatus = async (isOpen) => {
  try {
    const response = await api.post('/auth/set-registration-status',{isOpen})
    return response.data
  } catch (error) {
    console.log('Error Setting Registataion Status')
    throw error
  }
}

export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}


export const getUser = () => {
  const user = localStorage.getItem('user')
  if(user)return JSON.parse(user);

  return null;
}


