
# MongoDb

You need a mongoDb server to run this application. Either:
 
- Use the docker image https://hub.docker.com/_/mongo/ 

- Install mongodb server (and maven) 
    - create directory c:\mongodb\data\db
    - start Mongo server Win
        - cd "c:\Program Files\MongoDB\Server\3.6\bin"
        - .\mongod.exe --dbpath "C:\mongodb\db\data"
    - start Mongo Server Mac
        - cd /Development/mongodb/bin
        - ./mongod --dbpath '/Development/mdb/data'

- Mongo can be embedded within this app. See https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-nosql.html#boot-features-mongo-embedded 


# MongoDb FHIR Server

start FHIR Server 

- mvn spring-boot:run

Using a tool such as [Postman(https://www.getpostman.com/)] POST FHIR Documents to:

- http://127.0.0.1:8181/STU3/Bundle


# Docker Notes

Which starts the app within your browser.




In this directory

docker build . -t document-repository

docker tag document-repository thorlogic/document-repository

docker push thorlogic/document-repository


docker run -d -p 8181:8181 document-repository

