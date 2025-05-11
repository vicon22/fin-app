package io.scrooge.data.transaction;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import io.scrooge.data.AbstractEntity;
import io.scrooge.data.project.Project;
import io.scrooge.data.project.ProjectRepository;
import io.scrooge.data.transaction.dto.FlowCategoryCurrencySum;
import io.scrooge.data.user.User;
import io.scrooge.services.user.IntegrationTest;
import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@AutoConfigureMockMvc
class TransactionRepositoryTest extends IntegrationTest {

    @Autowired
    TransactionRepository transactionRepository;
    @Autowired
    private ProjectRepository projectRepository;

    @Test
    void findAllByProjectIdTest() {
        List<Transaction> transactions = transactionRepository.findAll();
        List<Project> projects = projectRepository.findAll();

        Set<UUID> tProjectIds = transactions.stream()
            .map(Transaction::getProject_id)
            .collect(Collectors.toSet());
        Set<UUID> projectIds = projects.stream()
            .map(Project::getId)
            .collect(Collectors.toSet());
        assertTrue(projectIds.containsAll(tProjectIds));
    }

    @Test
    void totalByProjectIdTest() {
        List<Transaction> transactions = transactionRepository.findAll();

        Set<UUID> tProjectIds = transactions.stream()
            .map(Transaction::getProject_id)
            .collect(Collectors.toSet());

        tProjectIds.forEach(t -> {
                Long expectedTotal = transactions.stream()
                    .filter(transaction -> transaction.getProject_id().equals(t))
                    .map(Transaction::getAmount)
                    .filter(Objects::nonNull)
                    .reduce(0L, Long::sum);

                assertEquals(expectedTotal, transactionRepository.totalByProjectId(t));
            }
        );
    }

}