package io.scrooge.services.expense;

import com.vaadin.hilla.BrowserCallable;
import com.vaadin.hilla.crud.CrudRepositoryService;
import io.scrooge.data.flow.ExpenseFlow;
import io.scrooge.data.flow.ExpenseFlowRepository;
import io.scrooge.data.flow.dto.ExpenseFlowCategoryCurrencySum;
import io.scrooge.data.flow.dto.ExpenseFlowCategorySum;
import jakarta.annotation.security.RolesAllowed;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@BrowserCallable
@Service
@RolesAllowed("USER")
public class ExpenseService extends CrudRepositoryService<ExpenseFlow, UUID, ExpenseFlowRepository> {
    private final ExpenseFlowRepository repository;

    public ExpenseService(ExpenseFlowRepository repository) {
        this.repository = repository;
    }

    public List<ExpenseFlow> listAllByProject(UUID projectId) {
        return this.repository.findAllByProjectId(projectId);
    }

    public int totalByProject(UUID projectId) {
        return this.repository.totalByProjectId(projectId);
    }

    public List<ExpenseFlowCategoryCurrencySum> totalByUser(UUID userId) {
        return this.repository.totalByUserIdByCategories(userId);
    }

    public List<ExpenseFlowCategorySum> totalByProjectByCategories(UUID projectId) {
        return this.repository.totalByProjectIdByCategories(projectId);
    }
}
