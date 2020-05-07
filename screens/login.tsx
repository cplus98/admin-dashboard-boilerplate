import React, { useEffect } from 'react';
import Router from 'next/router';
import styled, { DefaultTheme } from 'styled-components';
import { Typography, Drawer, Divider, List, ListItem, ListItemIcon, ListItemText, Container, TextField } from '@material-ui/core';
import { Button } from '@components/styled';
import { useAuth } from '@utils/auth';
import { SvgLogo } from '@res/svg';
import { useLocalization } from '@locales';

const Layout = styled.div`
	width: 500px;
`;

const StyledTextField = styled(TextField)`
	margin-bottom: 10px;
	width: 100%;
`;

export default () => {
	const { t } = useLocalization();
	const { auth, logIn, logOut } = useAuth();

	useEffect(() => {
		Router.replace('/');
	}, []);

	return (
		<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
			<div style={{ width: 500, marginTop: 30 }}>
				<div style={{ marginBottom: 10, textAlign: 'center', fontSize: 26 }}>
					<SvgLogo style={{ width: 40, height: 40 }} />
					<div>Log In</div>
				</div>
				<StyledTextField
					label={t('account.email')}
					inputProps={{
						maxLength: 20,
					}}
				/>
				<StyledTextField
					type="password"
					label={t('account.password')}
					inputProps={{
						maxLength: 20,
					}}
				/>
				<Button
					style={{ width: '100%', marginTop: 20 }}
					onClick={() => {
						logIn({
							id: 'id',
							token: 'token',
							expireTime: 1000,
							refreshToken: 'refreshToken',
							refreshTime: 1000,
						});
					}}>
					{t('account.login')}
				</Button>
			</div>
		</div>
	);
};
