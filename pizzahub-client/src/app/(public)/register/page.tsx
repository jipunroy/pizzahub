
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Flame,
  Leaf,
  Bike,
  Smile,
  Plus,
  Clock3,
  Heart,
  Truck,
} from "lucide-react";

import PopularPizzas from "@/components/home/popular-pizzas";

const features = [
  {
    icon: Leaf,
    title: "Fresh",
    description: "Quality Ingredients",
  },
  {
    icon: Bike,
    title: "Fast",
    description: "Delivery Service",
  },
  {
    icon: Smile,
    title: "Tasty",
    description: "Amazing Flavors",
  },
];

const benefits = [
  {
    icon: Leaf,
    title: "Fresh Ingredients",
    description:
      "We carefully select quality ingredients to make every pizza delicious.",
  },
  {
    icon: Clock3,
    title: "Made to Order",
    description:
      "Every pizza is prepared fresh when you place your order.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description:
      "Enjoy your favorite pizza delivered right to your doorstep.",
  },
  {
    icon: Heart,
    title: "Made with Love",
    description:
      "Great flavors and thoughtful preparation in every single slice.",
  },
];

const experiences = [
  {
    number: "01",
    title: "Fresh Ingredients",
    description: "Quality ingredients make every bite special.",
    image:
      "https://images.unsplash.com/photo-1579751626657-72bc17010498?w=800&q=85",
  },
  {
    number: "02",
    title: "Perfectly Prepared",
    description: "Every pizza is made with attention and passion.",
    image:
      "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=800&q=85",
  },
  {
    number: "03",
    title: "Delivered with Love",
    description: "A delicious experience from our kitchen to you.",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=85",
  },
];

