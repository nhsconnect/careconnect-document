package uk.nhs.careconnect.nosql.dao;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.api.MethodOutcome;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import ca.uhn.fhir.rest.param.DateRangeParam;
import ca.uhn.fhir.rest.param.ReferenceParam;
import ca.uhn.fhir.rest.param.TokenOrListParam;
import ca.uhn.fhir.rest.param.TokenParam;
import org.hl7.fhir.dstu3.model.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;
import uk.nhs.careconnect.nosql.entities.DocumentReferenceEntity;

import java.util.ArrayList;
import java.util.List;

import static java.util.stream.Collectors.toList;
import static uk.nhs.careconnect.nosql.dao.CriteriaBuilder.aCriteriaBuilder;
import static uk.nhs.careconnect.nosql.decorators.DocumentReferenceDecorator.decorateDocumentReference;

@Repository
public class DocumentReferenceDao implements IDocumentReference {

    private static final Logger log = LoggerFactory.getLogger(DocumentReferenceDao.class);

    @Autowired
    MongoOperations mongo;

    @Value("${nhs.address}")
    String nhsAddress;

    IGenericClient clientNRLS = null;


    @Override
    public List<Resource> search(TokenParam resid, TokenParam identifier, ReferenceParam patient, DateRangeParam createdDate,
                                 TokenOrListParam type, TokenOrListParam setting, DateRangeParam period) {
        List<Resource> resources = new ArrayList<>();

        Criteria criteria = aCriteriaBuilder()
                .withId(resid)
                .withIdentifier(identifier)
                .withPatient(patient)
                .withCreatedDate(createdDate)
                .withType("type.coding.code", "type.coding.system", type)
                .withSetting(setting)
                .withPeriod(period)
                .build();

        if (criteria != null) {
            Query qry = Query.query(criteria);

            log.debug("About to call Mongo DB for a documentReference=[{}]", qry);

            List<DocumentReferenceEntity> results = mongo.find(qry, DocumentReferenceEntity.class);

            log.debug("Found [{}] result(s)", results.size());

            resources = results.stream()
                    .map(documentReference -> decorateDocumentReference(documentReference))
                    .collect(toList());
        }

        return resources;
    }

    @Override
    public DocumentReference read(IdType internalId) throws Exception {
        List<Resource> resources = new ArrayList<>();

        Criteria criteria = aCriteriaBuilder()
                .withId(new TokenParam().setValue(internalId.getIdPart()))
                .build();

        if (criteria != null) {
            Query qry = Query.query(criteria);

            log.debug("About to call Mongo DB for a documentReference=[{}]", qry);

            List<DocumentReferenceEntity> results = mongo.find(qry, DocumentReferenceEntity.class);

            log.debug("Found [{}] result(s)", results.size());

            resources = results.stream()
                    .map(documentReference -> decorateDocumentReference(documentReference))
                    .collect(toList());
        }
        if (resources.size()>0) return (DocumentReference) resources.get(0);
        return null;
    }

    @Override
    public MethodOutcome delete(IdType internalId) throws Exception {
        List<Resource> resources = new ArrayList<>();
        MethodOutcome methodOutcome = new MethodOutcome();
        Criteria criteria = aCriteriaBuilder()
                .withId(new TokenParam().setValue(internalId.getIdPart()))
                .build();

        if (criteria != null) {
            Query qry = Query.query(criteria);

            List<DocumentReferenceEntity> results = mongo.find(qry, DocumentReferenceEntity.class);

            if (results.size()>0) {
                DocumentReferenceEntity delete = results.get(0);
                mongo.remove(delete);
                OperationOutcome outcome = new OperationOutcome();
                outcome.addIssue()
                        .setSeverity(OperationOutcome.IssueSeverity.INFORMATION)
                        .setCode(OperationOutcome.IssueType.INFORMATIONAL)
                        .setDiagnostics("Deleted");
                methodOutcome.setOperationOutcome(outcome);
            } else {
                OperationOutcome outcome = new OperationOutcome();
                outcome.addIssue()
                        .setSeverity(OperationOutcome.IssueSeverity.INFORMATION)
                        .setCode(OperationOutcome.IssueType.INFORMATIONAL)
                        .setDiagnostics("Resource not found");
                methodOutcome.setOperationOutcome(outcome);
            }
        }

        return methodOutcome;
    }

    @Override
    public MethodOutcome refresh(FhirContext ctxFHIR) throws Exception {

        clientNRLS = ctxFHIR.newRestfulGenericClient(nhsAddress);
        updateNRLS(ctxFHIR);
        MethodOutcome retVal = new MethodOutcome();
        return retVal;
    }

