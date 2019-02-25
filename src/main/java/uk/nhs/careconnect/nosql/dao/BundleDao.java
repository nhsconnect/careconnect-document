package uk.nhs.careconnect.nosql.dao;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.server.exceptions.ResourceVersionConflictException;
import com.mongodb.DBObject;
import com.mongodb.DBRef;
import org.bson.types.ObjectId;
import org.hl7.fhir.dstu3.model.Attachment;
import org.hl7.fhir.dstu3.model.Binary;
import org.hl7.fhir.dstu3.model.Bundle;
import org.hl7.fhir.dstu3.model.Composition;
import org.hl7.fhir.dstu3.model.DocumentReference;
import org.hl7.fhir.dstu3.model.DocumentReference.DocumentReferenceContentComponent;
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

import static java.lang.String.format;
import static java.util.Arrays.asList;
import static java.util.Collections.emptyList;
import static java.util.stream.Collectors.toList;
import static uk.nhs.careconnect.nosql.dao.SaveAction.CREATE;
import static uk.nhs.careconnect.nosql.dao.SaveAction.UPDATE;
import static uk.nhs.careconnect.nosql.util.BundleUtils.bsonBundleToBundle;

@Transactional
@Repository
public class BundleDao implements IBundle {

    @Autowired
    MongoOperations mongo;

    @Autowired
    BinaryResourceDao binaryResourceDao;

    @Autowired
    IFHIRResource fhirDocumentDao;

    @Autowired
    IPatient patientDao;

    private static final Logger log = LoggerFactory.getLogger(BundleDao.class);

    @Override
    public Bundle update(FhirContext ctx, Bundle bundle, IdType idType, String theConditional) {
        log.debug("About to update Bundle");

        SaveBundleResponse saveBundleResponse = saveBundle(ctx, bundle, idType, UPDATE);

        PatientEntity savedPatient = savePatient(ctx, bundle);

        CompositionEntity compositionEntity = updateCompositionEntity(bundle, saveBundleResponse.getSavedBundleId(), savedPatient);

        OperationOutcome operationOutcome = new OperationOutcome();
        operationOutcome.setId("Composition/" + compositionEntity.getId());

        return aBundleResponse(saveBundleResponse.getBundle(), operationOutcome);
    }

    @Override
    public Bundle create(FhirContext ctx, Bundle bundle, IdType idType, String theConditional) {
        log.debug("About to create Bundle");

        checkNotAlreadySaved(bundle);

        SaveBundleResponse saveBundleResponse = saveBundle(ctx, bundle, idType, CREATE);

        PatientEntity savedPatient = savePatient(ctx, bundle);

        CompositionEntity compositionEntity = saveComposition(bundle, saveBundleResponse.getSavedBundleId(), savedPatient);

        saveBinary(ctx, bundle);

        saveDocumentReference(bundle, savedPatient);

        OperationOutcome operationOutcome = new OperationOutcome();
        operationOutcome.setId("Composition/" + compositionEntity.getId());

        return aBundleResponse(saveBundleResponse.getBundle(), operationOutcome);
    }

    private void checkNotAlreadySaved(Bundle bundle) {
        Query qry = Query.query(Criteria.where("identifier.system").is(bundle.getIdentifier().getSystem()).and("identifier.value").is(bundle.getIdentifier().getValue()));

        CompositionEntity bundleE = mongo.findOne(qry, CompositionEntity.class);
        if (bundleE != null)
            throw new ResourceVersionConflictException("FHIR Document already exists. Binary/" + bundleE.getId());
    }

    private SaveBundleResponse saveBundle(FhirContext ctx, Bundle bundle, IdType idType, SaveAction saveAction) {
        DBObject savedBsonBundle = fhirDocumentDao.save(ctx, bundle, idType, saveAction);

        Object savedBundleId = savedBsonBundle.get("_id");
        Bundle savedBundle = bsonBundleToBundle(ctx, savedBsonBundle);
        savedBundle.setId(savedBundleId.toString());

        return new SaveBundleResponse()
                .setObjectId(savedBundleId)
                .setBundle(savedBundle);
    }

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

    private CompositionEntity updateCompositionEntity(Bundle bundle, Object savedBundleId, PatientEntity savedPatient) {
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

        if (savedPatient != null) {
            compositionEntity.setIdxPatient(savedPatient);
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
                .map(documentReference -> new DocumentReferenceEntity(savedPatient, documentReference))
                .findFirst().ifPresent(mongo::save);
    }

    public void saveBinary(FhirContext ctx, Bundle bundle) {
        Optional<Binary> optionalBinary = bundle.getEntry().stream()
                .filter(entry -> entry.hasResource() && entry.getResource() instanceof Binary)
                .map(entry -> (Binary) entry.getResource())
                .findFirst();

        Optional<ObjectId> optionalBinaryId = optionalBinary.map(binary -> binaryResourceDao.save(ctx, binary));

        Optional<DocumentReference> optionalDocumentReference = bundle.getEntry().stream()
                .filter(entry -> entry.hasResource() && entry.getResource() instanceof DocumentReference)
                .map(entry -> (DocumentReference) entry.getResource())
                .findFirst();

        optionalDocumentReference.ifPresent(documentReference -> {
            optionalBinaryId.ifPresent(binaryId -> {

                DocumentReferenceContentComponent documentReferenceContentComponent = new DocumentReferenceContentComponent();

                Attachment attachment = new Attachment().setUrl(format("Binary/%s", binaryId));
                documentReferenceContentComponent.setAttachment(attachment);

                documentReference.setContent(asList(documentReferenceContentComponent));
            });
        });

    }

    private Bundle aBundleResponse(Bundle bundle, OperationOutcome operationOutcome) {
        return new Bundle()
                .addEntry(new Bundle.BundleEntryComponent().setResource(operationOutcome))
                .addEntry(new Bundle.BundleEntryComponent().setResource(bundle));
    }

    private class SaveBundleResponse {

        private Object savedBundleId;
        private Bundle bundle;

        public Object getSavedBundleId() {
            return savedBundleId;
        }

        public SaveBundleResponse setObjectId(Object savedBundleId) {
            this.savedBundleId = savedBundleId;
            return this;
        }

        public Bundle getBundle() {
            return bundle;
        }

        public SaveBundleResponse setBundle(Bundle bundle) {
            this.bundle = bundle;
            return this;
        }

    }

}