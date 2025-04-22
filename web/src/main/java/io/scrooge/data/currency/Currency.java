package io.scrooge.data.currency;

import io.scrooge.data.AbstractEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;

@Entity
@Getter
@Table(name = "currencies")
public class Currency extends AbstractEntity {
    private String value;
}
