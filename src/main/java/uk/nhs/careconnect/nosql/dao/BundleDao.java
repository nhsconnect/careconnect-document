package uk.nhs.careconnect.nosql.dao;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.server.exceptions.ResourceVersionConflictException;
import com.mongodb.DBObject;
import com.mongodb.DBRef;
import org.hl7.fhir.dstu3.model.*;
import org.hl7.fhir.dstu3.model.Bundle.BundleEntryComponent;
import org.hl7.fhir.dstu3.model.DocumentReference.DocumentReferenceContentComponent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;
import uk.nhs.careconnect.nosql.dao.transform.CompositionTransformer;
import uk.nhs.careconnect.nosql.dao.transform.PatientEntityToFHIRPatient;
import uk.nhs.careconnect.nosql.entities.*;

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
import static uk.nhs.careconnect.nosql.decorators.DocumentReferenceDecorator.decorateDocumentReference;
import static uk.nhs.careconnect.nosql.util.BundleUtils.*;


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
    private final PatientEntityToFHIRPatient patientEntityToFHIRPatient;



    @Autowired
    public BundleDao(Clock clock, FhirContext fhirContext, MongoOperations mongo,
                     IFHIRResource fhirDocumentDao, IPatient patientDao, CompositionDao compositionDao, BinaryResourceDao binaryResourceDao,
                     PatientEntityToFHIRPatient patientEntityToFHIRPatient) {
        this.clock = clock;
        this.fhirContext = fhirContext;
        this.mongo = mongo;
        this.fhirDocumentDao = fhirDocumentDao;
        this.patientDao = patientDao;
        this.compositionDao = compositionDao;
        this.binaryResourceDao = binaryResourceDao;
        this.patientEntityToFHIRPatient = patientEntityToFHIRPatient;
    }

    @Override
    public BundleResponse update(Bundle bundle, IdType idType, String theConditional) {
        log.debug("About to update Bundle");

        // KGM added 4/3/2019
        if (theConditional != null && bundle.hasIdentifier()) {
            // This is not kosher
            log.info("The conditional = "+theConditional);
            System.out.println("The conditional = "+theConditional);
            Query qry;

            if (bundle.getIdentifier().hasSystem() && bundle.getIdentifier().hasValue()) {
                qry = Query.query(Criteria.where("identifier.system").is(bundle.getIdentifier().getSystem()).and("identifier.value").is(bundle.getIdentifier().getValue()));
            } else {
                qry = Query.query(Criteria.where("identifier.value").is(bundle.getIdentifier().getValue()));
            }
            if (qry != null) {
                CompositionEntity bundleE = mongo.findOne(qry, CompositionEntity.class);
                if (bundleE != null) {
                    log.info("Conditional Found id = " + bundleE.getFhirDocumentlId());
                    idType = new IdType().setValue(bundleE.getFhirDocumentlId());
                }
            }
        }

        Optional<Bundle> optionalInnerBundle = extractFirstResourceOfType(Bundle.class, bundle);

        Bundle bundleToSave = optionalInnerBundle.orElse(bundle);

        SaveBundleResponse saveBundleResponse = saveBundle(bundleToSave, idType, UPDATE);

        PatientEntity savedPatient = savePatient(bundleToSave);

        CompositionEntity compositionEntity = updateCompositionEntity(bundleToSave, saveBundleResponse.getSavedBundleId(), savedPatient);

        Optional<Binary> savedBinary = saveBinary(saveBundleResponse.getBundle());

        DocumentReferenceEntity savedDocumentReference = saveDocumentReference(saveBundleResponse.getBundle(), savedPatient, compositionEntity, savedBinary);

        return aBundleResponse(saveBundleResponse.getBundle(), compositionEntity, savedPatient, savedDocumentReference);
    }

    @Override
    public BundleResponse create(Bundle bundle, IdType idType, String theConditional) {
        log.debug("About to create Bundle");

        Optional<Bundle> optionalInnerBundle = extractFirstResourceOfType(Bundle.class, bundle);

        Bundle bundleToSave = optionalInnerBundle.orElse(bundle);

        checkNotAlreadySaved(bundleToSave);

        SaveBundleResponse saveBundleResponse = saveBundle(bundleToSave, idType, CREATE);

        PatientEntity savedPatient = savePatient(bundleToSave);

        CompositionEntity compositionEntity = saveComposition(bundleToSave, saveBundleResponse.getSavedBundleId(), savedPatient);

        Optional<Binary> savedBinary = saveBinary(saveBundleResponse.getBundle());

        DocumentReferenceEntity savedDocumentReference = saveDocumentReference(saveBundleResponse.getBundle(), savedPatient, compositionEntity, savedBinary);

        return aBundleResponse(saveBundleResponse.getBundle(), compositionEntity, savedPatient, savedDocumentReference);
    }

    private void checkNotAlreadySaved(Bundle bundle) {
        if (bundle.hasEntry() && bundle.getEntryFirstRep().getResource() instanceof DocumentReference) {
            DocumentReference documentReference = (DocumentReference) bundle.getEntryFirstRep().getResource();
            for (Identifier identifier : documentReference.getIdentifier()) {
                Query qry = Query.query(Criteria.where("identifier.system").is(identifier.getSystem()).and("identifier.value").is(identifier.getValue()));
                DocumentReferenceEntity bundleE = mongo.findOne(qry, DocumentReferenceEntity.class);
                if (bundleE != null)
                    throw new ResourceVersionConflictException("DocumentReference already exists. Binary/" + bundleE.getId());
            }
        } else {
            Query qry = Query.query(Criteria.where("identifier.system").is(bundle.getIdentifier().getSystem()).and("identifier.value").is(bundle.getIdentifier().getValue()));

            CompositionEntity bundleE = mongo.findOne(qry, CompositionEntity.class);
            if (bundleE != null)
                throw new ResourceVersionConflictException("FHIR Document already exists. Binary/" + bundleE.getId());

        }
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

    private Collection<CodingEntity> fhirToCodingEntity(List<Coding> codingList) {
        return codingList.stream()
                .map(CodingEntity::new)
                .collect(toList());
    }

    private DocumentReferenceEntity saveDocumentReference(Bundle bundle, PatientEntity savedPatient, CompositionEntity compositionEntity, Optional<Binary> optionalBinary) {
        Optional<DocumentReference> optionalDocumentReference = bundle.getEntry().stream()
                .map(BundleEntryComponent::getResource)
                .filter(resourceOfType(DocumentReference.class))
                .map(DocumentReference.class::cast)
                .findFirst();

        DocumentReferenceEntity savedDocumentReferenceEntity;

        DocumentReferenceEntity foundDocumentReference = null;
        if (!optionalDocumentReference.isPresent()) {

            // FHIR Document, generate DocumentReference

            savedDocumentReferenceEntity = createDocumentReference(bundle, savedPatient, compositionEntity);

        } else {
            DocumentReference documentReference = optionalDocumentReference.get();
            foundDocumentReference = findSavedDocumentReference(bundle);
            if (foundDocumentReference != null) {
                savedDocumentReferenceEntity = updateDocumentReference(documentReference, foundDocumentReference);
            } else {
                savedDocumentReferenceEntity = saveDocumentReference(savedPatient, documentReference);
            }
        }

        saveDocumentReferenceAttachment(savedDocumentReferenceEntity.getFhirDocumentReference(), optionalBinary);

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

        return savedDocumentReferenceEntity;

    }


    private DocumentReferenceEntity findSavedDocumentReference(DocumentReference documentReference) {
        for (Identifier identifier : documentReference.getIdentifier()) {
            Query qry = Query.query(Criteria.where("identifier.system").is(identifier.getSystem())
                    .and("identifier.value").is(identifier.getValue()));

            DocumentReferenceEntity documentReferenceEntity = mongo.findOne(qry, DocumentReferenceEntity.class);
            if (documentReferenceEntity != null) return documentReferenceEntity;
        }
        return null;
    }


    private DocumentReferenceEntity findSavedDocumentReference(Bundle bundle) {

        if (!bundle.hasIdentifier()) {
            return null;
        }
       Query qry = Query.query(Criteria.where("identifier.system").is(bundle.getIdentifier().getSystem()).and("identifier.value").is(bundle.getIdentifier().getValue()));


        DocumentReferenceEntity documentReferenceEntity = mongo.findOne(qry, DocumentReferenceEntity.class);
        if (documentReferenceEntity != null) return documentReferenceEntity;

        return null;
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
                            .setUrl(format("Binary/%s", compositionEntity.getId().toString()))
                            .setContentType("application/fhir+xml"))

            ));
            DocumentReferenceEntity foundDocumentReference = findSavedDocumentReference(documentReference);
            if (foundDocumentReference != null ) {
                return new DocumentReferenceEntity(documentReference, foundDocumentReference);
            } else {
                return new DocumentReferenceEntity(savedPatient, documentReference);
            }
        }).orElse(null);
    }

    private void saveDocumentReferenceAttachment(DocumentReference documentReference, Optional<Binary> optionalBinary) {
        optionalBinary.ifPresent(binary -> {

            DocumentReferenceContentComponent documentReferenceContentComponent = new DocumentReferenceContentComponent();

            Optional<Attachment> optionalAttachment = documentReference.getContent().stream()
                    .map(DocumentReferenceContentComponent::getAttachment)
                    .findFirst();

            optionalAttachment.ifPresent(attachment -> {
                attachment.setUrl(format("Binary/%s", binary.getId()));
                documentReferenceContentComponent.setAttachment(attachment);
            });

            documentReference.setContent(asList(documentReferenceContentComponent));
        });
    }

    public Optional<Binary> saveBinary(Bundle bundle) {
        Optional<Binary> optionalBinary = bundle.getEntry().stream()
                .map(BundleEntryComponent::getResource)
                .filter(resourceOfType(Binary.class))
                .map(Binary.class::cast)
                .findFirst();

        return optionalBinary.map(binary -> binaryResourceDao.save(fhirContext, binary));
    }

    private BundleResponse aBundleResponse(Bundle savedBundle, CompositionEntity savedCompositionEntity, PatientEntity savedPatient, DocumentReferenceEntity savedDocumentReferenceEntity) {
        OperationOutcome operationOutcome = new OperationOutcome();
        operationOutcome.setId("Composition/" + savedCompositionEntity.getId());

        decorateDocumentReference(savedDocumentReferenceEntity);

        Bundle responseBundle = (Bundle) new Bundle()
                .setIdentifier(savedBundle.getIdentifier())
                .addEntry(new BundleEntryComponent().setResource(patientEntityToFHIRPatient.transform(savedPatient)))
                .addEntry(new BundleEntryComponent().setResource(savedDocumentReferenceEntity.getFhirDocumentReference()))
                .setId(savedBundle.getId());

        return new BundleResponse(operationOutcome, responseBundle);
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
