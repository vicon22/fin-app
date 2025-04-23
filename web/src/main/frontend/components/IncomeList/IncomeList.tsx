import {VerticalLayout} from '@vaadin/react-components';
import {AutoGrid} from '@vaadin/hilla-react-crud';
import ExpenseFlow from 'Frontend/generated/io/scrooge/data/flow/ExpenseFlow';
import IncomeFlow from 'Frontend/generated/io/scrooge/data/flow/IncomeFlow';
import IncomeFlowModel from 'Frontend/generated/io/scrooge/data/flow/IncomeFlowModel';
import {IncomeService} from 'Frontend/generated/endpoints';
import Project from 'Frontend/generated/io/scrooge/data/project/Project';
import {formatAmount} from 'Frontend/util/currency';
import {AddRecord} from './components/AddRecord/AddRecord';
import IncomeCategory from 'Frontend/generated/io/scrooge/data/category/IncomeCategory';
import st from './incomeList.module.css';

type IncomeListProps = {
    project: Project | undefined;
    items: (ExpenseFlow | IncomeFlow)[];
    categories: IncomeCategory[];
    onCreate: (item: IncomeFlow) => void;
};

export function IncomeList(props: IncomeListProps) {
    function renderItem({ item } : {item: ExpenseFlow}) {
        return <div className={st.item}>
            <div className={st.title}>
                {item.title}
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
                    {renderAddControl('Добавить доход')}
                    <AutoGrid
                        service={IncomeService}
                        model={IncomeFlowModel}
                        visibleColumns={['amount', 'title', 'created']}
                    />
                </VerticalLayout>
            )
            : (
                <div className={st.placeholder}>
                    <h2>Доходов пока нет</h2>
                    <p>Создате первую запись о доходах</p>
                    {renderAddControl('Создать запись')}
                </div>
            )
    )
};
