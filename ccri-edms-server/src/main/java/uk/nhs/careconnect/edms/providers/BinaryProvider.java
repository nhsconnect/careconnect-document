package uk.nhs.careconnect.edms.providers;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.annotation.*;

import ca.uhn.fhir.rest.server.IResourceProvider;


import org.hl7.fhir.dstu3.model.*;
import org.hl7.fhir.instance.model.api.IBaseResource;

import javax.servlet.http.HttpServletRequest;

import org.apache.chemistry.opencmis.client.api.Session;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;



@Component
public class BinaryProvider implements IResourceProvider {

    @Autowired
    FhirContext ctx;

    private Session cmisSession;

    public static final String CMIS_URL = "/public/cmis/versions/1.1/atom";




    public Class<? extends IBaseResource> getResourceType() {
        return Binary.class;
    }


    @Read
    public Composition getCompositionById(HttpServletRequest request, @IdParam IdType internalId) {

       // Session cmisSession = getCmisSession();


        return null;
    }




}
