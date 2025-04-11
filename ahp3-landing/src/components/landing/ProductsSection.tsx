import { ResponsiveImage } from '@/components/ui';

export const ProductsSection = () => {
  return (
    <section className="w-full py-16 bg-gradient-to-b from-[#F5F8FA] to-[#D3E3E5]">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-light text-center text-[#333333] mb-6 font-['Gibson']">
          Accident & Health <span className="font-bold">products available online</span>
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Product 1 */}
          <div className="bg-white rounded-md shadow-md p-6 flex flex-col items-center">
            <div className="w-16 h-16 mb-4 flex items-center justify-center">
              <ResponsiveImage 
                src="/images/medical-icon.svg" 
                alt="Medical" 
                width={48} 
                height={48} 
              />
            </div>
            <h3 className="text-lg font-normal text-[#333333] mb-2 text-center font-['Gibson']">
              Occupational Accident
            </h3>
            <p className="text-m text-[#333333] text-center font-['IBM_Plex_Sans']">
              Essential coverage for independent contractors who are not eligible for workers' compensation. Protects drivers by covering medical expenses, disability benefits, and accidental death in the event if a work related injury.
            </p>
          </div>
          
          {/* Product 2 */}
          <div className="bg-white rounded-md shadow-md p-6 flex flex-col items-center">
            <div className="w-16 h-16 mb-4 flex items-center justify-center">
              <ResponsiveImage 
                src="/images/off-road-accident-icon.svg" 
                alt="Off Road Accident" 
                width={48} 
                height={48} 
              />
            </div>
            <h3 className="text-lg font-normal text-[#333333] mb-2 text-center font-['Gibson']">
              Non-Trucking Liability
            </h3>
            <p className="text-m text-[#333333] text-center font-['IBM_Plex_Sans']">
              Covers drivers for drivers when they are using the truck for non-business purposes, such as personal errands or commuting. This protection fills the gap when a driver is off dispatch, shielding them from potential liability claims that could otherwise be costly.
            </p>
          </div>
          
          {/* Product 3 */}
          <div className="bg-white rounded-md shadow-md p-6 flex flex-col items-center">
            <div className="w-16 h-16 mb-4 flex items-center justify-center">
              <ResponsiveImage 
                src="/images/roadside-assistance-icon.svg" 
                alt="Roadside Assistance" 
                width={48} 
                height={48} 
              />
            </div>
            <h3 className="text-lg font-normal text-[#333333] mb-2 text-center font-['Gibson']">
              Vehicle Physical Damage
            </h3>
            <p className="text-m text-[#333333] text-center font-['IBM_Plex_Sans']">
              Pays for repairs or replacement of the truck in case of damage from accident, fire, theft, or natural disasters. This coverage helps protect a motor carrier's investment in equipment, ensuring the vehicle stays on the road with minimal financial setbacks.
            </p>
          </div>
        </div>
        
        <div className="text-center text-m text-[#333333] mb-4 font-['Gibson']">
          Underwritten by [Underwriting Company]. [Product] not available to motor carriers located in [state], [state], and [state]
        </div>
        
        <div className="text-center text-m text-[#333333] font-['Gibson']">
          Learn more about Accident & Health and their full suite of products.
        </div>
      </div>
    </section>
  );
};
