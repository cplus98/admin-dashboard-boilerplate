import gql from 'graphql-tag';
import { useRequestGql, useManualRequestGql } from './useRequestGql';
import { requestGql } from './requestGql';

const useQuery = useRequestGql;
const useManualQuery = useManualRequestGql;
const useMutation = useManualRequestGql;

export { gql, requestGql, useRequestGql, useManualRequestGql, useQuery, useManualQuery, useMutation };
