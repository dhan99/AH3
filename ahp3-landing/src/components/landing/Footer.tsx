import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="w-full bg-[#F0F0F0] text-[#000000]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-wrap justify-center gap-24 mb-8">
          <Link href="#" className="text-m font-light hover:underline font-['Gibson']">
            Legal
          </Link>
          <Link href="#" className="text-m font-light hover:underline font-['Gibson']">
            Privacy
          </Link>
          <Link href="#" className="text-m font-light hover:underline font-['Gibson']">
            Producer Compensation Disclosure
          </Link>
          <Link href="#" className="text-m font-light hover:underline font-['Gibson']">
            Underwriting Companies
          </Link>
        </div>
        
        <div className="border-t border-[#000000] pt-8">
          <p className="text-xs font-light mb-4 font-['Gibson']">
            © 2025 Intact Insurance Group USA LLC
          </p>
          <p className="text-xs font-light mb-4 font-['Gibson']">
            Intact Insurance Specialty Solutions is the marketing brand for the insurance company subsidiaries of Intact Insurance Group USA LLC. Coverages are underwritten by Atlantic Specialty Insurance Company. This material is intended as a general description of certain types of insurance coverages and services. Coverages and availability vary by state; exclusions and deductibles may apply. Please refer to the actual policies or consult with your independent insurance advisor for descriptions of coverages, terms and conditions.
          </p>
          <p className="text-xs font-light font-['Gibson']">
            *Intact Insurance is backed by the financial strength of Atlantic Specialty Insurance Company, a subsidiary of Intact Financial Corporation (TSX:IFC), rated A+ by A.M. Best.
          </p>
        </div>
      </div>
    </footer>
  );
};
