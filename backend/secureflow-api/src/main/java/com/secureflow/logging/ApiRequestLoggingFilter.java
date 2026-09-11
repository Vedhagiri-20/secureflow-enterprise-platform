package com.secureflow.logging;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Records API access without logging request bodies, passwords, tokens,
 * query strings, or other sensitive values.
 */
@Component
public class ApiRequestLoggingFilter
        extends OncePerRequestFilter {

    private static final Logger LOGGER =
            LoggerFactory.getLogger(
                    ApiRequestLoggingFilter.class
            );

    @Override
    protected boolean shouldNotFilter(
            HttpServletRequest request
    ) {
        String path =
                request.getRequestURI();

        return !path.startsWith("/api/")
                || path.equals(
                        "/api/logs/frontend"
                );
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        long startedAt =
                System.currentTimeMillis();

        try {
            filterChain.doFilter(
                    request,
                    response
            );
        } finally {
            long duration =
                    System.currentTimeMillis()
                    - startedAt;

            LOGGER.info(
                    "HTTP {} {} status={} durationMs={}",
                    request.getMethod(),
                    request.getRequestURI(),
                    response.getStatus(),
                    duration
            );
        }
    }
}
