FROM ubuntu:24.04

ENV TZ="Europe/Warsaw"

RUN apt-get update && \
    apt-get install -y \
    wget \
    unzip \
    curl \
    zip

RUN curl -s https://get.sdkman.io | bash && \
    bash -c "source $HOME/.sdkman/bin/sdkman-init.sh && \
    sdk install java 21.0.4-tem && \
    sdk install sbt 1.10.10 && \
    sdk install scala 3.3.5"

ENV PATH=$PATH:/root/.sdkman/candidates/java/current/bin
ENV PATH=$PATH:/root/.sdkman/candidates/sbt/current/bin
ENV PATH=$PATH:/root/.sdkman/candidates/scala/current/bin

WORKDIR /app

COPY build.sbt /app/
COPY project /app/project/
COPY . /app/

# Expose the port the app runs on
EXPOSE 9000

# Run the application
CMD ["sbt", "run"]