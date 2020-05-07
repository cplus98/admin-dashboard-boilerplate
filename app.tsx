import _ from 'lodash';
import React, { useCallback, useContext, createContext } from 'react';
import { createStore, mergeState as mergeStateData, setState as setStateData, StoreType, StoreFunc, Resolvers } from '@utils/store';
import { useAppSettings } from '@utils/settings';

export const graphqlURI = process.env.GRAPHQL_URI || '';

// Global store
export let GlobalStore: StoreType;
export let useGlobalStore: StoreFunc;
export const mergeState = mergeStateData;
export const setState = setStateData;

export const createGlobalStore = () => {
	GlobalStore = createStore(resolvers || {}, defaults || {});
	useGlobalStore = GlobalStore.useStore;
};

// Customize global-store-defaults your own.
const defaults = {
	temp: {},
	account: {},
};

// Customize global-resolvers your own.
const resolvers = {};

// Customize themes your own.
export interface ThemePropsType {
	textColor: string;
	backgroundColor: string;
	barStyle: string;
}

export interface ThemesType<ThemePropsType> {
	default: ThemePropsType;
	dark: ThemePropsType;
}

export const themes: ThemesType<ThemePropsType> = {
	default: {
		textColor: '#000',
		backgroundColor: '#fff',
		barStyle: 'light-content',
	},
	dark: {
		textColor: '#fff',
		backgroundColor: '#000',
		barStyle: 'dark-content',
	},
};

export const useDarkMode = (): [boolean, (darkMode: boolean) => void] => {
	const { settings, setSettings }: any = useAppSettings();
	const { darkMode } = settings || false;

	const setDarkMode = useCallback(
		(isDarkMode: boolean) => {
			if (darkMode === isDarkMode) return;

			const newOption = _.merge({}, settings, { darkMode: isDarkMode });
			setSettings(newOption);
		},
		[darkMode, setSettings, settings],
	);

	return [darkMode, setDarkMode];
};
