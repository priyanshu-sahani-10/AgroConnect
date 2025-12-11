import {
  Heart,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  ArrowUp,
  Sprout,
} from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const footerLinks = {
    product: [
      { name: "Marketplace", path: "/marketplace" },
      { name: "How it Works", path: "/how-it-works" },
      { name: "For Farmers", path: "/for-farmers" },
      { name: "For Buyers", path: "/for-buyers" },
    ],
    company: [
      { name: "About Us", path: "/about" },
      { name: "Our Mission", path: "/mission" },
      { name: "Success Stories", path: "/stories" },
      { name: "Blog", path: "/blog" },
    ],
    support: [
      { name: "Help Center", path: "/help" },
      { name: "Contact Us", path: "/contact" },
      { name: "Sell Products", path: "/sell" },
      { name: "FAQ", path: "/faq" },
    ],
    legal: [
      { name: "Privacy Policy", path: "/privacy" },
      { name: "Terms of Service", path: "/terms" },
      { name: "Refund Policy", path: "/refund" },
      { name: "Guidelines", path: "/guidelines" },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: "https://x.com/PriyanshuS37737", label: "Twitter" },
    {
      icon: Instagram,
      href: "https://www.instagram.com/priyanshu_sahani_10/",
      label: "Instagram",
    },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/priyanshu-sahani-b9a154282",
      label: "LinkedIn",
    },
    {
      icon: Github,
      href: "https://github.com/priyanshu-sahani-10",
      label: "GitHub",
    },
  ];

  return (
    <footer className="relative bg-linear-to-b from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 border-t border-green-200 dark:border-gray-700">
      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-green-500 via-emerald-500 to-green-600 dark:from-green-600 dark:via-emerald-600 dark:to-green-700"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="inline-flex items-center gap-2 group cursor-pointer">
              <div className="w-10 h-10 bg-linear-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-md dark:shadow-green-900/50">
                <Sprout className="text-white w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold bg-linear-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                AgroConnect
              </h2>
            </div>

            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Bridging the gap between farmers and buyers. Fresh produce,
              fair prices, and direct connections for a sustainable future.
            </p>

            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((social, idx) => {
                const Icon = social.icon;
                return (
                  <a
                    key={idx}
                    href={social.href}
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-green-200 dark:bg-gray-700 flex items-center justify-center hover:bg-linear-to-br hover:from-green-500 hover:to-emerald-600 dark:hover:from-green-600 dark:hover:to-emerald-700 text-gray-600 dark:text-gray-300 hover:text-white transition-all duration-300 hover:scale-110"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Product
            </h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link, idx) => (
                <li key={idx}>
                  <a
                    // href={link.path}
                    className="text-sm text-blue-500 dark:text-blue-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Company
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link, idx) => (
                <li key={idx}>
                  <a
                    // href={link.path}
                    className="text-sm text-blue-500 dark:text-blue-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Support
            </h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link, idx) => (
                <li key={idx}>
                  <a
                    // href={link.path}
                    className="text-sm text-blue-500 dark:text-blue-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Legal
            </h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link, idx) => (
                <li key={idx}>
                  <a
                    // href={link.path}
                    className="text-sm text-blue-500 dark:text-blue-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="py-8 border-t border-green-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <Mail className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Email us
                </p>
                <a
                  href="mailto:support@agroconnect.com"
                  className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                >
                  priyanshusahani2341@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                <Phone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Call us
                </p>
                <a
                  href="tel:+918369601243"
                  className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  +91 8369601243
                </a>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Visit us
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  MNNIT Allahabad, 211004
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="py-6 border-t border-green-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
              © {new Date().getFullYear()} AgroConnect. Made with{" "}
              <Heart className="w-4 h-4 text-red-500 fill-red-500 inline animate-pulse" />{" "}
              for farmers and sustainable agriculture.
            </p>

            <div className="flex items-center gap-4">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Version 1.0.0
              </p>
              <button
                onClick={scrollToTop}
                className="w-10 h-10 rounded-full bg-linear-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 text-white flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg dark:shadow-green-900/50"
                aria-label="Scroll to top"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;