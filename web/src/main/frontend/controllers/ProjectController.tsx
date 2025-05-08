import {ReactNode, useCallback, useEffect, useState} from 'react';
import { useParams } from 'react-router';
import {ProjectEndpoint, TransactionEndpoint, TransactionCategoryEndpoint} from 'Frontend/generated/endpoints';
import TransactionCategory from 'Frontend/generated/io/scrooge/data/category/TransactionCategory';
import Project from 'Frontend/generated/io/scrooge/data/project/Project';
import Transaction from 'Frontend/generated/io/scrooge/data/transaction/Transaction';
import {useAuth} from 'Frontend/util/auth';
import AndFilter from 'Frontend/generated/com/vaadin/hilla/crud/filter/AndFilter';
import TransactionType from 'Frontend/generated/io/scrooge/data/transaction/TransactionType';
import {SummaryByCategory, SummaryByState, SummaryByType} from 'Frontend/domain/transactions/types';
import TransactionState from 'Frontend/generated/io/scrooge/data/transaction/TransactionState';
import { ReadonlySignal } from '@vaadin/hilla-react-signals';

type ProjectControllerProps = {
    filter: ReadonlySignal<AndFilter>
    children: (payload: {
        error: boolean;
        pending: boolean;
        refetch: {
            project: () => Promise<void>;
            flows: () => Promise<void>;
            categories: () => Promise<void>;
        },
        data: {
            project: Project | undefined,
            transactions: Transaction[],
            categories: TransactionCategory[],
            summaryByType: SummaryByType;
            summaryByState: SummaryByState;
            summaryByCategory: SummaryByCategory;
        }
    }) => ReactNode;
};

export default function ProjectController(props: ProjectControllerProps) {
    const {projectId} = useParams();
    const {state} = useAuth();
    const [project, setProject] = useState<Project>();

    const [error, setError] = useState<boolean>(false);
    const [pending, setPending] = useState<boolean>(true);
    
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [transactionCategories, setTransactionCategories] = useState<TransactionCategory[]>([]);

    const [summaryByType, setSummaryByType] = useState<SummaryByType>({
        [TransactionType.INCOME]: 0,
        [TransactionType.EXPENSE]: 0,
    });

    const [summaryByState, setSummaryByState] = useState<SummaryByState>({
        [TransactionState.INITIAL]: 0,
        [TransactionState.PENDING]: 0,
        [TransactionState.FULFILLED]: 0,
        [TransactionState.DELETED]: 0,
        [TransactionState.CANCELED]: 0,
        [TransactionState.APPROVED]: 0,
        [TransactionState.RETURNED]: 0,
    });

    const [summaryByCategory, setSummaryByCategory] = useState<SummaryByCategory>({});

    const fetchProject = useCallback(() => {
        return ProjectEndpoint.getProject(state.user?.id, projectId)
            .then((projectResp) => {
                setProject(projectResp);
            })
    }, [projectId]);

    const fetchFlows = useCallback(() => {
        return TransactionEndpoint.getProjectTransactions(projectId)
            .then((transactionsResp) => {
                setTransactions((transactionsResp || []).filter(p => !!p));
            })
    }, [projectId]);

    const fetchCategories = useCallback(() => {
        return TransactionCategoryEndpoint.getAll()
            .then((transactionCategoriesResp) => {
                setTransactionCategories((transactionCategoriesResp || []).filter(item => !!item));
            })
    }, []);


    const fetch = useCallback(() => {
        Promise
            .all([
                fetchFlows(),
                fetchProject(),
                fetchCategories(),
            ])
            .catch(() => {
                setError(true);
            })
            .finally(() => {
                setPending(false)
            })
    }, [])

    useEffect(fetch, [projectId]);

    return (
        props.children({
            error,
            pending,
            refetch: {
                project: fetchProject,
                flows: fetchFlows,
                categories: fetchCategories
            },
            data: {
                project,
                transactions,
                categories: transactionCategories,
                summaryByType,
                summaryByState,
                summaryByCategory,
            }
        })
    );
}
