// First we need to import axios.js
import axios from "axios";
const url1 = "https://plms-0a2c20251af6.herokuapp.com";
const url = "http://localhost:8080";
// Next we make an 'instance' of it
const instance = axios.create({
  baseURL: url1,
});
instance.defaults.withCredentials = true;

export default instance;
