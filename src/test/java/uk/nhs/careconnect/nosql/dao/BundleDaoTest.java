package uk.nhs.careconnect.nosql.dao;

import com.mongodb.DBObject;
import org.bson.types.ObjectId;
import org.hl7.fhir.dstu3.model.Bundle;
import org.hl7.fhir.dstu3.model.OperationOutcome;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import uk.nhs.careconnect.nosql.entities.CompositionEntity;

import static org.hamcrest.CoreMatchers.*;
import static org.hamcrest.MatcherAssert.assertThat;
import static uk.nhs.careconnect.nosql.support.assertions.CompositionAssertions.assertThatCompositionsAreEqual;
import static uk.nhs.careconnect.nosql.support.testdata.BundleTestData.aBundle;
import static uk.nhs.careconnect.nosql.support.testdata.CompositionTestData.aCompositionEntity;

public class BundleDaoTest extends AbstractDaoTest {

    @Autowired
    IBundle bundleDao;

    @Test
    public void givenABundle_whenCreateIsCalled_anIdxCompositionIsPersistedInMongo() {
        //setup
        Bundle bundle = aBundle();
        CompositionEntity expectedCompositionEntity = aCompositionEntity();

        //when
        OperationOutcome operationOutcome = bundleDao.create(ctx, bundle, null, null);

        //then

        //load the saved bundle and check it
        Query qry = Query.query(Criteria.where("id").is(bundle.getId()));
        DBObject resourceObj = mongoTemplate.findOne(qry, DBObject.class, "Bundle");
        ObjectId bundleId = (ObjectId) resourceObj.get("_id");

        //load the saved idxComposition

        qry = Query.query(Criteria.where("fhirDocumentlId").is(bundleId.toHexString()));
        CompositionEntity savedCompositionEntity = mongoTemplate.findOne(qry, CompositionEntity.class);

        assertThatCompositionsAreEqual(savedCompositionEntity, expectedCompositionEntity);
        assertThat(savedCompositionEntity.getFhirDocument(), is(notNullValue()));
        assertThat(savedCompositionEntity.getFhirDocumentlId(), is(notNullValue()));
        assertThat(operationOutcome.getId(), startsWith("Composition/" ));
    }

    //TODO - test that a bundle is persisted

    //TODO - test that a idxPatient is persisted

}
