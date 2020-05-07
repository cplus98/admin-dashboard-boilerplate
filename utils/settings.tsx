import React, { createContext, useContext, useCallback } from 'react';
import { useLocalStorage } from 'react-use';

const settingsTag = 'settings';

interface SettingsType {
	settings: {};
	setSettings: (newSettings: any) => void;
	resetSettings: (defaultSettings: any) => void;
}

const createSettingsContext = () => {
	const SettingsContext = createContext({});

	const useAppSettings: () => SettingsType = () => useContext(SettingsContext) as any;

	const AppSettingsProvider = ({ children }: { children: any }) => {
		const [settings, setSettings] = useLocalStorage(settingsTag, {});

		const resetSettings = useCallback(
			(defaultSettings: object = {}) => {
				setSettings(defaultSettings);
			},
			[setSettings],
		);

		return <SettingsContext.Provider value={{ settings, setSettings, resetSettings }}>{children}</SettingsContext.Provider>;
	};

	return { AppSettingsProvider, useAppSettings };
};

export const { AppSettingsProvider, useAppSettings }: any = createSettingsContext();

export const getAppSettings = () => window.localStorage.getItem(settingsTag);
