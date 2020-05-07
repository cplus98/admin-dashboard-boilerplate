import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider, ThemeContext } from 'styled-components';
import { useLocalization } from '@locales';

const Error = (props: any) => {
	const { theme } = props;
	const { t } = useLocalization();

	return (
		<div>
			<h1>{t('error.404')}</h1>
		</div>
	);
};

export default Error;
