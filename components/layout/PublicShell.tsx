import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <main id="top">
      <Navbar />
      {children}
      <Footer />
    </main>
  );
}
