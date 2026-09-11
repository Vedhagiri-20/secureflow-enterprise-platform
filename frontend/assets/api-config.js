(function configureSecureFlowApi() {
    const localHosts = new Set([
        "localhost",
        "127.0.0.1",
        "::1",
        "[::1]"
    ]);

    const separateLocalFrontend =
        localHosts.has(
            window.location.hostname
        )
        && window.location.port !== "8080";

    const apiBase =
        separateLocalFrontend
            ? "http://localhost:8080"
            : window.location.origin;

    window.SECUREFLOW_API_BASE =
        apiBase;

    window.secureFlowApiUrl =
        function secureFlowApiUrl(path) {
            const value =
                String(path || "");

            const normalizedPath =
                value.startsWith("/")
                    ? value
                    : `/${value}`;

            return `${apiBase}${normalizedPath}`;
        };
})();
