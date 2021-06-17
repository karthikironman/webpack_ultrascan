import a from "./apihelper"
const apihelper = new a();
const base_address = process.env.REACT_APP_IP_ADDRESS;
class exampleService {
    exampleGet() {
        const url = base_address+ "/url1";
        return apihelper.get(url)
     }

     saveISOTime(data){
        const url = base_address+ "/url2";
        return apihelper.post(url,data)
     }
}
export default exampleService;