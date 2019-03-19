package uk.nhs.careconnect.nosql.dao;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.server.exceptions.ResourceVersionConflictException;
import com.mongodb.DBObject;
import com.mongodb.DBRef;
import org.bson.types.ObjectId;
import org.hl7.fhir.dstu3.model.Attachment;
import org.hl7.fhir.dstu3.model.Binary;
import org.hl7.fhir.dstu3.model.Bundle;
import org.hl7.fhir.dstu3.model.Bundle.BundleEntryComponent;
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
import uk.nhs.careconnect.nosql.dao.transform.CompositionTransformer;
import uk.nhs.careconnect.nosql.entities.CodingEntity;
import uk.nhs.careconnect.nosql.entities.CompositionEntity;
import uk.nhs.careconnect.nosql.entities.DocumentReferenceEntity;
import uk.nhs.careconnect.nosql.entities.IdentifierEntity;
import uk.nhs.careconnect.nosql.entities.PatientEntity;

import javax.transaction.Transactional;
import java.time.Clock;
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
import static uk.nhs.careconnect.nosql.util.BundleUtils.extractFirstResourceOfType;
import static uk.nhs.careconnect.nosql.util.BundleUtils.resourceOfType;

@Transactional
@Repository
public class BundleDao implements IBundle {

    private static final Logger log = LoggerFactory.getLogger(BundleDao.class);

    private final Clock clock;
    private final FhirContext fhirContext;
    private final MongoOperations mongo;
    private final IFHIRResource fhirDocumentDao;
    private final IPatient patientDao;
    private final CompositionDao compositionDao;
    private final BinaryResourceDao binaryResourceDao;

    @Autowired
    public BundleDao(Clock clock, FhirContext fhirContext, MongoOperations mongo,
                     IFHIRResource fhirDocumentDao, IPatient patientDao, CompositionDao compositionDao, BinaryResourceDao binaryResourceDao) {
        this.clock = clock;
        this.fhirContext = fhirContext;
        this.mongo = mongo;
        this.fhirDocumentDao = fhirDocumentDao;
        this.patientDao = patientDao;
        this.compositionDao = compositionDao;
        this.binaryResourceDao = binaryResourceDao;
    }

    @Override
    public Bundle update(Bundle bundle, IdType idType, String theConditional) {
        log.debug("About to update Bundle");

//        // KGM added 4/3/2019
//        if (theConditional != null) {
//            // This is not kosher
//
//            Query qry = Query.query(Criteria.where("identifier.system").is(bundle.getIdentifier().getSystem()).and("identifier.value").is(bundle.getIdentifier().getValue()));
//
//            CompositionEntity bundleE = mongo.findOne(qry, CompositionEntity.class);
//            if (bundleE != null) {
//                log.info("Conditional Found id = " + bundleE.getFhirDocumentlId());
//                idType = new IdType().setValue(bundleE.getFhirDocumentlId());
//            }
//
//        }
        SaveBundleResponse saveBundleResponse = saveBundle(bundle, idType, UPDATE);

        PatientEntity savedPatient = savePatient(bundle);

        CompositionEntity compositionEntity = updateCompositionEntity(bundle, saveBundleResponse.getSavedBundleId(), savedPatient);

        Optional<ObjectId> optionalBinaryId = saveBinary(saveBundleResponse.getBundle());

        saveDocumentReference(saveBundleResponse.getBundle(), savedPatient, compositionEntity, optionalBinaryId);

        OperationOutcome operationOutcome = new OperationOutcome();
        operationOutcome.setId("Composition/" + compositionEntity.getId());

        return aBundleResponse(saveBundleResponse.getBundle(), compositionEntity);
    }

