FROM gradle:jdk17 AS build

WORKDIR /app
COPY . /app/

RUN gradle clean build shadowJar --no-daemon --refresh-dependencies

FROM openjdk:17-slim

WORKDIR /app
COPY --from=build /app/build/libs/*.jar /app/app.jar
# COPY --from=build /app/src/main/resources /app/resources

ENV DISCORD_TOKEN=""
ENV DISCORD_CHANNEL=""

CMD ["java", "-jar", "/app/app.jar"]