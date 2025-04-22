package io.scrooge.services.expense;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.Endpoint;
import io.scrooge.data.flow.ExpenseFlow;
import io.scrooge.data.flow.dto.ExpenseFlowCategoryCurrencySum;
import io.scrooge.data.flow.dto.ExpenseFlowCategorySum;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.UUID;

@Endpoint
@AnonymousAllowed
public class ExpenseEndpoint {

    @Autowired
    private ExpenseService service;

    public int getTotal(UUID projectId) {
        return this.service.totalByProject(projectId);
    }

    public List<ExpenseFlowCategoryCurrencySum> getTotalByUser(UUID userId) {
        return this.service.totalByUser(userId);
    }

    public List<ExpenseFlowCategorySum> getTotalByCategories(UUID projectId) {
        return this.service.totalByProjectByCategories(projectId);
    }

    public List<ExpenseFlow> getProjectExpenses(UUID projectId) {
        return this.service.listAllByProject(projectId);
    }

    public ExpenseFlow create(UUID projectId, UUID categoryId, String title, int amount) {
        ExpenseFlow e = new ExpenseFlow();

        e.setProject_id(projectId);
        e.setAmount(amount);
        e.setTitle(title);
        e.setCategory_id(categoryId);

        return this.service.save(e);
    }
}
