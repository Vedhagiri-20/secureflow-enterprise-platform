package com.secureflow.exception;

import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Converts backend failures into consistent API responses and records
 * diagnostic information in the backend log.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger LOGGER =
            LoggerFactory.getLogger(
                    GlobalExceptionHandler.class
            );

    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleRuntimeException(
            RuntimeException exception
    ) {
        String message =
                exception.getMessage() == null
                        ? "Request failed"
                        : exception.getMessage();

        LOGGER.warn(
                "Request failed: {}",
                message
        );

        return Map.of(
                "message",
                message
        );
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Map<String, String> handleException(
            Exception exception
    ) {
        LOGGER.error(
                "Unexpected server error",
                exception
        );

        return Map.of(
                "message",
                "Unexpected server error"
        );
    }
}
