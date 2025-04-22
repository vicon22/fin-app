package io.scrooge.data.category;

import io.scrooge.data.AbstractEntity;
import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@MappedSuperclass
@Getter
@Setter
public class BaseCategory extends AbstractEntity {
    private String title;
    private String description;

    @Column(insertable = false, updatable = false)
    private Date created;
}
