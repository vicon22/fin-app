import {ReactNode, useCallback, useEffect, useState} from 'react';
import {BankEndpoint} from 'Frontend/generated/endpoints';
import { useParams } from 'react-router';
import Bank from 'Frontend/generated/io/scrooge/data/bank/Bank';

type BanksControllerProps = {
    children: (payload: {
        error: boolean;
        pending: boolean;
        data: {
            banks: Bank[]
        }
    }) => ReactNode;
};

export default function BanksController(props: BanksControllerProps) {
    const {projectId} = useParams();
    const [error, setError] = useState<boolean>(false);
    const [pending, setPending] = useState<boolean>(true);
    const [banks, setBanks] = useState<Bank[]>([]);

    const fetchData = useCallback(async () => {
        const banksResp = await BankEndpoint.getAll()
        
        setBanks((banksResp || []).filter(item => !!item));
    }, []);

    useEffect(() => {
        fetchData()
            .catch(() => {
                setError(true);
            })
            .finally(() => {
                setPending(false)
            })
    }, [projectId]);

    return (
        props.children({
            error,
            pending,
            data: {
                banks
            }
        })
    );
}
