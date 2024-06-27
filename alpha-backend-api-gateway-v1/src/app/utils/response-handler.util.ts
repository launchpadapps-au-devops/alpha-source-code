interface ResponseHandlerOptions {
    message?: string;
    data?: any;
    statusCode?: number;
    meta?: {
      page?: number;
      pageSize?: number;
      totalPages?: number;
      totalResults?: number;
    };
  }
  
  export const responseHandler = ({ message, data, statusCode, meta }: ResponseHandlerOptions) => {
    return {
      statusCode: statusCode || 200,
      message: message || 'Success',
      data: data || null,
      meta: meta || {},
    };
  };
  