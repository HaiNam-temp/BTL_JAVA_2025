# Multi-stage Dockerfile for shopapp
# Stage 1: build with Maven (uses the wrapper in the repo)
FROM eclipse-temurin:21-jdk AS build
WORKDIR /workspace

# Copy Maven wrapper and pom
COPY mvnw mvnw
COPY .mvn .mvn
COPY pom.xml pom.xml

# Copy source
COPY src src

# Make mvnw executable and build. Run spring-boot:repackage to ensure an executable (fat) jar
RUN chmod +x mvnw && \
    ./mvnw -B -ntp clean package -DskipTests spring-boot:repackage

# Stage 2: runtime
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy the executable jar from the build stage (use wildcard to match versioned name)
COPY --from=build /workspace/target/*-SNAPSHOT.jar app.jar

# Expose the port Spring Boot uses by default
EXPOSE 8080

# Support passing additional JVM options via JAVA_OPTS
ENV JAVA_OPTS=""

# Run the jar
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar /app/app.jar"]
