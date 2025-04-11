import Link from 'next/link';
import { ResponsiveImage } from '@/components/ui';

export const HeadlineSection = () => {
  return (
    <section className="w-full py-16 bg-[#F2FBFC]">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-semibold text-[#333333] text-center mb-12 font-['Gibson']">
          [Headline]
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brokers Card */}
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-white">
            <div className="flex justify-center mb-4">
              <ResponsiveImage 
                src="/images/brokers-figma-icon.svg" 
                alt="Brokers Icon" 
                width={50} 
                height={50} 
              />
            </div>
            <h3 className="text-xl font-semibold text-[#333333] text-center mb-4 font-['Gibson']">
              Brokers
            </h3>
            <ul className="space-y-4">
              <li className="border-b-0 border-[#007B87] py-2">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 mt-1 flex-shrink-0">
                    <ResponsiveImage 
                      src="/images/checkmark2-icon.svg" 
                      alt="login with your producer credentials" 
                      width={8} 
                      height={8} 
                    />
                  </div>
                  <p className="text-m text-[#333333] font-['IBM_Plex_Sans']">
                    Login with your producer credentials
                  </p>
                </div>
              </li>
              <li className="border-b-0 border-[#007B87] py-2">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 mt-1 flex-shrink-0">
                    <ResponsiveImage 
                      src="/images/checkmark2-icon.svg" 
                      alt="Placeholder text to come"
                      width={8} 
                      height={8} 
                    />
                  </div>
                  <p className="text-m text-[#333333] font-['IBM_Plex_Sans']">
                    [Placeholder text to come]
                  </p>
                </div>
              </li>
              <li className="border-b-0 border-[#007B87] py-2">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 mt-1 flex-shrink-0">
                    <ResponsiveImage 
                      src="/images/checkmark2-icon.svg" 
                      alt="Placeholder text to come"
                      width={8} 
                      height={8} 
                    />
                  </div>
                  <p className="text-m text-[#333333] font-['IBM_Plex_Sans']">
                    [Placeholder text to come]
                  </p>
                </div>
              </li>
            </ul>
          </div>
          
          {/* Motor Carriers Card */}
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-white">
            <div className="flex justify-center mb-4">
              <ResponsiveImage 
                src="/images/motor-carriers-figma-icon.svg" 
                alt="Motor Carriers Icon" 
                width={50} 
                height={50} 
              />
            </div>
            <h3 className="text-xl font-semibold text-[#333333] text-center mb-4 font-['Gibson']">
              Motor Carriers
            </h3>
            <ul className="space-y-4">
              <li className="border-b-0 border-[#007B87] py-2">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 mt-1 flex-shrink-0">
                    <ResponsiveImage 
                      src="/images/checkmark2-icon.svg" 
                      alt="Placeholder text to come"
                      width={8} 
                      height={8} 
                    />
                  </div>
                  <p className="text-m text-[#333333] font-['IBM_Plex_Sans']">
                    [Placeholder text to come]
                  </p>
                </div>
              </li>
              <li className="border-b-0 border-[#007B87] py-2">
              <div className="flex items-start gap-4">
                  <div className="w-8 h-8 mt-1 flex-shrink-0">
                    <ResponsiveImage 
                      src="/images/checkmark2-icon.svg" 
                      alt="Placeholder text to come"
                      width={8} 
                      height={8} 
                    />
                  </div>
                  <p className="text-m text-[#333333] font-['IBM_Plex_Sans']">
                    [Placeholder text to come]
                  </p>
                </div>
              </li>
              <li className="border-b-0 border-[#007B87] py-2">
              <div className="flex items-start gap-4">
                  <div className="w-8 h-8 mt-1 flex-shrink-0">
                    <ResponsiveImage 
                      src="/images/checkmark2-icon.svg" 
                      alt="Placeholder text to come"
                      width={8} 
                      height={8} 
                    />
                  </div>
                  <p className="text-m text-[#333333] font-['IBM_Plex_Sans']">
                    [Placeholder text to come]
                  </p>
                </div>
              </li>
            </ul>
          </div>
          
          {/* Drivers Card */}
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-white">
            <div className="flex justify-center mb-4">
              <ResponsiveImage 
                src="/images/drivers-figma-icon.svg" 
                alt="Drivers Icon" 
                width={50} 
                height={50} 
              />
            </div>
            <h3 className="text-xl font-semibold text-[#333333] text-center mb-4 font-['Gibson']">
              Drivers
            </h3>
            <ul className="space-y-4">
              <li className="border-b-0 border-[#007B87] py-2">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 mt-1 flex-shrink-0">
                    <ResponsiveImage 
                      src="/images/checkmark2-icon.svg" 
                      alt="Placeholder text to come"
                      width={8} 
                      height={8} 
                    />
                  </div>
                  <p className="text-m text-[#333333] font-['IBM_Plex_Sans']">
                    [Placeholder text to come]
                  </p>
                </div>
              </li>
              <li className="border-b-0 border-[#007B87] py-2">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 mt-1 flex-shrink-0">
                    <ResponsiveImage 
                      src="/images/checkmark2-icon.svg" 
                      alt="Placeholder text to come"
                      width={8} 
                      height={8} 
                    />
                  </div>
                  <p className="text-m text-[#333333] font-['IBM_Plex_Sans']">
                    [Placeholder text to come]
                  </p>
                </div>
              </li>
              <li className="border-b-0 border-[#007B87] py-2">
                <p className="text-m text-[#333333] font-['IBM_Plex_Sans'] text-center font-semibold">
                  Encourage your motor carrier to sponsor a plan today!
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
