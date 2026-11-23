
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  ShoppingBag,
  ShoppingCart,
  X,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { toast } from "sonner";

import { useCart } from "@/context/cart-context";
import { authClient } from "@/lib/auth-client";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Menu", href: "/menu" },
  { name: "About", href: "/#about" },
  { name: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const { cartCount } = useCart();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const isLoggedIn = Boolean(session?.user);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);

      const result = await authClient.signOut();

      if (result.error) {
        toast.error(result.error.message || "Unable to sign out.");
        return;
      }

      setIsOpen(false);
      toast.success("Signed out successfully!");
      router.replace("/login");
      router.refresh();
    } catch {
      toast.error("Something went wrong while signing out.");
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-orange-100 bg-[#FFF9F2]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="text-2xl font-extrabold tracking-tight">
          <span className="text-[#D9362B]">Pizza</span>
          <span className="text-[#242424]">Hub.</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-semibold text-gray-700 transition hover:text-[#D9362B]"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          {/* Cart */}
          <Link
            href="/cart"
            aria-label={`Shopping cart, ${cartCount} items`}
            className="relative rounded-full p-2.5 text-[#242424] transition hover:bg-orange-100"
          >
            <ShoppingCart size={22} />

            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#D9362B] px-1 text-[11px] font-bold text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          {!isPending && (
            isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-[#242424] transition hover:bg-orange-100"
                >
                  <LayoutDashboard size={17} />
                  Dashboard
                </Link>

                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="flex items-center gap-2 rounded-full border border-[#D9362B] px-5 py-2.5 text-sm font-semibold text-[#D9362B] transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <LogOut size={17} />
                  {isSigningOut ? "Signing Out..." : "Sign Out"}
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-full px-5 py-2.5 text-sm font-semibold text-[#242424] transition hover:bg-orange-100"
              >
                Login
              </Link>
            )
          )}

          <Link
            href="/menu"
            className="flex items-center gap-2 rounded-full bg-[#D9362B] px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-[#b92b23]"
          >
            <ShoppingBag size={17} />
            Order Now
          </Link>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/cart"
            aria-label={`Shopping cart, ${cartCount} items`}
            className="relative rounded-lg p-2 text-[#242424] hover:bg-orange-100"
          >
            <ShoppingCart size={23} />

            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#D9362B] px-1 text-[11px] font-bold text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-lg p-2 text-[#242424] hover:bg-orange-100"
            aria-label="Toggle navigation"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={25} /> : <Menu size={25} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="border-t border-orange-100 bg-[#FFF9F2] px-5 py-5 md:hidden">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="font-semibold text-gray-700 hover:text-[#D9362B]"
              >
                {link.name}
              </Link>
            ))}

            <Link
              href="/cart"
              onClick={() => setIsOpen(false)}
              className="font-semibold text-gray-700"
            >
              Shopping Cart ({cartCount})
            </Link>

            {!isPending && (
              isLoggedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 font-semibold text-gray-700"
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="flex items-center gap-2 text-left font-semibold text-[#D9362B] disabled:opacity-50"
                  >
                    <LogOut size={18} />
                    {isSigningOut ? "Signing Out..." : "Sign Out"}
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="font-semibold text-gray-700"
                >
                  Login
                </Link>
              )
            )}

            <Link
              href="/menu"
              onClick={() => setIsOpen(false)}
              className="rounded-full bg-[#D9362B] px-5 py-3 text-center font-bold text-white"
            >
              Order Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
