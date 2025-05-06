package io.scrooge.data.category;

import io.scrooge.data.AbstractEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
@Getter
@Setter
@Table(name = "transaction_categories")
public class TransactionCategory extends AbstractEntity {
    private String title;
    private String description;

    @Column(insertable = false, updatable = false)
    private Date created;
}
