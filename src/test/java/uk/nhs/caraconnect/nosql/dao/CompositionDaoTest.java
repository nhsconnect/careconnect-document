package uk.nhs.caraconnect.nosql.dao;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.context.FhirVersionEnum;
import ca.uhn.fhir.rest.param.ReferenceParam;
import ca.uhn.fhir.rest.param.TokenParam;
import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import com.mongodb.DBRef;
import org.bson.types.ObjectId;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import uk.nhs.careconnect.nosql.dao.CompositionDao;
import uk.nhs.careconnect.nosql.entities.CompositionEntity;

import static java.util.Arrays.asList;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static uk.nhs.caraconnect.nosql.providers.support.testdata.CompositionTestData.VALID_ID;
import static uk.nhs.caraconnect.nosql.providers.support.testdata.CompositionTestData.VALID_PATIENT_ID;

@RunWith(MockitoJUnitRunner.class)
public class CompositionDaoTest {

    @Mock
    MongoTemplate mongo;

    @InjectMocks
    CompositionDao compositionDao;

    //TODO: look into FhirContext - autowired in provider, passed as parameter to dao - could it be autowired in dao and removed from provider?
    FhirContext ctx;

    @Before
    public void eachTest() {
        ctx = new FhirContext(FhirVersionEnum.DSTU3);
    }

    @Test
    public void givenANumberOfSearchParameters_whenSearchIsCalledWithResId_shouldQueryMongo() {
        TokenParam resid = new TokenParam();
        resid.setValue(VALID_ID);
        ReferenceParam patient = null;

        Query expectedQuery = new Query(Criteria.where("_id").is(new ObjectId(resid.getValue())));

        testSearchCallsToMongo(resid, patient, expectedQuery);
    }

    @Test
    public void givenANumberOfSearchParameters_whenSearchIsCalledWithPatient_shouldQueryMongo() {
        TokenParam resid = null;
        ReferenceParam patient = new ReferenceParam();
        patient.setValue(VALID_PATIENT_ID);

        Query expectedQuery = new Query(Criteria.where("idxPatient").is(new DBRef("idxPatient", VALID_PATIENT_ID)));

        testSearchCallsToMongo(resid, patient, expectedQuery);
    }

    @Test
    public void givenANumberOfSearchParameters_whenSearchIsCalledWithResIdAndPatient_shouldQueryMongo() {
        //setup
        TokenParam resid = new TokenParam();
        resid.setValue(VALID_ID);
        ReferenceParam patient = new ReferenceParam();
        patient.setValue(VALID_PATIENT_ID);

        Query expectedQuery = new Query(Criteria.where("_id").is(new ObjectId(resid.getValue()))
                .and("idxPatient").is(new DBRef("idxPatient", patient.getValue())));

        testSearchCallsToMongo(resid, patient, expectedQuery);
    }

    private void testSearchCallsToMongo(TokenParam resid, ReferenceParam patient, Query expectedFindQuery) {
        // setup
        Query expectedFindOne =  new Query(Criteria.where("_id").is(aCompositionEntity().getFhirDocument().getId()));
        mockMongoResponses(expectedFindQuery, expectedFindOne);

        //when
        compositionDao.search(ctx, resid, patient);

        //then
        verifyCallsToMongo(expectedFindQuery, expectedFindOne);
    }

    private void mockMongoResponses(Query expectedFindQuery, Query expectedFindOne) {
        when(mongo.find(expectedFindQuery, CompositionEntity.class)).thenReturn(asList(aCompositionEntity()));
        when(mongo.findOne(expectedFindOne, DBObject.class, "Bundle")).thenReturn(aBasicDBObjectBundle());
    }

    private void verifyCallsToMongo(Query expectedFindQuery, Query expectedFindOne) {
        verify(mongo).find(expectedFindQuery, CompositionEntity.class);
        verify(mongo).findOne(expectedFindOne, DBObject.class, "Bundle");
    }

    private static CompositionEntity aCompositionEntity() {
        CompositionEntity aCompositionEntity = new CompositionEntity();
        DBRef fhirDocument = new DBRef("Bundle", new ObjectId(VALID_ID));
        aCompositionEntity.setFhirDocument(fhirDocument);
        return aCompositionEntity;
    }

    private static BasicDBObject aBasicDBObjectBundle() {
        return new BasicDBObject()
                .append("_id", "_id-value")
                .append("_class", "_class-value")
                .append("resourceType", "Bundle")
                .append("meta", "meta-value")
                .append("identifier", "identifier-value")
                .append("type", "document")
                .append("entry", new BasicDBList());
    }

}
