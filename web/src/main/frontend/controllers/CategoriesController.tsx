import {ReactNode, useCallback, useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {ExpenseCategoryEndpoint, IncomeCategoryEndpoint} from 'Frontend/generated/endpoints';
import ExpenseCategory from 'Frontend/generated/io/scrooge/data/category/ExpenseCategory';
import IncomeCategory from 'Frontend/generated/io/scrooge/data/category/IncomeCategory';

type CategoriesControllerProps = {
    children: (payload: {
        error: boolean;
        pending: boolean;
        refetch: () => Promise<void>;
        data: {
            categories: {
                expense: ExpenseCategory[];
                income: IncomeCategory[];
            };
        }
    }) => ReactNode;
};

export default function CategoriesController(props: CategoriesControllerProps) {
    const {projectId} = useParams();
    const [error, setError] = useState<boolean>(false);
    const [pending, setPending] = useState<boolean>(true);
    const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>([]);
    const [incomeCategories, setIncomeCategories] = useState<IncomeCategory[]>([]);

    const fetchCategories = useCallback(async () => {
        const [
            expenseCategoriesResp,
            imcomeCategoriesResp
        ] = await Promise
            .all([
                ExpenseCategoryEndpoint.getAll(),
                IncomeCategoryEndpoint.getAll()
            ]);
        setExpenseCategories((expenseCategoriesResp || []).filter(item => !!item));
        setIncomeCategories((imcomeCategoriesResp || []).filter(item_1 => !!item_1));
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
                categories: {
                    expense: expenseCategories,
                    income: incomeCategories
                }
            }
        })
    );
}
