// Define the error response object
export interface ErrorResponse {
    error: boolean;
    status: number;
    errorType: string;
    message: string;
}

// Function used to pretty log the error
const logError = (errorResponse: ErrorResponse) => {
    console.log('\nERROR:');
    console.log('Status:', errorResponse.status);
    console.log('Message:', errorResponse.message);
}

// Function that handles errors
export const getError = (error: any, ctx: Context) => {
    // Check if the error is from the API or the code
    if (error.response) {
        // Get message
        let message: string = 'No error message was returned';
        if (error.response.data.Message) {
            message = error.response.data.Message;
        } else if (error.response.data) {
            message = error.response.data;
        } else if (error.response.data.error.message) {
            message = error.response.data.error.message;
        }
        // Build error response
        const errorResponse: ErrorResponse = {
            error: true,
            status: error.response.status,
            errorType: error.message,
            message
        }
        // Return and log error
        ctx.body = errorResponse;
        ctx.status = errorResponse.status;

        logError(errorResponse);
    } else {
        // Log error
        console.log(error);
    }
    throw new Error(error);
}
