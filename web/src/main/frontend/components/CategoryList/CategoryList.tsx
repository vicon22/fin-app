import { VerticalLayout, VirtualList } from '@vaadin/react-components';
import ExpenseCategory from 'Frontend/generated/io/scrooge/data/category/ExpenseCategory';
import IncomeCategory from 'Frontend/generated/io/scrooge/data/category/IncomeCategory';
import AddCategory from '../AddCategory/AddCategory';
import st from './categoryList.module.css';

type CategoryListProps = {
    title: string;
    items: (ExpenseCategory | IncomeCategory)[];
    create: (title: string, description: string) => Promise<ExpenseCategory | IncomeCategory | undefined>;
    onCreate: VoidFunction;
};

export function CategoryList(props: CategoryListProps) {
    function renderItem({ item } : {item: ExpenseCategory | IncomeCategory}) {
        return <div className={st.item}>
            <div className={st.title}>
                {item.title}
            </div>

            <div className={st.description}>
                {item.description}
            </div>
        </div>
    };

    return (
        props.items.length
            ? (
                <VerticalLayout theme='spacing'>
                    <AddCategory
                        title={props.title}
                        create={props.create}
                        buttonText='Add category'
                        onCreate={props.onCreate}
                    />

                    <VirtualList items={props.items}>{renderItem}</VirtualList>
                </VerticalLayout>
            )
            : (
                <div className={st.placeholder}>
                    <h2>No categories yet</h2>
                    <p>Add categories to group flows and control expenses</p>

                    <AddCategory
                        title={props.title}
                        create={props.create}
                        buttonText='Add category'
                        onCreate={props.onCreate}
                    />
                </div>
            )
    )
}
