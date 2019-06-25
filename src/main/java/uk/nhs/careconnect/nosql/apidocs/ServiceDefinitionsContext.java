package uk.nhs.careconnect.nosql.apidocs;

import org.springframework.stereotype.Component;
import springfox.documentation.swagger.web.SwaggerResource;


import java.util.ArrayList;
import java.util.List;

@Component
public class ServiceDefinitionsContext {


    public List<SwaggerResource> getSwaggerDefinitions() {

        List<SwaggerResource> resources = new ArrayList<>();
        SwaggerResource resource = new SwaggerResource();
        resource.setLocation("/apidocs" );
        resource.setName(System.getProperty("ccri.software.name"));
        resource.setSwaggerVersion("2.0");
        resources.add(resource);
        return  resources;
    }
}
