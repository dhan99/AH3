import { ResponsiveImage } from '@/components/ui';

export const HowItWorksSection = () => {
  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-semibold text-[#333333] mb-12 font-['Gibson'] text-center">How it works</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 - Qualify & Quote (Left) */}
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <ResponsiveImage 
                  src="/images/pad-icon.svg" 
                  alt="Pad" 
                  width={60} 
                  height={60} 
                />
                <div className="absolute -top-2 -right-2 bg-[#007B87] rounded-full w-8 h-8 flex items-center justify-center">
                  <ResponsiveImage 
                    src="/images/person-icon.svg" 
                    alt="Person" 
                    width={20} 
                    height={20} 
                  />
                </div>
              </div>
            </div>
            <h3 className="text-2xl font-normal text-[#333333] mb-2 text-center font-['Gibson']">Qualify & Quote</h3>
            <div className="w-16 h-1 bg-[#D8D8D8] mb-4"></div>
            <p className="text-base text-[#333333] text-center font-['Gibson']">
              Enter business information to get a quote online
            </p>
          </div>
          
          {/* Step 2 - Share & Apply (Middle) */}
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center mb-4 gap-2">
                <ResponsiveImage 
                  src="/images/computer-icon.svg" 
                  alt="Computer" 
                  width={60} 
                  height={60} 
                />
                <ResponsiveImage 
                  src="/images/multi-devices-icon.svg" 
                  alt="Multi Devices" 
                  width={60} 
                  height={60} 
                />
            </div>
            <h3 className="text-2xl font-normal text-[#333333] mb-2 text-center font-['Gibson']">Share & Apply</h3>
            <div className="w-16 h-1 bg-[#D8D8D8] mb-4"></div>
            <p className="text-base text-[#333333] text-center font-['Gibson']">
              Seamlessly pass documents between agency and motor carrier
            </p>
          </div>
          
          {/* Step 3 - Issue & Enroll (Right) */}
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <ResponsiveImage 
                  src="/images/other-endorsements-icon.svg" 
                  alt="Other Endorsements" 
                  width={60} 
                  height={60} 
                />
                <div className="absolute -top-2 -right-2 bg-[#007B87] rounded-full w-8 h-8 flex items-center justify-center">
                  <ResponsiveImage 
                    src="/images/checkmark-icon.svg" 
                    alt="Checkmark" 
                    width={20} 
                    height={20} 
                  />
                </div>
              </div>
            </div>
            <h3 className="text-2xl font-normal text-[#333333] mb-2 text-center font-['Gibson']">Issue & Enroll</h3>
            <div className="w-16 h-1 bg-[#D8D8D8] mb-4"></div>
            <p className="text-base text-[#333333] text-center font-['Gibson']">
              Motor carriers sign and send invites to enroll
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
