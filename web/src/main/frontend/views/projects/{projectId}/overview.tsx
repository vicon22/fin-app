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
import { useParams } from 'react-router';
import { TransactionFilterController } from 'Frontend/controllers/TransactionFilterController';
import { getSummaryByCategoryChartData, getSummaryByStateChartData, getSummaryByTypeChartData } from './utils';
import ProjectSummaryController from 'Frontend/controllers/ProjectSummaryController';

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
        <TransactionFilterController>
            {({filter, criterions, settings}) => {
             

                return (
                    <ProjectController filter={filter}>
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
                                    acc += item.amount || 0;
                                }

                                return acc;
                            }, 0);


                            const totalIncome = data.transactions.reduce<number>((acc, item) => {
                                if (item.type === TransactionType.INCOME) {
                                    acc += item.amount || 0;
                                }

                                return acc;
                            }, 0);


                            const ballance = totalIncome - totalExpense;

                            return (
                                <>
                                    <HorizontalLayout theme="padding spacing">
                                        <VerticalLayout theme="padding spacing">
                                            <h2>{data.project?.name}</h2>
                                            <span {...{ theme: ballance == 0 ? 'badge' : ballance < 0 ? 'badge error' : 'badge success' }}>
                                                {formatAmount(ballance, data.project?.currency)}
                                            </span>
                                        </VerticalLayout>
                                    </HorizontalLayout>

                                    <TabSheet>
                                        <TabSheetTab label='Транзакции'>
                                            <TransactionList
                                                filter={filter}
                                                criterions={criterions}
                                                settings={settings}
                                                items={data.transactions}
                                                categories={data.categories}
                                                project={data.project}
                                                onCreate={refetch.flows}
                                            />
                                        </TabSheetTab>

                                        <TabSheetTab label='Отчеты'>
                                            <ProjectSummaryController filter={filter}>
                                                {(summary) => (
                                                    <VerticalLayout theme="padding spacing">

                                                        <HorizontalLayout theme="padding spacing">
                                                            <div style={{ width: 400, height: 350}}>
                                                                <h4 style={{lineHeight: 3}}>Итоговое распределение</h4>
                                                                <Pie
                                                                    options={{
                                                                    plugins: {
                                                                        legend: {
                                                                            display: false,
                                                                        }
                                                                    }
                                                                    }}
                                                                    data={getSummaryByTypeChartData(summary.data.byType)}
                                                                />
                                                            </div>


                                                            <div style={{ width: 400, height: 350, marginLeft: 50}}>
                                                                <h4 style={{lineHeight: 3}}>Итого по категориям</h4>
                                                                <Pie
                                                                    options={{
                                                                    plugins: {
                                                                        legend: {
                                                                            display: false,
                                                                        }
                                                                    }
                                                                    }}
                                                                    data={getSummaryByStateChartData(summary.data.byState)}
                                                                />
                                                            </div>
                                                        </HorizontalLayout>

                                                        

                                                        <div style={{ width: '100%', height: 400, marginTop: 80, boxSizing: 'border-box' }}>
                                                            <h4 style={{lineHeight: 3}}>Распределени по типу и категории</h4>
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
                                                                data={getSummaryByCategoryChartData(summary.data.byCategory, data.categories)}
                                                            />
                                                        </div>
                                                    </VerticalLayout>
                                                )}
                                            </ProjectSummaryController>
                                        </TabSheetTab>
                                    </TabSheet>
                                </>
                            )
                        }}
                    </ProjectController>
                )
            }}
        </TransactionFilterController>
    );
}
