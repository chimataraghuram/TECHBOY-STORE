from rest_framework.views import exception_handler

def custom_exception_handler(exc, context):
    # Call REST framework's default exception handler first,
    # to get the standard error response.
    response = exception_handler(exc, context)

    if response is not None:
        error_msg = "An error occurred."
        
        # If response.data is a dict containing multiple field errors
        if isinstance(response.data, dict):
            if 'detail' in response.data:
                error_msg = str(response.data['detail'])
            else:
                # Get the first error field
                for key, value in response.data.items():
                    if isinstance(value, list) and len(value) > 0:
                        error_msg = f"{key}: {value[0]}"
                    else:
                        error_msg = f"{key}: {str(value)}"
                    break
        elif isinstance(response.data, list) and len(response.data) > 0:
            error_msg = str(response.data[0])
            
        response.data = {"error": error_msg}

    return response
