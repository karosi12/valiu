class Responses {
    constructor() {
      return this;
    }
    public success(errorCode: number, data: object | null, message: string) {
      return {
        error: false,
        errorCode,
        data,
        message
      };
    }
    public error(errorCode: number, message: string) {
      return {
        error: true,
        errorCode,
        message
      };
    }
  
    public output(statusCode: number, message: string, data: object, meta: object) {
      return {
        error: false,
        statusCode,
        message,
        data,
        meta,
      };
    }
  }
  
  export const responsesHelper = new Responses();
  