package io.scrooge.services.transactionCategory;

import com.vaadin.hilla.BrowserCallable;
import com.vaadin.hilla.crud.CrudRepositoryService;
import io.scrooge.data.category.IncomeCategory;
import io.scrooge.data.category.IncomeCategoryRepository;
import io.scrooge.data.category.TransactionCategory;
import io.scrooge.data.category.TransactionCategoryRepository;
import jakarta.annotation.security.RolesAllowed;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@BrowserCallable
@Service
@RolesAllowed("USER")
public class TransactionCategoryService extends CrudRepositoryService<TransactionCategory, UUID, TransactionCategoryRepository> {
    private final TransactionCategoryRepository repository;

    public TransactionCategoryService(TransactionCategoryRepository repository) {
        this.repository = repository;
    }

    public List<TransactionCategory> getAll() {
        return this.repository.findAll();
    }
}
