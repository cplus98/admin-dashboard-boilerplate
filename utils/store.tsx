import _ from 'lodash';
import React, { useContext, useReducer } from 'react';

export interface Resolvers {
	[name: string]: (state: any, param?: any) => object;
}

export interface StoreContextType {
	store: any;
	dispatch: (action: string, param?: any) => void;
}

export interface StoreType {
	StoreProvider: any;
	useStore: any;
}

export interface StoreFunc {
	(): StoreContextType;
}

export const createStore = (resolvers: Resolvers, defaultValue: object) => {
	const StoreContext = React.createContext({});

	const reducer = (state: object, action: object) => action;

	const useStore = () => useContext(StoreContext) as StoreFunc;

	const StoreProvider = ({ children }: { children: any }) => {
		const [store, dispatchReducer]: [object, (state: object) => void] = useReducer(reducer, defaultValue);

		const dispatch = (action: string, param?: any) => {
			dispatchReducer(resolvers[action](store, param));
		};

		return <StoreContext.Provider value={{ store, dispatch }}>{children}</StoreContext.Provider>;
	};

	return { StoreProvider, useStore };
};

export const mergeState = (state: object, param: object): object => _.merge({}, state, param);

export const setState = (state: object, path: _.Many<string | number | symbol>, param: object): object => _.set(state, path, param);
