import { Suspense } from "react";
import { BillingPanel } from "@/components/office/billing-panel";
import { SectionTitle } from "@/components/section-title";

export const dynamic = "force-dynamic";

export default function BillingPage() {
  return (
    <div className="space-y-4">
      <div>
        <SectionTitle>Billing</SectionTitle>
        <p className="mt-3 max-w-3xl text-sm text-muted">
          Plans are priced in ZAR excluding VAT. Annual billing includes two months free. Failed payments move through grace → read-only → suspended — we never delete your data.
        </p>
      </div>
      <Suspense fallback={<p className="text-sm text-muted">Loading billing…</p>}>
        <BillingPanel />
      </Suspense>
    </div>
  );
}
