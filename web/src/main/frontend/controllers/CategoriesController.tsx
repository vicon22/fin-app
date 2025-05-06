import {ReactNode, useCallback, useEffect, useState} from 'react';
import {TransactionCategoryEndpoint} from 'Frontend/generated/endpoints';
import { useParams } from 'react-router';
import TransactionCategory from 'Frontend/generated/io/scrooge/data/category/TransactionCategory';

type CategoriesControllerProps = {
    children: (payload: {
        error: boolean;
        pending: boolean;
        refetch: () => Promise<void>;
        data: {
            categories: TransactionCategory[]
        }
    }) => ReactNode;
};

export default function CategoriesController(props: CategoriesControllerProps) {
    const {projectId} = useParams();
    const [error, setError] = useState<boolean>(false);
    const [pending, setPending] = useState<boolean>(true);
    const [categories, setCategories] = useState<TransactionCategory[]>([]);

    const fetchCategories = useCallback(async () => {
        const items = await TransactionCategoryEndpoint.getAll();

        setCategories((items || []).filter(item => !!item));
    }, []);

    useEffect(() => {
        fetchCategories()
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
            refetch: fetchCategories,
            data: {
                categories,
            }
        })
    );
}
