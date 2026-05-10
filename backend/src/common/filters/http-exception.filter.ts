import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from "@nestjs/common"
import { timestamp } from "drizzle-orm/gel-core"

import type { Request, Response } from "express"
import path from "path"

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>()
        const request = ctx.getRequest<Request>()

        const status =
            exception instanceof HttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        const exceptionResponse =
        exception instanceof HttpException
        ? exception.getResponse()
        : "Internal Server Error";

        const mensage =
        typeof exceptionResponse === "string"
        ? exceptionResponse
        : ((exceptionResponse as Record<string, unknown>).mensage ?? exceptionResponse)

        response.status(status).json({
            statusCode: status,
            mensage,
            timestamp: new Date().toISOString(),
            path: request.url,
        })
    }
}