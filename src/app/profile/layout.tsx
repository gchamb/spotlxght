export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mt-10 max-w-screen-2xl px-4">{children}</div>
  );
}
