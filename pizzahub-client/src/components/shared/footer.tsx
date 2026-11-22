import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#242424] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-3 lg:px-8">
        <div>
          <Link href="/" className="text-3xl font-extrabold">
            <span className="text-[#F28C28]">Pizza</span>Hub.
          </Link>

          <p className="mt-4 max-w-sm text-sm leading-7 text-gray-400">
            Freshly baked pizzas, delicious flavors and fast delivery.
            Your favorite pizza is just one click away.
          </p>

          <div className="mt-5 flex gap-5 text-sm font-semibold">
            <a href="#" aria-label="Facebook" className="hover:text-[#F28C28]">
              Facebook
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-[#F28C28]">
              Instagram
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-[#F28C28]">
              Twitter
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold">Quick Links</h3>

          <div className="mt-5 flex flex-col gap-3 text-sm text-gray-400">
            <Link href="/" className="hover:text-[#F28C28]">Home</Link>
            <Link href="/menu" className="hover:text-[#F28C28]">Our Menu</Link>
            <Link href="/login" className="hover:text-[#F28C28]">Login</Link>
            <Link href="/register" className="hover:text-[#F28C28]">Create Account</Link>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold">Contact Us</h3>

          <div className="mt-5 space-y-3 text-sm text-gray-400">
            <p>Email: support@pizzahub.com</p>
            <p>Available for fresh pizza orders</p>
            <p>Made with love for pizza lovers.</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-5 py-5 text-center text-sm text-gray-500">
       © 2026 PizzaHub. All rights reserved.
      </div>
    </footer>
  );
}