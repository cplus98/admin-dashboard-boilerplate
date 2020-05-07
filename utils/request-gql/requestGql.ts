import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { DocumentNode, print } from 'graphql';

export type OperationVariables = Record<string, any>;

export const requestGql = (url: string, query: DocumentNode, variables: OperationVariables = {}, msTimeout = 1000): Promise<AxiosResponse<any>> => {
	const option: AxiosRequestConfig = {
		url,
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		data: { query: print(query), variables },
		timeout: msTimeout,
	};

	return axios.request(option);
};
