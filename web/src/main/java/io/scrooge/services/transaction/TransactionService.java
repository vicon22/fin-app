package io.scrooge.services.transaction;

import com.vaadin.hilla.BrowserCallable;
import com.vaadin.hilla.crud.CrudRepositoryService;
import com.vaadin.hilla.crud.JpaFilterConverter;
import com.vaadin.hilla.crud.filter.Filter;
import io.scrooge.data.transaction.Transaction;
import io.scrooge.data.transaction.TransactionRepository;
import io.scrooge.data.transaction.TransactionState;
import io.scrooge.data.transaction.TransactionType;
import io.scrooge.data.transaction.dto.FlowCategoryCurrencySum;
import io.scrooge.data.transaction.dto.FlowCategorySum;
import jakarta.annotation.security.RolesAllowed;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
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

    private Specification getFilterSpec(Filter filter) {
        return filter != null
                ? JpaFilterConverter.toSpec(filter, Transaction.class)
                : Specification.anyOf();
    }
    public Map<TransactionType, Long> getSummaryByType(Filter filter) {
        var items = this.repository.findAll(this.getFilterSpec(filter));
        var result = new HashMap<TransactionType, Long>();

        for (var item : items) {
            var elem = (Transaction)item;
            var type = elem.getType();

            if (!result.containsKey(type)) {
                result.put(type, 0l);
            }

            result.put(type, result.get(type) + elem.getAmount());
        }

        return result;
    }

    public Map<TransactionState, Integer> getSummaryByState(Filter filter) {
        var items = this.repository.findAll(this.getFilterSpec(filter));
        var result = new HashMap<TransactionState, Integer>();

        for (var item : items) {
            var elem = (Transaction)item;
            var state = elem.getState();

            if (!result.containsKey(state)) {
                result.put(state, 0);
            }

            result.put(state, result.get(state) + 1);
        }

        return result;
    }

    public Map<UUID, HashMap<TransactionType, Long>> getSummaryByCategory(Filter filter) {
        var items = this.repository.findAll(this.getFilterSpec(filter));
        var result = new HashMap<UUID, HashMap<TransactionType, Long>>();

        for (var item : items) {
            var elem = (Transaction)item;
            var catId = elem.getCategory_id();
            var type = elem.getType();

            if (!result.containsKey(catId)) {
                result.put(catId, new HashMap<>() {{
                    put(TransactionType.EXPENSE, 0l);
                    put(TransactionType.INCOME, 0l);
                }});
            }

            var unit = result.get(catId);

            unit.put(type, unit.get(type) + elem.getAmount());
            result.put(catId, unit);
        }

        return result;
    }
}
