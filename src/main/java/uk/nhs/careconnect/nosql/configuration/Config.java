package uk.nhs.careconnect.nosql.configuration;


import ca.uhn.fhir.context.FhirContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;


/**
 * Created by kevinmayfield on 21/07/2017.
 */



@Configuration
public class Config {



    @Autowired()
    FhirContext ctx;



    /*
    @Bean(name="fhirValidator")
    public FhirValidator fhirValidator () {

       // FhirContext r4ctx = FhirContext.forR4();

        FhirValidator val = ctx.newValidator();

        val.setValidateAgainstStandardSchema(true);

        // todo reactivate once this is fixed https://github.com/nhsconnect/careconnect-reference-implementation/issues/36
        val.setValidateAgainstStandardSchematron(false);

        DefaultProfileValidationSupport defaultProfileValidationSupport = new DefaultProfileValidationSupport();

        FhirInstanceValidator instanceValidator = new FhirInstanceValidator(defaultProfileValidationSupport);
        val.registerValidatorModule(instanceValidator);


        ValidationSupportChain validationSupportChain = new ValidationSupportChain();

        validationSupportChain.addValidationSupport(new DefaultProfileValidationSupport());
        validationSupportChain.addValidationSupport(new CareConnectProfileValidationSupport(ctx, "http://localhost:"+serverPort+serverPath+"/STU3"));
        validationSupportChain.addValidationSupport(new SNOMEDUKMockValidationSupport());

        instanceValidator.setValidationSupport(validationSupportChain);



        return val;
    }

     */


}
