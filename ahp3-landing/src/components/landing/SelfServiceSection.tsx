import { ResponsiveImage } from '@/components/ui';

export const SelfServiceSection = () => {
  return (
    <section className="w-full bg-[#00626B] text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="md:max-w-sm mb-8 md:mb-0">
            <p className="text-xl font-semibold mb-2 font-['Gibson'] uppercase">SELF SERVICE</p>
            <h2 className="text-3xl mb-4 font-['Gibson']">Policies at your <span className="font-bold">speed</span>.</h2>
            <p className="text-base font-light mb-6 font-['Gibson'] md:w-10/12">
              Use our online platform to secure Occupational-Accident, Non-Trucking Liability, and Vehicle Physical Damage coverage for motor carriers with 50 units and under.
            </p>
          </div>
          
          <div className="md:w-1/2 border-t md:border-t-0 md:pl-12 pt-8 md:pt-0">
            <div className="border-t border-b border-white divide-y divide-white">
              <div className="flex items-center gap-4 py-5">
                <div className="w-12 h-12 flex items-center justify-center">
                  <ResponsiveImage 
                    src="/images/desktop-icon.svg" 
                    alt="Minimal data entry" 
                    width={40} 
                    height={40} 
                  />
                </div>
                <p className="text-xl font-light font-['Gibson']">Minimal data entry</p>
              </div>
              
              <div className="flex items-center gap-4 py-5">
                <div className="w-12 h-12 flex items-center justify-center">
                  <ResponsiveImage 
                    src="/images/instant-issue-icon.svg" 
                    alt="Instant issue" 
                    width={40} 
                    height={40} 
                  />
                </div>
                <p className="text-xl font-light font-['Gibson']">Instant issue</p>
              </div>
              
              <div className="flex items-center gap-4 py-5">
                <div className="w-12 h-12 flex items-center justify-center">
                  <ResponsiveImage 
                    src="/images/credit-card-icon.svg" 
                    alt="Credit card payment support" 
                    width={40} 
                    height={40} 
                  />
                </div>
                <p className="text-xl font-light font-['Gibson']">Credit card payment support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
