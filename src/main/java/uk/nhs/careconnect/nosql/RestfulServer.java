package uk.nhs.careconnect.nosql;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.context.FhirVersionEnum;
import ca.uhn.fhir.rest.api.EncodingEnum;
import ca.uhn.fhir.rest.server.FifoMemoryPagingProvider;
import ca.uhn.fhir.rest.server.HardcodedServerAddressStrategy;
import ca.uhn.fhir.rest.server.IResourceProvider;
import ca.uhn.fhir.rest.server.interceptor.CorsInterceptor;
import ca.uhn.fhir.util.VersionUtil;
import ca.uhn.fhir.validation.FhirValidator;
import org.springframework.context.ApplicationContext;
import org.springframework.web.cors.CorsConfiguration;
import uk.nhs.careconnect.nosql.interceptor.CCRequestValidatingInterceptor;
import uk.nhs.careconnect.nosql.interceptor.mimeInterceptor;
import uk.nhs.careconnect.nosql.providers.ConformanceProvider;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.TimeZone;

@WebServlet(urlPatterns = { "/*" }, displayName = "FHIR Server")
public class RestfulServer extends ca.uhn.fhir.rest.server.RestfulServer {

	private static final long serialVersionUID = 1L;
	private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(RestfulServer.class);

	private ApplicationContext applicationContext;

	RestfulServer(ApplicationContext context) {
		this.applicationContext = context;

	}

	@Override
	public void addHeadersToResponse(HttpServletResponse theHttpResponse) {
		theHttpResponse.addHeader("X-Powered-By", "HAPI FHIR " + VersionUtil.getVersion() + " RESTful Server (INTEROPen Care Connect STU3)");
	}

	@SuppressWarnings("unchecked")
	@Override
	protected void initialize() throws ServletException {
		super.initialize();
		TimeZone.setDefault(TimeZone.getTimeZone("UTC"));

		//Fetching the roles set in properties file
		String ccri_role =  this.applicationContext.getEnvironment().getProperty("ccri.role");
		String ccri_document_resource =  this.applicationContext.getEnvironment().getProperty("ccri.ccri_document_resource");
		List<String> ccri_document_resources = Arrays.asList(ccri_document_resource.split("\\s*,\\s*"));

		String ccri_document_CareConnectAPI_resource =  this.applicationContext.getEnvironment().getProperty("ccri.ccri_document_CareConnectAPI_resource");
		List<String> ccri_document_CareConnectAPI_resources = Arrays.asList(ccri_document_CareConnectAPI_resource.split("\\s*,\\s*"));

		List<String> permissions = null;
	    switch(ccri_role)
	        {
	            case "ccri_document" :
	                permissions = ccri_document_resources;
	                break;
	            case "ccri_document_CareConnectAPI" :
	                permissions = ccri_document_CareConnectAPI_resources;
	                break;

	        }


		FhirVersionEnum fhirVersion = FhirVersionEnum.DSTU3;
		setFhirContext(new FhirContext(fhirVersion));


		String serverBase = HapiProperties.getServerBase();
	     if (serverBase != null && !serverBase.isEmpty()) {
            setServerAddressStrategy(new HardcodedServerAddressStrategy(serverBase));
        }

        if (applicationContext == null ) log.info("Context is null");


        Class<?> classType = null;
        log.info("Resource count " + permissions.size());

        List<IResourceProvider> permissionlist = new ArrayList<>();
        for (String permission : permissions) {
            try {
                classType = Class.forName("uk.nhs.careconnect.nosql.providers." + permission + "Provider");
            } catch (ClassNotFoundException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
            System.out.println(permission);
            permissionlist.add((IResourceProvider) applicationContext.getBean(classType));
        }

        setResourceProviders(permissionlist);


		registerInterceptor(new mimeInterceptor());

		// Replace built in conformance provider (CapabilityStatement)
		setServerConformanceProvider(new ConformanceProvider());

		setServerName(HapiProperties.getServerName());
		setServerVersion(HapiProperties.getSoftwareVersion());
		setImplementationDescription(HapiProperties.getSoftwareImplementationDesc());

		CorsConfiguration config = new CorsConfiguration();
		config.addAllowedHeader("x-fhir-starter");
		config.addAllowedHeader("Origin");
		config.addAllowedHeader("Accept");
		config.addAllowedHeader("X-Requested-With");
		config.addAllowedHeader("Content-Type");

		config.addAllowedOrigin("*");

		config.addExposedHeader("Location");
		config.addExposedHeader("Content-Location");
		config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

		// Create the interceptor and register it
		CorsInterceptor interceptor = new CorsInterceptor(config);
		registerInterceptor(interceptor);

		FifoMemoryPagingProvider pp = new FifoMemoryPagingProvider(10);
		pp.setDefaultPageSize(10);
		pp.setMaximumPageSize(100);
		setPagingProvider(pp);

		setDefaultPrettyPrint(true);
		setDefaultResponseEncoding(EncodingEnum.JSON);

		FhirContext ctx = getFhirContext();


		// KGM 13th March 2019 - Copied from ccri-fhir
		if (HapiProperties.getValidationFlag()) {
			//log.info("Registering Validation Interceptor");
			CCRequestValidatingInterceptor requestInterceptor = new CCRequestValidatingInterceptor(log, (FhirValidator) applicationContext.getBean("fhirValidator"), ctx);

			registerInterceptor(requestInterceptor);
		}
		// Remove as believe due to issues on docker ctx.setNarrativeGenerator(new DefaultThymeleafNarrativeGenerator());
	}




}