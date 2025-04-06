import axios from 'axios';


const AxiosClient = axios.create({
  baseURL: import.meta.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
});

export default AxiosClient;