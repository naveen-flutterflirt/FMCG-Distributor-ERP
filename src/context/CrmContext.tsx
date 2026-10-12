'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  FMCGCompany,
  PendingOrder,
  VanSettlementSummary,
  ClaimRecord,
  SalesmanScorecard,
} from '@/types/crm';
import {
  mockPendingOrders,
  mockVanSettlement,
  mockClaims,
  mockScorecards,
} from '@/data/mockData';
import { ErpDialogModal } from '@/components/modals/ErpDialogModal';

export interface DialogState {
  isOpen: boolean;
  title: string;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'danger';
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
}

interface CrmContextType {
  selectedCompany: FMCGCompany;
  setSelectedCompany: (company: FMCGCompany) => void;
  selectedRoute: string;
  setSelectedRoute: (route: string) => void;
  globalSearch: string;
  setGlobalSearch: (term: string) => void;
  orders: PendingOrder[];
  filteredOrders: PendingOrder[];
  selectedOrderIds: string[];
  toggleSelectOrder: (id: string) => void;
  selectAllOrders: (checked: boolean) => void;
  activePreviewOrderId: string;
  setActivePreviewOrderId: (id: string) => void;
  bulkBillSelected: () => void;
  vanSettlement: VanSettlementSummary;
  closeVanSettlement: () => void;
  claims: ClaimRecord[];
  activeClaimId: string;
  setActiveClaimId: (id: string) => void;
  resolveClaimQuery: (id: string) => void;
  scorecards: SalesmanScorecard[];
  notification: string | null;
  setNotification: (msg: string | null) => void;
  isNewOrderModalOpen: boolean;
  setIsNewOrderModalOpen: (open: boolean) => void;
  addNewOrder: (order: Partial<PendingOrder>) => void;
  showAlert: (
    title: string,
    message: string,
    type?: 'success' | 'info' | 'warning' | 'danger'
  ) => void;
  showConfirm: (
    title: string,
    message: string,
    onConfirm: () => void,
    confirmText?: string,
    cancelText?: string,
    type?: 'warning' | 'danger' | 'info'
  ) => void;
  closeDialog: () => void;
}

const CrmContext = createContext<CrmContextType | undefined>(undefined);

