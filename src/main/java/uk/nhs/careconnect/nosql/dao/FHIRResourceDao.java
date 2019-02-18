package uk.nhs.careconnect.nosql.dao;

import ca.uhn.fhir.context.FhirContext;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import org.bson.Document;
import org.hl7.fhir.dstu3.model.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

@Transactional
@Repository
public class FHIRResourceDao implements IFHIRResource {

    private static final Logger log = LoggerFactory.getLogger(FHIRResourceDao.class);

    @Autowired
    protected MongoTemplate mongoTemplate;

    @Override
    public DBObject save(FhirContext ctx, Resource resource) {
        log.debug("About to save FHIRResource");

        Document doc = Document.parse(ctx.newJsonParser().encodeResourceToString(resource));
        DBObject mObj = new BasicDBObject(doc);
        mongoTemplate.insert(mObj, resource.getResourceType().name());
        return mObj;
    }

}
