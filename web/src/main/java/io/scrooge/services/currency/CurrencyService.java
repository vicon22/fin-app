package io.scrooge.services.currency;

import com.vaadin.hilla.BrowserCallable;
import com.vaadin.hilla.crud.CrudRepositoryService;
import io.scrooge.data.currency.Currency;
import io.scrooge.data.currency.CurrencyRepository;
import jakarta.annotation.security.RolesAllowed;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@BrowserCallable
@Service
@RolesAllowed("USER")
public class CurrencyService extends CrudRepositoryService<Currency, UUID, CurrencyRepository> {
    private final CurrencyRepository repository;

    public CurrencyService(CurrencyRepository repository) {
        this.repository = repository;
    }

    public List<Currency> getAll() {
        return this.repository.findAll();
    }
}
