import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div id="top">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
