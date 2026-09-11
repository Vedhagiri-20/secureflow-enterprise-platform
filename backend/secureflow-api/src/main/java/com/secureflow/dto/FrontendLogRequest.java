package com.secureflow.dto;

/**
 * Represents a browser-side diagnostic event sent to the backend logger.
 */
public record FrontendLogRequest(
        String level,
        String message,
        String page,
        String stack
) {
}
