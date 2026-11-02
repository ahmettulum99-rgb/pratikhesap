import { adSlots, adsEnabled, type AdSlotId } from "@/lib/ads";

export function AdSlot({ placement, className = "" }: { placement: AdSlotId; className?: string }) {
  const slot = adSlots[placement];
  if (!adsEnabled) return null;

  return (
    <aside className={`ad-slot ${className}`} aria-label={slot.label}>
      <span>{slot.description}</span>
      {/* Add the single-point AdSense integration here when ads are enabled. */}
    </aside>
  );
}
