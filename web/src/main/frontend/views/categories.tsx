import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { TabSheet, TabSheetTab } from '@vaadin/react-components';
import { CategoryList } from 'Frontend/components/CategoryList/CategoryList';
import CategoriesController from 'Frontend/controllers/CategoriesController';
import { ExpenseCategoryEndpoint, IncomeCategoryEndpoint } from 'Frontend/generated/endpoints';

export const config: ViewConfig = {
  menu: { order: 3, icon: 'line-awesome/svg/list-solid.svg' },
  title: 'Categories',
  loginRequired: true,
};

export default function CategoriesView() {
    return (
        <CategoriesController>
            {({data, refetch}) => (
                <TabSheet>
                    <TabSheetTab label='Incomes'>
                        <CategoryList
                            title='Add income category'
                            create={IncomeCategoryEndpoint.create}
                            items={data.categories.income}
                            onCreate={refetch}
                        />
                    </TabSheetTab>

                    <TabSheetTab label='Expenses'>
                        <CategoryList
                            title='Add expense category'
                            create={ExpenseCategoryEndpoint.create}
                            items={data.categories.expense}
                            onCreate={refetch}
                        />
                    </TabSheetTab>
                </TabSheet>
            )}
        </CategoriesController>
    );
}
