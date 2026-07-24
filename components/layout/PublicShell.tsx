import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <Navbar />
      {children}
      <Footer />
    </main>
  );
}
