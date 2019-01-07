FROM openjdk:8-jdk-alpine
VOLUME /tmp

ADD target/ccri-document.jar ccri-document.jar
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/ccri-document.jar"]

