import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from "@nestjs/common"

import type { Request, Response } from "express"

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>()
        const request = ctx.getRequest<Request>()

        const status =
            exception instanceof HttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
            this.logger.error(
                `Erro crítico (500) na rota ${request.url}`, 
                exception instanceof Error ? exception.stack : exception
            );
        }

        const exceptionResponse =
            exception instanceof HttpException
            ? exception.getResponse()
            : "Internal Server Error";

    
        const message =
            typeof exceptionResponse === "string"
            ? exceptionResponse
            : ((exceptionResponse as Record<string, unknown>).message ?? exceptionResponse)

        response.status(status).json({
            statusCode: status,
            message, 
            timestamp: new Date().toISOString(),
            path: request.url,
        })
    }
}