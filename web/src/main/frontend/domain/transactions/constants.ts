import TransactionState from "Frontend/generated/io/scrooge/data/transaction/TransactionState";

export const STATE_PARAMS = {
    [TransactionState.INITIAL]: { 
        title: 'Новая',
        color: '#0092c1'
    },
    [TransactionState.PENDING]: {
        title: 'В процессе',
        color: '#c19400'
    },
    [TransactionState.FULFILLED]: {
        title: 'Выполнено',
        color: '#a2009b'
    },
    [TransactionState.DELETED]: {
        title: 'Удалено',
        color: '#000000'
    },
    [TransactionState.CANCELED]: {
        title: 'Отменена',
        color: '#888888'
    },
    [TransactionState.APPROVED]: {
        title: 'Утверждена',
        color: '#1c9439'
    },
    [TransactionState.RETURNED]: {
        title: 'Возврат',
        color: '#ff9233'
    },
}