package com.secureflow.controller;

import com.secureflow.dto.FrontendLogRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * Receives sanitized browser diagnostics so frontend failures are visible
 * in the same server logging environment as backend failures.
 */
@RestController
@RequestMapping("/api/logs")
public class FrontendLogController {

    private static final Logger FRONTEND_LOGGER =
            LoggerFactory.getLogger("FRONTEND");

    @PostMapping("/frontend")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logFrontendEvent(
            @RequestBody FrontendLogRequest request
    ) {
        String level = clean(
                request.level(),
                20
        ).toUpperCase();

        String page = clean(
                request.page(),
                300
        );

        String message = clean(
                request.message(),
                1500
        );

        String stack = clean(
                request.stack(),
                3000
        );

        String formattedMessage =
                "page={} message={} stack={}";

        switch (level) {
            case "ERROR" ->
                    FRONTEND_LOGGER.error(
                            formattedMessage,
                            page,
                            message,
                            stack
                    );

            case "WARN" ->
                    FRONTEND_LOGGER.warn(
                            formattedMessage,
                            page,
                            message,
                            stack
                    );

            default ->
                    FRONTEND_LOGGER.info(
                            formattedMessage,
                            page,
                            message,
                            stack
                    );
        }
    }

    private String clean(
            String value,
            int maximumLength
    ) {
        if (value == null) {
            return "-";
        }

        String cleaned = value
                .replace('\r', ' ')
                .replace('\n', ' ')
                .trim();

        if (cleaned.length() <= maximumLength) {
            return cleaned;
        }

        return cleaned.substring(
                0,
                maximumLength
        );
    }
}
