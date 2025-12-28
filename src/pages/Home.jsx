// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";

/**
 * Saarah Eats — Home Page
 * - Hero section + CTAs
 * - Featured highlights
 * - Location + embedded map
 * - Opening hours + contact
 * - Footer
 *
 * Tailwind-only, no extra libs.
 */

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-gray-50" />
        <div className="relative mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-sm text-gray-700 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Fresh • Authentic • Fast Checkout
              </div>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Traditional Indian flavours,
                <span className="text-emerald-700"> delivered</span> to your door
              </h1>

              <p className="mt-4 max-w-xl text-base text-gray-600">
                From buttery curries to street-style chaat, Saarah Eats brings a modern ordering
                experience to classic recipes. Browse the menu, build your cart, and pay securely.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/menu"
                  className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600"
                >
                  Explore Menu
                </Link>

                <Link
                  to="/cart"
                  className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-100"
                >
                  View Cart
                </Link>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <InfoPill label="Pickup / Delivery" value="Available" />
                <InfoPill label="Avg prep time" value="20–30 min" />
                <InfoPill label="Secure payments" value="Stripe" />
              </div>
            </div>

            {/* HERO IMAGE CARD */}
            <div className="relative">
              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="aspect-[16/11] overflow-hidden rounded-2xl">
                  {/* Replace with your own image URL */}
                  <img
                    src="https://images.unsplash.com/photo-1604909052743-94e838986d24?auto=format&fit=crop&w=1400&q=80"
                    alt="Indian food platter"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        Today’s favourites
                      </div>
                      <div className="text-sm text-gray-600">
                        Butter Chicken • Paneer Tikka • Biryani
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                      Popular
                    </span>
                  </div>
                </div>
              </div>

              {/* Accent blob */}
              <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-emerald-200/40 blur-2xl" />
              <div className="pointer-events-none absolute -left-8 -bottom-10 h-40 w-40 rounded-full bg-red-200/40 blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <HighlightCard
            title="Chef-made classics"
            desc="Authentic spice blends, slow-cooked curries, and tandoor favourites."
          />
          <HighlightCard
            title="Fast, smooth checkout"
            desc="Guest or logged-in checkout with secure Stripe payments."
          />
          <HighlightCard
            title="Real-time availability"
            desc="Menu items update instantly so you only order what’s available."
          />
        </div>
      </section>

      {/* LOCATION + HOURS */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Map */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Find us</h2>
              <p className="mt-1 text-sm text-gray-600">
                Visit us for dine-in or pickup. Delivery available in nearby areas.
              </p>
            </div>

            {/* MAP EMBED
               - Replace the "q=" value with your restaurant address for exact location.
               - Example: q=Saarah+Eats,+Ilford+London
            */}
            <div className="aspect-[16/9]">
              <iframe
                title="Saarah Eats Location"
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps?q=Ilford%20London&output=embed"
              />
            </div>

            <div className="p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm">
                <div className="font-semibold text-gray-900">Saarah Eats</div>
                <div className="text-gray-600">Ilford, London (Update address)</div>
              </div>
              <a
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-100"
                href="https://www.google.com/maps?q=Ilford%20London"
                target="_blank"
                rel="noreferrer"
              >
                Open in Maps
              </a>
            </div>
          </div>

          {/* Hours + Contact */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="p-5">
              <h2 className="text-lg font-semibold text-gray-900">Opening hours</h2>
              <div className="mt-4 space-y-2 text-sm">
                <HoursRow day="Mon–Thu" hours="12:00 – 22:00" />
                <HoursRow day="Fri" hours="12:00 – 23:00" />
                <HoursRow day="Sat" hours="12:00 – 23:00" />
                <HoursRow day="Sun" hours="12:00 – 21:30" />
              </div>

              <div className="mt-6 border-t border-gray-200 pt-5">
                <h3 className="text-sm font-semibold text-gray-900">Contact</h3>
                <div className="mt-3 space-y-2 text-sm text-gray-700">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-gray-600">Phone</span>
                    <span className="font-medium">+44 20 0000 0000</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-gray-600">Email</span>
                    <span className="font-medium">hello@saaraha-eats.com</span>
                  </div>
                </div>

                <div className="mt-5 flex gap-3">
                  <Link
                    to="/menu"
                    className="flex-1 rounded-lg bg-emerald-500 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-emerald-600"
                  >
                    Order now
                  </Link>
                  <Link
                    to="/login"
                    className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-center text-sm font-semibold hover:bg-gray-100"
                  >
                    Sign in
                  </Link>
                </div>

                <p className="mt-4 text-xs text-gray-500">
                  Tip: Update the map query, address, and contact details with your real info.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="text-base font-semibold text-gray-900">Saarah Eats</div>
              <p className="mt-2 text-sm text-gray-600">
                Authentic Indian cuisine with modern ordering — guest checkout, secure payments, and
                fast delivery.
              </p>
            </div>

            <div>
              <div className="text-sm font-semibold text-gray-900">Quick links</div>
              <div className="mt-2 grid gap-2 text-sm">
                <Link className="text-gray-700 hover:text-gray-900" to="/menu">
                  Menu
                </Link>
                <Link className="text-gray-700 hover:text-gray-900" to="/cart">
                  Cart
                </Link>
                <Link className="text-gray-700 hover:text-gray-900" to="/orders">
                  Orders
                </Link>
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold text-gray-900">Legal</div>
              <div className="mt-2 grid gap-2 text-sm text-gray-700">
                <span className="cursor-default">Privacy Policy</span>
                <span className="cursor-default">Terms &amp; Conditions</span>
                <span className="cursor-default">Refund Policy</span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-6 text-sm text-gray-600">
            <span>© {new Date().getFullYear()} Saarah Eats. All rights reserved.</span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Built with React • Tailwind • Node • MySQL
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function InfoPill({ label, value }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-sm font-semibold text-gray-900">{value}</div>
    </div>
  );
}

function HighlightCard({ title, desc }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="text-sm font-semibold text-gray-900">{title}</div>
      <div className="mt-2 text-sm text-gray-600">{desc}</div>
    </div>
  );
}

function HoursRow({ day, hours }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-gray-600">{day}</span>
      <span className="font-medium text-gray-900">{hours}</span>
    </div>
  );
}
