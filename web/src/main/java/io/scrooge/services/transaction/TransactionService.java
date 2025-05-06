package io.scrooge.services.transaction;

import com.vaadin.hilla.BrowserCallable;
import com.vaadin.hilla.crud.CrudRepositoryService;
import io.scrooge.data.transaction.Transaction;
import io.scrooge.data.transaction.TransactionRepository;
import io.scrooge.data.transaction.dto.FlowCategoryCurrencySum;
import io.scrooge.data.transaction.dto.FlowCategorySum;
import jakarta.annotation.security.RolesAllowed;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@BrowserCallable
@Service
@RolesAllowed("USER")
public class TransactionService extends CrudRepositoryService<Transaction, UUID, TransactionRepository> {

    private final TransactionRepository repository;

    public TransactionService(TransactionRepository repository) {
        this.repository = repository;
    }

    public List<Transaction> listAllByProject(UUID projectId) {
        return this.repository.findAllByProjectId(projectId);
    }

    public int totalByProject(UUID projectId) {
        return this.repository.totalByProjectId(projectId);
    }

    public List<FlowCategoryCurrencySum> totalByUser(UUID userId) {
        return this.repository.totalByUserIdByCategories(userId);
    }

    public List<FlowCategorySum> totalByProjectByCategories(UUID projectId) {
        return this.repository.totalByProjectIdByCategories(projectId);
    }
}
