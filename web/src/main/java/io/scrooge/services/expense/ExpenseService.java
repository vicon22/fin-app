package io.scrooge.services.expense;

import com.vaadin.hilla.BrowserCallable;
import com.vaadin.hilla.Nullable;
import com.vaadin.hilla.crud.CrudRepositoryService;
import com.vaadin.hilla.crud.JpaFilterConverter;
import com.vaadin.hilla.crud.ListService;
import com.vaadin.hilla.crud.filter.Filter;
import io.scrooge.data.flow.ExpenseFlow;
import io.scrooge.data.flow.ExpenseFlowRepository;
import io.scrooge.data.flow.IncomeFlow;
import io.scrooge.data.flow.dto.ExpenseFlowCategoryCurrencySum;
import io.scrooge.data.flow.dto.ExpenseFlowCategorySum;
import jakarta.annotation.security.RolesAllowed;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@BrowserCallable
@Service
@RolesAllowed("USER")
public class ExpenseService extends CrudRepositoryService<ExpenseFlow, UUID, ExpenseFlowRepository> implements ListService<ExpenseFlow> {
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

//    private Specification getFilterSpec(Filter filter) {
//        Specification<ExpenseFlow> projectMatched = (root, query, builder) ->
//                builder.equal(root.get("project_id"), this.projectId);
//        Specification<ExpenseFlow> filterMatched = filter != null
//                ? JpaFilterConverter.toSpec(filter, ExpenseFlow.class)
//                : Specification.anyOf();
//
//        return projectMatched.and(filterMatched);
//    }
//
//    @Override
//    public List<ExpenseFlow> list(Pageable pageable, Filter filter) {
//        return this.repository.findAll(this.getFilterSpec(filter), pageable).stream().toList();
//    }
//
//    @Override
//    public long count(Filter filter) {
//        return this.repository.count(this.getFilterSpec(filter));
//    }
}
