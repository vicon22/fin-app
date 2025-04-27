package io.scrooge.services.bank;

import com.vaadin.flow.component.page.Page;
import com.vaadin.hilla.BrowserCallable;

import com.vaadin.hilla.crud.CrudRepositoryService;
import com.vaadin.hilla.crud.JpaFilterConverter;
import com.vaadin.hilla.crud.ListService;
import com.vaadin.hilla.crud.filter.Filter;
import io.scrooge.data.bank.Bank;
import io.scrooge.data.bank.BankRepository;
import io.scrooge.data.category.IncomeCategory;
import io.scrooge.data.flow.ExpenseFlow;
import io.scrooge.data.flow.IncomeFlow;
import io.scrooge.data.flow.IncomeFlowRepository;
import jakarta.annotation.Nullable;
import jakarta.annotation.security.RolesAllowed;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@BrowserCallable
@Service
@RolesAllowed("USER")
public class BankService extends CrudRepositoryService<Bank, UUID, BankRepository> {
    private final BankRepository repository;

    public BankService(BankRepository repository) {
        this.repository = repository;
    }

    public List<Bank> getAll() {
        return this.repository.findAll();
    }
}
