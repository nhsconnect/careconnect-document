package uk.nhs.careconnect.nosql.dao;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.param.ReferenceParam;
import ca.uhn.fhir.rest.param.TokenParam;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoDatabase;
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
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.MatcherAssert.assertThat;

@RunWith(SpringRunner.class)
@ContextConfiguration(classes = {TestConfig.class})
public class DaoCompositionIT {

    @Autowired
    FhirContext ctx;

    @Autowired
    IBundle bundleDao;

    @Autowired
    IComposition compositionDao;

    private static final String DATABASE_NAME = "test-mongo-db";
    private MongodExecutable mongodExe;
    private MongodProcess mongod;
    private MongoClient mongo;
    private MongoTemplate mongoTemplate;

    @Before
    public void beforeEach() throws Exception {
        MongodStarter starter = MongodStarter.getDefaultInstance();
        String bindIp = "localhost";
        int port = 12345;
        IMongodConfig mongodConfig = new MongodConfigBuilder()
                .version(Version.Main.PRODUCTION)
                .net(new Net(bindIp, port, Network.localhostIsIPv6()))
                .build();
        this.mongodExe = starter.prepare(mongodConfig);
        this.mongod = mongodExe.start();
        this.mongo = new MongoClient(bindIp, port);
        this.mongoTemplate = new MongoTemplate(new MongoClient(bindIp, port), DATABASE_NAME);
    }

    @After
    public void afterEach() throws Exception {
        if (this.mongod != null) {
            this.mongod.stop();
            this.mongodExe.stop();
        }
    }

    @Test
    public void canReadABundleFromAnXMLFileTest() {
        Bundle bundle = loadBundle();
        assertThat(bundle, is(notNullValue()));
    }

    private Bundle loadBundle() {
        String filename = getClass().getClassLoader().getResource("raw-bundle.xml").getPath();

        try {
            String bundleJson = new String(Files.readAllBytes(Paths.get(filename)));
            return FhirContext.forDstu3().newXmlParser().parseResource(Bundle.class, bundleJson);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return null;
    }

    @Test
    public void loadBundle_createViaBundleDaoTest() {
        Bundle bundle = loadBundle();
        OperationOutcome operationOutcome = bundleDao.create(ctx, bundle, null, null);
        assertThat(operationOutcome.getId(), is(notNullValue()));
    }

    @Test
    public void searchCompositionTest() {
        //setup
        Bundle bundle = loadBundle();
        OperationOutcome operationOutcome = bundleDao.create(ctx, bundle, null, null);
        assertThat(operationOutcome.getId(), is(notNullValue()));

        String id = operationOutcome.getId().split("/")[1];

        TokenParam resid = new TokenParam();
        resid.setValue(id);
        ReferenceParam patient = null;

        List<Resource> resources = compositionDao.search(ctx, resid, patient);
    }

    @Test
    public void canPopulateFromObject() {
        MongoDatabase db = mongo.getDatabase(DATABASE_NAME);
        db.createCollection("testCollection");
        populateMongoFromTestDataObjects();
    }

    private void populateMongoFromTestDataObjects() {
        Bundle aBundle = loadBundle();

        mongoTemplate.insert(aBundle, "testCollection");
    }

}
