package io.scrooge.services.expenseCategory;

import com.vaadin.hilla.BrowserCallable;
import com.vaadin.hilla.crud.CrudRepositoryService;
import io.scrooge.data.category.ExpenseCategory;
import io.scrooge.data.category.ExpenseCategoryRepository;
import jakarta.annotation.security.RolesAllowed;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@BrowserCallable
@Service
@RolesAllowed("USER")
public class ExpenseCategoryService extends CrudRepositoryService<ExpenseCategory, UUID, ExpenseCategoryRepository> {

    private final ExpenseCategoryRepository repository;

    public ExpenseCategoryService(ExpenseCategoryRepository repository) {
        this.repository = repository;
    }

    public List<ExpenseCategory> getAll() {
        return this.repository.findAll();
    }
}
