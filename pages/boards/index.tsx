import React from 'react';
import Router from 'next/router';
import styled, { DefaultTheme } from 'styled-components';

import { Title } from '@components/title';

const Content = styled.div`
	background-color: 'orange';
	/* flex: 1; */
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

export default () => (
	<>
		<Title>Boards</Title>
	</>
);
