import React, { useCallback } from 'react';
import { gql, useRequestGql } from '@utils/request-gql';

const q = gql`
	query {
		users {
			email
		}
	}
`;

const graphqlUrl: string = process.env.GRAPHQL_URI || '';

const Index = () => {
	const onSucceed = useCallback((data: any): void => {
		console.log(data);
	}, []);

	const state = useRequestGql(graphqlUrl, q, {}, onSucceed, 1000);
	console.log(state);

	return (
		<div>
			<h1>
				<div>Hello, GraphQL!</div>
				<button
					type="button"
					onClick={async () => {
						state.refetch();
					}}>
					Hey
				</button>
				{/* <TestApp /> */}
			</h1>
		</div>
	);
};

export default Index;
