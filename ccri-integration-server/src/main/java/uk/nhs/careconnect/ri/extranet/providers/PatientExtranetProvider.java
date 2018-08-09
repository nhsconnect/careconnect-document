package uk.nhs.careconnect.ri.extranet.providers;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.model.valueset.BundleTypeEnum;
import ca.uhn.fhir.rest.annotation.Operation;
import ca.uhn.fhir.rest.annotation.OperationParam;
import ca.uhn.fhir.rest.annotation.ResourceParam;
import ca.uhn.fhir.rest.annotation.Validate;
import ca.uhn.fhir.rest.api.EncodingEnum;
import ca.uhn.fhir.rest.api.MethodOutcome;
import ca.uhn.fhir.rest.api.ValidationModeEnum;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import ca.uhn.fhir.rest.param.TokenParam;
import ca.uhn.fhir.rest.server.IResourceProvider;
import ca.uhn.fhir.rest.server.exceptions.InternalErrorException;
import org.hl7.fhir.dstu3.model.Bundle;
import org.hl7.fhir.dstu3.model.IdType;
import org.hl7.fhir.dstu3.model.OperationOutcome;
import org.hl7.fhir.dstu3.model.Patient;
import org.hl7.fhir.instance.model.api.IBaseResource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import uk.nhs.careconnect.ri.extranet.dao.ICarePlan;
import uk.nhs.careconnect.ri.extranet.dao.IComposition;
import uk.nhs.careconnect.ri.extranet.dao.IPatient;

import javax.activation.UnsupportedDataTypeException;
import javax.servlet.http.HttpServletRequest;
import java.util.Date;


@Component
public class PatientExtranetProvider implements IResourceProvider {

    @Autowired
    FhirContext ctx;

    @Value("${fhir.restserver.eprBase}")
    private String eprBase;

    @Autowired
    private IPatient patientDao;

    @Autowired
    private ICarePlan carePlanDao;

    @Autowired
    private IComposition compositionDao;

    private static final Logger log = LoggerFactory.getLogger(PatientExtranetProvider.class);

    public Class<? extends IBaseResource> getResourceType() {
        return Patient.class;
    }


    @Operation(name = "$getrecord3", idempotent = true, bundleType= BundleTypeEnum.COLLECTION)
    public Bundle getGetRecord3(
            @OperationParam(name="patientNHSnumber") TokenParam
                    nhsNumber,
            @OperationParam(name="recordType") TokenParam
                   recordType,
            @OperationParam(name="recordSection") TokenParam
                    recordSection
    ) throws UnsupportedDataTypeException {

        log.info("In Patient getrecord3 " +nhsNumber.getValue());

        HttpServletRequest request =  null;

        IGenericClient client = FhirContext.forDstu3().newRestfulGenericClient(eprBase);

        log.info("Build client");
        client.setEncoding(EncodingEnum.XML);

        log.info("calling get Patient");
        Bundle fhirDocument = null;
        try {
            fhirDocument = patientDao.getPatient(client,nhsNumber);
        } catch (Exception ex) {
            throw new InternalErrorException(ex.getMessage());
        }

        if (fhirDocument.getEntry().size() > 0) {
            try {
                fhirDocument = carePlanDao.searchCarePlan(client,new IdType(fhirDocument.getEntry().get(0).getResource().getId()),recordType);
            } catch (Exception ex) {
                throw new InternalErrorException(ex.getMessage());
            }
        }
        if (fhirDocument.getEntry().size() > 0) {
            try {
                Date lastUpdated = null;
                String carePlanId = null;
                for (Bundle.BundleEntryComponent
                        entry: fhirDocument.getEntry()) {
                    if (carePlanId == null || lastUpdated == null || entry.getResource().getMeta().getLastUpdated().after(lastUpdated)) {
                        lastUpdated = entry.getResource().getMeta().getLastUpdated();
                        carePlanId = entry.getResource().getId();
                    }
                }

                fhirDocument = carePlanDao.getCarePlan(client,new IdType(carePlanId));

            } catch (Exception ex) {
                throw new InternalErrorException(ex.getMessage());
            }
        }
        return fhirDocument;

    }

    @Operation(name = "$getrecord4", idempotent = true, bundleType= BundleTypeEnum.DOCUMENT)
    public Bundle getCareRecord4(
            @OperationParam(name="patientNHSnumber") TokenParam
                    nhsNumber,
            @OperationParam(name="recordType") TokenParam
                    recordType,
            @OperationParam(name="recordSection") TokenParam
                    recordSection
    ) throws UnsupportedDataTypeException {


        log.info("In Patient getrecord4 " +nhsNumber.getValue());

        HttpServletRequest request =  null;

        IGenericClient client = FhirContext.forDstu3().newRestfulGenericClient(eprBase);

        log.info("Build client");
        client.setEncoding(EncodingEnum.XML);

        log.info("calling get Patient");
        Bundle fhirDocument = null;
        try {
            fhirDocument = patientDao.getPatient(client,nhsNumber);
        } catch (Exception ex) {
            throw new InternalErrorException(ex.getMessage());
        }

        if (fhirDocument.getEntry().size() > 0) {
            try {
                fhirDocument = carePlanDao.searchCarePlan(client,new IdType(fhirDocument.getEntry().get(0).getResource().getId()),recordType);
            } catch (Exception ex) {
                throw new InternalErrorException(ex.getMessage());
            }
        }
        if (fhirDocument.getEntry().size() > 0) {
            try {
                Date lastUpdated = null;
                String carePlanId = null;
                for (Bundle.BundleEntryComponent
                        entry: fhirDocument.getEntry()) {
                    if (carePlanId == null || lastUpdated == null || entry.getResource().getMeta().getLastUpdated().after(lastUpdated)) {
                        lastUpdated = entry.getResource().getMeta().getLastUpdated();
                        carePlanId = entry.getResource().getId();
                    }
                }

                fhirDocument = compositionDao.buildCarePlanDocument(client, new IdType(carePlanId));

            } catch (Exception ex) {
                throw new InternalErrorException(ex.getMessage());
            }
        }
        return fhirDocument;
    }



    @Validate
    public MethodOutcome validate(@ResourceParam Patient patient,
                                         @Validate.Mode ValidationModeEnum theMode,
                                         @Validate.Profile String theProfile) {

        // Actually do our validation: The UnprocessableEntityException
        // results in an HTTP 422, which is appropriate for business rule failure



        MethodOutcome retVal = new MethodOutcome();

        OperationOutcome outcome = ValidationFactory.validateResource(patient);


        retVal.setOperationOutcome(outcome);

        return retVal;
    }



}
