import {VerticalLayout} from '@vaadin/react-components';
import {AutoGrid} from '@vaadin/hilla-react-crud';
import ExpenseFlow from 'Frontend/generated/io/scrooge/data/flow/ExpenseFlow';
import ExpenseFlowModel from 'Frontend/generated/io/scrooge/data/flow/ExpenseFlowModel';
import IncomeFlow from 'Frontend/generated/io/scrooge/data/flow/IncomeFlow';
import Project from 'Frontend/generated/io/scrooge/data/project/Project';
import {formatAmount} from 'Frontend/util/currency';
import ExpenseCategory from 'Frontend/generated/io/scrooge/data/category/ExpenseCategory';
import {ExpenseService} from 'Frontend/generated/endpoints';
import {AddRecord} from './components/AddRecord/AddRecord';
import st from './expenseList.module.css';

type ExpenseListProps = {
    project: Project | undefined;
    items: (ExpenseFlow | IncomeFlow)[];
    categories: ExpenseCategory[];
    onCreate: (item: IncomeFlow) => void;
};

export function ExpenseList(props: ExpenseListProps) {
    function renderItem({ item } : {item: ExpenseFlow}) {
        const category = props.categories.find(category => category.id === item.category_id);

        return <div className={st.item}>
            <div className={st.title}>
                {item.title}
            </div>

            <div className={st.category}>
                {category?.title}
            </div>
    
            <div className={st.amount}>
                {formatAmount(item.amount, props.project?.currency)}
            </div>
    
            <div className={st.date}>
                {(new Date(String(item.created))).toLocaleDateString('ru-RU')}
            </div>
        </div>
    };

    function renderAddControl(buttonText: string) {
        return (
            <AddRecord
                buttonText={buttonText}
                projectId={props.project?.id}
                onCreate={props.onCreate}
                categories={props.categories}
            />
        )
    };

    return (
        props.items.length
            ? (
                <VerticalLayout theme='spacing'>
                    {renderAddControl('Добавить расход')}
                    <AutoGrid
                        service={ExpenseService}
                        model={ExpenseFlowModel}
                        visibleColumns={['amount', 'title', 'created']}
                    />
                </VerticalLayout>
            )
            : (
                <div className={st.placeholder}>
                    <h2>Расходов пока нет</h2>
                    <p>Создате первую запись о расходах</p>
                    {renderAddControl('Создать запись')}
                </div>
            )
    )
};
