package io.scrooge.services.bank;

import com.vaadin.hilla.BrowserCallable;
import com.vaadin.hilla.crud.CrudRepositoryService;
import io.scrooge.data.bank.Bank;
import io.scrooge.data.bank.BankRepository;
import jakarta.annotation.security.RolesAllowed;
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
