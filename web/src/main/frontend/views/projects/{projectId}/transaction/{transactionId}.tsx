import TransactionForm from "Frontend/components/TransactionForm/TransactionForm";
import { TransactionFormController } from "Frontend/components/TransactionForm/TransactionFormController";
import TransactionController from "Frontend/controllers/TransactionController";
import st from './transaction.module.css'

export default function TransactionView() {
    return (
        <div className={st.layout}>
            <TransactionController>
                {({data, pending, error}) => {


                    if (pending) {
                        return null;
                    }

                    if (error || !data.transaction) {
                        return (
                            <div className={st.placeholder}>
                                <h2>Что-то пошло не так :(</h2>
                                <p>Проверьте id проекта и транзакции и перезагрузите страницу</p>
                            </div>
                        )
                    }


                    const categories = data.categories.map(item => ({
                        label: item.title,
                        value: item.id
                    }));

                    return (
                        <TransactionFormController
                            banks={data.banks}
                            categories={categories}
                            projectId={data.projectId}
                            submit={form => Promise.resolve()}
                            initialValue={data.transaction}
                        >
                            {({form, banksOptions}) => (
                                <TransactionForm
                                    form={form}
                                    categories={categories}
                                    banks={banksOptions}
                                />
                            )}
                        </TransactionFormController>
                    )
                }}
            </TransactionController>
        </div>
    )
}