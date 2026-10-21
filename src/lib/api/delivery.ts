import { apiClient } from './client';

export interface DeliveryTrip {
  id: string;
  route: string;
  vehicle: string;
  driver: string;
  totalDrops: number;
  delivered: number;
  pending: number;
  valueToCollect: number;
  collectedSoFar: number;
  status: string;
  casesLoaded: number;
  tripDate: string;
}

export interface DeliveryFleetSummary {
  totalVehicles: number;
  totalDrops: number;
  completedDrops: number;
  completionPct: number;
  totalCollectedAtDoor: number;
  costPerCase: number;
}

export interface DeliveryFleetData {
  trips: DeliveryTrip[];
  summary: DeliveryFleetSummary;
}

export interface PlanTripInput {
  route: string;
  vehicle: string;
  driver: string;
  totalDrops: number;
  casesLoaded: number;
  valueToCollect: number;
}

export const deliveryApi = {
  getTrips: () => apiClient.get<DeliveryFleetData>('/delivery/trips'),
  planTrip: (data: PlanTripInput) => apiClient.post<{ message: string }>('/delivery/plan-trip', data),
};
