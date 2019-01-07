package uk.nhs.careconnect.ri.extranet;

import org.springframework.context.annotation.Configuration;

@Configuration
public class LoggingConfig {
    // See config details from http://hawt.io/plugins/logs/

    /* Issue using logs, disable for now TODO
    @Bean(name = "LogQuery", destroyMethod = "stop", initMethod = "start")
    @Scope("singleton")
    @Lazy(false)
    public Log4jLogQuery log4jLogQuery() {
        Log4jLogQuery log4jLogQuery = new Log4jLogQuery();
        return log4jLogQuery;
    }
    */
}