package io.scrooge.services.transaction;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.Endpoint;
import io.scrooge.data.transaction.Transaction;
import io.scrooge.data.transaction.TransactionState;
import io.scrooge.data.transaction.dto.FlowCategoryCurrencySum;
import io.scrooge.data.transaction.dto.FlowCategorySum;
import io.scrooge.data.transaction.dto.TransactionDTO;
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

    public List<FlowCategoryCurrencySum> getTotalByUser(UUID userId) {
        return this.service.totalByUser(userId);
    }

    public List<FlowCategorySum> getTotalByCategories(UUID projectId) {
        return this.service.totalByProjectByCategories(projectId);
    }

    public List<Transaction> getProjectTransactions(UUID projectId) {
        return this.service.listAllByProject(projectId);
    }

    public Transaction create(TransactionDTO payload) {
        Transaction e = new Transaction();
        e.setProject_id(payload.getProject_id());
        e.setAmount(payload.getAmount());
        e.setTitle(payload.getTitle());

        e.setCategory_id(payload.getCategory_id());
        e.setType(payload.getType());
        e.setState(TransactionState.INITIAL);
        e.setLegal(payload.getLegal());

        e.setConsumer_account(payload.getConsumer_account());
        e.setProducer_account(payload.getProducer_account());

        e.setConsumer_bank_id(payload.getConsumer_bank_id());
        e.setProducer_bank_id(payload.getProducer_bank_id());

        e.setConsumer_tin(payload.getConsumer_tin());
        e.setConsumer_tel(payload.getConsumer_tel());

        return this.service.save(e);
    }
}
