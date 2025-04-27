import {useCallback, useEffect} from 'react';
import {useSignal} from '@vaadin/hilla-react-signals';
import {
    Button,
    ComboBox,
    Dialog,
    HorizontalLayout,
    Icon,
    NumberField,
    SelectItem,
    TextField,
    VerticalLayout,
    RadioButton,
    RadioGroup,
    DatePicker,
    Select,
    TextArea
} from '@vaadin/react-components';
import st from './addFlow.module.css';
import BanksController from 'Frontend/controllers/BanksController';

type AddFlowProps<T, C> = {
    title: string;
    projectId: string | undefined;
    categories: SelectItem[];
    buttonText?: string;
    create: (projectId: string, categoryId: string, title: string, amount: number) => Promise<T | undefined>;
    onCreate: (item: T) => void;
};

export default function AddFlow<T, C>(props: AddFlowProps<T, C>) {
    const dialogOpened = useSignal<boolean>(false);
    const label = useSignal<string | undefined>();
    const integer = useSignal<number | undefined>();
    const fraction = useSignal<number | undefined>();
    const categoryId = useSignal<string | undefined>();

    const close = useCallback(() => {
        label.value = undefined;
        integer.value = undefined;
        fraction.value = undefined;
        categoryId.value = undefined;

        requestAnimationFrame(() => {
            dialogOpened.value = false;
        }) 
    }, []);

    const submit = useCallback(() => {
        const amount = (integer?.value || 0) * 100 + (fraction.value || 0);
        const category = categoryId.value;
        const title = label.value;
        const projectId = props.projectId;
    
        if (projectId && category && title) {
            props
                .create(projectId, category, title, amount)
                .then(item => {
                    if (item) {
                        props.onCreate(item);
                        close();
                    }
                });
        }
    }, [props.projectId, props.create, props.onCreate]);

    useEffect(() => {
        if (!categoryId.value) {
            categoryId.value = props.categories[0]?.value;
        }
    }, [props.categories]);

    return (
        <>
            <Dialog
                headerTitle={props.title}
                opened={dialogOpened.value}
                onOpenedChanged={({ detail }) => {
                    dialogOpened.value = detail.value;
                }}
                footerRenderer={() => (
                    <>
                        <Button onClick={close}>
                            Отмена
                        </Button>
                        <Button
                            theme='primary'
                            onClick={submit}
                        >
                            Добавить
                        </Button>
                    </>
                )}
            >
                <BanksController>
                    {(payload) => {

                        if (payload.pending) {
                            return 'Loading'
                        }

                        const banks = payload.data.banks.map(item => ({
                            label: item.name,
                            value: item.id
                        }));

                        return (
                            <VerticalLayout className={st.layout}>
                                <HorizontalLayout theme="spacing" style={{ justifyContent: 'space-between' }}>
                                    <TextField
                                        style={{ flexGrow: 1 }}
                                        required
                                        label='Название'
                                        value={label.value}
                                        onChange={e => label.value = e.target.value.trim()}
                                    />
                                    <DatePicker label="Дата операции" />
                                </HorizontalLayout>

                                <HorizontalLayout theme="spacing" style={{ justifyContent: 'space-between' }}>
                                    <ComboBox
                                        required
                                        style={{ flexGrow: 1 }}
                                        label='Категория'
                                        items={props.categories}
                                        value={categoryId.value}
                                        onChange={e => categoryId.value = e.target.value}
                                    />

                                    <HorizontalLayout className={st.amount}>
                                        <NumberField
                                            required
                                            label='Сумма'
                                            theme='align-right'
                                            className={st.integer}
                                            placeholder='0'
                                            min={0}
                                            value={String(integer.value)}
                                            onChange={e => {
                                                const value = parseInt(e.target.value);

                                                if (value < 0) {
                                                    integer.value = 0;
                                                } else {
                                                    integer.value = value;
                                                }
                                            }}
                                        />
                                        <div className={st.separator}>.</div>
                                        <NumberField
                                            theme='align-right'
                                            className={st.fraction}
                                            placeholder='00'
                                            value={String(fraction.value)}
                                            onChange={e => {
                                                const value = parseInt(e.target.value);

                                                if (value < 0) {
                                                    fraction.value = 0;
                                                } else if (value > 99) {
                                                    fraction.value = 99;
                                                } else {
                                                    fraction.value = value;
                                                }
                                            }}
                                        />
                                    </HorizontalLayout>
                                </HorizontalLayout>

                                <hr/>
                                <h5 className={st.subtitle}>Отправитель</h5>

                                <HorizontalLayout theme="spacing" style={{ justifyContent: 'space-between' }}>
                                    <Select style={{ flexGrow: 1 }} label="Банк" items={banks} value={banks[0].value} />
                                    <NumberField style={{ flexGrow: 1 }} required label='Счет' />
                                </HorizontalLayout>

                                <hr/>
                                <h5 className={st.subtitle}>Получатель</h5>

                                <RadioGroup label="Тип лица">
                                    <RadioButton value="legal" label="Юридическое" />
                                    <RadioButton value="private" label="Физическое" />
                                </RadioGroup>

                                <HorizontalLayout theme="spacing" style={{ justifyContent: 'space-between' }}>
                                    <Select style={{ flexGrow: 1 }} label="Банк" items={banks} value={banks[0].value} />
                                    <NumberField style={{ flexGrow: 1 }} required label='Счет' />
                                </HorizontalLayout>

                                <HorizontalLayout theme="spacing" style={{ justifyContent: 'space-between' }}>
                                    <NumberField
                                    style={{ flexGrow: 1 }}
                                        required
                                        label='ИНН'
                                    />

                                    <NumberField
                                    style={{ flexGrow: 1 }}
                                        required
                                        label='Телефон'
                                    />
                                </HorizontalLayout>

                                <hr/>

                                <TextArea label='Комментарии' minRows={3} maxRows={5} />
                            </VerticalLayout>
                        );
                    }}
                </BanksController>
            </Dialog>

            <Button onClick={() => dialogOpened.value = true} theme={props.buttonText ? undefined : 'icon small'}>
                {props.buttonText || <Icon icon='lumo:plus' />}
            </Button>
        </>
    )
}