import { useCallback, useEffect, useMemo } from 'react';
import { useSignal } from '@vaadin/hilla-react-signals';
import { Button, Dialog, Icon, Select, TextField, VerticalLayout } from '@vaadin/react-components';
import { CurrencyEndpoint, ProjectEndpoint } from 'Frontend/generated/endpoints';
import Currency from 'Frontend/generated/io/scrooge/data/currency/Currency';
import Project from 'Frontend/generated/io/scrooge/data/project/Project';
import { useAuth } from 'Frontend/util/auth';
import st from './addProject.module.css';

type AddProjectProps = {
    onCreate: (item: Project) => void;
    buttonText?: string;
}

export default function AddProject(props: AddProjectProps) {
    const auth = useAuth();
    const dialogOpened = useSignal<boolean>(false);
    const name = useSignal<string>('');
    const currencyId = useSignal<string>('');
    const currencies = useSignal<Currency[]>([]);

    const close = useCallback(() => {
        dialogOpened.value = false;
        name.value = '';
    }, []);

    const create = useCallback(() => {
        if (name.value) {
            ProjectEndpoint
                .createProject(auth.state.user?.id, name.value, currencyId.value)
                .then(project => {
                    project && props.onCreate(project);
                    close();
                });
        }
    }, [props.onCreate, auth.state.user?.id, close]);

    const options = useMemo(() => {
        return currencies.value.map(item => ({
            label: item.value,
            value: item.id
        }));
    }, [currencies.value]);

    useEffect(() => {
        CurrencyEndpoint.getCurrencies().then(data => {
            if (data) {
                const firstId = data[0]?.id;

                currencies.value = data.filter(item => !!item);

                if (firstId) {
                    currencyId.value = firstId;
                }
            }
        });
    }, []);

    return (
        <>
            <Dialog
                headerTitle='New project'
                opened={dialogOpened.value}
                onOpenedChanged={({ detail }) => {
                    dialogOpened.value = detail.value;
                }}
                footerRenderer={() => (
                    <>
                        <Button
                            onClick={close}
                        >
                            Cancel
                        </Button>
                        <Button
                            theme='primary'
                            onClick={create}
                        >
                            Add
                        </Button>
                    </>
                )}
            >
                <VerticalLayout className={st.layout}>
                    <TextField
                        required
                        value={name.value}
                        label='Name'
                        onChange={e => {
                            name.value = e.target.value
                        }}
                    />
                    <Select
                        label='Currency'
                        items={options}
                        value={currencyId.value}
                        onChange={e => {
                            currencyId.value = e.target.value
                        }}
                    />
                </VerticalLayout>
            </Dialog>

            <Button onClick={() => dialogOpened.value = true} theme={props.buttonText ? undefined : 'icon small'}>
                {props.buttonText || <Icon icon='lumo:plus' />}
            </Button>
        </>
    )
}
