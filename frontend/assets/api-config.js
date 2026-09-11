(function configureSecureFlowApi() {
    const localHosts = new Set([
        "localhost",
        "127.0.0.1",
        "::1"
    ]);

    const runningLocalFrontend =
        localHosts.has(window.location.hostname)
        && window.location.port !== "8080";

    const apiBase =
        runningLocalFrontend
            ? "http://localhost:8080"
            : window.location.origin;

    window.SECUREFLOW_API_BASE =
        apiBase;

    window.secureFlowApiUrl =
        function secureFlowApiUrl(path) {
            const normalizedPath =
                String(path || "")
                    .startsWith("/")
                    ? String(path)
                    : `/${path}`;

            return `${apiBase}${normalizedPath}`;
        };
})();
