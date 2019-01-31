package uk.nhs.careconnect.nosql.dao;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.param.DateRangeParam;
import ca.uhn.fhir.rest.param.ReferenceParam;
import ca.uhn.fhir.rest.param.TokenParam;
import de.flapdoodle.embed.mongo.MongodExecutable;
import de.flapdoodle.embed.mongo.MongodProcess;
import de.flapdoodle.embed.mongo.MongodStarter;
import de.flapdoodle.embed.mongo.config.IMongodConfig;
import de.flapdoodle.embed.mongo.config.MongodConfigBuilder;
import de.flapdoodle.embed.mongo.config.Net;
import de.flapdoodle.embed.mongo.distribution.Version;
import de.flapdoodle.embed.process.runtime.Network;
import org.hl7.fhir.dstu3.model.Bundle;
import org.hl7.fhir.dstu3.model.OperationOutcome;
import org.hl7.fhir.dstu3.model.Resource;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import uk.nhs.careconnect.nosql.entities.CompositionEntity;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.stream.Stream;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.Assert.fail;

@RunWith(SpringRunner.class)
@ContextConfiguration(classes = {TestConfig.class})
public class CompositionDaoTest {

    @Autowired
    MongoTemplate mongoTemplate;

    @Autowired
    FhirContext ctx;

    @Autowired
    IBundle bundleDao;

    @Autowired
    IComposition compositionDao;

    private static final String[] COLLECTION_NAMES = {"Bundle", "idxComposition", "idxPatient"};

    private static MongodExecutable mongodExe;
    private static MongodProcess mongod;
    private String compositionId;
    private CompositionEntity compositionEntity;

    @BeforeClass
    public static void beforeEach() throws Exception {
        MongodStarter starter = MongodStarter.getDefaultInstance();
        String bindIp = "localhost";
        int port = 12345;
        IMongodConfig mongodConfig = new MongodConfigBuilder()
                .version(Version.Main.PRODUCTION)
                .net(new Net(bindIp, port, Network.localhostIsIPv6()))
                .build();
        CompositionDaoTest.mongodExe = starter.prepare(mongodConfig);
        CompositionDaoTest.mongod = mongodExe.start();
    }

    @AfterClass
    public static void afterEach() {
        if (CompositionDaoTest.mongod != null) {
            CompositionDaoTest.mongod.stop();
            CompositionDaoTest.mongodExe.stop();
        }
    }

    @Before
    public void eachTest() {
        Stream.of(COLLECTION_NAMES).forEach(collectionName -> mongoTemplate.dropCollection(collectionName));
        loadAndCreateBundle();
        loadCompositionEntity();
    }

    @Test
    public void givenABundleStoredInMongo_whenSearchIsCalledWithResId_aListOfRelevantResourcesShouldBeReturned() {
        //setup
        TokenParam resid = new TokenParam();
        resid.setValue(compositionId);

        //when
        List<Resource> resources = compositionDao.search(ctx, resid, null, null);

        //then
        assertThat(resources.get(0).getId(), is(compositionId));
    }

    @Test
    public void givenABundleStoredInMongo_whenSearchIsCalledWithPatient_aListOfRelevantResourcesShouldBeReturned() {
        //setup
        ReferenceParam patient = new ReferenceParam();
        patient.setValue(compositionEntity.getIdxPatient().getId().toString());

        //when
        List<Resource> resources = compositionDao.search(ctx, null, patient, null);

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
        List<Resource> resources = compositionDao.search(ctx, resid, patient, null);

        //then
        assertThat(resources.get(0).getId(), is(compositionId));
    }

    @Test
    public void givenABundleStoredInMongo_whenSearchIsCalledWithDate_aListOfRelevantResourcesShouldBeReturned() {
        //1957-01-01
        Date startDate = Date.from(LocalDate.of(1957, 01,01).atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date endDate = Date.from(LocalDate.of(1957, 01,02).atStartOfDay(ZoneId.systemDefault()).toInstant());
        DateRangeParam dateRangeParam = new DateRangeParam(startDate, endDate);

        //when
        List<Resource> resources = compositionDao.search(ctx, null, null, dateRangeParam);

        //then
        assertThat(resources.get(0).getId(), is(compositionId));
        //fail("Not implemented");
    }

    @Test
    public void givenABundleStoredInMongo_whenSearchIsCalledWithPeriod_aListOfRelevantResourcesShouldBeReturned() {
        fail("Not implemented");
    }

    @Test
    public void givenABundleStoredInMongo_whenSearchIsCalledWithType_aListOfRelevantResourcesShouldBeReturned() {
        fail("Not implemented");
    }

    @Test
    public void givenABundleStoredInMongo_whenSearchIsCalledWith_Id_aListOfRelevantResourcesShouldBeReturned() {
        fail("Not implemented");
    }

    @Test
    public void givenABundleStoredInMongo_whenSearchIsCalledWithIdentifier_aListOfRelevantResourcesShouldBeReturned() {
        fail("Not implemented");
    }

    private Bundle loadBundle() {
        String filename = getClass().getClassLoader().getResource("raw-bundle.xml").getPath();

        try {
            String bundleJson = new String(Files.readAllBytes(Paths.get(filename)));
            return ctx.newXmlParser().parseResource(Bundle.class, bundleJson);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return null;
    }

    private void loadAndCreateBundle() {
        Bundle bundle = loadBundle();
        OperationOutcome operationOutcome = bundleDao.create(ctx, bundle, null, null);

        compositionId = operationOutcome.getId().split("/")[1];
    }

    private void loadCompositionEntity() {
        Query qry = Query.query(Criteria.where("_id").is(compositionId));

        compositionEntity = mongoTemplate.findOne(qry, CompositionEntity.class);
    }

}
