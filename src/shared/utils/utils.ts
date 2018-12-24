import { Response } from "shared/models/response";

export interface CustomError{
    err_stack: {[property: string]: any}
}

export function isCustomError(data: any): data is CustomError {
    return data.hasOwnProperty('err_stack')
}

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
            // Sql internal errors and errors from typeORM
            if(err.message && err.message.includes('MySQL') && err.hasOwnProperty('sqlMessage')) {
                resp.error.mysql_err = err.message;
            }
            // Validation errors
            if(operation == 'Validation') {
                resp.error.validation_err = err.message
            }
            // Custom errors
            if(isCustomError(err)) {
                resp.error = err.err_stack;
            }
            
            return resp
        }
    )
        
    
}