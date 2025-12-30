export default function Footer() {
  return (
    <footer className="bg-oradent-blue text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
        <div>
          <h3 className="text-2xl font-bold mb-4">FDC</h3>
          <p className="text-blue-100 text-sm">Providing expert dental care with the latest technology for your perfect smile.</p>
        </div>
        <div>
          <h4 className="font-bold text-oradent-teal uppercase text-xs tracking-widest mb-4">Contact Info</h4>
          <p className="text-sm">Phone: +1 234 567 890</p>
          <p className="text-sm">Email: info@fdc.com</p>
        </div>
        <div>
          <h4 className="font-bold text-oradent-teal uppercase text-xs tracking-widest mb-4">Hours</h4>
          <p className="text-sm text-blue-100">Mon - Fri: 9:00 AM - 8:00 PM</p>
          <p className="text-sm text-blue-100">Weekend: 10:00 AM - 4:00 PM</p>
        </div>
      </div>
      <div className="border-t border-blue-800 mt-12 pt-8 text-center text-xs text-blue-300">
        © 2025 FDC Clinic Management System.
      </div>
    </footer>
  );
}