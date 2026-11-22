import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex-1">{children}</main>
      <Footer />
    </>
  );
}