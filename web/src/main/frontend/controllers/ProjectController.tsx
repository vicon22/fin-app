import {ReactNode, useCallback, useEffect, useState} from 'react';
import { useParams } from 'react-router';
import {ProjectEndpoint, TransactionEndpoint, TransactionCategoryEndpoint} from 'Frontend/generated/endpoints';
import TransactionCategory from 'Frontend/generated/io/scrooge/data/category/TransactionCategory';
import Project from 'Frontend/generated/io/scrooge/data/project/Project';
import Transaction from 'Frontend/generated/io/scrooge/data/transaction/Transaction';
import {useAuth} from 'Frontend/util/auth';

type ProjectControllerProps = {
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
            categories: TransactionCategory[]
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

    useEffect(() => {
        Promise
            .all([
                fetchProject(),
                fetchFlows(),
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
            refetch: {
                project: fetchProject,
                flows: fetchFlows,
                categories: fetchCategories
            },
            data: {
                project,
                transactions,
                categories: transactionCategories
            }
        })
    );
}
