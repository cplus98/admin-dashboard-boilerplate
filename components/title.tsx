import React from 'react';
import Router from 'next/router';
import styled, { DefaultTheme } from 'styled-components';

export const Title = styled.div`
	/* color: ${({ theme }: any) => theme.textColor}; */
	color: 'red';
	margin: 20px 0;
	font-size: 24pt;
`;

export default Title;
