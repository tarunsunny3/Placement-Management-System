// First we need to import axios.js
import axios from 'axios';
const url1 = "https://plms-project.herokuapp.com"
const url = "http://localhost:8080";
// Next we make an 'instance' of it
const instance = axios.create({
    baseURL: url
});
instance.defaults.withCredentials = true;


export default instance;
