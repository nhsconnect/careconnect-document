package uk.nhs.careconnect.nosql.dao;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.server.exceptions.ResourceVersionConflictException;
import com.mongodb.DBObject;
import com.mongodb.DBRef;
import org.hl7.fhir.dstu3.model.Bundle;
import org.hl7.fhir.dstu3.model.Composition;
import org.hl7.fhir.dstu3.model.DocumentReference;
import org.hl7.fhir.dstu3.model.IdType;
import org.hl7.fhir.dstu3.model.OperationOutcome;
import org.hl7.fhir.dstu3.model.Patient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;
import uk.nhs.careconnect.nosql.entities.CodingEntity;
import uk.nhs.careconnect.nosql.entities.CompositionEntity;
import uk.nhs.careconnect.nosql.entities.DocumentReferenceEntity;
import uk.nhs.careconnect.nosql.entities.IdentifierEntity;
import uk.nhs.careconnect.nosql.entities.PatientEntity;

import javax.transaction.Transactional;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static java.util.Collections.emptyList;
import static java.util.stream.Collectors.toList;

@Transactional
@Repository
public class BundleDao implements IBundle {

    @Autowired
    MongoOperations mongo;

    @Autowired
    IFHIRResource fhirDocumentDao;

    @Autowired
    IPatient patientDao;

    private static final Logger log = LoggerFactory.getLogger(BundleDao.class);

    @Override
    public OperationOutcome update(FhirContext ctx, Bundle bundle, IdType theId, String theConditional) {
        log.debug("BundleDao.save");
        OperationOutcome operationOutcome = new OperationOutcome();


        CompositionEntity compositionEntity = null;

        if (bundle.hasIdentifier()) {
            IdentifierEntity identifierE = new IdentifierEntity(bundle.getIdentifier());
            Query qry = Query.query(Criteria.where("identifier.system").is(bundle.getIdentifier().getSystem()).and("identifier.value").is(bundle.getIdentifier().getValue()));

            compositionEntity = mongo.findOne(qry, CompositionEntity.class);
            if (compositionEntity == null) {
                compositionEntity = new CompositionEntity();
                compositionEntity.setIdentifier(identifierE);
            } else {
                // Handle updated document, this should be history
            }
        }

        DBObject mObj = fhirDocumentDao.save(ctx, bundle);
        compositionEntity.setFhirDocument(new DBRef("Bundle", mObj.get("_id")));
        compositionEntity.setFhirDocumentlId(mObj.get("_id").toString());

        for (Bundle.BundleEntryComponent entry : bundle.getEntry()) {
            if (entry.hasResource() && entry.getResource() instanceof Patient) {
                // TODO ensure this is the correcct Patient (one referred to in the Composition)
                PatientEntity mpiPatient = patientDao.createEntity(ctx, (Patient) entry.getResource());
                compositionEntity.setIdxPatient(mpiPatient);
            }
        }

        mongo.save(compositionEntity);

        operationOutcome.setId("Composition/" + compositionEntity.getId());


        return operationOutcome;
    }

    @Override
    public OperationOutcome create(FhirContext ctx, Bundle bundle, IdType theId, String theConditional) {

        log.debug("BundleDao.save");
        OperationOutcome operationOutcome = new OperationOutcome();

        checkNotAlreadySaved(bundle);

        Object savedBundleId = saveBundle(ctx, bundle);

        PatientEntity savedPatient = savePatient(ctx, bundle);

        CompositionEntity compositionEntity = saveComposition(bundle, savedBundleId, savedPatient);

        saveDocumentReference(bundle, savedPatient);

        operationOutcome.setId("Composition/" + compositionEntity.getId());

        return operationOutcome;
    }

    private void checkNotAlreadySaved(Bundle bundle) {
        Query qry = Query.query(Criteria.where("identifier.system").is(bundle.getIdentifier().getSystem()).and("identifier.value").is(bundle.getIdentifier().getValue()));

        CompositionEntity bundleE = mongo.findOne(qry, CompositionEntity.class);
        if (bundleE != null)
            throw new ResourceVersionConflictException("FHIR Document already exists. Binary/" + bundleE.getId());
    }

    private Object saveBundle(FhirContext ctx, Bundle bundle) {
        return fhirDocumentDao.save(ctx, bundle).get("_id");
    }

    //TODO: check with Kev about the saving of more than one patient
    private PatientEntity savePatient(FhirContext ctx, Bundle bundle) {
        PatientEntity savedPatientEntity = null;

        for (Bundle.BundleEntryComponent entry : bundle.getEntry()) {
            if (entry.hasResource() && entry.getResource() instanceof Patient) {
                // TODO ensure this is the correcct Patient (one referred to in the Composition)
                savedPatientEntity = patientDao.createEntity(ctx, (Patient) entry.getResource());
            }
        }
        return savedPatientEntity;
    }

    private CompositionEntity saveComposition(Bundle bundle, Object savedBundleId, PatientEntity savedPatient) {
        CompositionEntity compositionEntity = new CompositionEntity();
        if (savedPatient != null) {
            compositionEntity.setIdxPatient(savedPatient);
        }

        if (bundle.hasIdentifier()) {
            IdentifierEntity identifierE = new IdentifierEntity(bundle.getIdentifier());
            compositionEntity.setIdentifier(identifierE);
            compositionEntity.setDate(new Date());

            setCompositionEntityType(bundle, compositionEntity);
        }

        compositionEntity.setFhirDocument(new DBRef("Bundle", savedBundleId));
        compositionEntity.setFhirDocumentlId(savedBundleId.toString());

        mongo.save(compositionEntity);
        return compositionEntity;
    }

    private void setCompositionEntityType(Bundle bundle, CompositionEntity compositionEntity) {
        Optional<Composition> compositionEntry = bundle.getEntry().stream()
                .filter(entry -> entry.hasResource() && entry.getResource() instanceof Composition)
                .map(composition -> (Composition) composition.getResource())
                .findFirst();

        compositionEntity.setType(compositionEntry.map(composition -> fhirToCodingEntity(composition.getType().getCoding())).orElse(emptyList()));
    }

    private Collection<CodingEntity> fhirToCodingEntity(List<org.hl7.fhir.dstu3.model.Coding> codingList) {
        return codingList.stream()
                .map(CodingEntity::new)
                .collect(toList());
    }

    private void saveDocumentReference(Bundle bundle, PatientEntity savedPatient) {
        bundle.getEntry().stream()
                .filter(entry -> entry.hasResource() && entry.getResource() instanceof DocumentReference)
                .map(entry -> (DocumentReference) entry.getResource())
                .map(documentReference -> new DocumentReferenceEntity(savedPatient, documentReference)
//                .map(documentReference -> aDocumentReferenceEntityMapper()
//                        .withPatientId(savedPatient.getId().toString())
//                        .withPeriod(documentReference.getContext().getPeriod())
//                        .build()
                )
                .findFirst().ifPresent(documentReferenceEntity -> mongo.save(documentReferenceEntity));
    }


}