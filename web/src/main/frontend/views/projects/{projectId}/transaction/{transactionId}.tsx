import TransactionForm from "Frontend/components/TransactionForm/TransactionForm";
import { TransactionFormController } from "Frontend/components/TransactionForm/TransactionFormController";
import TransactionController from "Frontend/controllers/TransactionController";
import st from './transaction.module.css'
import { Button, VerticalLayout } from "@vaadin/react-components";
import { TransactionEndpoint } from "Frontend/generated/endpoints";
import { useNavigate } from "react-router";
import { STATE_PARAMS } from "Frontend/domain/transactions/constants";
import TransactionState from "Frontend/generated/io/scrooge/data/transaction/TransactionState";
import { ViewConfig } from "@vaadin/hilla-file-router/types.js";

export const config: ViewConfig = {
  loginRequired: true,
  title: 'Транзакция',
};

export default function TransactionView() {
    const navigate = useNavigate();

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

                    const ediatable = STATE_PARAMS[data.transaction?.state as TransactionState].editable;

                    return (
                        <TransactionFormController
                            banks={data.banks}
                            categories={categories}
                            projectId={data.projectId}
                            submit={form => (
                                TransactionEndpoint
                                    .update(data.transaction?.id, form)
                                    .then(() => {
                                        navigate(`/projects/${data.projectId}/overview`)
                                    }))}
                            initialValue={data.transaction}
                        >
                            {({form, banksOptions}) => (
                                <VerticalLayout theme="spacing">
                                    <h2>{data.transaction?.title}</h2>
                                    <TransactionForm
                                        mode='edit'
                                        disabled={!ediatable}
                                        form={form}
                                        categories={categories}
                                        banks={banksOptions}
                                    />

                                    {ediatable && (
                                        <Button onClick={form.submit} >
                                            Сохранить 
                                        </Button>
                                    )}
                                </VerticalLayout>
                            )}
                        </TransactionFormController>
                    )
                }}
            </TransactionController>
        </div>
    )
}