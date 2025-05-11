import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { AutoGrid } from '@vaadin/hilla-react-crud';
import { useComputed, useSignal } from '@vaadin/hilla-react-signals';
import { TextField, VerticalLayout } from '@vaadin/react-components';
import AndFilter from 'Frontend/generated/com/vaadin/hilla/crud/filter/AndFilter';
import Matcher from 'Frontend/generated/com/vaadin/hilla/crud/filter/PropertyStringFilter/Matcher';
import { BankService } from 'Frontend/generated/endpoints';
import BankModel from 'Frontend/generated/io/scrooge/data/bank/BankModel';
import st from './Banks.module.css';

export const config: ViewConfig = {
  menu: { order: 5, icon: 'line-awesome/svg/university-solid.svg' },
  title: 'Банки',
  loginRequired: true,
};

export default function BanksView() {
    const nameFilterValue = useSignal('');

    const filter = useComputed<AndFilter>(() => {
        return {
            '@type': 'and',
            children: [
                {
                    propertyId: 'name',
                    filterValue: nameFilterValue.value,
                    matcher: Matcher.CONTAINS,
                    '@type': 'propertyString',
                },
            ],
        };
    });
    
    return (
        <VerticalLayout className={st.layout} theme='spacing padding'>
            <TextField
                className={st.search} 
                label='Поиск по названию'
                value={nameFilterValue.value}
                onValueChanged={(e) => {
                    nameFilterValue.value = e.detail.value;
                }}
            />
            <AutoGrid
                className={st.crud}
                service={BankService}
                model={BankModel}
                
                noHeaderFilters
                experimentalFilter={filter.value}
                columnOptions={{
                    name: { header: 'Название' },
                    reg: { header: 'Рег. номер' },
                    ogrn: { header: 'ОГРН' },
                }}
            />
        </VerticalLayout>
    );
}
