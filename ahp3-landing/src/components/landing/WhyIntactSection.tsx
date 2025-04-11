import { ResponsiveImage } from '@/components/ui';

export const WhyIntactSection = () => {
  return (
    <section className="bg-[#004248]">
      <div className="max-w-7xl mx-auto px-6 py-16 flex items-center h-[280px]">
        
        <div className="flex flex-col md:flex-row items-center gap-8">
          
          <div className="md:w-1/3 flex flex-col justify-center">
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 mt-1 flex-shrink-0">
                  <ResponsiveImage 
                    src="/images/specialty-expertise-icon.svg" 
                    alt="Specialty expertise" 
                    width={32} 
                    height={32} 
                  />
                </div>
                <p className="text-lg font-light text-white font-['Gibson']">
                  Specialty expertise
                </p>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 mt-1 flex-shrink-0">
                  <ResponsiveImage 
                    src="/images/dedicated-teams-icon.svg" 
                    alt="Dedicated local teams" 
                    width={32} 
                    height={32} 
                  />
                </div>
                <p className="text-lg font-light text-white font-['Gibson']">
                  Dedicated local teams
                </p>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 mt-1 flex-shrink-0">
                  <ResponsiveImage 
                    src="/images/responsive-claims-icon.svg" 
                    alt="Responsive claims support" 
                    width={32} 
                    height={32} 
                  />
                </div>
                <p className="text-lg font-light text-white font-['Gibson']">
                  Responsive claims support
                </p>
              </div>
            </div>
          </div>
          <div className="md:w-1/3 flex items-center justify-center">
            <div className="text-center">
              <ResponsiveImage 
                src="/images/why-intact-icon.svg" 
                alt="Why Intact?" 
                width={120} 
                height={120} 
              />
            </div>
          </div>
          <div className="md:w-1/2">
            <ResponsiveImage 
              src="/images/intact-logo-large.jpg" 
              alt="Intact Insurance" 
              width={500} 
              height={300} 
              className="w-full h-auto rounded-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
