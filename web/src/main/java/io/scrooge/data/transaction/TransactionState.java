package io.scrooge.data.transaction;

public enum TransactionState {
    INITIAL("INITIAL"),
    PENDING("PENDING"),
    APPROVED("APPROVED"),
    FULFILLED("FULFILLED"),
    CANCELED("CANCELED"),
    DELETED("DELETED"),
    RETURNED("RETURNED");

    TransactionState(String s) {
    }
}