export function CrmProvider({ children }: { children: React.ReactNode }) {
  const [selectedCompany, setSelectedCompany] = useState<FMCGCompany>('All');
  const [selectedRoute, setSelectedRoute] = useState<string>('All');
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [orders, setOrders] = useState<PendingOrder[]>(mockPendingOrders);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([
    'SO-61208',
    'SO-61211',
    'SO-61219',
  ]);
  const [activePreviewOrderId, setActivePreviewOrderId] = useState<string>('SO-61208');
  const [vanSettlement, setVanSettlement] = useState<VanSettlementSummary>(mockVanSettlement);
  const [claims, setClaims] = useState<ClaimRecord[]>(mockClaims);
  const [activeClaimId, setActiveClaimId] = useState<string>('CL-26-086');
  const [scorecards] = useState<SalesmanScorecard[]>(mockScorecards);
  const [notification, setNotification] = useState<string | null>(null);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState<boolean>(false);
  const [dialogState, setDialogState] = useState<DialogState>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    confirmText: 'OK',
  });

  const toggleSelectOrder = (id: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAllOrders = (checked: boolean) => {
    if (checked) {
      setSelectedOrderIds(filteredOrders.map((o) => o.id));
    } else {
      setSelectedOrderIds([]);
    }
  };

  // Filter orders reactively based on route, company, and global search query
  const filteredOrders = orders.filter((order) => {
    const matchRoute =
      selectedRoute === 'All' || order.route.toLowerCase().includes(selectedRoute.toLowerCase());
    const matchSearch =
      !globalSearch ||
      order.id.toLowerCase().includes(globalSearch.toLowerCase()) ||
      order.outlet.toLowerCase().includes(globalSearch.toLowerCase()) ||
      order.route.toLowerCase().includes(globalSearch.toLowerCase());
    return matchRoute && matchSearch;
  });

  const bulkBillSelected = () => {
    const validOrders = orders.filter(
      (o) => selectedOrderIds.includes(o.id) && o.checks === 'OK'
    );
    const holdOrders = orders.filter(
      (o) => selectedOrderIds.includes(o.id) && o.checks !== 'OK'
    );

    if (validOrders.length === 0 && holdOrders.length > 0) {
      showNotice(`Billing blocked: Selected orders have credit holds or stock shortages.`);
      return;
    }

    setOrders((prev) =>
      prev.map((order) => {
        if (selectedOrderIds.includes(order.id) && order.checks === 'OK') {
          return { ...order, deliveryDate: 'Dispatched · Mon 12 Oct' };
        }
        return order;
      })
    );
    showNotice(
      `Billed ${validOrders.length} orders successfully. e-Way bills generated.${
        holdOrders.length > 0 ? ` (${holdOrders.length} orders held for review)` : ''
      }`
    );
  };

  const closeVanSettlement = () => {
    setVanSettlement((prev) => ({
      ...prev,
      status: 'Settled',
    }));
    showNotice('Van 2 settlement reconciled and closed. Shortage voucher created.');
  };

  const resolveClaimQuery = (claimId: string) => {
    setClaims((prev) =>
      prev.map((c) =>
        c.id === claimId
          ? {
              ...c,
              status: 'Submitted' as const,
              evidence: { ...c.evidence, queryNote: undefined },
            }
          : c
      )
    );
    showNotice(`Claim ${claimId} auditor query responded and resubmitted.`);
  };

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const addNewOrder = (newOrderData: Partial<PendingOrder>) => {
    const newId = `SO-${Math.floor(60000 + Math.random() * 9999)}`;
    const created: PendingOrder = {
      id: newId,
      outlet: newOrderData.outlet || 'New Outlet Store',
      outletClass: 'A',
      route: newOrderData.route || 'R4 Gandhi Nagar',
      source: 'Salesman · Rakesh',
      lines: 4,
      value: newOrderData.value || 7500,
      schemeSaving: 320,
      checks: 'OK',
      deliveryDate: 'Sat, 10 Oct',
      gstin: '09AABCN9921D1Z9',
      balanceDue: 0,
      creditLimit: 30000,
      items: [
        {
          id: 'item-1',
          sku: 'Premium CTC Tea 250 g',
          qty: '2 cs',
          units: 48,
          rate: 108,
          mrp: 125,
          scheme: 'QPS 2%',
          amount: 5184,
          isMustSell: true,
        },
        {
          id: 'item-2',
          sku: 'Biscuit ₹10 pack',
          qty: '3 cs',
          units: 180,
          rate: 8.4,
          mrp: 10,
          scheme: '12+1 free',
          amount: 1512,
        },
      ],
    };
    setOrders((prev) => [created, ...prev]);
    setSelectedOrderIds((prev) => [...prev, newId]);
    setActivePreviewOrderId(newId);
    setIsNewOrderModalOpen(false);
    showNotice(`Order ${newId} placed successfully from field beat.`);
  };

  const showAlert = (
    title: string,
    message: string,
    type: 'success' | 'info' | 'warning' | 'danger' = 'info'
  ) => {
    setDialogState({
      isOpen: true,
      title,
      message,
      type,
      confirmText: 'OK',
      cancelText: undefined,
      onConfirm: undefined,
    });
  };

  const showConfirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    confirmText: string = 'Confirm',
    cancelText: string = 'Cancel',
    type: 'warning' | 'danger' | 'info' = 'warning'
  ) => {
    setDialogState({
      isOpen: true,
      title,
      message,
      type,
      confirmText,
      cancelText,
      onConfirm,
    });
  };

  const closeDialog = () => {
    setDialogState((prev) => ({ ...prev, isOpen: false }));
  };

  // Safely override browser window.alert across client components
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.alert = (message?: unknown) => {
        showAlert('ERP System Message', String(message ?? ''), 'info');
      };
    }
  }, []);

  return (
    <CrmContext.Provider
      value={{
        selectedCompany,
        setSelectedCompany,
        selectedRoute,
        setSelectedRoute,
        globalSearch,
        setGlobalSearch,
        orders,
        filteredOrders,
        selectedOrderIds,
        toggleSelectOrder,
        selectAllOrders,
        activePreviewOrderId,
        setActivePreviewOrderId,
        bulkBillSelected,
        vanSettlement,
        closeVanSettlement,
        claims,
        activeClaimId,
        setActiveClaimId,
        resolveClaimQuery,
        scorecards,
        notification,
        setNotification,
        isNewOrderModalOpen,
        setIsNewOrderModalOpen,
        addNewOrder,
        showAlert,
        showConfirm,
        closeDialog,
      }}
    >
      {children}
      <ErpDialogModal
        isOpen={dialogState.isOpen}
        title={dialogState.title}
        message={dialogState.message}
        type={dialogState.type}
        confirmText={dialogState.confirmText}
        cancelText={dialogState.cancelText}
        onConfirm={dialogState.onConfirm}
        onClose={closeDialog}
      />
    </CrmContext.Provider>
  );
}

export function useCrm() {
  const context = useContext(CrmContext);
  if (!context) {
    throw new Error('useCrm must be used within a CrmProvider');
  }
  return context;
}
