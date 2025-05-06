package io.scrooge.data.project;

import io.scrooge.data.AbstractEntity;
import io.scrooge.data.currency.Currency;
import io.scrooge.data.transaction.Transaction;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@Table(name = "projects")
public class Project extends AbstractEntity {
    private String name;
    private UUID user_id;
    private UUID currency_id;

    @OneToMany(cascade = CascadeType.REMOVE)
    @JoinColumn(name = "project_id", updatable = false)
    @OrderBy("created ASC")
    private List<Transaction> transactions;

    @OneToOne()
    @JoinColumn(insertable = false, updatable = false, name = "currency_id", referencedColumnName = "id")
    private Currency currency;
}
