/**
 * Authentication token management.
 */

import _ from 'lodash';
import { useCallback, useMemo } from 'react';
import { useAppSettings } from '@utils/settings';

export interface TokensType {
	token: string;
	expireTime: number;
	refreshToken: string;
	refreshTime: number;
}

export interface AuthInfoType extends TokensType {
	id: string;
}

export const useAuth = () => {
	const { settings, setSettings } = useAppSettings();

	const auth = useMemo((): AuthInfoType => settings?.auth, [settings]);

	const logIn = useCallback(
		(tokens: AuthInfoType) => {
			setSettings((s: any) => _.merge({}, s, { auth: tokens }));
		},
		[setSettings],
	);

	const logOut = useCallback(() => {
		setSettings((s: any) => _.omit(s, 'auth'));
	}, [setSettings]);

	const refreshTokens = useCallback(
		(tokens: TokensType) => {
			setSettings((s: any) => {
				const newTokens: TokensType = {
					token: tokens.token,
					expireTime: tokens.expireTime,
					refreshToken: tokens.refreshToken,
					refreshTime: tokens.refreshTime,
				};

				return _.merge({}, s, { auth: newTokens });
			});
		},
		[setSettings],
	);

	return { auth, logIn, logOut, refreshTokens };
};
