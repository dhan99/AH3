import {
  Navbar,
  HeroSection,
  HeadlineSection,
  SelfServiceSection,
  HowItWorksSection,
  FleetManagementSection,
  ProductsSection,
  WhyIntactSection,
  ContactSection,
  Footer
} from '@/components/landing';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <SelfServiceSection />
      <HowItWorksSection />
      <FleetManagementSection />
      <ProductsSection />
      <HeadlineSection />
      <WhyIntactSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
