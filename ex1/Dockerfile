FROM ubuntu:24.04

ENV TZ="Europe/Warsaw"

# install Python and Java 8:
RUN apt-get update && \
    apt-get install -y \
    python3.10 \
    openjdk-8-jdk \
    wget \
    unzip \
    curl \
    zip

ENV JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64

# install Kotlin and Gradle:
RUN curl -s https://get.sdkman.io | bash && \
    bash -c "source $HOME/.sdkman/bin/sdkman-init.sh && \
    sdk install kotlin && \
    sdk install gradle"

ENV PATH=$PATH:$JAVA_HOME/bin:/root/.sdkman/candidates/kotlin/current/bin
ENV PATH=$PATH:/root/.sdkman/candidates/gradle/current/bin

# 4.0:

RUN mkdir -p /app/src/main/kotlin/
WORKDIR /app
COPY build.gradle /app/
WORKDIR /app

# 4.5:

# copy the Kotlin application
COPY src/main/kotlin/Main.kt /app/src/main/kotlin/
# compile the application 
RUN gradle build
# two ways to run the application
CMD ["bash", "-c", "echo 'Running with Kotlin compiler:' && kotlin -classpath /app/build/classes/kotlin/main MainKt && echo '\nRunning with Gradle:' && gradle run"]