package io.scrooge.services.incomeCategory;

import com.vaadin.hilla.BrowserCallable;
import com.vaadin.hilla.crud.CrudRepositoryService;
import io.scrooge.data.category.IncomeCategory;
import io.scrooge.data.category.IncomeCategoryRepository;
import jakarta.annotation.security.RolesAllowed;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@BrowserCallable
@Service
@RolesAllowed("USER")
public class IncomeCategoryService extends CrudRepositoryService<IncomeCategory, UUID, IncomeCategoryRepository> {

    private final IncomeCategoryRepository repository;

    public IncomeCategoryService(IncomeCategoryRepository repository) {
        this.repository = repository;
    }

    public List<IncomeCategory> getAll() {
        return this.repository.findAll();
    }
}
