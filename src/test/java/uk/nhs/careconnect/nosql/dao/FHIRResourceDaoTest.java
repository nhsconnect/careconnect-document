package uk.nhs.careconnect.nosql.dao;

import com.mongodb.DBObject;
import org.hl7.fhir.dstu3.model.Bundle;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.MatcherAssert.assertThat;
import static uk.nhs.careconnect.nosql.support.assertions.BundleAssertions.assertThatBundleIsEqual;
import static uk.nhs.careconnect.nosql.support.testdata.BundleTestData.aBundle;


public class FHIRResourceDaoTest extends AbstractDaoTest {

    @Autowired
    FHIRResourceDao fhirResourceDao;

    @Test
    public void givenAFhirResource_whenSaveIsCalled_aResourceIsPersistedInMongo() {
        //setup
        Bundle bundle = aBundle();

        //when
        DBObject savedBundleDBObject = fhirResourceDao.save(ctx, bundle);
        Bundle savedBundle = bsonBundleToBundle(savedBundleDBObject);


        //then
        assertThat(savedBundleDBObject.get("_id"), is(notNullValue()));
        assertThatBundleIsEqual(bundle, savedBundle);
    }

    private Bundle bsonBundleToBundle(DBObject bsonBundle) {
        return (Bundle) ctx.newJsonParser().parseResource(bsonBundle.toString());
    }

}