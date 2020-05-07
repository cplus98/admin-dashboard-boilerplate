import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import React, { useState, useReducer, useEffect, useContext, useCallback, useRef } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { Button, TextField } from '@material-ui/core';
import styled from 'styled-components';
import { gql, useAuthQuery, useAuth } from '@utils/auth';
import { graphqlURI } from 'app';
import { useLocalization } from '@locales';
import { Title } from '@components/title';

const Content = styled.div`
	background-color: ${({ theme }: any) => theme.backgroundColor};
	flex: 1;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

const gqlGetUser = gql`
	query GetUser($token: String!, $email: String, $id: String, $type: LoginType) {
		auth(token: $token)
		getUser(email: $email, id: $id, type: $type) {
			id
			email
			username
		}
	}
`;

const StyledButton = styled(Button)`
	&& {
		background-color: orange;
		color: inherit;
		margin-left: 30px;
	}
`;

const Index = () => {
	const { t, changeLanguage } = useLocalization();

	const { loading, error, refetch } = useAuthQuery(
		graphqlURI,
		gqlGetUser,
		{ email: 'test1@t.com' },
		useCallback((data: any): void => {
			console.log('WOW', data.data?.data);
		}, []),
	);

	const [testName, setTestName] = useState('11111');

	return (
		<>
			<div style={{ flex: 1, backgroundColor: 'orange' }}>
				<Content>
					<Title>{t('hello')}</Title>
					<button
						type="button"
						onClick={async () => {
							setTestName(testName === '11111' ? '22222' : '11111');
						}}>
						{testName}
					</button>
				</Content>
			</div>
		</>
	);
};

export default Index;
