package uk.nhs.careconnect.nosql.providers;

import ca.uhn.fhir.context.FhirVersionEnum;
import ca.uhn.fhir.parser.DataFormatException;
import ca.uhn.fhir.rest.annotation.Metadata;
import ca.uhn.fhir.rest.server.IResourceProvider;
import ca.uhn.fhir.rest.server.RestfulServer;
import ca.uhn.fhir.rest.server.RestulfulServerConfiguration;
import org.hl7.fhir.dstu3.hapi.rest.server.ServerCapabilityStatementProvider;
import org.hl7.fhir.dstu3.model.*;
import org.hl7.fhir.dstu3.model.CapabilityStatement.ResourceInteractionComponent;
import org.hl7.fhir.instance.model.api.IPrimitiveType;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;
import uk.nhs.careconnect.nosql.HapiProperties;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.List;


public class ConformanceProvider extends ServerCapabilityStatementProvider {

    private boolean myCache = true;
    private volatile CapabilityStatement capabilityStatement;

    private RestulfulServerConfiguration serverConfiguration;

    private RestfulServer restfulServer;

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(ConformanceProvider.class);


    public ConformanceProvider() {
        super();
    }

    @Override
    public void setRestfulServer(RestfulServer theRestfulServer) {

        serverConfiguration = theRestfulServer.createConfiguration();
        restfulServer = theRestfulServer;
        super.setRestfulServer(theRestfulServer);
    }

    @Override
    @Metadata
    public CapabilityStatement getServerConformance(HttpServletRequest theRequest) {
    	
    	WebApplicationContext ctx = WebApplicationContextUtils.getWebApplicationContext(theRequest.getServletContext());
    	log.info("restful2 Server not null = " + HapiProperties.getValidationFlag());
    	 
        boolean CRUD_update = HapiProperties.getServerCrudUpdate();
        boolean CRUD_delete = HapiProperties.getServerCrudDelete();
        boolean CRUD_create = HapiProperties.getServerCrudCreate();
        boolean CRUD_read = HapiProperties.getServerCrudRead();


        if (capabilityStatement != null && myCache) {
            return capabilityStatement;
        }
        CapabilityStatement capabilityStatement = super.getServerConformance(theRequest);


        capabilityStatement.setPublisher("NHS Digital");
        capabilityStatement.setDateElement(conformanceDate());
        capabilityStatement.setFhirVersion(FhirVersionEnum.DSTU3.getFhirVersionString());
        capabilityStatement.setAcceptUnknown(CapabilityStatement.UnknownContentCode.EXTENSIONS); // TODO: make this configurable - this is a fairly big
        // effort since the parser
        // needs to be modified to actually allow it

        capabilityStatement.getImplementation().setDescription(serverConfiguration.getImplementationDescription());
        capabilityStatement.setKind(CapabilityStatement.CapabilityStatementKind.INSTANCE);


        capabilityStatement.getSoftware().setName(HapiProperties.getSoftwareName());
        capabilityStatement.getSoftware().setVersion(HapiProperties.getSoftwareVersion());
        capabilityStatement.getImplementation().setDescription(HapiProperties.getSoftwareImplementationDesc());
        capabilityStatement.getImplementation().setUrl(HapiProperties.getSoftwareImplementationUrl());
        // TODO KGM move to config
        // KGM only add if not already present
        if (capabilityStatement.getImplementationGuide().size() == 0) {
            capabilityStatement.getImplementationGuide().add(new UriType(HapiProperties.getSoftwareImplementationGuide()));
        }

        capabilityStatement.setStatus(Enumerations.PublicationStatus.ACTIVE);
        /*
        if (serverConfiguration != null) {
            for (ResourceBinding resourceBinding : serverConfiguration.getResourceBindings()) {
                log.info("resourceBinding.getResourceName() = "+resourceBinding.getResourceName());
                log.info("resourceBinding.getMethodBindings().size() = "+resourceBinding.getMethodBindings().size());
            }
        }
        */
        if (restfulServer != null) {
            log.trace("restful Server not null");
            for (CapabilityStatement.CapabilityStatementRestComponent nextRest : capabilityStatement.getRest()) {
                for (CapabilityStatement.CapabilityStatementRestResourceComponent restResourceComponent : nextRest.getResource()) {

                    if (restResourceComponent.getType().equals("OperationDefinition")) {
                        nextRest.getResource().remove(restResourceComponent);
                        break;
                    }
                    if (restResourceComponent.getType().equals("StructureDefinition")) {
                        nextRest.getResource().remove(restResourceComponent);
                        break;
                    }

                    log.trace("restResourceComponent.getType - " + restResourceComponent.getType());
                 
                 // Start of CRUD operations
                  	 List<ResourceInteractionComponent> l = restResourceComponent.getInteraction();
                       for(int i=0;i<l.size();i++)
                       	if(!CRUD_read)
                       	if (restResourceComponent.getInteraction().get(i).getCode().toString()=="READ")
                       	{
                       		restResourceComponent.getInteraction().remove(i);
                       	}	
                       for(int i=0;i<l.size();i++)
                       	if(!CRUD_update)
                       	if (restResourceComponent.getInteraction().get(i).getCode().toString()=="UPDATE")
                       	{
                       		restResourceComponent.getInteraction().remove(i);
                       	}	
                       for(int i=0;i<l.size();i++)
                       	if(!CRUD_create)
                       	if (restResourceComponent.getInteraction().get(i).getCode().toString()=="CREATE")
                       	{
                       		restResourceComponent.getInteraction().remove(i);
                       	}	
                       for(int i=0;i<l.size();i++)
                       	if(!CRUD_delete)
                       	if (restResourceComponent.getInteraction().get(i).getCode().toString()=="DELETE")
                       	{
                       		restResourceComponent.getInteraction().remove(i);
                       	}	
                       // End of CRUD operations
                    
                    
                    for (IResourceProvider provider : restfulServer.getResourceProviders()) {

                        log.trace("Provider Resource - " + provider.getResourceType().getSimpleName());
                        if (restResourceComponent.getType().equals(provider.getResourceType().getSimpleName())
                                || (restResourceComponent.getType().contains("List") && provider.getResourceType().getSimpleName().contains("List")))
                            if (provider instanceof ICCResourceProvider) {
                                log.trace("ICCResourceProvider - " + provider.getClass());
                                ICCResourceProvider resourceProvider = (ICCResourceProvider) provider;

                                Extension extension = restResourceComponent.getExtensionFirstRep();
                                if (extension == null) {
                                    extension = restResourceComponent.addExtension();
                                }
                                extension.setUrl("http://hl7api.sourceforge.net/hapi-fhir/res/extdefs.html#resourceCount")
                                        .setValue(new DecimalType(resourceProvider.count()));
                            }
                    }
                }
            }
        }


        return capabilityStatement;
    }

    private DateTimeType conformanceDate() {
        IPrimitiveType<Date> buildDate = serverConfiguration.getConformanceDate();
        if (buildDate != null) {
            try {
                return new DateTimeType(buildDate.getValue());
            } catch (DataFormatException e) {
                // fall through
            }
        }
        return DateTimeType.now();
    }


}
