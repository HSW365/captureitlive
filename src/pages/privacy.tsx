export default function Privacy() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-20 prose">
      <h1 className="font-display text-3xl font-medium mb-6">Privacy Policy</h1>
      <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
        <p>Yogo collects the information you provide directly — your name, email, role, and anything you choose to share in your profile, posts, or class listings.</p>
        <p>We use this information to operate the community: showing your posts to other members, connecting instructors with students, and managing class RSVPs.</p>
        <p>We don't sell your data. Authentication and storage are handled by Supabase, and your password is never visible to us or stored in plain text.</p>
        <p>You can edit or delete your profile information at any time from your dashboard. To delete your account entirely, contact us and we'll remove your data.</p>
      </div>
    </div>
  );
}
