import { type User } from "next-auth";

export default function VenueProfile({ user }: { user: User }) {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <h1>Venue Profile</h1>
      <p>Welcome, {user.name}</p>
      <p>User email: {user.email}</p>
    </div>
  );
}
