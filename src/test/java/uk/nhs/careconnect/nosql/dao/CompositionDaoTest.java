package uk.nhs.careconnect.nosql.dao;

import ca.uhn.fhir.context.FhirContext;
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
import java.util.List;
import java.util.stream.Stream;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

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
        Stream.of(COLLECTION_NAMES).forEach(
                collectionName -> mongoTemplate.dropCollection(collectionName)
        );
        loadAndCreateBundle();
        loadCompositionEntity();
    }

    @Test
    public void givenABundleStoredInMongo_whenSearchIsCalledWithResId_aListOfRelevantResourcesShouldBeReturned() {
        //setup
        TokenParam resid = new TokenParam();
        resid.setValue(compositionId);
        ReferenceParam patient = null;

        List<Resource> resources = compositionDao.search(ctx, resid, patient);

        assertThat(resources.size(), is(1));
    }

    @Test
    public void givenABundleStoredInMongo_whenSearchIsCalledWithPatient_aListOfRelevantResourcesShouldBeReturned() {
        //setup
        TokenParam resid = null;
        ReferenceParam patient = new ReferenceParam();
        patient.setValue(compositionEntity.getIdxPatient().getId().toString());

        List<Resource> resources = compositionDao.search(ctx, resid, patient);

        assertThat(resources.size(), is(1));
    }

    @Test
    public void givenABundleStoredInMongo_whenSearchIsCalledWithResIdAndPatient_aListOfRelevantResourcesShouldBeReturned() {
        //setup
        TokenParam resid = new TokenParam();
        resid.setValue(compositionId);
        ReferenceParam patient = new ReferenceParam();
        patient.setValue(compositionEntity.getIdxPatient().getId().toString());

        List<Resource> resources = compositionDao.search(ctx, resid, patient);

        assertThat(resources.size(), is(1));
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
