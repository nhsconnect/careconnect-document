package uk.nhs.careconnect.nosql.dao;

import ca.uhn.fhir.rest.param.DateRangeParam;
import ca.uhn.fhir.rest.param.ReferenceParam;
import ca.uhn.fhir.rest.param.TokenOrListParam;
import ca.uhn.fhir.rest.param.TokenParam;
import org.hl7.fhir.dstu3.model.Bundle;
import org.hl7.fhir.dstu3.model.DocumentReference;
import org.hl7.fhir.dstu3.model.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;
import uk.nhs.careconnect.nosql.entities.DocumentReferenceEntity;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;

import static java.lang.String.format;
import static java.util.stream.Collectors.toList;
import static uk.nhs.careconnect.nosql.dao.CriteriaBuilder.aCriteriaBuilder;

@Transactional
@Repository
public class DocumentReferenceDao implements IDocumentReference {

    private static final Logger log = LoggerFactory.getLogger(DocumentReferenceDao.class);

    @Autowired
    MongoOperations mongo;

    @Value("${ccri.server.base}")
    String serverBase;

    @Override
    public Bundle search(TokenParam resid, TokenParam identifier, ReferenceParam patient, DateRangeParam createdDate,
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
                    .map(this::decorateDocumentReference)
                    .collect(toList());
        }

        return new Bundle().setEntry(resources.stream().map(new Bundle.BundleEntryComponent()::setResource).collect(toList()));
    }

    private Resource decorateDocumentReference(DocumentReferenceEntity documentReferenceEntity) {
        DocumentReference documentReference = documentReferenceEntity.getFhirDocumentReference();
        documentReference.setId(documentReferenceEntity.getId());
        documentReference.getContent().stream()
                .forEach(c -> c.setAttachment(c.getAttachment().setUrl(format(serverBase + "/%s", c.getAttachment().getUrl()))));

        return documentReference;
    }

}
