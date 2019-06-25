package uk.nhs.careconnect.nosql.configuration;


import org.springframework.context.annotation.Configuration;

@Configuration
public class LoggingConfig {
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