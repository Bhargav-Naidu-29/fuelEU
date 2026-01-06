import { ApiClient } from '../../infrastructure/http/apiClient';
import { RoutesApi } from '../../infrastructure/api/RoutesApi';
import { ComplianceApi } from '../../infrastructure/api/ComplianceApi';
import { BankingApi } from '../../infrastructure/api/BankingApi';
import { PoolingApi } from '../../infrastructure/api/PoolingApi';

const httpClient = new ApiClient();

export const routesApi = new RoutesApi(httpClient);
export const complianceApi = new ComplianceApi(httpClient);
export const bankingApi = new BankingApi(httpClient);
export const poolingApi = new PoolingApi(httpClient);