    @Override
    public Bundle create(Bundle bundle, IdType idType, String theConditional) {
        log.debug("About to create Bundle");

        Optional<Bundle> optionalInnerBundle = extractFirstResourceOfType(Bundle.class, bundle);

        Bundle bundleToSave = optionalInnerBundle.orElse(bundle);

        checkNotAlreadySaved(bundleToSave);

        SaveBundleResponse saveBundleResponse = saveBundle(bundleToSave, idType, CREATE);

        PatientEntity savedPatient = savePatient(bundleToSave);

        CompositionEntity compositionEntity = saveComposition(bundleToSave, saveBundleResponse.getSavedBundleId(), savedPatient);

        Optional<ObjectId> optionalBinaryId = saveBinary(saveBundleResponse.getBundle());

        saveDocumentReference(saveBundleResponse.getBundle(), savedPatient, compositionEntity, optionalBinaryId);

        return aBundleResponse(saveBundleResponse.getBundle(), compositionEntity);
    }

    private void checkNotAlreadySaved(Bundle bundle) {
        Query qry = Query.query(Criteria.where("identifier.system").is(bundle.getIdentifier().getSystem()).and("identifier.value").is(bundle.getIdentifier().getValue()));

        CompositionEntity bundleE = mongo.findOne(qry, CompositionEntity.class);
        if (bundleE != null)
            throw new ResourceVersionConflictException("FHIR Document already exists. Binary/" + bundleE.getId());
    }

    private SaveBundleResponse saveBundle(Bundle bundle, IdType idType, SaveAction saveAction) {
        DBObject savedBsonBundle = fhirDocumentDao.save(fhirContext, bundle, idType, saveAction);

        Object savedBundleId = savedBsonBundle.get("_id");
        Bundle savedBundle = bsonBundleToBundle(fhirContext, savedBsonBundle);
        savedBundle.setId(savedBundleId.toString());

        return new SaveBundleResponse()
                .setObjectId(savedBundleId)
                .setBundle(savedBundle);
    }

