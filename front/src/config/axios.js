import axios from 'axios';


const AxiosClient = axios.create({
  baseURL: import.meta.env.REACT_APP_API_URL || 'https://recetario-production.up.railway.app/api',
  timeout: 10000,
});

export default AxiosClient;
