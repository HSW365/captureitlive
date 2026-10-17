import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { MEMBERSHIP_PRICE } from "@/lib/config";

// Shown to signed-in people without an active paid membership.
export function MembershipBar() {
  const { user, membership, isMember } = useAuth();
  const [loc] = useLocation();
  if (!user || !membership || isMember || loc === "/pricing") return null;
  return (
    <div className="bg-gradient-to-r from-coral-500 to-violet-500 text-white text-sm">
      <div className="max-w-6xl mx-auto px-6 py-2.5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center">
        <span>
          {membership.pending
            ? "We're confirming your payment."
            : `Activate your membership to post, message and book classes — $${MEMBERSHIP_PRICE}/month.`}
        </span>
        {!membership.pending && (
          <Link href="/pricing" className="font-semibold underline underline-offset-4">Activate now</Link>
        )}
      </div>
    </div>
  );
}
