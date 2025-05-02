package io.scrooge.data.transaction;

import io.scrooge.data.transaction.dto.FlowCategoryCurrencySum;
import io.scrooge.data.transaction.dto.FlowCategorySum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface TransactionRepository extends JpaRepository<Transaction, UUID>, JpaSpecificationExecutor<Transaction> {
    @Query("select e from Transaction e where project_id = ?1")
    List<Transaction> findAllByProjectId(UUID projectId);

    @Query("select coalesce(sum(e.amount), 0) from ExpenseFlow e where project_id = ?1")
    int totalByProjectId(UUID projectId);

    @Query(value = "select " +
            "new io.scrooge.data.transaction.dto.FlowCategoryCurrencySum(e.category_id, w.currency_id, sum(e.amount)) " +
            "from Transaction e join Project w on w.id = e.project_id " +
            "where e.project_id in (select id from Project w where user_id = ?1) " +
            "group by e.category_id, w.currency_id")
    List<FlowCategoryCurrencySum> totalByUserIdByCategories(UUID projectId);

    @Query(value = "select new io.scrooge.data.transaction.dto.FlowCategorySum(category_id, sum(e.amount)) " +
            "from Transaction e " +
            "where project_id = ?1 " +
            "group by e.category_id")
    List<FlowCategorySum> totalByProjectIdByCategories(UUID projectId);
}
