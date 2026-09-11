FROM eclipse-temurin:21-jdk AS build

WORKDIR /workspace

COPY . .

RUN rm -rf backend/secureflow-api/src/main/resources/static \
    && mkdir -p backend/secureflow-api/src/main/resources/static \
    && cp -R frontend/. backend/secureflow-api/src/main/resources/static/

WORKDIR /workspace/backend/secureflow-api

RUN chmod +x mvnw \
    && ./mvnw clean package -DskipTests


FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=build \
    /workspace/backend/secureflow-api/target/secureflow-api-*.jar \
    /app/secureflow.jar

ENV PORT=10000

EXPOSE 10000

ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75.0", "-jar", "/app/secureflow.jar"]
