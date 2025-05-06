package io.scrooge.data.bank;

import io.scrooge.data.AbstractEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;

@Entity
@Getter
@Table(name = "banks")
public class Bank extends AbstractEntity {
    private String name;
    private Integer reg;
    private Long ogrn;
}
