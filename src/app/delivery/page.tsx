'use client';

import React from 'react';
import { Truck } from 'lucide-react';
import { useCrm } from '@/context/CrmContext';

const deliveryTrips = [
  {
    id: 'TRIP-R4-01',
    route: 'R4 Gandhi Nagar',
    vehicle: 'Tata Ace (UP-80-BT-9120)',
    driver: 'Mahesh Kumar',
    totalDrops: 26,
    delivered: 11,
    pending: 15,
    valueToCollect: 21671,
    collectedSoFar: 14800,
    status: 'On Route',
    casesLoaded: 142,
  },
  {
    id: 'TRIP-R2-01',
    route: 'R2 Station Road',
    vehicle: 'Mahindra Bolero (UP-80-CT-4421)',
    driver: 'Rajesh Pal',
    totalDrops: 31,
    delivered: 28,
    pending: 3,
    valueToCollect: 34100,
    collectedSoFar: 31200,
    status: 'Almost Completed',
    casesLoaded: 210,
  },
  {
    id: 'TRIP-MT-01',
    route: 'MT Route (Modern Trade)',
    vehicle: 'Eicher 14ft (UP-80-E-8819)',
    driver: 'Satish Yadav',
    totalDrops: 6,
    delivered: 6,
    pending: 0,
    valueToCollect: 236400,
    collectedSoFar: 236400,
    status: 'Settled & Completed',
    casesLoaded: 380,
  },
];

export default function DeliveryFleetPage() {
  const { showAlert } = useCrm();

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-[16px] font-bold text-[#111827]">
            Delivery &amp; Fleet
          </h2>
          <p className="text-[12px] text-[#6b7280]">
            Dispatch planning, real-time proof of delivery (POD), and vehicle cost per case.
          </p>
        </div>

        <button
          onClick={() =>
            showAlert(
              'Trip Dispatch Planning',
              'Vehicle routing and gate pass generator opened. Ready to assign driver, vehicle number, and optimize retail outlet drop sequences.',
              'info'
            )
          }
          className="px-3 py-1.5 text-[12px] font-semibold bg-[#005f56] hover:bg-[#004e46] text-white rounded-[6px] flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Plan Dispatch Trip</span>
        </button>
      </div>

      {/* Fleet KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="erp-card p-3">
          <div className="text-[10px] text-[#6b7280] font-medium uppercase">Vehicles Dispatched</div>
          <div className="text-[18px] font-bold text-[#111827] mt-0.5">3 Vehicles</div>
          <div className="text-[10px] text-[#059669] font-medium">100% On-time Departure</div>
        </div>
        <div className="erp-card p-3">
          <div className="text-[10px] text-[#6b7280] font-medium uppercase">Total Drops</div>
          <div className="text-[18px] font-bold text-[#111827] mt-0.5">63 Drops</div>
          <div className="text-[10px] text-[#005f56] font-medium">45 Completed (71.4%)</div>
        </div>
        <div className="erp-card p-3">
          <div className="text-[10px] text-[#6b7280] font-medium uppercase">Cash Collected at Door</div>
          <div className="text-[18px] font-bold text-[#059669] mt-0.5">₹2.82L</div>
          <div className="text-[10px] text-[#6b7280]">OTP / Digital Verified</div>
        </div>
        <div className="erp-card p-3">
          <div className="text-[10px] text-[#6b7280] font-medium uppercase">Delivery Cost / Case</div>
          <div className="text-[18px] font-bold text-[#111827] mt-0.5">₹4.20</div>
          <div className="text-[10px] text-[#059669] font-medium">Benchmark: &lt; ₹5.00</div>
        </div>
      </div>

      {/* Trip Manifest Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {deliveryTrips.map((trip) => (
          <div key={trip.id} className="erp-card p-4 space-y-2.5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#005f56] bg-[#f0fdf4] px-1.5 py-0.2 rounded">
                  {trip.id}
                </span>
                <h3 className="text-[13px] font-bold text-[#111827] mt-1">
                  {trip.route}
                </h3>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  trip.status.includes('Completed')
                    ? 'bg-[#dcfce7] text-[#15803d]'
                    : 'bg-[#fef3c7] text-[#b45309]'
                }`}
              >
                {trip.status}
              </span>
            </div>

            <div className="p-2.5 bg-[#f9fafb] rounded-[6px] border border-[#f3f4f6] text-[11px] space-y-1 text-[#374151]">
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Vehicle:</span>
                <span className="font-semibold text-[#111827]">{trip.vehicle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Driver:</span>
                <span className="font-semibold text-[#111827]">{trip.driver}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Cases Loaded:</span>
                <span className="font-semibold text-[#005f56]">{trip.casesLoaded} Cases</span>
              </div>
            </div>

            {/* Progress bar */}
            <div>
              <div className="flex justify-between text-[11px] font-medium mb-1 text-[#4b5563]">
                <span>Progress: {trip.delivered} of {trip.totalDrops} drops</span>
                <span>{Math.round((trip.delivered / trip.totalDrops) * 100)}%</span>
              </div>
              <div className="w-full bg-[#f3f4f6] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#005f56] h-full rounded-full transition-all"
                  style={{ width: `${(trip.delivered / trip.totalDrops) * 100}%` }}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-[#f3f4f6] flex items-center justify-between text-[11px]">
              <div>
                <span className="text-[10px] text-[#6b7280] block">Collected at door:</span>
                <span className="font-bold text-[#059669]">₹{trip.collectedSoFar.toLocaleString()}</span>
              </div>
              <button
                onClick={() =>
                  showAlert(
                    `Trip Manifest · ${trip.id}`,
                    `Vehicle: ${trip.vehicle} | Driver: ${trip.driver}\nTotal Drops: ${trip.totalDrops} | Completed: ${trip.delivered} | Pending: ${trip.pending}`,
                    'info'
                  )
                }
                className="px-2.5 py-1 bg-[#f3f4f6] hover:bg-[#e5e7eb] text-[#374151] font-semibold rounded text-[11px] cursor-pointer"
              >
                View Drops
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
