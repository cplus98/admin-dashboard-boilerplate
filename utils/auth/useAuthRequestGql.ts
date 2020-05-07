/**
 * Requests graphQL with auto refreshed access token.
 */

import _ from 'lodash';
import { DocumentNode } from 'graphql';
import { useState, useEffect, useCallback, useReducer } from 'react';
import { gql, requestGql } from '@utils/request-gql';
import { OperationVariables } from '@utils/request-gql/requestGql';
import { TokensType, useAuth } from './useAuth';

export interface Callback {
	(data: any, isTokenRefreshed: boolean): void;
}

const gqlRefreshLoginToken = gql`
	query refreshTokens($accessToken: String!, $refreshToken: String!) {
		sign {
			refreshTokens(accessToken: $accessToken, refreshToken: $refreshToken) {
				token
				expireTime
				refreshToken
				refreshTime
			}
		}
	}
`;

type State = {
	loading: boolean;
	error?: string;
	data?: any;
};

type Action = { type: 'request' } | { type: 'refreshToken' } | { type: 'success'; result: any } | { type: 'failure'; error: string };

const reducer = (state: State, action: Action): State => {
	switch (action.type) {
		case 'request':
			return {
				loading: true,
			};

		case 'refreshToken':
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

const useAuthRequestGql = (url: string, query: DocumentNode, variables: OperationVariables = {}, callback?: Callback, msTimeout = 3000) => {
	const { auth, refreshTokens } = useAuth();
	const { token: accessToken, refreshToken, id } = auth || {};

	const [{ loading, error, data }, dispatch] = useReducer(reducer, { loading: false });

	const [defs, setDefs] = useState(variables);
	const [refetchVal, setRefetchVal] = useState(true);
	const refetch = useCallback((): void => {
		setRefetchVal((currentValue) => !currentValue);
		setDefs(variables);
	}, [setRefetchVal, variables]);

	useEffect(() => {
		(async () => {
			dispatch({ type: 'request' });
			if (auth === undefined) return;

			let results: any = {};

			// Requests original gql.
			try {
				dispatch({ type: 'refreshToken' });
				results = await requestGql(url, query, { token: accessToken, id, ...defs }, msTimeout);
			} catch (e) {
				dispatch({ type: 'failure', error: e });
				return;
			}

			// Check if refresh token has expired.
			const { errors: resErrors } = results.data;
			if (resErrors) {
				let isTokenRefreshed = false;

				// Find token expired error.
				_.every(resErrors, async (err) => {
					if (err?.extensions?.code === 'TOKEN_EXPIRED') {
						let refreshedAccessToken = '';

						// Refresh tokens.
						try {
							results = await requestGql(url, gqlRefreshLoginToken, { accessToken, refreshToken }, msTimeout);
							if (results.data?.errors) {
								callback && callback(results, true);
								return false;
							}

							// Store tokens
							refreshedAccessToken = results.data?.data?.sign.refreshTokens.token;
							const newTokens: TokensType = {
								token: refreshedAccessToken,
								expireTime: results.data?.data?.sign.refreshTokens.expireTime,
								refreshToken: results.data?.data?.sign.refreshTokens.refreshToken,
								refreshTime: results.data?.data?.sign.refreshTokens.refreshTime,
							};
							refreshTokens(newTokens);

							isTokenRefreshed = true;
						} catch (e) {
							dispatch({ type: 'failure', error: e });
							isTokenRefreshed = true;
							return false;
						}

						// Re-requests original gql.
						try {
							results = await requestGql(url, query, { token: refreshedAccessToken, id, ...defs }, msTimeout);
							dispatch({ type: 'success', result: results });
							callback && callback(results, false);
						} catch (e) {
							dispatch({ type: 'failure', error: e });
							return false;
						}

						return false;
					}
					return true;
				});

				if (!isTokenRefreshed) {
					dispatch({ type: 'success', result: results });
					callback && callback(results, false);
				}
			} else {
				dispatch({ type: 'success', result: results });
				callback && callback(results, false);
			}
		})();
	}, [query, url, msTimeout, refetchVal, defs, callback, accessToken, refreshToken, refreshTokens, id, auth]);

	return { loading, error, data, refetch };
};

const useManualAuthRequestGql = (url: string, query: DocumentNode, variables: OperationVariables = {}, callback?: Callback, msTimeout = 3000) => {
	const { auth, refreshTokens } = useAuth();
	const { token: accessToken, refreshToken, id } = auth || {};

	const [{ loading, error, data }, dispatch] = useReducer(reducer, { loading: false });

	const [defs, setDefs] = useState<object>();
	const [refetchVal, setRefetchVal] = useState(true);
	const refetch = useCallback((): void => {
		setRefetchVal((currentValue) => !currentValue);
		setDefs(variables);
	}, [setRefetchVal, variables]);

	useEffect(() => {
		(async () => {
			if (!defs) return;
			if (auth === undefined) return;

			dispatch({ type: 'request' });

			let results: any = {};

			// Requests original gql.
			try {
				dispatch({ type: 'refreshToken' });
				results = await requestGql(url, query, { token: accessToken, id, ...defs }, msTimeout);
			} catch (e) {
				dispatch({ type: 'failure', error: e });
				return;
			}

			// Check if refresh token has expired.
			const { errors: resErrors } = results.data;
			if (resErrors) {
				let isTokenRefreshed = false;

				// Find token expired error.
				_.every(resErrors, async (err) => {
					if (err?.extensions?.code === 'TOKEN_EXPIRED') {
						let refreshedAccessToken = '';

						// Refresh tokens.
						try {
							results = await requestGql(url, gqlRefreshLoginToken, { accessToken, refreshToken }, msTimeout);
							if (results.data?.errors) {
								callback && callback(results, true);
								return false;
							}

							// Store tokens
							refreshedAccessToken = results.data?.data?.sign.refreshTokens.token;
							const newTokens: TokensType = {
								token: refreshedAccessToken,
								expireTime: results.data?.data?.sign.refreshTokens.expireTime,
								refreshToken: results.data?.data?.sign.refreshTokens.refreshToken,
								refreshTime: results.data?.data?.sign.refreshTokens.refreshTime,
							};
							refreshTokens(newTokens);

							isTokenRefreshed = true;
						} catch (e) {
							dispatch({ type: 'failure', error: e });
							isTokenRefreshed = true;
							return false;
						}

						// Re-requests original gql.
						try {
							results = await requestGql(url, query, { token: refreshedAccessToken, id, ...defs }, msTimeout);
							dispatch({ type: 'success', result: results });
							callback && callback(results, false);
						} catch (e) {
							dispatch({ type: 'failure', error: e });
							return false;
						}

						return false;
					}
					return true;
				});

				if (!isTokenRefreshed) {
					dispatch({ type: 'success', result: results });
					callback && callback(results, false);
				}
			} else {
				dispatch({ type: 'success', result: results });
				callback && callback(results, false);
			}
		})();
	}, [query, url, msTimeout, defs, callback, accessToken, refreshToken, refreshTokens, id, auth]);

	return { loading, error, data, refetch };
};

const useAuthQuery = useAuthRequestGql;
const useManualAuthQuery = useManualAuthRequestGql;
const useAuthMutation = useManualAuthRequestGql;

export { gql, requestGql, useAuthRequestGql, useManualAuthRequestGql, useAuthQuery, useManualAuthQuery, useAuthMutation };
