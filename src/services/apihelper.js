import AXIOS from 'axios';
const BASE_HEADERS = "";

class A {
    get(url) {
        return AXIOS.get(url)
    }
    post(url, data) {
        return AXIOS.post(url, data, { 
            headers: this.getHeaders(true),
            withCredentials: false}
          )
    }
    getHeaders(multipart = false) {
        let defaultHeaders = BASE_HEADERS;
        if (multipart) {
          defaultHeaders = { "Content-Type": "multipart/form-data" };
        }
        return defaultHeaders;
      }
}
export default A;