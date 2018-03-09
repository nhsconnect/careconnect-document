package uk.nhs.careconnect.nosql.dao;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.param.ReferenceParam;
import ca.uhn.fhir.rest.param.TokenParam;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.mongodb.DBObject;

import com.mongodb.DBRef;
import uk.nhs.careconnect.nosql.entities.CompositionEntity;
import uk.nhs.careconnect.nosql.entities.Entry;
import org.apache.commons.lang3.StringUtils;
import org.bson.types.ObjectId;
import org.hl7.fhir.dstu3.model.Bundle;
import org.hl7.fhir.dstu3.model.Composition;
import org.hl7.fhir.dstu3.model.IdType;

import org.hl7.fhir.dstu3.model.Resource;
import org.hl7.fhir.instance.model.api.IBaseResource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;
import uk.nhs.careconnect.nosql.entities.PatientEntity;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;

@Transactional
@Repository
public class CompositionDao implements IComposition {


    @Autowired
    protected MongoTemplate mongo;

    @Autowired IResource resourceDao;

    private static final Logger log = LoggerFactory.getLogger(CompositionDao.class);

    @Override
    public List<Resource> search(FhirContext ctx, TokenParam resid, ReferenceParam patient) {

        List<Resource> resources = new ArrayList<>();

        Criteria criteria = null;

        if (resid != null) {
            if (criteria == null) {
                criteria = Criteria.where("entry.objectId").is(resid.getValue());//.and("entry.resourceType").is("Composition");
            } else {
                criteria = criteria.and("entry.objectId").is(resid.getValue());//.and("entry.resourceType").is("Composition");
            }
        }
        if (patient != null) {

            if (criteria == null) {
                criteria = Criteria.where("idxPatient").is(new DBRef("idxPatient", patient.getValue()));
            } else {
                criteria = criteria.and("idxPatient").is(new DBRef("idxPatient", patient.getValue()));
            }
        }
        if (criteria != null) {
            Query qry = Query.query(criteria);
            log.info("qry = " + qry.toString());
            List<CompositionEntity> results = mongo.find(qry, CompositionEntity.class);
            log.info("Found = "+results.size());
            for (CompositionEntity bundleEntity : results) {

                for (Entry entry : bundleEntity.getEntry()) {
                    if (entry.getObject().getCollectionName().equals("Composition")) {
                        log.info(entry.getObject().getId().toString());
                        resources.add(read(ctx,new IdType().setValue(entry.getObject().getId().toString())));
                    }
                }
            }
        }

        return resources;
    }

    @Override
    public Composition read(FhirContext ctx, IdType theId) {


        Composition composition = null;

        Query qry = Query.query(Criteria.where("_id").is(new ObjectId(theId.getValue())));
        log.info("qry = " + qry.toString());
        DBObject resourceObj =  mongo.findOne(qry,DBObject.class,"Composition");
        if (resourceObj != null) {

            // Remove Mongo Elements
            JsonParser jsonParser = new JsonParser();
            JsonObject jo = (JsonObject)jsonParser.parse(resourceObj.toString());
            jo.remove("_class");
            jo.remove("_id");

            IBaseResource resource = ctx.newJsonParser().parseResource(jo.toString());
            resource.setId(theId.getValue());

            if (resource instanceof  Composition) composition = (Composition) resource;
        }


        return composition;

    }

    private ObjectId converToObjectId(String id) {
        return new ObjectId(id);
    }

    @Override
    public Bundle readDocument(FhirContext ctx, IdType theId) {
        // Search for document bundle rather than composition (this contains a link to the Composition

        // {'entry.objectId': ObjectId("5a95166bbc5b249440975d8f"), 'entry.resourceType' : 'Composition'}
        Bundle bundle = new Bundle();
        bundle.setType(Bundle.BundleType.DOCUMENT);

        Query qry = Query.query(Criteria.where("entry.objectId").is( theId.getIdPart()) );

        System.out.println(qry.toString());
        CompositionEntity document = mongo.findOne(qry, CompositionEntity.class);
        if (document!=null) {
            log.info(document.toString());
            for (Entry entry :document.getEntry()) {

                qry = Query.query(Criteria.where("_id").is(entry.getObject().getId()));
                log.info("qry = " + qry.toString());
                DBObject resourceObj =  mongo.findOne(qry,DBObject.class,entry.getObject().getCollectionName());
                if (resourceObj != null) {

                    JsonParser jsonParser = new JsonParser();
                    JsonObject jo = (JsonObject)jsonParser.parse(resourceObj.toString());
                    jo.remove("_class");
                    jo.remove("_id");

                    IBaseResource resource = ctx.newJsonParser().parseResource(jo.toString());
                    resource.setId(StringUtils.remove(entry.getOriginalId(),"urn:uuid:"));
                    bundle.addEntry().setResource((Resource) resource).setFullUrl("urn:uuid:"+((Resource) resource).getId());
                }
            }
        } else {
            return null;
        }

        return bundle;
    }
}
