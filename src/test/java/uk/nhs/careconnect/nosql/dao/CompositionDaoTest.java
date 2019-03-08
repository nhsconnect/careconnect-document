package uk.nhs.careconnect.nosql.dao;

import ca.uhn.fhir.rest.param.DateRangeParam;
import ca.uhn.fhir.rest.param.ReferenceParam;
import ca.uhn.fhir.rest.param.TokenOrListParam;
import ca.uhn.fhir.rest.param.TokenParam;
import org.hl7.fhir.dstu3.model.Bundle;
import org.hl7.fhir.dstu3.model.OperationOutcome;
import org.hl7.fhir.dstu3.model.Resource;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import uk.nhs.careconnect.nosql.entities.CompositionEntity;

import java.time.*;
import java.util.Date;
import java.util.List;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static uk.nhs.careconnect.nosql.util.BundleUtils.extractFirstResourceOfType;

public class CompositionDaoTest extends AbstractDaoTest {

    @Autowired
    IBundle bundleDao;

    @Autowired
    IComposition compositionDao;

    private CompositionEntity compositionEntity;
    private String compositionId;

    @Before
    public void eachTest() {
        loadAndCreateBundle();
        loadCompositionEntity();
    }

    @Test
    public void givenABundleStoredInMongo_whenSearchIsCalledWith_Id_aListOfRelevantResourcesShouldBeReturned() {
        //setup
        TokenParam _id = new TokenParam();
        _id.setValue(compositionId);

        //when
        List<Resource> resources = compositionDao.search(ctx, _id, null, null, null, null);

        //then
        assertThat(resources.get(0).getId(), is(compositionId));
    }

    @Test
    public void givenABundleStoredInMongo_whenSearchIsCalledWithIdentifier_aListOfRelevantResourcesShouldBeReturned() {
        //setup
        TokenParam identifier = new TokenParam("https://tools.ietf.org/html/rfc4122", "434f40c3-de6c-435a-914d-fb274b9a5e99");

        //when
        List<Resource> resources = compositionDao.search(ctx, null, identifier, null, null, null);

        //then
        assertThat(resources.get(0).getId(), is(compositionId));
    }

    @Test
    public void givenABundleStoredInMongo_whenSearchIsCalledWithPatient_aListOfRelevantResourcesShouldBeReturned() {
        //setup
        ReferenceParam patient = new ReferenceParam();
        patient.setValue(compositionEntity.getIdxPatient().getId().toString());

        //when
        List<Resource> resources = compositionDao.search(ctx, null, null, patient, null, null);

        //then
        assertThat(resources.get(0).getId(), is(compositionId));
    }

    @Test
    public void givenABundleStoredInMongo_whenSearchIsCalledWithResIdAndPatient_aListOfRelevantResourcesShouldBeReturned() {
        //setup
        TokenParam resid = new TokenParam();
        resid.setValue(compositionId);
        ReferenceParam patient = new ReferenceParam();
        patient.setValue(compositionEntity.getIdxPatient().getId().toString());

        //when
        List<Resource> resources = compositionDao.search(ctx, resid, null, patient, null, null);

        //then
        assertThat(resources.get(0).getId(), is(compositionId));
    }

    @Test
    public void givenABundleStoredInMongo_whenSearchIsCalledWithDate_aListOfRelevantResourcesShouldBeReturned() {

        OffsetDateTime now = OffsetDateTime.now(ZoneOffset.UTC);
        Date yesterday = Date.from(now.minusDays(1).toInstant());
        Date tomorrow = Date.from(now.plusDays(1).toInstant());

        DateRangeParam date = new DateRangeParam(yesterday, tomorrow);

        //when
        List<Resource> resources = compositionDao.search(ctx, null, null, null, date, null);

        //then
        assertThat(resources.get(0).getId(), is(compositionId));
    }


    //TODO: Check about display field of type
    @Test
    public void givenABundleStoredInMongo_whenSearchIsCalledWithType_aListOfRelevantResourcesShouldBeReturned() {
        //setup
        TokenOrListParam type = new TokenOrListParam("http://snomed.info/sct", "373942005");

        //when
        List<Resource> resources = compositionDao.search(ctx, null, null, null, null, type);

        //then
        assertThat(resources.get(0).getId(), is(compositionId));
    }

    private void loadAndCreateBundle() {
        Bundle bundle = loadBundle();

        Bundle createdBundle = bundleDao.create(bundle, null, null);
        OperationOutcome operationOutcome = extractFirstResourceOfType(OperationOutcome.class, createdBundle).get();

        compositionId = operationOutcome.getId().split("/")[1];
    }

    private void loadCompositionEntity() {
        Query qry = Query.query(Criteria.where("_id").is(compositionId));

        compositionEntity = mongoTemplate.findOne(qry, CompositionEntity.class);
    }

}
