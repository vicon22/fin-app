import {ReactNode, useCallback, useEffect, useState} from 'react';
import { useParams } from 'react-router';
import {ProjectEndpoint, TransactionEndpoint, TransactionCategoryEndpoint} from 'Frontend/generated/endpoints';
import TransactionCategory from 'Frontend/generated/io/scrooge/data/category/TransactionCategory';
import Project from 'Frontend/generated/io/scrooge/data/project/Project';
import Transaction from 'Frontend/generated/io/scrooge/data/transaction/Transaction';
import {useAuth} from 'Frontend/util/auth';
import AndFilter from 'Frontend/generated/com/vaadin/hilla/crud/filter/AndFilter';
import TransactionType from 'Frontend/generated/io/scrooge/data/transaction/TransactionType';
import {SummaryByBank, SummaryByCategory, SummaryByState, SummaryByTime, SummaryByType} from 'Frontend/domain/transactions/types';
import TransactionState from 'Frontend/generated/io/scrooge/data/transaction/TransactionState';
import { ReadonlySignal } from '@vaadin/hilla-react-signals';

type ProjectSummaryControllerProps = {
    filter: ReadonlySignal<AndFilter>
    children: (payload: {
        error: boolean;
        pending: boolean;
        refetch: VoidFunction;
        data: {
            byType: SummaryByType;
            byState: SummaryByState;
            byCategory: SummaryByCategory;
            byBank: SummaryByBank;
            byTime: SummaryByTime;
        }
    }) => ReactNode;
};

export default function ProjectSummaryController(props: ProjectSummaryControllerProps) {
    const {projectId} = useParams();

    const [error, setError] = useState<boolean>(false);
    const [pending, setPending] = useState<boolean>(true);
    

    const [byType, setByType] = useState<SummaryByType>({
        [TransactionType.INCOME]: 0,
        [TransactionType.EXPENSE]: 0,
    });

    const [byState, setByState] = useState<SummaryByState>({
        [TransactionState.INITIAL]: 0,
        [TransactionState.PENDING]: 0,
        [TransactionState.FULFILLED]: 0,
        [TransactionState.DELETED]: 0,
        [TransactionState.CANCELED]: 0,
        [TransactionState.APPROVED]: 0,
        [TransactionState.RETURNED]: 0,
    });

    const [byCategory, setByCategory] = useState<SummaryByCategory>({});

    const [byBank, setByBank] = useState<SummaryByBank>({});
    
    const [byTime, setByTime] = useState<SummaryByTime>({});

    const fetchSummaryByType = useCallback(() => {
        return TransactionEndpoint.getSummaryByType(props.filter.value)
            .then((resp) => {
                if (resp) {
                    setByType(resp as SummaryByType);
                }
            })
    }, [props.filter.value]);

    const fetchSummaryByState = useCallback(() => {
        return TransactionEndpoint.getSummaryByState(props.filter.value)
            .then((resp) => {
                if (resp) {
                    setByState(resp as SummaryByState);
                }
            })
    }, [props.filter.value]);

    const fetchSummaryByCategory = useCallback(() => {
        return TransactionEndpoint.getSummaryByCategory(props.filter.value)
            .then((resp) => {
                if (resp) {
                    setByCategory(resp);
                }
            })
    }, [props.filter.value]);

    const fetchSummaryByBank = useCallback(() => {
        if (typeof TransactionEndpoint.getSummaryByBank === 'function') {
            return TransactionEndpoint.getSummaryByBank(props.filter.value)
                .then((resp) => {
                    if (resp) {
                        setByBank(resp);
                    }
                });
        } else {
            console.warn('getSummaryByBank method not available');
            return Promise.resolve();
        }
    }, [props.filter.value]);
    
    const fetchSummaryByTime = useCallback(() => {
        if (typeof TransactionEndpoint.getSummaryByTime === 'function') {
            return TransactionEndpoint.getSummaryByTime(props.filter.value)
                .then((resp) => {
                    if (resp) {
                        setByTime(resp);
                    }
                });
        } else {
            console.warn('getSummaryByTime method not available');
            return Promise.resolve();
        }
    }, [props.filter.value]);

    const fetch = useCallback(() => {
        return Promise
            .all([
                fetchSummaryByType(),
                fetchSummaryByState(),
                fetchSummaryByCategory(),
                fetchSummaryByBank(),
                fetchSummaryByTime()
            ])
            .catch(() => {
                setError(true);
            })
            .finally(() => {
                setPending(false)
            })
    }, [fetchSummaryByType, fetchSummaryByState, fetchSummaryByCategory, fetchSummaryByBank, fetchSummaryByTime])

    useEffect(() => {
        fetch()
    }, [projectId]);

    useEffect(() => {
        props.filter.subscribe(fetch)
    }, [])

    return (
        props.children({
            error,
            pending,
            refetch: fetch,
            data: {
                byType,
                byState,
                byCategory,
                byBank,
                byTime
            }
        })
    );
}
