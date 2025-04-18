package com.tranvelmanagement.tranvelmanagement.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory;

@Configuration
public class MongoConfiguration {

    @Bean
    public MongoTemplate mongoTemplate() {

        String connectionString = "mongodb+srv://chaminduwn:180517@travel.1lzndvh.mongodb.net/TravelManagement?retryWrites=true&w=majority&appName=travel"   ;
        
             return new MongoTemplate(new SimpleMongoClientDatabaseFactory(connectionString));
    }
}
