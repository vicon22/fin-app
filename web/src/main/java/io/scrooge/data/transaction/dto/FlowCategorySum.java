package io.scrooge.data.transaction.dto;

import java.util.UUID;

public record FlowCategorySum(UUID category_id, long total) {
}