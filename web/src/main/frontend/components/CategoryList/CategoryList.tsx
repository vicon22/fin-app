import {VerticalLayout, VirtualList} from '@vaadin/react-components';
import AddCategory from '../AddCategory/AddCategory';
import st from './categoryList.module.css';
import TransactionCategory from 'Frontend/generated/io/scrooge/data/category/TransactionCategory';

type CategoryListProps = {
    title: string;
    items: TransactionCategory[];
    create: (title: string, description: string) => Promise<TransactionCategory | undefined>;
    onCreate: VoidFunction;
};

export function CategoryList(props: CategoryListProps) {
    function renderItem({ item } : {item: TransactionCategory}) {
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
                        buttonText='Новая категория'
                        onCreate={props.onCreate}
                    />

                    <VirtualList items={props.items}>{renderItem}</VirtualList>
                </VerticalLayout>
            )
            : (
                <div className={st.placeholder}>
                    <h2>Категорий еще нет</h2>
                    <p>Создайте первую категорию для группировки доходов или расходов</p>

                    <AddCategory
                        title={props.title}
                        create={props.create}
                        buttonText='Создать категорию'
                        onCreate={props.onCreate}
                    />
                </div>
            )
    )
}