export default function HomePage() {
  return (
    <main className="overflow-hidden bg-[#FFF6E9] text-[#172313]">

      {/* ================= HERO SECTION ================= */}

      <section className="relative">
        <div className="mx-auto grid min-h-[680px] max-w-[1500px] lg:grid-cols-2">

          {/* LEFT CONTENT */}
          <div className="relative z-10 flex flex-col justify-center px-6 py-16 sm:px-12 lg:px-16 lg:py-20">

            <div className="mb-8 inline-flex w-fit items-center gap-2 rounded-full bg-[#FFE1C3] px-5 py-3 text-sm font-bold text-[#B63C20]">
              <Flame size={17} />
              Freshly Baked, Delivered With Love
            </div>

            <h1 className="font-serif text-[clamp(4rem,7vw,7.5rem)] font-black leading-[0.88] tracking-[-0.07em]">
              Every Slice
              <br />
              Tells a
              <br />
              <span className="font-serif italic text-[#E44222]">
                Story.
              </span>
            </h1>

            <p className="mt-8 max-w-md text-base leading-8 text-[#656456]">
              Discover delicious, freshly prepared pizzas made with
              quality ingredients. Your next favorite slice is waiting
              for you.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Link
                href="/menu"
                className="inline-flex items-center gap-4 rounded-full bg-[#E94322] px-8 py-4 font-bold text-white shadow-lg shadow-orange-900/15 transition hover:-translate-y-1 hover:bg-[#BD321A]"
              >
                Explore Our Menu
                <ArrowRight size={19} />
              </Link>

              <Link
                href="/register"
                className="inline-flex items-center gap-3 font-bold transition hover:text-[#E94322]"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#172313]/30">
                  <ArrowUpRight size={19} />
                </span>
                Join PizzaHub
              </Link>
            </div>

            {/* FEATURES */}
            <div className="mt-14 flex flex-wrap gap-x-7 gap-y-5 border-t border-[#172313]/15 pt-7">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div key={feature.title} className="flex items-center gap-3">
                    <Icon
                      className="text-[#E94322]"
                      size={27}
                    />
                    <div>
                      <p className="font-bold">{feature.title}</p>
                      <p className="text-xs text-[#777568]">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT FOOD IMAGE */}
          <div className="relative min-h-[520px] overflow-hidden bg-[#172313] lg:min-h-[720px] lg:rounded-bl-[180px]">

            <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full border border-white/10" />

            <div className="absolute -bottom-40 -left-20 h-[500px] w-[500px] rounded-full border border-white/10" />

            <div className="absolute right-10 top-16 h-40 w-40 rounded-full border border-dashed border-[#F9C77B]/30" />

            {/* MAIN PIZZA IMAGE */}
            <div className="absolute inset-0 flex items-center justify-center p-5 sm:p-10">
              <div className="relative w-full max-w-[650px]">

                <div className="absolute inset-8 rounded-full bg-[#E8A94D]/20 blur-3xl" />

                <img
                  src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&q=90"
                  alt="Freshly baked PizzaHub pizza"
                  className="relative z-10 aspect-square w-full rounded-full object-cover shadow-2xl"
                />

              </div>
            </div>

            {/* FLOATING PIZZA CARD */}
            <div className="absolute left-4 top-8 z-30 flex w-[230px] rotate-[-5deg] items-center gap-3 rounded-2xl bg-[#FFF6E9] p-3 shadow-2xl sm:left-8 sm:top-16 sm:w-[285px]">

              <img
                src="https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=250&q=85"
                alt="Margherita pizza"
                className="h-16 w-16 rounded-xl object-cover sm:h-20 sm:w-20"
              />

              <div className="min-w-0 flex-1">
                <p className="text-sm font-black">
                  Margherita Pizza
                </p>
                <p className="mt-1 text-lg font-black text-[#E94322]">
                  ৳450
                </p>
              </div>

              <Link
                href="/menu"
                aria-label="Explore pizza menu"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E94322] text-white"
              >
                <Plus size={19} />
              </Link>
            </div>

            {/* FLOATING LABEL */}
            <div className="absolute bottom-10 right-4 z-30 rotate-[4deg] rounded-2xl bg-[#FFF6E9] px-5 py-4 shadow-2xl sm:bottom-16 sm:right-10">
              <p className="font-serif text-xl font-bold italic">
                Delicious
              </p>
              <p className="font-serif text-xl font-bold italic text-[#E94322]">
                & Made with Love ♥
              </p>
            </div>

            <div className="absolute bottom-5 left-6 text-xs font-bold uppercase tracking-[0.3em] text-white/50">
              PizzaHub / 001
            </div>
          </div>
        </div>
      </section>

      {/* ================= POPULAR PIZZAS ================= */}

      <section className="bg-[#FFF6E9] px-5 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1400px]">

          <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <span className="rounded-full bg-[#FFE1C3] px-5 py-2 text-sm font-bold text-[#E94322]">
                Customer Favorites
              </span>

              <h2 className="mt-5 font-serif text-4xl font-black sm:text-6xl">
                Popular Pizzas
              </h2>

              <p className="mt-4 max-w-lg text-sm leading-7 text-[#777568]">
                Discover our delicious pizzas, freshly prepared with
                quality ingredients.
              </p>
            </div>

            <Link
              href="/menu"
              className="inline-flex items-center gap-2 font-bold text-[#E94322] transition hover:gap-4"
            >
              View Full Menu <ArrowRight size={19} />
            </Link>
          </div>

          {/* EXISTING BACKEND API */}
          <PopularPizzas />

        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}

      <section className="bg-[#172313] px-6 py-24 text-white sm:px-12 lg:px-16">
        <div className="mx-auto max-w-[1300px]">

          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F5C879]">
              The PizzaHub Promise
            </p>

            <h2 className="mt-5 font-serif text-4xl font-black sm:text-6xl">
              Why Choose PizzaHub?
            </h2>

            <p className="mx-auto mt-5 max-w-xl leading-7 text-white/60">
              Great ingredients, delicious recipes and a simple
              ordering experience—all in one place.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={benefit.title}
                  className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 transition duration-300 hover:-translate-y-2 hover:bg-white/[0.09]"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFE1C3] text-[#E94322]">
                    <Icon size={26} />
                  </div>

                  <h3 className="mt-6 text-lg font-black">
                    {benefit.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-white/55">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= OUR EXPERIENCE ================= */}

      <section className="bg-[#F5DCC3] px-5 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1400px]">

          <div className="mb-12">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#B63C20]">
              A little about our process
            </p>

            <h2 className="mt-5 font-serif text-5xl font-black sm:text-7xl">
              Made with care<span className="text-[#E94322]">.</span>
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {experiences.map((item) => (
              <article key={item.number} className="group">

                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-[#D7A65F]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />

                  <span className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#FFF6E9] font-serif font-bold">
                    {item.number}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 border-b border-[#172313]/20 py-6">
                  <div>
                    <h3 className="font-serif text-2xl font-bold">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm text-[#656456]">
                      {item.description}
                    </p>
                  </div>

                  <ArrowUpRight
                    size={22}
                    className="shrink-0 text-[#E94322] transition group-hover:-translate-y-1 group-hover:translate-x-1"
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ABOUT ================= */}

      <section
        id="about"
        className="scroll-mt-24 bg-[#FFF6E9] px-6 py-24 sm:px-12 lg:px-16"
      >
        <div className="mx-auto grid max-w-[1300px] items-center gap-12 md:grid-cols-2">

          <div className="overflow-hidden rounded-[40px]">
            <img
              src="https://images.unsplash.com/photo-1579751626657-72bc17010498?w=1000&q=85"
              alt="Pizza made with fresh ingredients"
              className="h-[400px] w-full object-cover transition duration-700 hover:scale-105"
            />
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#B63C20]">
              Our Story
            </p>

            <h2 className="mt-5 font-serif text-5xl font-black leading-tight sm:text-6xl">
              More Than Pizza.
              <br />
              <span className="italic text-[#E94322]">
                It&apos;s Happiness.
              </span>
            </h2>

            <p className="mt-7 max-w-lg leading-8 text-[#656456]">
              At PizzaHub, we believe that food brings people closer.
              Our mission is to make delicious pizza easy to enjoy,
              whether it is a family dinner, a movie night or a little
              treat for yourself.
            </p>

            <p className="mt-4 max-w-lg leading-8 text-[#656456]">
              We bring together quality ingredients, thoughtful
              preparation and convenient delivery to make every order
              something special.
            </p>

            <Link
              href="/menu"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#172313] px-7 py-4 font-bold text-white transition hover:bg-[#E94322]"
            >
              Discover Our Menu <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= CONTACT CTA ================= */}

      <section
        id="contact"
        className="scroll-mt-24 bg-[#F5D5B7] px-6 py-24 text-center sm:px-12"
      >
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#B63C20]">
          Your next slice is waiting
        </p>

        <h2 className="mx-auto mt-5 max-w-3xl font-serif text-4xl font-black sm:text-6xl">
          Ready for Your Next Slice?
        </h2>

        <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-[#656456]">
          Explore our menu and discover your favorite pizza.
        </p>

        <Link
          href="/menu"
          className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#E94322] px-9 py-4 font-bold text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#BD321A]"
        >
          Order Your Pizza <ArrowRight size={19} />
        </Link>
      </section>

      {/* ================= FOOTER ================= */}

      <footer className="bg-[#172313] px-6 py-14 text-white sm:px-12 lg:px-16">
        <div className="mx-auto max-w-[1400px]">

          <div className="grid gap-12 border-b border-white/15 pb-12 sm:grid-cols-2 lg:grid-cols-4">

            <div className="lg:col-span-2">
              <Link href="/" className="font-serif text-4xl font-black">
                PizzaHub<span className="text-[#E94322]">.</span>
              </Link>

              <p className="mt-5 max-w-sm text-sm leading-7 text-white/55">
                Freshly baked pizzas, delicious flavors and fast
                delivery. Your favorite pizza is just one click away.
              </p>

              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 transition hover:bg-[#E94322]"
                aria-label="Instagram"
              >
                <ArrowUpRight size={20} />
              </a>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#F5C879]">
                Quick Links
              </h3>

              <div className="mt-6 flex flex-col gap-4 text-sm text-white/65">
                <Link href="/" className="hover:text-white">Home</Link>
                <Link href="/menu" className="hover:text-white">Our Menu</Link>
                <Link href="/login" className="hover:text-white">Login</Link>
                <Link href="/register" className="hover:text-white">Create Account</Link>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#F5C879]">
                Contact Us
              </h3>

              <div className="mt-6 space-y-4 text-sm text-white/65">
                <a
                  href="mailto:support@pizzahub.com"
                  className="block hover:text-white"
                >
                  support@pizzahub.com
                </a>

                <p>Available for fresh pizza orders</p>
                <p>Delivered with love.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-4 pt-7 text-xs text-white/40 sm:flex-row">
            <p>© 2026 PizzaHub. All rights reserved.</p>
            <p>Made with love for pizza lovers.</p>
          </div>
        </div>
      </footer>

    </main>
  );
}
