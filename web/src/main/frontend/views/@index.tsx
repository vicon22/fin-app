import { NavLink } from 'react-router-dom';
import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { HorizontalLayout, VerticalLayout } from '@vaadin/react-components';
import { formatAmount, getCurrencySign } from 'Frontend/util/currency';
import DashboardController from 'Frontend/controllers/DashboardController';
import st from './Index.module.css';

export const config: ViewConfig = {
  menu: { order: 0, icon: 'line-awesome/svg/tachometer-alt-solid.svg' },
  title: 'Обзор',
  loginRequired: true,
};

export default function DashboardView() {
    return (
        <DashboardController>
            {({data}) => {
                return (
                    <HorizontalLayout theme='spacing margin'>
                        <div className={st.slot}>
                            <h2>Баланс по проектам</h2>

                            <VerticalLayout theme='spacing-s'>
                                {data.projects.map(item => {
                                    const totalExpense = (item.expenses || []).reduce<number>((acc ,item) => acc += (item?.amount || 0) , 0);
                                    const totalIncome = (item.incomes || []).reduce<number>((acc ,item) => acc += (item?.amount || 0) , 0);
                                    const ballance = totalIncome - totalExpense;

                                    return (
                                        <HorizontalLayout className={st.unit} theme='spacing-s'>
                                            <span {...{ theme: 'badge pill' }}>{getCurrencySign(item.currency?.value)}</span>
                                            <NavLink to={`/projects/${item.id}/`}>{item.name}</NavLink>
                                            <span {...{ theme: ballance == 0 ? 'badge' : ballance < 0 ? 'badge error' : 'badge success' }}>
                                                {formatAmount(ballance, item.currency)}
                                            </span>
                                        </HorizontalLayout>
                                    )
                                })}
                            </VerticalLayout>
                        </div>

                        <div className={st.slot}>
                            <h2>Расходы по категориям</h2>

                            <VerticalLayout theme='spacing-s'>
                                {Object.entries(data.expenseGroups).map(([key, value]) => {
                                    const category = data.expenseCategories.find(item => item.id === key);
                                  

                                    return (
                                        <VerticalLayout className={st.unit} theme='spacing-s'>
                                            <span>{category?.title}</span>

                                            <HorizontalLayout theme='spacing-s'>
                                                {value.map(child => {
                                                    const currency = data.currencies.find(c => c.id === child.currency_id);

                                                    return (
                                                        <span {...{ theme: 'badge'}}>
                                                            {formatAmount(child.total, currency)}
                                                        </span>
                                                    );
                                                })}
                                            </HorizontalLayout>
                                            
                                        </VerticalLayout>
                                    )
                                })}
                            </VerticalLayout>
                        </div>
                    </HorizontalLayout>
                )
            }}
        </DashboardController>
    )
}
