import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { TabSheet, TabSheetTab } from '@vaadin/react-components';
import { CategoryList } from 'Frontend/components/CategoryList/CategoryList';
import CategoriesController from 'Frontend/controllers/CategoriesController';
import { TransactionCategoryEndpoint } from 'Frontend/generated/endpoints';

export const config: ViewConfig = {
  menu: { order: 3, icon: 'line-awesome/svg/list-solid.svg' },
  title: 'Категории',
  loginRequired: true,
};

export default function CategoriesView() {
    return (
        <CategoriesController>
            {({data, refetch}) => (
                <TabSheet>
                    <TabSheetTab label='Все категории'>
                        <CategoryList
                            title='Добавить категорию'
                            create={TransactionCategoryEndpoint.create}
                            items={data.categories}
                            onCreate={refetch}
                        />
                    </TabSheetTab>
                </TabSheet>
            )}
        </CategoriesController>
    );
}
