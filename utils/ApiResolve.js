class ApiResolve{
    constructor(statuscode,message="Success",data,)
    {
        super(message)
        this.statuscode = statuscode;
        this.message = message;
        this.data = data;
        this.success = statuscode<400
    }
}