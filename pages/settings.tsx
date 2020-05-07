import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { DocumentNode, print } from 'graphql';
import React, { useState, useReducer, useEffect, useContext, useCallback, useRef } from 'react';
import styled, { DefaultTheme } from 'styled-components';
import Link from 'next/link';
import { FormControlLabel, MenuItem } from '@material-ui/core';
import Router from 'next/router';
import { Select, Switch } from '@components/styled';
import { Title } from 'components/title';
import { ThemePropsType, useDarkMode, useGlobalStore, setState, mergeState, graphqlURI } from 'app';
import { useLocalization } from '@locales';

const Content = styled.div`
	background-color: ${({ theme }: any) => theme.backgroundColor};
	flex: 1;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

const LanguageSelector = () => {
	const { t, changeLanguage, language } = useLocalization();
	const [lang, setLang] = useState(language);

	return (
		<div>
			<Select
				labelId="demo-simple-select-label"
				id="demo-simple-select"
				value={lang}
				onChange={({ target }: any) => {
					setLang(target.value);
					changeLanguage(target.value);
				}}>
				<MenuItem value="kr">kr</MenuItem>
				<MenuItem value="en">en</MenuItem>
			</Select>
			{t('languageSettings')}
		</div>
	);
};

export default () => {
	const [isDarkMode, setDarkMode] = useDarkMode();
	const { t, changeLanguage } = useLocalization();

	return (
		<>
			<Title>{t('settings')}</Title>
			<FormControlLabel
				label="Dark Mode"
				control={
					<Switch
						checked={isDarkMode}
						onChange={() => {
							setDarkMode(!isDarkMode);
						}}
					/>
				}
			/>
			<LanguageSelector />
		</>
	);
};
