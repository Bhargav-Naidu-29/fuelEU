import { HttpClient } from '../../infrastructure/api/HttpClient';
import { RoutesApi } from '../../infrastructure/api/RoutesApi';
import { ComplianceApi } from '../../infrastructure/api/ComplianceApi';
import { BankingApi } from '../../infrastructure/api/BankingApi';
import { PoolingApi } from '../../infrastructure/api/PoolingApi';

const baseUrl = '/api'; // In a real app, this would come from env
const httpClient = new HttpClient(baseUrl);

export const routesApi = new RoutesApi(httpClient);
export const complianceApi = new ComplianceApi(httpClient);
export const bankingApi = new BankingApi(httpClient);
export const poolingApi = new PoolingApi(httpClient);
