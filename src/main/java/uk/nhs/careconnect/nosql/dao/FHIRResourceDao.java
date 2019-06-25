package uk.nhs.careconnect.nosql.dao;

import ca.uhn.fhir.context.FhirContext;
import com.mongodb.DBObject;
import org.hl7.fhir.dstu3.model.Bundle;
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

import static uk.nhs.careconnect.nosql.dao.SaveAction.CREATE;
import static uk.nhs.careconnect.nosql.util.BundleUtils.fhirResourceToDBObject;


@Repository
public class FHIRResourceDao implements IFHIRResource {

    private static final Logger log = LoggerFactory.getLogger(FHIRResourceDao.class);

    @Autowired
    protected MongoTemplate mongoTemplate;

    @Override
    public DBObject save(FhirContext ctx, Resource resource, IdType idType, SaveAction saveAction) {

        DBObject mObj = fhirResourceToDBObject(ctx, resource);

        if (saveAction == CREATE) {
            log.debug("About to save new FHIRResource");

            mongoTemplate.insert(mObj, resource.getResourceType().name());
            return mObj;
        } else {

            log.debug("About to update FHIRResource");

            Bundle bundle = (Bundle)resource;

            Criteria criteria = Criteria.where("identifier.value").is(bundle.getIdentifier().getValue());

            if (bundle.getIdentifier().getSystem() != null){
                criteria.and("identifier.system").is(bundle.getIdentifier().getSystem());
            }

            Query qry = Query.query(criteria);

            DBObject foundBundle = mongoTemplate.findOne(qry, DBObject.class,"Bundle");

            mongoTemplate.findAndModify(qry, Update.fromDBObject(mObj), new FindAndModifyOptions().returnNew(true), DBObject.class, resource.getResourceType().name());
            mObj.put("_id", foundBundle.get("_id"));

            return mObj;
        }

    }

}