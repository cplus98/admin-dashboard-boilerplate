import _ from 'lodash';
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import Router from 'next/router';
import styled from 'styled-components';
import { TextField, Snackbar } from '@material-ui/core';
import { Button } from '@components/styled';
import * as StringUtil from '@utils/string-util';
import { useAuth } from '@utils/auth';
import { Title } from '@components/title';
import { gql, useManualQuery, useMutation } from '@utils/request-gql';
import { graphqlURI } from 'app';
import { useLocalization } from '@locales';

const MIN_NAME_LENGTH = 4;
const MIN_PASSWORD_LENGTH = 4;

const Content = styled.div`
	background-color: 'orange';
	justify-content: center;
	display: flex;
	flex-direction: column;
	width: 300px;
`;

const StyledTextField = styled(TextField)`
	margin-bottom: 10px;
`;

const StyledButton = styled(Button)`
	margin: 30px 80px 0px 0px;
`;

const gqlCreateUser = gql`
	mutation CreateUser($email: String!, $username: String!, $password: String!) {
		createUser(email: $email, username: $username, password: $password) {
			email
		}
	}
`;

const gqlValidationEmail = gql`
	query ValidationEmail($email: String!) {
		validationEmail(email: $email)
	}
`;

export default () => {
	// If signed in, Redirect to the root page.
	const { auth } = useAuth();
	const signedIn = useMemo(() => !_.isEmpty(auth?.id), [auth]);
	useEffect(() => {
		if (signedIn) Router.replace('/');
	}, [signedIn]);
	if (signedIn) return <></>;

	const { t } = useLocalization();

	const [openSnackbar, setOpenSnackbar] = useState(false);

	const [email, setEmail] = useState('');
	const [name, setName] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const [checkedValidEmail, setCheckedValidEmail] = useState(false);
	const [validEmail, setValidEmail] = useState('');
	const [validName, setValidName] = useState('');
	const [validPassword, setValidPassword] = useState('');
	const [validConfirmPassword, setValidConfirmPassword] = useState('');

	const CheckValidEmail = useCallback(() => {
		if (!StringUtil.validateEmail(email)) {
			setValidEmail(t('account.invalidEmail'));
			return false;
		}
		return true;
	}, [email, t]);

	const CheckValidName = useCallback(() => {
		if (name.length < MIN_NAME_LENGTH) {
			setValidName(t('account.shortName'));
			return false;
		}
		return true;
	}, [name.length, t]);

	const CheckValidPassword = useCallback(() => {
		if (password.length < MIN_PASSWORD_LENGTH) {
			setValidPassword(t('account.shortPassword'));
			return false;
		}
		return true;
	}, [password.length, t]);

	const CheckValidConfirmPassword = useCallback(() => {
		if (confirmPassword.length < MIN_PASSWORD_LENGTH || password !== confirmPassword) {
			setValidConfirmPassword(t('account.incorrectPassword'));
			return false;
		}
		return true;
	}, [confirmPassword, password, t]);

	const { refetch: refetchValidationEmail } = useManualQuery(
		graphqlURI,
		gqlValidationEmail,
		{ email },
		useCallback(
			(data: any): void => {
				const validationEmail = data.data?.data?.validationEmail || false;
				if (validationEmail) {
					setValidEmail(t('account.usedEmail'));
					setCheckedValidEmail(false);
				}
				setCheckedValidEmail(true);
			},
			[t],
		),
	);

	const { loading, error, refetch } = useMutation(
		graphqlURI,
		gqlCreateUser,
		{
			email,
			username: name,
			password,
		},
		useCallback((data: any): void => {
			const { errors: resErrors } = data.data;

			if (resErrors) {
				_.map(resErrors, (e) => {
					const { code } = e?.extensions;
					if (code === 'USER_ALREADY_EXISTS') {
						setCheckedValidEmail(false);
						setValidEmail('This email is already used.');
					}
				});
				return;
			}

			// Go to sign in with email.
			Router.replace('/users/signin/email');
		}, []),
	);

	if (error) {
		console.log(error);
	}

	const refTextFieldName = useRef();
	const refTextFieldPassword = useRef();
	const refTextFieldConfirmPassword = useRef();

	return (
		<>
			<Snackbar
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
				open={openSnackbar}
				autoHideDuration={4000}
				onClose={() => {
					setOpenSnackbar(false);
				}}
			/>
			<Title>{t('account.create')}</Title>
			<Content>
				<StyledTextField
					label={t('account.email')}
					inputProps={{
						maxLength: 20,
					}}
					onChange={(evt) => {
						setValidEmail('');
						setEmail(evt.target.value);
					}}
					onBlur={(evt) => {
						if (CheckValidEmail()) {
							refetchValidationEmail();
						}
					}}
					error={!_.isEmpty(validEmail)}
					helperText={validEmail}
				/>
				<StyledTextField
					label={t('account.name')}
					inputProps={{
						maxLength: 30,
					}}
					onChange={(evt) => {
						setValidName('');
						setName(evt.target.value);
					}}
					onBlur={(evt) => {
						CheckValidName();
					}}
					error={!_.isEmpty(validName)}
					helperText={validName}
					inputRef={refTextFieldName}
				/>
				<StyledTextField
					type="password"
					label={t('account.password')}
					inputProps={{
						maxLength: 20,
					}}
					onChange={(evt) => {
						setValidPassword('');
						setPassword(evt.target.value);
					}}
					onBlur={(evt) => {
						CheckValidPassword();
					}}
					error={!_.isEmpty(validPassword)}
					helperText={validPassword}
					inputRef={refTextFieldPassword}
				/>
				<StyledTextField
					type="password"
					label={t('account.confirmPassword')}
					inputProps={{
						maxLength: 20,
					}}
					onChange={(evt) => {
						setValidConfirmPassword('');
						setConfirmPassword(evt.target.value);
					}}
					onBlur={(evt) => {
						CheckValidConfirmPassword();
					}}
					error={!_.isEmpty(validConfirmPassword)}
					helperText={validConfirmPassword}
					inputRef={refTextFieldConfirmPassword}
				/>
				<StyledButton
					type="button"
					disabled={loading}
					onClick={() => {
						let isValid = true;
						isValid = CheckValidEmail() && checkedValidEmail;
						isValid = CheckValidName() && isValid;
						isValid = CheckValidPassword() && isValid;
						isValid = CheckValidConfirmPassword() && isValid;

						if (isValid) {
							refetch();
						}
					}}>
					{t('account.create')}
				</StyledButton>
			</Content>
		</>
	);
};
