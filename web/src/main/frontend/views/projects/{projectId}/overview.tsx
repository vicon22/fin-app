import {ViewConfig} from '@vaadin/hilla-file-router/types.js';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement
} from 'chart.js';

import { Pie, Bar } from 'react-chartjs-2';
import {HorizontalLayout, VerticalLayout, TabSheet, TabSheetTab} from '@vaadin/react-components';
import ProjectController from 'Frontend/controllers/ProjectController';
import { formatAmount } from 'Frontend/util/currency';
import { TransactionList } from 'Frontend/components/TransactionList/TransactionList';
import st from './project.module.css';
import TransactionType from 'Frontend/generated/io/scrooge/data/transaction/TransactionType';

export const config: ViewConfig = {
  loginRequired: true,
  title: 'Проект',
};

ChartJS.register(
    ArcElement,
    BarElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title
);

export default function ProjectOverview() {
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
                            <h2>Что-то пошло не так :(</h2>
                            <p>Проверьте id проекта и перезагрузите страницу</p>
                        </div>
                    )
                }


                const totalExpense = data.transactions.reduce<number>((acc, item) => {
                    if (item.type === TransactionType.EXPENSE) {
                        acc += item.amount / 100;
                    }

                    return acc;
                }, 0);


                const totalIncome = data.transactions.reduce<number>((acc, item) => {
                    if (item.type === TransactionType.INCOME) {
                        acc += item.amount / 100;
                    }

                    return acc;
                }, 0);


                const ballance = totalIncome - totalExpense;
                
                const dates = Array.from(new Set(data.transactions.map(item => new Date(String(item.created)).toLocaleDateString('ru-RU')))).toSorted()
                

                const expensesMap = data.transactions.reduce<Record<string, number>>((acc, item) => {
                    if (item.type === TransactionType.EXPENSE) {
                        acc[new Date(String(item.created)).toLocaleDateString('ru-RU')] = item.amount / 100;
                    }

                    return acc;
                }, {});

                const incomesMap = data.transactions.reduce<Record<string, number>>((acc, item) => {
                    if (item.type === TransactionType.INCOME) {
                        acc[new Date(String(item.created)).toLocaleDateString('ru-RU')] = item.amount / 100;
                    }

                    return acc;
                }, {});

                return (
                    <>
                        <HorizontalLayout theme="padding spacing">
                            <VerticalLayout theme="padding spacing">
                                <h2>{data.project?.name}</h2>
                                <span {...{ theme: ballance == 0 ? 'badge' : ballance < 0 ? 'badge error' : 'badge success' }}>
                                    {formatAmount(ballance, data.project?.currency)}
                                </span>
                            </VerticalLayout>

                            <div style={{ width: 120, height: 120 }}>
                                <Pie
                                    options={{
                                       plugins: {
                                           legend: {
                                               display: false,
                                           }
                                       }
                                    }}
                                    data={{
                                        labels: ['Доходы', 'Расходы'],
                                        datasets: [{
                                            data: [totalIncome, totalExpense],
                                            backgroundColor: [
                                               'hsla(145, 72%, 31%, 0.5)',
                                               'hsla(3, 85%, 49%, 0.5)',
                                            ],
                                        }],
                                    }}
                                />
                            </div>
                        </HorizontalLayout>

                        <div style={{ width: '100%', height: 400, padding: 40, boxSizing: 'border-box' }}>
                        <Bar
                            options={{
                               responsive: true,
                               maintainAspectRatio: false,
                               plugins: {
                                    legend: {
                                        display: false,
                                    },
                                    title: {
                                        display: false,
                                    },
                               },
                            }}
                            data={{
                                labels: dates,
                                datasets: [
                                    {
                                        label: 'Расходы',
                                        data: dates.map(item => expensesMap[item]),
                                        backgroundColor: 'hsla(3, 85%, 49%, 0.5)',
                                    },
                                    {
                                        label: 'Доходы',
                                        data: dates.map(item => incomesMap[item]),
                                        backgroundColor: 'hsla(145, 72%, 31%, 0.5)',
                                    },
                                ],
                            }}
                        />
                        </div>

                        <TabSheet>
                            <TabSheetTab label='Транзакции'>
                                <TransactionList
                                    items={data.transactions}
                                    categories={data.categories}
                                    project={data.project}
                                    onCreate={refetch.flows}
                                />
                            </TabSheetTab>

                            <TabSheetTab label='Отчеты' disabled>
                                Тут будет конструктор отчетов
                            </TabSheetTab>
                        </TabSheet>
                    </>
                )
            }}
        </ProjectController>
    );
}
