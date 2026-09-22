/**
 * PLACEHOLDER CONTACT DETAILS — `email`, `phone`, `address` and every `social`
 * href are invented and must be replaced with the agency's real details before
 * this site goes anywhere near production. The email domain in particular is a
 * guess made to match the new name; nobody has registered it.
 */

export const SITE = {
  name: "Reef Rooster",
  legalName: "Reef Rooster Communications",
  tagline: "We link brands and causes to the people.",

  email: "hello@reefrooster.co.ke",
  phone: "+254 00 000 0000",
  address: "Nairobi, Kenya",

  nav: [
    { href: "/projects", label: "Work" },
    { href: "/about", label: "About" },
    { href: "/contacts", label: "Contact" },
  ],

  social: [
    { href: "#", label: "Instagram" },
    { href: "#", label: "LinkedIn" },
    { href: "#", label: "Behance" },
    { href: "#", label: "X" },
  ],
} as const;
