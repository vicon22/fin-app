package io.scrooge.data.flow;

import io.scrooge.data.flow.dto.ExpenseFlowCategoryCurrencySum;
import io.scrooge.data.flow.dto.ExpenseFlowCategorySum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface ExpenseFlowRepository extends JpaRepository<ExpenseFlow, UUID>, JpaSpecificationExecutor<ExpenseFlow> {
    @Query("select e from ExpenseFlow e where project_id = ?1")
    List<ExpenseFlow> findAllByProjectId(UUID projectId);

    @Query("select coalesce(sum(e.amount), 0) from ExpenseFlow e where project_id = ?1")
    int totalByProjectId(UUID projectId);

    @Query(value = "select " +
            "new io.scrooge.data.flow.dto.ExpenseFlowCategoryCurrencySum(e.category_id, w.currency_id, sum(e.amount)) " +
            "from ExpenseFlow e join Project w on w.id = e.project_id " +
            "where e.project_id in (select id from Project w where user_id = ?1) " +
            "group by e.category_id, w.currency_id")
    List<ExpenseFlowCategoryCurrencySum> totalByUserIdByCategories(UUID projectId);

    @Query(value = "select new io.scrooge.data.flow.dto.ExpenseFlowCategorySum(category_id, sum(e.amount)) " +
            "from ExpenseFlow e " +
            "where project_id = ?1 " +
            "group by e.category_id")
    List<ExpenseFlowCategorySum> totalByProjectIdByCategories(UUID projectId);
}
