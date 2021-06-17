class Validation{
    validateName(name) {
        var regex = /^[a-zA-Z ]+$/;
        if (regex.test(name) == false) {
          return false;
        } else {
          return true;
        }
      }
      validateIP(ip) {
        var regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if (regex.test(ip) == false) {
          return false;
        } else {
          return true;
        }
      }
      // /^[0-9]+\.[0-9]+$/;
      validateFloatNumber(num){
        var regex =  /^[0-9]*[.]?[0-9]+$/;
        if (regex.test(num) == false) {
          return false;
        } else {
          return true;
        }
      }
      validateString(str){
        var regex =  /^[a-zA-Z0-9_ ]*$/;
        if (regex.test(str) == false) {
          return false;
        } else {
          return true;
        }
      }
}
export default Validation