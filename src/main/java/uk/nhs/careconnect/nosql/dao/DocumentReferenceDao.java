package uk.nhs.careconnect.nosql.dao;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.param.DateRangeParam;
import ca.uhn.fhir.rest.param.ReferenceParam;
import ca.uhn.fhir.rest.param.TokenOrListParam;
import ca.uhn.fhir.rest.param.TokenParam;
import org.hl7.fhir.dstu3.model.Resource;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import uk.nhs.careconnect.nosql.dao.transform.DocumentReferenceTransformer;
import uk.nhs.careconnect.nosql.entities.DocumentReferenceEntity;
import org.hl7.fhir.dstu3.model.DocumentReference;
import org.hl7.fhir.dstu3.model.IdType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.stereotype.Repository;


import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;

import static java.util.stream.Collectors.toList;
import static uk.nhs.careconnect.nosql.dao.CriteriaBuilder.aCriteriaBuilder;

@Transactional
@Repository
public class DocumentReferenceDao implements IDocumentReference {

    private static final Logger log = LoggerFactory.getLogger(DocumentReferenceDao.class);

    @Autowired
    MongoOperations mongo;

    @Override
    public List<Resource> search(FhirContext ctx, TokenParam resid, TokenParam identifier, ReferenceParam patient,
                                 DateRangeParam createdDate, TokenOrListParam type, TokenOrListParam setting, DateRangeParam periodStart, DateRangeParam periodEnd) {
        List<Resource> resources = new ArrayList<>();

        Criteria criteria = aCriteriaBuilder()
                .withId(resid)
                .withIdentifier(identifier)
                .withPatient(patient)
                .withCreatedDate(createdDate)
                .withType("type.coding.code", "type.coding.system", type)
                .withSetting(setting)
                .withPeriod(periodStart, periodEnd)
                .build();

        if (criteria != null) {
            Query qry = Query.query(criteria);

            log.debug("About to call Mongo DB for a documentReference=[{}]", qry);

            List<DocumentReferenceEntity> results = mongo.find(qry, DocumentReferenceEntity.class);

            log.debug("Found [{}] result(s)", results.size());

            resources = results.stream()
                    .map(result -> new DocumentReferenceTransformer().transform(result))
                    .collect(toList());
        }


        return resources;
    }

    public DocumentReference create(FhirContext ctx, DocumentReference documentReference, IdType theId, String theConditional) {
//        log.debug("DocumentReferenceEntity.save");
//
//        DocumentReferenceEntity documentReferenceEntity = new DocumentReferenceEntity();
//        documentReferenceEntity.setName("Dina");
//        String json = ctx.newJsonParser().encodeResourceToString(documentReference);
//        documentReferenceEntity.setJson(json);
//
//        mongo.save(documentReferenceEntity);

        return null;
    }

}
