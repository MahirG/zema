import { RELEASE_STATUS_LABELS } from "@/lib/domain/constants";
import type { DeliveryStatus, ReleaseStatus, TrackStatus } from "@/lib/domain/types";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: ReleaseStatus | TrackStatus | DeliveryStatus }): React.JSX.Element {
  const label = status in RELEASE_STATUS_LABELS
    ? RELEASE_STATUS_LABELS[status as ReleaseStatus]
    : status === "delivered" || status === "queued" || status === "sent" || status === "accepted"
      ? "Delivering"
      : status === "taken_down" ? "Taken down" : status.charAt(0).toUpperCase() + status.slice(1);
  return <span className={cn("status-badge", `status-${status.replaceAll("_", "-")}`)}><span aria-hidden="true" />{label}</span>;
}
