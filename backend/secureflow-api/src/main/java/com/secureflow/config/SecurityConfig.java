package com.secureflow.config;

import com.secureflow.security.JwtAuthenticationFilter;
import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * Configures JWT-backed role-based access for Secure Flow APIs.
 *
 * Static frontend pages remain accessible because browser navigation does
 * not attach an Authorization header. Protected application data continues
 * to be enforced by the role-restricted API endpoints.
 */
@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter
    ) {
        this.jwtAuthenticationFilter =
                jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
                .csrf(csrf ->
                        csrf.disable()
                )
                .cors(cors ->
                        cors.configurationSource(
                                corsConfigurationSource()
                        )
                )
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )
                .authorizeHttpRequests(auth -> auth

                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        )
                        .permitAll()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/",
                                "/index.html",
                                "/index.css",
                                "/favicon.ico",
                                "/assets/**",
                                "/auth/**",
                                "/customer/**",
                                "/dashboard/**",
                                "/workflow/**",
                                "/report/**",
                                "/notification/**",
                                "/login",
                                "/register",
                                "/client",
                                "/employee",
                                "/manager",
                                "/admin",
                                "/eligibility",
                                "/apply",
                                "/application",
                                "/reports",
                                "/notifications"
                        )
                        .permitAll()

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/auth/login",
                                "/api/auth/register/customer",
                                "/api/logs/frontend"
                        )
                        .permitAll()

                        .requestMatchers(
                                "/error"
                        )
                        .permitAll()

                        .requestMatchers(
                                "/api/customer/**",
                                "/api/eligibility/**"
                        )
                        .hasRole("CUSTOMER")

                        .requestMatchers(
                                "/api/employee/**",
                                "/api/reports/**",
                                "/api/dashboard/**",
                                "/api/workflows/**"
                        )
                        .hasRole("EMPLOYEE")

                        .requestMatchers(
                                "/api/manager/**"
                        )
                        .hasRole("MANAGER")

                        .requestMatchers(
                                "/api/admin/**"
                        )
                        .hasRole("ADMIN")

                        .anyRequest()
                        .authenticated()
                )
                .exceptionHandling(exceptions ->
                        exceptions
                                .authenticationEntryPoint(
                                        (
                                                request,
                                                response,
                                                exception
                                        ) -> {
                                            response.setStatus(
                                                    401
                                            );

                                            response.setContentType(
                                                    "application/json"
                                            );

                                            response.getWriter()
                                                    .write(
                                                            "{\"message\":\"Unauthorized\"}"
                                                    );
                                        }
                                )
                                .accessDeniedHandler(
                                        (
                                                request,
                                                response,
                                                exception
                                        ) -> {
                                            response.setStatus(
                                                    403
                                            );

                                            response.setContentType(
                                                    "application/json"
                                            );

                                            response.getWriter()
                                                    .write(
                                                            "{\"message\":\"Forbidden\"}"
                                                    );
                                        }
                                )
                )
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOriginPatterns(
                List.of(
                        "http://localhost:*",
                        "http://127.0.0.1:*"
                )
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of(
                        "Authorization",
                        "Content-Type"
                )
        );

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }
}
