import {ReactNode, useCallback, useEffect, useState} from 'react';
import { useParams } from 'react-router';
import {TransactionCategoryEndpoint, BankEndpoint, TransactionEndpoint} from 'Frontend/generated/endpoints';
import TransactionCategory from 'Frontend/generated/io/scrooge/data/category/TransactionCategory';
import Bank from 'Frontend/generated/io/scrooge/data/bank/Bank';
import Transaction from 'Frontend/generated/io/scrooge/data/transaction/Transaction';

type TransactionControllerProps = {
    children: (payload: {
        error: boolean;
        pending: boolean;
        data: {
            projectId?: string;
            categories: TransactionCategory[];
            transaction?: Transaction;
            banks: Bank[];
        }
    }) => ReactNode;
};

export default function TransactionController(props: TransactionControllerProps) {
    const {projectId, transactionId} = useParams();
    const [error, setError] = useState<boolean>(false);
    const [pending, setPending] = useState<boolean>(true);
    const [transaction, setTransaction] = useState<Transaction | undefined>();
    
    const [banks, setBanks] = useState<TransactionCategory[]>([]);
    const [transactionCategories, setTransactionCategories] = useState<TransactionCategory[]>([]);

    const fetchTransaction = useCallback(() => {
        return TransactionEndpoint.getById(transactionId)
            .then((resp) => {
                setTransaction(resp)
            })
     }, []);

    const fetchBanks = useCallback(() => {
        return BankEndpoint.getAll()
            .then((resp) => {
                setBanks((resp || []).filter(item => !!item));
            })
     }, []);

    const fetchCategories = useCallback(() => {
        return TransactionCategoryEndpoint.getAll()
            .then((resp) => {
                setTransactionCategories((resp || []).filter(item => !!item));
            })
     }, []);

    useEffect(() => {
        Promise
            .all([
                fetchTransaction(),
                fetchBanks(),
                fetchCategories()
            ])
            .catch(() => {
                setError(true);
            })
            .finally(() => {
                setPending(false)
            })
    }, [projectId]);

    return (
        props.children({
            error,
            pending,
            data: {
                projectId,
                categories: transactionCategories,
                banks,
                transaction,
            }
        })
    );
}
