package uk.nhs.careconnect.nosql.dao;

import de.flapdoodle.embed.mongo.Command;
import de.flapdoodle.embed.mongo.MongodExecutable;
import de.flapdoodle.embed.mongo.MongodProcess;
import de.flapdoodle.embed.mongo.MongodStarter;
import de.flapdoodle.embed.mongo.config.IMongodConfig;
import de.flapdoodle.embed.mongo.config.MongodConfigBuilder;
import de.flapdoodle.embed.mongo.config.Net;
import de.flapdoodle.embed.mongo.config.RuntimeConfigBuilder;
import de.flapdoodle.embed.mongo.distribution.Version;
import de.flapdoodle.embed.process.config.IRuntimeConfig;
import de.flapdoodle.embed.process.runtime.Network;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

public class MongoManager {

    private static final Logger log = LoggerFactory.getLogger(MongoManager.class);

    private static final String TEST_MONGO_HOST = "localhost";
    private static final int TEST_MONGO_PORT = 12345;

    private static MongoManager instance;

    private MongodExecutable mongodExe;
    private MongodProcess mongod;

    private MongoManager(){

    }

    public static MongoManager getInstance() {
        if (instance == null)
            instance = new MongoManager();
        return instance;
    }

    public void startMongo() throws IOException {
         IRuntimeConfig runtimeConfig = new RuntimeConfigBuilder()
                .defaultsWithLogger(Command.MongoD, log)
                .build();
        MongodStarter starter = MongodStarter.getInstance(runtimeConfig);

        IMongodConfig mongodConfig = new MongodConfigBuilder()
                .version(Version.Main.PRODUCTION)
                .net(new Net(TEST_MONGO_HOST, TEST_MONGO_PORT, Network.localhostIsIPv6()))
                .build();
        mongodExe = starter.prepare(mongodConfig);
        mongod = mongodExe.start();
    }

    public void stopMongo() {
        if (mongod != null) {
            mongod.stop();
            mongodExe.stop();
        }
    }

}
