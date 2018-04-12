package uk.nhs.careconnect.ri.extranet.providers;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.annotation.ResourceParam;
import ca.uhn.fhir.rest.annotation.Validate;
import ca.uhn.fhir.rest.api.MethodOutcome;
import ca.uhn.fhir.rest.api.ValidationModeEnum;
import ca.uhn.fhir.rest.param.DateRangeParam;
import ca.uhn.fhir.rest.param.StringParam;
import ca.uhn.fhir.rest.param.TokenParam;

import org.hl7.fhir.dstu3.model.Bundle;
import org.hl7.fhir.dstu3.model.OperationOutcome;
import org.hl7.fhir.dstu3.model.Patient;
import org.hl7.fhir.dstu3.model.Resource;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;


@Component
public class PatientDao implements IPatient {




    @Override
    public String findInsert(FhirContext ctx, Patient patient) {


        return null;
    }

    @Override
    public List<Resource> search(FhirContext ctx, DateRangeParam birthDate, StringParam familyName, StringParam gender, StringParam givenName, TokenParam identifier, StringParam name) {

        List<Resource> resources = new ArrayList<>();


        return resources;
    }

    @Validate
    public MethodOutcome validate(@ResourceParam Patient patient,
                                         @Validate.Mode ValidationModeEnum theMode,
                                         @Validate.Profile String theProfile) {

        MethodOutcome retVal = new MethodOutcome();
        OperationOutcome outcome = ValidationFactory.validateResource(patient);

        retVal.setOperationOutcome(outcome);
        return retVal;
    }
}
