import {ViewConfig} from '@vaadin/hilla-file-router/types.js';
import {HorizontalLayout, TabSheet, TabSheetTab} from '@vaadin/react-components';
import ProjectController from 'Frontend/controllers/ProjectController';
import { formatAmount } from 'Frontend/util/currency';
import { IncomeList } from 'Frontend/components/IncomeList/IncomeList';
import { ExpenseList } from 'Frontend/components/ExpenseList/ExpenseList';
import st from './project.module.css';

export const config: ViewConfig = {
  loginRequired: true,
};

export default function ProjectView() {
    return (
        <ProjectController>
            {({
                error,
                pending,
                data,
                refetch
            }) => {
                if (pending) {
                    return null;
                }

                if (error) {
                    return (
                        <div className={st.placeholder}>
                            <h2>Something went wrong :(</h2>
                            <p>Check project id or try to reload page</p>
                        </div>
                    )
                }
                const ballance = data.totals.income - data.totals.expense;

                return (
                    <>
                        <HorizontalLayout theme="padding spacing">
                            <div className={st.title}>
                                <h2>{data.project?.name}</h2>
                                <span {...{ theme: ballance == 0 ? 'badge' : ballance < 0 ? 'badge error' : 'badge success' }}>
                                    {formatAmount(ballance, data.project?.currency)}
                                </span>
                            </div>
                        </HorizontalLayout>

                        <TabSheet>
                            <TabSheetTab label='Expenses'>
                                <ExpenseList
                                    items={data.flows.expenses}
                                    categories={data.categories.expense}
                                    project={data.project}
                                    onCreate={refetch.flows}
                                />
                            </TabSheetTab>

                            <TabSheetTab label='Incomes'>
                                <IncomeList
                                    items={data.flows.incomes}
                                    categories={data.categories.income}
                                    project={data.project}
                                    onCreate={refetch.flows}
                                />
                            </TabSheetTab>
                        </TabSheet>
                    </>
                )
            }}
        </ProjectController>
    );
}
