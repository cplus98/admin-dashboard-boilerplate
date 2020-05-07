import { DocumentNode } from 'graphql';
import { useState, useReducer, useEffect, useCallback } from 'react';
import { requestGql, OperationVariables } from './requestGql';

type State = {
	loading: boolean;
	error?: string;
	data?: any;
};

type Action = { type: 'request' } | { type: 'success'; result: any } | { type: 'failure'; error: string };

const reducer = (state: State, action: Action): State => {
	switch (action.type) {
		case 'request':
			return {
				loading: true,
			};

		case 'failure':
			return {
				loading: false,
				error: action.error,
			};

		case 'success':
			return {
				loading: false,
				data: action.result,
			};

		default:
			return state;
	}
};

export interface Callback {
	(data: any): void;
}

export const useRequestGql = (url: string, query: DocumentNode, variables: OperationVariables = {}, callback?: Callback, msTimeout = 1000) => {
	const [{ loading, error, data }, dispatch] = useReducer(reducer, { loading: false });

	const [defs, setDefs] = useState(variables);
	const [refetchVal, setRefetchVal] = useState(true);
	const refetch = useCallback((): void => {
		setRefetchVal(currentValue => !currentValue);
		setDefs(variables);
	}, [setRefetchVal, variables]);

	useEffect(() => {
		let ignore = false;

		dispatch({ type: 'request' });
		requestGql(url, query, defs, msTimeout)
			.then(results => {
				if (!ignore) {
					dispatch({ type: 'success', result: results });
					callback && callback(results);
				}
			})
			.catch(e => {
				dispatch({ type: 'failure', error: e });
			});

		return () => {
			ignore = true;
		};
	}, [query, url, msTimeout, refetchVal, defs, callback]);

	return { loading, error, data, refetch };
};

export const useManualRequestGql = (url: string, query: DocumentNode, variables: OperationVariables = {}, callback?: Callback, msTimeout = 1000) => {
	const [{ loading, error, data }, dispatch] = useReducer(reducer, { loading: false });

	const [defs, setDefs] = useState({});
	const [refetchVal, setRefetchVal] = useState(true);
	const refetch = useCallback((): void => {
		setRefetchVal(currentValue => !currentValue);
		setDefs(variables);
	}, [setRefetchVal, variables]);

	useEffect(() => {
		if (!defs) return () => {};

		let ignore = false;

		dispatch({ type: 'request' });
		requestGql(url, query, defs, msTimeout)
			.then(results => {
				if (!ignore) {
					dispatch({ type: 'success', result: results });
					callback && callback(results);
				}
			})
			.catch(e => {
				dispatch({ type: 'failure', error: e });
			});

		return () => {
			ignore = true;
		};
	}, [query, url, msTimeout, refetchVal, defs, callback]);

	return { loading, error, data, refetch };
};
