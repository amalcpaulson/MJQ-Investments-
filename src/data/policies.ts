export interface Policy {
  slug: string;
  title: string;
  updated: string;
  html: string;
}

export const POLICIES: Policy[] = [
  {
    slug: "shipping-returns",
    title: "Shipping & Returns",
    updated: "July 2026",
    html: `
      <h2>Shipping</h2>
      <p>We ship across the United Arab Emirates, typically within <strong>2–5 business days</strong>. Standard and expedited options are available at checkout, and select international destinations are supported (customs duties may apply).</p>
      <p>Enjoy <strong>free UAE delivery on orders over AED 150</strong>. Once your order ships, you'll receive an email with tracking details.</p>
      <h2>Returns & Exchanges</h2>
      <p>If you are not completely satisfied, contact us within <strong>14 days</strong> of receiving your order to arrange a return or exchange. Items must be unused and in their original packaging.</p>
      <p>Refunds are issued to the original payment method once your return is received and inspected.</p>
    `,
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    updated: "July 2026",
    html: `
      <p>Luxury.ae, operated by MJQ Investment LLC, respects your privacy. This policy explains what we collect and why.</p>
      <h2>What we collect</h2>
      <p>We collect the information you provide when you place an order or subscribe — such as your name, email address, delivery address and order details — and basic analytics about how the site is used.</p>
      <h2>How we use it</h2>
      <p>Your information is used to process orders, provide support, send updates you've opted into, and improve our service. We do not sell your personal data.</p>
      <h2>Your choices</h2>
      <p>You may unsubscribe from marketing emails at any time, and you can contact us to access or delete the personal information we hold about you.</p>
    `,
  },
  {
    slug: "terms",
    title: "Terms of Service",
    updated: "July 2026",
    html: `
      <p>By using Luxury.ae you agree to these terms. Please read them carefully.</p>
      <h2>Orders</h2>
      <p>All orders are subject to acceptance and availability. Prices are shown in UAE dirhams (AED) and are inclusive of applicable VAT unless stated otherwise.</p>
      <h2>Products</h2>
      <p>We take care to describe products accurately. Packaging and formulations may occasionally be updated by the manufacturer.</p>
      <h2>Liability</h2>
      <p>To the fullest extent permitted by law, Luxury.ae is not liable for indirect or consequential loss arising from the use of the site or products, beyond the value of the order.</p>
      <h2>Contact</h2>
      <p>Questions about these terms? Email <a href="mailto:mk@mjqinvestment.com">mk@mjqinvestment.com</a>.</p>
    `,
  },
];

export function getPolicy(slug: string): Policy | undefined {
  return POLICIES.find((p) => p.slug === slug);
}
