import {ReactNode, useCallback, useEffect, useState} from 'react';
import {CurrencyEndpoint, TransactionCategoryEndpoint, TransactionEndpoint} from 'Frontend/generated/endpoints';
import Project from 'Frontend/generated/io/scrooge/data/project/Project';
import {useAuth} from 'Frontend/util/auth';
import Currency from 'Frontend/generated/io/scrooge/data/currency/Currency';
import TransactionCategory from 'Frontend/generated/io/scrooge/data/category/TransactionCategory';

type ExpenseGroups = Record<string, {currency_id: string, total: number}[]>;

type DashboardControllerProps = {
    children: (payload: {
        error: boolean;
        pending: boolean;
        data: {
            currencies: Currency[],
            categories: TransactionCategory[],
            expenseGroups: ExpenseGroups;
            projects: Project[];
        }
    }) => ReactNode;
};

export default function DashboardController(props: DashboardControllerProps) {
    const {state} = useAuth();
    const [error, setError] = useState<boolean>(false);
    const [pending, setPending] = useState<boolean>(true);
    const [expenseGroups, setExpenseGroups] = useState<ExpenseGroups>({});
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [categories, setCategories] = useState<TransactionCategory[]>([]);

    const fetchCurrencies = useCallback(async () => {
        const data = await CurrencyEndpoint.getCurrencies();

        setCurrencies((data || []).filter(p => !!p));
    }, []);

    const fetchCategories = useCallback(async () => {
        const categoriesResp = await TransactionCategoryEndpoint.getAll();
    
        setCategories((categoriesResp || []).filter(item => !!item));
    }, []);
   
    const fetchSummary = useCallback(async () => {
        const data = await TransactionEndpoint.getTotalByUser(state.user?.id);




        setExpenseGroups((data || []).reduce<ExpenseGroups>((acc, item) => {
            if (item?.category_id && item.currency_id) {
                acc[item?.category_id] = acc[item?.category_id] || [];

                acc[item?.category_id].push({
                    currency_id: item.currency_id,
                    total: item.total
                });
            }

            return acc;
        }, {}));
    }, []);

    useEffect(() => {
        Promise
            .all([
                fetchSummary(),
                fetchCurrencies(),
                fetchCategories(),
            ])
            .catch(() => {
                setError(true);
            })
            .finally(() => {
                setPending(false)
            })
    }, []);

    return (
        props.children({
            error,
            pending,
            data: {
                currencies,
                categories,
                expenseGroups,
                projects: state?.user?.projects?.filter?.(item => !!item) || []
            }
        })
    );
}
