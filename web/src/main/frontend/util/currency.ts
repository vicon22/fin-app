import Currency from "Frontend/generated/io/scrooge/data/currency/Currency";

enum Currencies {
    RUB = 'RUB',
    USD = 'USD',
    EUR = 'EUR'
};

export function getCurrencySign(currency: string | undefined) {
    const signs = {
        [Currencies.RUB]: '₽',
        [Currencies.USD]: '$',
        [Currencies.EUR]: '€'
    };

    console.log(currency, Object.keys(Currencies))

    if (currency) {
        if (Object.keys(Currencies).includes(currency)) {
            return signs[currency as Currencies];
        }
    }

    return undefined;
}

export function formatAmount(amount: number, currency: Currency | undefined) {
    if (!currency) {
        return null;
    }

    return new Intl.NumberFormat('ru', {
        style: 'currency',
        maximumFractionDigits: 2,
        currency: currency.value,
    }).format(amount / 100);
}