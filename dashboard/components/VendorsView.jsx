"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import VendorList from "./VendorList";
import AddVendorModal from "./AddVendorModal";

/**
 * Full vendors workspace: filterable list + onboarding.
 */
export default function VendorsView({ vendor, segments, onVendorClick, onSegmentClick }) {
  const [modal, setModal] = useState(false);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-bold text-slate-800">Vendor SCRM</h2>
          <p className="text-[12px] text-slate-400">Search, sort, onboard and inspect vendors.</p>
        </div>
        <button
          type="button"
          onClick={() => setModal(true)}
          className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-3 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-orange-600"
        >
          <Plus size={14} /> Add New Vendor
        </button>
      </div>
      <VendorList
        vendor={vendor}
        segments={segments}
        onVendorClick={onVendorClick}
        onSegmentClick={onSegmentClick}
      />
      <AddVendorModal open={modal} onClose={() => setModal(false)} onCreated={vendor.refetch} />
    </div>
  );
}
