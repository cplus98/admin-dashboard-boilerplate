import React, { useState, useEffect, useMemo } from 'react';
import Router from 'next/router';
import { AppContext, AppInitialProps } from 'next/app';
import styled, { ThemeProvider, ThemeContext } from 'styled-components';
import { StylesProvider } from '@material-ui/styles';
import { AppSettingsProvider } from '@utils/settings';
import { useAuth } from '@utils/auth';
import { initLocalization } from '@locales';
import LoginScreen from 'screens/login';
import Layout from 'components/layout';
import { createGlobalStore, themes, GlobalStore, useGlobalStore, mergeState, setState, useDarkMode } from 'app';

// Initilize global store
createGlobalStore();

const AppContainer = ({ Component, pageProps }: any) => {
	const [isInitialized, setInitialized] = useState(false);

	const { auth, logIn, logOut } = useAuth();

	// Get theme type
	const [isDarkMode] = useDarkMode();
	const theme = useMemo(() => {
		const themeName = isDarkMode ? 'dark' : 'default';
		return themes[themeName] || {};
	}, [isDarkMode]);

	// useEffect(() => {
	// 	if (!auth?.token) {
	// 		Router.push('/login');
	// 		console.log('redirect to login.');
	// 	}
	// }, [auth]);

	useEffect(() => {
		const removeServerCSS = () => {
			// Remove the server-side injected CSS.
			const jssStyles = document.querySelector('#jss-server-side');
			if (jssStyles) {
				jssStyles.parentNode!.removeChild(jssStyles);
			}
		};

		(async () => {
			removeServerCSS();

			await initLocalization();

			// await registedAppSettings.onInitEssential();

			// Initialize completed
			setInitialized(true);
		})();
	}, []);

	if (!isInitialized) return <></>;

	return (
		<StylesProvider injectFirst>
			<ThemeProvider theme={theme}>
				{!auth ? (
					<LoginScreen />
				) : (
					<Layout>
						<Component {...pageProps} theme={theme} />
					</Layout>
				)}

				<style jsx global>
					{`
						body {
							background: ${theme.backgroundColor};
							color: ${theme.textColor};
							margin: 0;
							padding: 0;
							font-family: 'Arial';
							font-size: 18px;
							font-weight: 400;
							line-height: 1.8;
						}
						form {
							display: flex;
							flex-flow: column;
						}
						h1 {
							font-weight: 700;
						}
						p {
							margin-bottom: 10px;
						}
					`}
				</style>
			</ThemeProvider>
		</StylesProvider>
	);
};

const App = ({ Component, pageProps }: AppContext & AppInitialProps) => (
	<GlobalStore.StoreProvider>
		<AppSettingsProvider>
			<AppContainer Component={Component} pageProps={pageProps} />
		</AppSettingsProvider>
	</GlobalStore.StoreProvider>
);

export default App;
