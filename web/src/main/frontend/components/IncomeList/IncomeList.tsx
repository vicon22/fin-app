import { VerticalLayout, VirtualList } from '@vaadin/react-components';
import ExpenseFlow from 'Frontend/generated/io/scrooge/data/flow/ExpenseFlow';
import IncomeFlow from 'Frontend/generated/io/scrooge/data/flow/IncomeFlow';
import Project from 'Frontend/generated/io/scrooge/data/project/Project';
import { formatAmount } from 'Frontend/util/currency';
import { AddRecord } from './components/AddRecord/AddRecord';
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
                    {renderAddControl('Add income record')}
                    <VirtualList items={props.items}>{renderItem}</VirtualList>
                </VerticalLayout>
            )
            : (
                <div className={st.placeholder}>
                    <h2>No records yet</h2>
                    <p>Fulfill project with income or expenses records</p>
                    {renderAddControl('Add first income')}
                </div>
            )
    )
};
