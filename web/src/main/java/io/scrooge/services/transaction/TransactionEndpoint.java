package io.scrooge.services.transaction;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.Endpoint;
import io.scrooge.data.flow.IncomeFlow;
import io.scrooge.data.transaction.Transaction;
import io.scrooge.services.income.IncomeService;
import io.scrooge.services.transactionCategory.TransactionCategoryService;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.UUID;

@Endpoint
@AnonymousAllowed
public class TransactionEndpoint {

    @Autowired
    private TransactionService service;

    public int getTotal(UUID projectId) {
        return this.service.totalByProject(projectId);
    }

    public List<Transaction> getProjectTransactions(UUID projectId) {
        return this.service.listAllByProject(projectId);
    }

    public Transaction create(UUID projectId, UUID categoryId, String title, int amount) {
        Transaction e = new Transaction();

        e.setProject_id(projectId);
        e.setAmount(amount);
        e.setTitle(title);
        e.setCategory_id(categoryId);

        return this.service.save(e);
    }
}
