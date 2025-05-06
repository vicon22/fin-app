package io.scrooge.services.transaction;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.Endpoint;
import io.scrooge.data.transaction.Transaction;
import io.scrooge.data.transaction.TransactionRepository;
import io.scrooge.data.transaction.TransactionState;
import io.scrooge.data.transaction.dto.FlowCategoryCurrencySum;
import io.scrooge.data.transaction.dto.FlowCategorySum;
import io.scrooge.data.transaction.dto.TransactionDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Endpoint
@AnonymousAllowed
public class TransactionEndpoint {

    @Autowired
    private TransactionService service;

    @Autowired
    private TransactionRepository repository;

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


    private Transaction applyPatch(Transaction entity, TransactionDTO payload) {
        entity.setProject_id(payload.getProject_id());
        entity.setAmount(payload.getAmount());
        entity.setTitle(payload.getTitle());

        entity.setCategory_id(payload.getCategory_id());
        entity.setType(payload.getType());
        entity.setState(TransactionState.INITIAL);
        entity.setLegal(payload.getLegal());

        entity.setConsumer_account(payload.getConsumer_account());
        entity.setProducer_account(payload.getProducer_account());

        entity.setConsumer_bank_id(payload.getConsumer_bank_id());
        entity.setProducer_bank_id(payload.getProducer_bank_id());

        entity.setConsumer_tin(payload.getConsumer_tin());
        entity.setConsumer_tel(payload.getConsumer_tel());

        return entity;
    }

    public Transaction create(TransactionDTO payload) {
        return this.service.save(this.applyPatch(new Transaction(), payload));
    }

    public Transaction update(UUID id, TransactionDTO payload) {
        var current = this.service.get(id).orElseThrow(() -> new ResponseStatusException(
            HttpStatus.NOT_FOUND, "transaction not found"
        ));

        return this.service.save(this.applyPatch(current, payload));
    }

    public Optional<Transaction> getById(UUID id) {
        return this.service.get(id);
    }
}