    private PatientEntity savePatient(Bundle bundle) {
        PatientEntity savedPatientEntity = null;

        for (BundleEntryComponent entry : bundle.getEntry()) {
            if (entry.hasResource() && entry.getResource() instanceof Patient) {
                // TODO ensure this is the correcct Patient (one referred to in the Composition)
                savedPatientEntity = patientDao.createEntity(fhirContext, (Patient) entry.getResource());
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
            compositionEntity.setDate(Date.from(clock.instant()));

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
                .map(BundleEntryComponent::getResource)
                .filter(resourceOfType(Composition.class))
                .map(Composition.class::cast)
                .findFirst();

        compositionEntity.setType(compositionEntry.map(composition -> fhirToCodingEntity(composition.getType().getCoding())).orElse(emptyList()));
    }

    private Collection<CodingEntity> fhirToCodingEntity(List<org.hl7.fhir.dstu3.model.Coding> codingList) {
        return codingList.stream()
                .map(CodingEntity::new)
                .collect(toList());
    }

    private void saveDocumentReference(Bundle bundle, PatientEntity savedPatient, CompositionEntity compositionEntity, Optional<ObjectId> optionalBinaryId) {
        Optional<DocumentReference> optionalDocumentReference = bundle.getEntry().stream()
                .map(BundleEntryComponent::getResource)
                .filter(resourceOfType(DocumentReference.class))
                .map(DocumentReference.class::cast)
                .findFirst();

        DocumentReferenceEntity savedDocumentReferenceEntity;

        if (!optionalDocumentReference.isPresent()) {
            savedDocumentReferenceEntity = createDocumentReference(bundle, savedPatient, compositionEntity);
        } else {
            DocumentReference documentReference = optionalDocumentReference.get();
            DocumentReferenceEntity foundDocumentReference = findSavedDocumentReference(savedPatient);
            if (foundDocumentReference != null) {
                savedDocumentReferenceEntity = updateDocumentReference(documentReference, foundDocumentReference);
            } else {
                savedDocumentReferenceEntity = saveDocumentReference(savedPatient, documentReference);
            }
        }

        saveDocumentReferenceAttachment(savedDocumentReferenceEntity.getFhirDocumentReference(), optionalBinaryId);

        mongo.save(savedDocumentReferenceEntity);

        //prepare response
        savedDocumentReferenceEntity.getFhirDocumentReference().setId(savedDocumentReferenceEntity.getId());

        List<BundleEntryComponent> entries = bundle.getEntry().stream()
                .map(BundleEntryComponent::getResource)
                .map(resource -> resourceOfType(DocumentReference.class).test(resource) ?
                        savedDocumentReferenceEntity.getFhirDocumentReference() : resource)
                .map(resource -> new BundleEntryComponent().setResource(resource))
                .collect(toList());

        bundle.setEntry(entries);

    }

    private DocumentReferenceEntity findSavedDocumentReference(PatientEntity patientEntity) {
        Query qry = Query.query(Criteria.where("idxPatient").is(new DBRef("idxPatient", patientEntity.getId().toString())));

        return mongo.findOne(qry, DocumentReferenceEntity.class);
    }

    private DocumentReferenceEntity updateDocumentReference(DocumentReference documentReference, DocumentReferenceEntity foundDocumentReference) {
        return new DocumentReferenceEntity(documentReference, foundDocumentReference);
    }

    private DocumentReferenceEntity saveDocumentReference(PatientEntity savedPatient, DocumentReference documentReference) {
        return new DocumentReferenceEntity(savedPatient, documentReference);
    }

    private DocumentReferenceEntity createDocumentReference(Bundle bundle, PatientEntity savedPatient, CompositionEntity compositionEntity) {
        Optional<Composition> compositionEntry = bundle.getEntry().stream()
                .map(BundleEntryComponent::getResource)
                .filter(resourceOfType(Composition.class))
                .map(Composition.class::cast)
                .findFirst();

        return compositionEntry.map(composition -> {
            DocumentReference documentReference = CompositionTransformer.transformToDocumentReference(composition);
            documentReference.setCreated(Date.from(clock.instant()));


            documentReference.setContent(asList(new DocumentReferenceContentComponent()
                    .setAttachment(new Attachment()
                            .setUrl(compositionEntity.getId().toString())
                            .setContentType("application/fhir+xml"))

            ));

            return new DocumentReferenceEntity(savedPatient, documentReference);
        }).orElse(null);
    }

    private void saveDocumentReferenceAttachment(DocumentReference documentReference, Optional<ObjectId> optionalBinaryId) {
        optionalBinaryId.ifPresent(binaryId -> {

            DocumentReferenceContentComponent documentReferenceContentComponent = new DocumentReferenceContentComponent();

            Optional<Attachment> optionalAttachment = documentReference.getContent().stream()
                    .map(DocumentReferenceContentComponent::getAttachment)
                    .findFirst();

            optionalAttachment.ifPresent(attachment -> {
                attachment.setUrl(format("Binary/%s", binaryId));
                documentReferenceContentComponent.setAttachment(attachment);
            });

            documentReference.setContent(asList(documentReferenceContentComponent));
        });
    }

    public Optional<ObjectId> saveBinary(Bundle bundle) {
        Optional<Binary> optionalBinary = bundle.getEntry().stream()
                .map(BundleEntryComponent::getResource)
                .filter(resourceOfType(Binary.class))
                .map(Binary.class::cast)
                .findFirst();

        return optionalBinary.map(binary -> binaryResourceDao.save(fhirContext, binary));
    }

    private Bundle aBundleResponse(Bundle bundle, CompositionEntity compositionEntity) {
        OperationOutcome operationOutcome = new OperationOutcome();
        operationOutcome.setId("Composition/" + compositionEntity.getId());

        return new Bundle()
                .addEntry(new BundleEntryComponent().setResource(operationOutcome))
                .addEntry(new BundleEntryComponent().setResource(bundle));
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