    private void updateNRLS(FhirContext ctx) {

        List<Resource> doc1 = search(null,null,null, null, new TokenOrListParam().add("http://snomed.info/sct","373942005"),null,null);
        List<Resource> docs = search(null,null,null, null, new TokenOrListParam().add("http://snomed.info/sct","73625300"),null,null);

        docs.addAll(doc1);

        for (Resource resource : docs) {
            if (resource instanceof DocumentReference) {
                DocumentReference documentReference = (DocumentReference) resource;
                if (documentReference.hasContext()
                        && documentReference.getContext().hasPracticeSetting()
                        && documentReference.getContext().getPracticeSetting().hasCoding()
                ) {
                    switch (documentReference.getContext().getPracticeSetting().getCodingFirstRep().getCode()) {

                        case "892811000000109":
                            sendNRLS(ctx, documentReference);
                            break;
                    }
                }
            }
        }

    }

    private void sendNRLS(FhirContext ctx, DocumentReference documentReference) {
        log.info("Checking NRLS for entry "+documentReference.getId());

        Boolean found = false;
        if (documentReference.getSubject().hasIdentifier()) {
            Bundle bundle = clientNRLS.search()
                    .forResource(DocumentReference.class)
                    .where(DocumentReference.PATIENT.hasId(documentReference.getSubject().getIdentifier().getValue()))
                    .returnBundle(Bundle.class)
                    .execute();
            //System.out.println(documentReference.getSubject().getIdentifier().getValue() + " - "+ bundle.getEntry().size());
            for (Bundle.BundleEntryComponent entry : bundle.getEntry()) {
                if (entry.getResource() instanceof DocumentReference) {
                    DocumentReference nrlsDoc = (DocumentReference) entry.getResource();
                    for (Identifier identifierNRLS : nrlsDoc.getIdentifier()) {
                        for (Identifier identifier : documentReference.getIdentifier()) {
                            if (identifier.getSystem().equals(identifierNRLS.getSystem())
                                    && identifier.getValue().equals(identifierNRLS.getValue())) {
                                found = true;
                                break;
                            }
                        }

                    }
                }
            }
        }
        if (!found) {
            log.info("Entry not found on NRL. Adding entry for "+documentReference.getId());

            CodeableConcept type = new CodeableConcept();
            type.addCoding()
                    .setCode("736253002")
                    .setSystem("http://snomed.info/sct")
                    .setDisplay("Mental health crisis plan");
            documentReference.setType(type);

            documentReference.addAuthor().setReference("https://directory.spineservices.nhs.uk/STU3/Organization/MHT01");
            documentReference.setCustodian(new Reference("https://directory.spineservices.nhs.uk/STU3/Organization/MHT01"));

            if (!documentReference.hasIndexed()) {
                documentReference.setIndexed(documentReference.getCreated());
            }
            if (!documentReference.hasStatus()) {
                documentReference.setStatus(Enumerations.DocumentReferenceStatus.CURRENT);
            }
            CodeableConcept _class = new CodeableConcept();
            _class.addCoding()
                    .setCode("734163000")
                    .setSystem("http://snomed.info/sct")
                    .setDisplay("Care plan");
            documentReference.setClass_(_class);

            if (documentReference.hasSubject()) {
                if (documentReference.getSubject().hasIdentifier()
                        && documentReference.getSubject().getIdentifier().getSystem().equals("https://fhir.nhs.uk/Id/nhs-number")) {
                    documentReference.setSubject(
                            new Reference()
                                    .setReference("https://demographics.spineservices.nhs.uk/STU3/Patient/"+documentReference.getSubject().getIdentifier().getValue())
                    );
                }
            }
            DocumentReference.DocumentReferenceContentComponent content = documentReference.getContentFirstRep();
            if (!content.hasFormat()) {
                content.setFormat(new Coding()
                        .setCode("proxy:https://www.iso.org/standard/63534.html")
                        .setDisplay("PDF")
                .setSystem("https://fhir.nhs.uk/STU3/CodeSystem/NRL-FormatCode-1"));
            }

            if (!content.hasExtension()) {
                Extension extension = content.addExtension();
                extension.setUrl("https://fhir.nhs.uk/STU3/StructureDefinition/Extension-NRL-ContentStability-1");
                CodeableConcept codeableConcept = new CodeableConcept();
                codeableConcept.addCoding()
                        .setSystem("https://fhir.nhs.uk/STU3/CodeSystem/NRL-ContentStability-1")
                        .setCode("static")
                        .setDisplay("Static");
                extension.setValue(codeableConcept);
            }


            log.trace(ctx.newJsonParser().setPrettyPrint(true).encodeResourceToString(documentReference));
            clientNRLS.create().resource(documentReference).execute();
        }

    }

}
