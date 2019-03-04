package uk.nhs.careconnect.nosql;

import ca.uhn.fhir.context.FhirContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@SpringBootApplication
public class CcriDocument {

    @Autowired
    ApplicationContext context;

    @Value("${ccri.software.version}")
    String softwareVersion;

    @Value("${ccri.software.name}")
    String softwareName;

    @Value("${ccri.server}")
    String server;

    @Value("${ccri.guide}")
    String guide;

    @Value("${ccri.server.base}")
    String serverBase;

    public static void main(String[] args) {
        //System.setProperty(AuthenticationFilter.HAWTIO_AUTHENTICATION_ENABLED, "false");
        System.setProperty("hawtio.authenticationEnabled", "false");
        System.setProperty("management.security.enabled","false");
        System.setProperty("server.port", "8181");
        System.setProperty("server.context-path", "/ccri-document");
        System.setProperty("management.contextPath","");
        SpringApplication.run(CcriDocument.class, args);

    }

    @Bean
    public ServletRegistrationBean ServletRegistrationBean() {
        ServletRegistrationBean registration = new ServletRegistrationBean(new CcriFHIRDocumentServerHAPIConfig(context), "/STU3/*");
        registration.setName("FhirServlet");
        registration.setLoadOnStartup(1);
        return registration;
    }

    @Bean
    public FhirContext getFhirContext() {

        System.setProperty("ccri.server.base",this.serverBase);
        System.setProperty("ccri.software.name",this.softwareName);
        System.setProperty("ccri.software.version",this.softwareVersion);
        System.setProperty("ccri.guide",this.guide);
        System.setProperty("ccri.server",this.server);
        return FhirContext.forDstu3();
    }

    @Bean
    CorsConfigurationSource
    corsConfigurationSource() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", new CorsConfiguration().applyPermitDefaultValues());
        return source;
    }

    @Bean
    public FilterRegistrationBean corsFilterCustom() {

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin("*");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        source.registerCorsConfiguration("/**", config);
        FilterRegistrationBean bean = new FilterRegistrationBean(new CustomCorsFilter());
        bean.setOrder(0);
        return bean;
    }

    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder.build();
    }


}
