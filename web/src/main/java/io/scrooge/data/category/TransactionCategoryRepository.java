package io.scrooge.data.category;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.UUID;

public interface TransactionCategoryRepository extends JpaRepository<TransactionCategory, UUID>, JpaSpecificationExecutor<TransactionCategory> {
}
