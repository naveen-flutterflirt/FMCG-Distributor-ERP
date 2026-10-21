import { apiClient } from './client';

export interface SettingsData {
  id: string;
  distributorName: string;
  depotAddress: string;
  contactPhone: string;
  contactEmail: string;
  gstin: string;
  fssaiLicence: string;
  panNumber: string;
  ewayThreshold: number;
  mandatoryVanSettle: boolean;
  creditCeilingEnforce: boolean;
  periodLockMonth: string;
  connectors: {
    compA: boolean;
    compB: boolean;
    compC: boolean;
    tally: boolean;
  };
  updatedAt?: string;
}

export const settingsApi = {
  get: async () => {
    return apiClient.get<SettingsData>('/settings');
  },

  update: async (data: Partial<SettingsData>) => {
    return apiClient.put<{ message: string }>('/settings', data);
  }
};
