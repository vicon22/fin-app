package io.scrooge.services.user;

import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeAll;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@DirtiesContext
@Testcontainers
@ActiveProfiles("test")
public abstract class IntegrationTest {

    @Container
    @ServiceConnection
    public static final PostgreSQLContainer<?> postgres =
        new PostgreSQLContainer<>("postgres:17")
            .withInitScripts("test1.sql", "test2.sql");

    @BeforeAll
    static void testDatabaseConnection() {
        assertTrue(postgres.isRunning());
        System.out.println("Database URL: " + postgres.getDriverClassName());
        System.out.println("Database URL: " + postgres.getDatabaseName());
        System.out.println("Database URL: " + postgres.getJdbcUrl());
        System.out.println("Database Username: " + postgres.getUsername());
        System.out.println("Database Password: " + postgres.getPassword());
    }
}