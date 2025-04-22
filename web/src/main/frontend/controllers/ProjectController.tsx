import {ReactNode, useCallback, useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {ExpenseCategoryEndpoint, ExpenseEndpoint, IncomeCategoryEndpoint, IncomeEndpoint, ProjectEndpoint} from 'Frontend/generated/endpoints';
import ExpenseCategory from 'Frontend/generated/io/scrooge/data/category/ExpenseCategory';
import Project from 'Frontend/generated/io/scrooge/data/project/Project';
import {useAuth} from 'Frontend/util/auth';
import IncomeCategory from 'Frontend/generated/io/scrooge/data/category/IncomeCategory';
import ExpenseFlowCategorySum from 'Frontend/generated/io/scrooge/data/flow/dto/ExpenseFlowCategorySum';
import ExpenseFlow from 'Frontend/generated/io/scrooge/data/flow/ExpenseFlow';
import IncomeFlow from 'Frontend/generated/io/scrooge/data/flow/IncomeFlow';

type ProjectControllerProps = {
    children: (payload: {
        error: boolean;
        pending: boolean;
        refetch: {
            project: () => Promise<void>;
            totals: () => Promise<void>;
            flows: () => Promise<void>;
            categories: () => Promise<void>;
        },
        data: {
            project: Project | undefined,
            flows: {
                expenses: ExpenseFlow[];
                incomes: IncomeFlow[];
            };
            categories: {
                expense: ExpenseCategory[];
                income: IncomeCategory[];
            };
            totals: {
                byCategory: ExpenseFlowCategorySum[];
                income: number;
                expense: number;
            };
        }
    }) => ReactNode;
};

export default function ProjectController(props: ProjectControllerProps) {
    const {projectId} = useParams();
    const {state} = useAuth();
    const [project, setProject] = useState<Project>();

    const [error, setError] = useState<boolean>(false);
    const [pending, setPending] = useState<boolean>(true);

    const [expenses, setExpenses] = useState<ExpenseFlow[]>([]);
    const [incomes, setIncomes] = useState<IncomeFlow[]>([]);

    const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>([]);
    const [incomeCategories, setIncomeCategories] = useState<IncomeCategory[]>([]);

    const [totalExpenseByCategory, setTotalExpenseByCategory] = useState<ExpenseFlowCategorySum[]>([]);

    const [totalIncomes, setTotalIncomes] = useState<number>(0);
    const [totalExpenses, setTotalExpenses] = useState<number>(0);

    const fetchProject = useCallback(() => {
        return Promise
            .all([
                ProjectEndpoint.getProject(state.user?.id, projectId),
            ])
            .then(([
                projectResp,
            ]) => {
                setProject(projectResp);
            })
    }, [projectId]);

    const fetchFlows = useCallback(() => {
        return Promise
            .all([
                ExpenseEndpoint.getProjectExpenses(projectId),
                IncomeEndpoint.getProjectIncomes(projectId),
            ])
            .then(([
                expensesResp,
                incomesResp,
            ]) => {
                setExpenses((expensesResp || []).filter(p => !!p));
                setIncomes((incomesResp || []).filter(p => !!p));
            })
    }, [projectId]);

    const fetchTotals = useCallback(() => {
        return Promise
            .all([
                ExpenseEndpoint.getTotalByCategories(projectId),
                ExpenseEndpoint.getTotal(projectId),
                IncomeEndpoint.getTotal(projectId),
            ])
            .then(([
                totalByCategoriesResp,
                totalExpensesResp,
                totalIncomesResp,
            ]) => {
                setTotalExpenses(totalExpensesResp);
                setTotalIncomes(totalIncomesResp);
                setTotalExpenseByCategory((totalByCategoriesResp || []).filter(p => !!p));
            })

    }, [projectId]);

    const fetchCategories = useCallback(() => {
        return Promise
            .all([
                ExpenseCategoryEndpoint.getAll(),
                IncomeCategoryEndpoint.getAll()
            ])
            .then(([
                expenseCategoriesResp,
                incomeCategoriesResp
            ]) => {
                setExpenseCategories((expenseCategoriesResp || []).filter(item => !!item));
                setIncomeCategories((incomeCategoriesResp || []).filter(item => !!item));
            })
    }, []);

    useEffect(() => {
        Promise
            .all([
                fetchProject(),
                fetchFlows(),
                fetchTotals(),
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
                totals: fetchTotals,
                categories: fetchCategories
            },
            data: {
                project,
                flows: {
                    incomes,
                    expenses,
                },
                categories: {
                    expense: expenseCategories,
                    income: incomeCategories
                },
                totals: {
                    byCategory: totalExpenseByCategory,
                    income: totalIncomes,
                    expense: totalExpenses,
                }
            }
        })
    );
}
