package io.scrooge.data.currency;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.UUID;

public interface CurrencyRepository extends JpaRepository<Currency, UUID>, JpaSpecificationExecutor<Currency> {
}
