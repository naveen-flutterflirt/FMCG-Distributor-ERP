'use client';

import React, { useState, useEffect } from 'react';
import { Truck, RefreshCw, Loader2, CheckCircle2, Clock, Plus, MapPin, X } from 'lucide-react';
import { useCrm } from '@/context/CrmContext';
import { deliveryApi, DeliveryTrip, DeliveryFleetSummary } from '@/lib/api';

export default function DeliveryFleetPage() {
  const { showAlert } = useCrm();

  const [trips, setTrips] = useState<DeliveryTrip[]>([]);
  const [summary, setSummary] = useState<DeliveryFleetSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal State for Dispatch Planning
  const [modalOpen, setModalOpen] = useState(false);
  const [route, setRoute] = useState('R1 Civil Lines');
  const [vehicle, setVehicle] = useState('Tata Ace (UP-80-BT-9120)');
  const [driver, setDriver] = useState('Ramesh Kumar');
  const [totalDrops, setTotalDrops] = useState('22');
  const [casesLoaded, setCasesLoaded] = useState('150');
  const [valueToCollect, setValueToCollect] = useState('28500');
  const [submitting, setSubmitting] = useState(false);

  // Fetch live delivery trips from Neon PostgreSQL
  const fetchTrips = async () => {
    try {
      setLoading(true);
      const res = await deliveryApi.getTrips();
      if (res.data) {
        setTrips(res.data.trips);
        setSummary(res.data.summary);
      }
    } catch (err: any) {
      console.error('Failed to load trips:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handlePlanTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await deliveryApi.planTrip({
        route,
        vehicle,
        driver,
        totalDrops: parseInt(totalDrops, 10),
        casesLoaded: parseInt(casesLoaded, 10),
        valueToCollect: parseFloat(valueToCollect),
      });

      if (res.success) {
        showAlert('Trip Dispatched!', res.message || 'New delivery manifest created.', 'success');
        setModalOpen(false);
        fetchTrips();
      }
    } catch (err: any) {
      showAlert('Planning Error', err.message || 'Failed to dispatch trip', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-[16px] font-bold text-[#111827]">
            Delivery &amp; Fleet (Live Neon DB)
          </h2>
          <p className="text-[12px] text-[#6b7280]">
            Dispatch planning, real-time proof of delivery (POD), and vehicle cost per case.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchTrips}
            title="Refresh Fleet Trips"
            className="p-1.5 bg-white border border-slate-300 rounded-[6px] text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="px-3 py-1.5 text-[12px] font-semibold bg-[#005f56] hover:bg-[#004e46] text-white rounded-[6px] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Plan Dispatch Trip</span>
          </button>
        </div>
      </div>

      {/* Fleet KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="erp-card p-3 bg-white border border-slate-200 rounded-lg shadow-2xs">
          <div className="text-[10px] text-[#6b7280] font-medium uppercase">Vehicles Dispatched</div>
          <div className="text-[18px] font-bold text-[#111827] mt-0.5">
            {summary?.totalVehicles || trips.length} Vehicles
          </div>
          <div className="text-[10px] text-[#059669] font-medium">100% On-time Departure</div>
        </div>

        <div className="erp-card p-3 bg-white border border-slate-200 rounded-lg shadow-2xs">
          <div className="text-[10px] text-[#6b7280] font-medium uppercase">Total Drops</div>
          <div className="text-[18px] font-bold text-[#111827] mt-0.5">
            {summary?.totalDrops || 0} Drops
          </div>
          <div className="text-[10px] text-[#005f56] font-medium">
            {summary?.completedDrops || 0} Completed ({summary?.completionPct || 0}%)
          </div>
        </div>

        <div className="erp-card p-3 bg-white border border-slate-200 rounded-lg shadow-2xs">
          <div className="text-[10px] text-[#6b7280] font-medium uppercase">Cash Collected at Door</div>
          <div className="text-[18px] font-bold text-[#059669] mt-0.5 font-mono">
            ₹{((summary?.totalCollectedAtDoor || 0) / 100000).toFixed(2)}L
          </div>
          <div className="text-[10px] text-[#6b7280]">OTP / Digital Verified</div>
        </div>

        <div className="erp-card p-3 bg-white border border-slate-200 rounded-lg shadow-2xs">
          <div className="text-[10px] text-[#6b7280] font-medium uppercase">Delivery Cost / Case</div>
          <div className="text-[18px] font-bold text-[#111827] mt-0.5 font-mono">
            ₹{(summary?.costPerCase || 4.2).toFixed(2)}
          </div>
          <div className="text-[10px] text-[#059669] font-medium">Benchmark: &lt; ₹5.00</div>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="p-12 erp-card bg-white flex flex-col items-center justify-center text-slate-500">
          <Loader2 className="w-6 h-6 animate-spin text-[#005f56] mb-2" />
          <span className="text-xs">Loading active vehicle fleet manifests from database...</span>
        </div>
      ) : trips.length === 0 ? (
        <div className="p-12 erp-card bg-white text-center text-slate-500 text-xs">
          No delivery trips active today. Click &quot;Plan Dispatch Trip&quot; to assign a vehicle route.
        </div>
      ) : (
        /* Trip Manifest Cards */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {trips.map((trip) => (
            <div key={trip.id} className="erp-card bg-white border border-slate-200 rounded-lg p-4 space-y-2.5 shadow-2xs">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#005f56] bg-[#f0fdf4] px-1.5 py-0.5 rounded font-mono">
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
                  <span>{trip.totalDrops > 0 ? Math.round((trip.delivered / trip.totalDrops) * 100) : 0}%</span>
                </div>
                <div className="w-full bg-[#f3f4f6] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#005f56] h-full rounded-full transition-all"
                    style={{
                      width: `${trip.totalDrops > 0 ? (trip.delivered / trip.totalDrops) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-[#f3f4f6] flex items-center justify-between text-[11px]">
                <div>
                  <span className="text-[10px] text-[#6b7280] block">Collected at door:</span>
                  <span className="font-bold text-[#059669] font-mono">₹{trip.collectedSoFar.toLocaleString()}</span>
                </div>
                <button
                  onClick={() =>
                    showAlert(
                      `Trip Manifest · ${trip.id}`,
                      `Vehicle: ${trip.vehicle}\nDriver: ${trip.driver}\nTotal Drops: ${trip.totalDrops}\nCompleted: ${trip.delivered}\nPending Drops: ${trip.pending}\nCollected: ₹${trip.collectedSoFar.toLocaleString()}`,
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
      )}

      {/* Plan Dispatch Trip Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#005f56]" />
                <h3 className="font-bold text-sm text-slate-800">Plan &amp; Dispatch Vehicle Trip</h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePlanTrip} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Assigned Route</label>
                <select
                  value={route}
                  onChange={(e) => setRoute(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-[#005f56] focus:outline-none"
                >
                  <option value="R1 Civil Lines">R1 Civil Lines</option>
                  <option value="R2 Station Road">R2 Station Road</option>
                  <option value="R3 Old Market">R3 Old Market</option>
                  <option value="R4 Gandhi Nagar">R4 Gandhi Nagar</option>
                  <option value="MT Route (Modern Trade)">MT Route (Modern Trade)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Vehicle</label>
                  <input
                    type="text"
                    required
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    placeholder="e.g. Tata Ace (UP-80-BT-9120)"
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-[#005f56] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Driver Name</label>
                  <input
                    type="text"
                    required
                    value={driver}
                    onChange={(e) => setDriver(e.target.value)}
                    placeholder="e.g. Mahesh Kumar"
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-[#005f56] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Total Drops</label>
                  <input
                    type="number"
                    required
                    value={totalDrops}
                    onChange={(e) => setTotalDrops(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-[#005f56] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Cases Loaded</label>
                  <input
                    type="number"
                    required
                    value={casesLoaded}
                    onChange={(e) => setCasesLoaded(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-[#005f56] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Value (₹)</label>
                  <input
                    type="number"
                    required
                    value={valueToCollect}
                    onChange={(e) => setValueToCollect(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-[#005f56] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 font-medium rounded hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-3.5 py-1.5 bg-[#005f56] text-white font-semibold rounded hover:bg-[#004e46] flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Generate Gatepass &amp; Dispatch</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
