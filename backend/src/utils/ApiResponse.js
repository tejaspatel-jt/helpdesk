class ApiResponse {
    constructor(statusCode, data, message="Success",){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }
}

class ticketResponse {
    constructor(statusCode, data, message = "Success", total) {
      this.statusCode = statusCode;
      this.data = {
        total: total,
        tickets: data,
      };
      this.message = message;
      this.success = statusCode < 400;
    }
  }
export {ApiResponse,ticketResponse }