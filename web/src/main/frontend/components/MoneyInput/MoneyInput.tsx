import {useCallback, useEffect} from 'react';
import {useSignal} from '@vaadin/hilla-react-signals';
import {
    HorizontalLayout,
    NumberField,
} from '@vaadin/react-components';
import st from './moneyInput.module.css';
import {combineParts, getFraction, getInteger} from './utils';
import { ValueError } from '@vaadin/hilla-lit-form';

type MoneyInputProps = {
    disabled?: boolean;
    invalid?: boolean;
    errorMsg?: string;
    value: number;
    onChange: (value: number) => void;
};

export default function MoneyInput(props: MoneyInputProps) {
    const integer = useSignal<number | undefined>(getInteger(props.value || 0));
    const fraction = useSignal<number | undefined>(getFraction(props.value || 0));

    useEffect(() => {
        integer.value = getInteger(props.value || 0);
        fraction.value = getFraction(props.value || 0);
    }, [props.value]);

    const onChange = useCallback(() => {
        props.onChange(combineParts(integer.value || 0, fraction.value || 0))
    }, [props.onChange]);
   
    return (
        <HorizontalLayout className={st.wrapper}>
            <NumberField
                required
                disabled={props.disabled}
                label='Сумма'
                theme='align-right'
                invalid={props.invalid}
                errorMessage={props.errorMsg}
                className={st.integer}
                placeholder='0'
                min={0}
                value={String(integer.value)}
                onValueChanged={e => {
                    const value = parseInt(e.detail.value || '0');

                    if (value < 0) {
                        integer.value = 0;
                    } else {
                        integer.value = value;
                    }

                    onChange();
                }}
            />
            <div className={st.separator}>.</div>
            <NumberField
                disabled={props.disabled}
                invalid={props.invalid}
                theme='align-right'
                className={st.fraction}
                placeholder='00'
                value={String(fraction.value)}
                onValueChanged={e => {
                    const value = parseInt(e.detail.value || '0');

                    if (value < 0) {
                        fraction.value = 0;
                    } else if (value > 99) {
                        fraction.value = 99;
                    } else {
                        fraction.value = value;
                    }

                    onChange();
                }}
            />
        </HorizontalLayout>
    )
}
