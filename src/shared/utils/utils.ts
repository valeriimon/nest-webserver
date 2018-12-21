import { Response } from "shared/models/response";

export const getResponse = <T>(promise: Promise<T>, operation: string, successMsg?: string): Promise<Response> => {
    return promise
    .then(
        result => new Response(true, result, successMsg ? successMsg : `${operation} - succesed`, null)
    )
    .catch(
        err => {
            const resp = new Response(false, null, `${operation} - failed`, {
                error: 'Something went wrong',
            });

            if(err.message.includes('MySQL')) {
                resp.error.mysql_err = err.message;
            }
            if(operation == 'Validation') {
                resp.error.validation_err = err.message
            }
            
            return resp
        }
    )
        
    
}