import TransactionState from "Frontend/generated/io/scrooge/data/transaction/TransactionState";

export const STATE_PARAMS = {
    [TransactionState.INITIAL]: { 
        title: 'Новая',
        color: '#0092c1',
        editable: true,
    },
    [TransactionState.PENDING]: {
        title: 'В обработке',
        color: '#c19400',
        editable: false,
    },
    [TransactionState.FULFILLED]: {
        title: 'Выполнено',
        color: '#a2009b',
        editable: false,
    },
    [TransactionState.DELETED]: {
        title: 'Удалено',
        color: '#000000',
        editable: false,
    },
    [TransactionState.CANCELED]: {
        title: 'Отменена',
        color: '#888888',
        editable: false,
    },
    [TransactionState.APPROVED]: {
        title: 'Подтверждена',
        color: '#1c9439',
        editable: false,
    },
    [TransactionState.RETURNED]: {
        title: 'Возврат',
        color: '#ff9233',
        editable: false,
    },
}