import React from 'react';
import Router from 'next/router';
import styled, { DefaultTheme } from 'styled-components';

const Content = styled.div`
	background-color: ${({ theme }: any) => theme.backgroundColor};
	flex: 1;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

const Title = styled.div`
	color: ${({ theme }: any) => theme.textColor};
`;

const Index = () => (
	<Content>
		<Title>Test Component!</Title>
		<button
			type="button"
			onClick={() => {
				Router.push('/');
			}}>
			Home
		</button>
	</Content>
);

export default Index;
