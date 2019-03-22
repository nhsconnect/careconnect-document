package uk.nhs.careconnect.nosql.dao;

import com.mongodb.DBObject;
import org.hl7.fhir.dstu3.model.Bundle;
import org.hl7.fhir.dstu3.model.IdType;
import org.hl7.fhir.dstu3.model.Identifier;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.MatcherAssert.assertThat;
import static uk.nhs.careconnect.nosql.dao.SaveAction.CREATE;
import static uk.nhs.careconnect.nosql.dao.SaveAction.UPDATE;
import static uk.nhs.careconnect.nosql.support.assertions.BundleAssertions.assertThatBundleIsEqual;
import static uk.nhs.careconnect.nosql.support.testdata.BundleTestData.aBundleWithDocumentReference;
import static uk.nhs.careconnect.nosql.util.BundleUtils.bsonBundleToBundle;


public class FHIRResourceDaoTest extends AbstractDaoTest {

    @Autowired
    FHIRResourceDao fhirResourceDao;

    @Test
    public void givenAFhirResource_whenSaveIsCalledWithCreate_aResourceIsPersistedInMongo() {
        //setup
        Bundle bundle = aBundleWithDocumentReference();

        //when
        IdType idType = null;
        DBObject savedBundleDBObject = fhirResourceDao.save(ctx, bundle, idType, CREATE);
        Bundle savedBundle = bsonBundleToBundle(ctx, savedBundleDBObject);

        //then
        assertThat(savedBundleDBObject.get("_id"), is(notNullValue()));
        assertThatBundleIsEqual(bundle, savedBundle);
    }

    @Test
    public void givenAFhirResource_whenSaveIsCalledWithUpdate_aResourceIsUpdatedInMongo() {
        //setup
        Bundle bundle = aBundleWithDocumentReference();
        BundleResponse savedBundle = saveBundle(bundle);

        Bundle bundleUpdate = bundle.copy();
        bundleUpdate.setIdentifier(new Identifier().setValue("New Identifier Value"));

        //when
        IdType idType = new IdType().setValue(savedBundle.getBundle().getId());

        DBObject savedBundleDBObject = fhirResourceDao.save(ctx, bundleUpdate, idType, UPDATE);
        Bundle updatedBundle = bsonBundleToBundle(ctx, savedBundleDBObject);

        //then
        assertThat(savedBundleDBObject.get("_id"), is(notNullValue()));
        assertThatBundleIsEqual(updatedBundle, bundleUpdate);
    }

    protected BundleResponse saveBundle(Bundle bundle) {
        return bundleDao.create(bundle, null, null);
    }

}