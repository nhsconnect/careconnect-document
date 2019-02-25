package uk.nhs.careconnect.nosql.dao;

import ca.uhn.fhir.context.FhirContext;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.hl7.fhir.dstu3.model.IdType;
import org.hl7.fhir.dstu3.model.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

import static uk.nhs.careconnect.nosql.dao.SaveAction.CREATE;

@Transactional
@Repository
public class FHIRResourceDao implements IFHIRResource {

    private static final Logger log = LoggerFactory.getLogger(FHIRResourceDao.class);

    @Autowired
    protected MongoTemplate mongoTemplate;

    @Override
    public DBObject save(FhirContext ctx, Resource resource, IdType idType, SaveAction saveAction) {

        String resourceJson = filterOutComments(ctx.newJsonParser().encodeResourceToString(resource));

        Document doc = Document.parse(resourceJson);
        DBObject mObj = new BasicDBObject(doc);
        mObj.removeField("id");

        if (saveAction == CREATE) {
            log.debug("About to save new FHIRResource");

            mongoTemplate.insert(mObj, resource.getResourceType().name());
            return mObj;
        } else {

            log.debug("About to update FHIRResource");

            Query qry = Query.query(Criteria.where("_id").is(new ObjectId(idType.getIdPart())));
            return mongoTemplate.findAndModify(qry, Update.fromDBObject(mObj), new FindAndModifyOptions().returnNew(true), DBObject.class, resource.getResourceType().name());
        }

    }

    private String filterOutComments(String resourceJson) {
        return resourceJson.replaceAll("(?s)<!--.*?-->", "");
    }

}