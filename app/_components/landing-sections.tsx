'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CheckCircle, ShieldCheck, Banknote, Users, HandCoins, Building2, ChevronDown, UserPlus, UserCheck, PlayCircle, Zap, BadgeCheck, Lock } from 'lucide-react';
import { useLanguage } from '@/components/language-provider';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NOTES = [
  { id: '10k', front: '/currencies/10k_front.jpg', alt: '10,000 TZS' },
  { id: '5k', front: '/currencies/5k_front.jpg', alt: '5,000 TZS' },
  { id: '2k', front: '/currencies/2k_front.jpg', alt: '2,000 TZS' },
  { id: '1k', front: '/currencies/1k_front.jpg', alt: '1,000 TZS' },
];

function CurrencyCarousel() {
  const [order, setOrder] = useState([0, 1, 2, 3]);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Trigger Flip & Move Animation
      setIsFlipping(true);

      // 2. After flip/move duration, reorder the array and reset state
      setTimeout(() => {
        setOrder((prev) => {
          const newOrder = [...prev];
          const first = newOrder.shift(); // Remove first element
          if (first !== undefined) newOrder.push(first); // Add it to the end
          return newOrder;
        });
        setIsFlipping(false);
      }, 1000); // Animation duration

    }, 4000); // Total cycle time

    return () => clearInterval(interval);
  }, []);

  // Positions based on index in the visual stack (0 is front, 3 is back)
  const getStyle = (visualIndex: number) => {
    // FRONT CARD (0) -> Moving to BACK
    if (visualIndex === 0) {
        if (isFlipping) {
            // Animate moving up, flipping, and going to back
            return {
                zIndex: 50, // Keep on top during animation
                transform: 'translate(0px, -150px) scale(0.8)', // Move up, flip, shrink
                opacity: 0.8,
                transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)'
            };
        }
        return {
            zIndex: 40,
            transform: 'rotate(-15deg) translate(-40px, -20px)',
            opacity: 1,
            transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)'
        };
    }

    // SECOND CARD (1) -> Moving to FRONT
    if (visualIndex === 1) {
        if (isFlipping) {
             return {
                zIndex: 30, // Moves up in stack
                transform: 'rotate(-15deg) translate(-40px, -20px)', // Moves to pos 0
                opacity: 1,
                transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)'
            };
        }
        return {
            zIndex: 30,
            transform: 'rotate(-5deg) translate(-10px, -5px)',
            opacity: 1,
            transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)'
        };
    }

    // THIRD CARD (2) -> Moving to SECOND
    if (visualIndex === 2) {
        if (isFlipping) {
            return {
                zIndex: 20,
                transform: 'rotate(-5deg) translate(-10px, -5px)', // Moves to pos 1
                opacity: 1,
                transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)'
            };
        }
        return {
            zIndex: 20,
            transform: 'rotate(5deg) translate(20px, 15px)',
            opacity: 1,
            transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)'
        };
    }

    // LAST CARD (3) -> Moving to THIRD (Coming from bottom/back?)
    // Actually, when 0 moves to back, it becomes 3. 
    // The current 3 becomes 2.
    if (visualIndex === 3) {
        if (isFlipping) {
             return {
                zIndex: 10,
                transform: 'rotate(5deg) translate(20px, 15px)', // Moves to pos 2
                opacity: 1,
                transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)'
            };
        }
        return {
            zIndex: 10,
            transform: 'rotate(15deg) translate(50px, 40px)',
            opacity: 1,
            transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)'
        };
    }
    
    return {};
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center cursor-pointer perspective-[1000px]">
      {order.map((noteIndex, visualIndex) => {
        const note = NOTES[noteIndex];
        const style = getStyle(visualIndex);
        
        // We handle the flip via the container transform in getStyle now for the "pick up" effect
        // But we still want to show the back face if it's the one flipping over
        // Actually, if we rotateY(180deg) the container, we see the back.
        
        return (
          <div
            key={note.id}
            className="absolute"
            style={style as any}
          >
            <div 
                className="w-[320px] relative preserve-3d shadow-2xl rounded-sm overflow-hidden"
            >
              <div className="absolute inset-0 backface-hidden">
                <img src={note.front} alt={`${note.alt} Front`} className="w-full h-auto rounded-sm ring-1 ring-black/5" />
                {/* Specimen Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-4xl font-bold text-red-500/50 uppercase tracking-widest rotate-[-30deg] border-4 border-red-500/50 p-2 rounded-lg">
                        SPECIMEN
                    </span>
                </div>
              </div>
              {/* Invisible spacer */}
              <img src={note.front} alt="" className="w-full h-auto opacity-0 pointer-events-none" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Hero() {
  const { t } = useLanguage();
  const router = useRouter();
  
  return (
    <section className="relative overflow-hidden pt-6 pb-10 md:pt-12 md:pb-16 bg-background">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -z-10 rounded-bl-[100px] hidden md:block" />
      <div className="absolute top-20 left-10 w-24 h-24 bg-secondary/10 rounded-full blur-3xl -z-10" />
      
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Content */}
          <div className="flex flex-col items-start text-left space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-secondary/20 border border-secondary/30 text-secondary-foreground text-[10px] font-bold uppercase tracking-wider">
              <BadgeCheck className="w-3.5 h-3.5 text-secondary-foreground" />
              Trust Funding Microfinance
            </div>

            {/* Main Heading Area */}
            <div className="space-y-3 w-full">
              {/* Preserved Logo as Heading */}
              <div className='relative w-full h-16 md:h-20 animate-in fade-in slide-in-from-bottom-4 duration-1000 origin-left'>
                <Image
                  src="/text_only.png" 
                  alt="Trust Funding Microfinance" 
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>

              {/* Complementary Text from Design */}
              {/* <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
                Fast, Secure Loans at Your <span className="text-primary">Fingertips</span>
              </h1> */}
            </div>

            <p className="text-base text-muted-foreground md:text-lg max-w-lg leading-relaxed">
              {t.hero.description}
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="lg"
                    className="h-12 px-6 rounded-lg text-base font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all w-full sm:w-auto gap-2"
                  >
                    {t.hero?.action?.options?.apply || "Apply for Loan"}
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64 p-2 rounded-lg">
                  <DropdownMenuItem 
                    className="h-10 rounded-md gap-3 cursor-pointer"
                    onClick={() => router.push("/apply")}
                  >
                    <UserPlus className="w-4 h-4 text-primary" />
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">{t.hero?.applicantType?.options?.new || "New Applicant"}</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="h-10 rounded-md gap-3 cursor-pointer"
                    onClick={() => router.push("/apply/existing")}
                  >
                    <UserCheck className="w-4 h-4 text-primary" />
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">{t.hero?.applicantType?.options?.existing || "Existing Customer"}</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                size="lg"
                variant="outline"
                className="h-12 px-6 rounded-lg text-base font-semibold gap-2 border-2 w-full sm:w-auto"
                onClick={() => router.push("/#how-it-works")}
              >
                {t.howItWorks.title || "How it works"}
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted overflow-hidden">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 15}`} 
                      alt="User" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="text-xs">
                <span className="font-bold text-foreground">10,000+</span> <span className="text-muted-foreground">{t.hero.userCount || "happy entrepreneurs"}</span>
              </div>
            </div>
          </div>
          
          {/* Right Column: Image & Card */}
          <div className="relative hidden md:block h-[500px] w-full perspective-[1000px]">
             <CurrencyCarousel />
             
             {/* Source Citation */}
             <div className="absolute bottom-4 left-0 right-0 text-center z-50 pointer-events-none">
                <p className="text-[10px] text-muted-foreground/60">
                  Banknote images source: <a href="https://www.bot.go.tz/Currency/BanknotesAndCoinsIssued" target="_blank" rel="noopener noreferrer" className="hover:underline pointer-events-auto">Bank of Tanzania</a>
                </p>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export function Features() {
  const { t } = useLanguage();
  return (
    <section className="py-12 bg-muted/30">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-8 space-y-2">
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-foreground">Why Choose <span className="text-primary">Chap Chap?</span></h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">{t.features.sectionSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="group p-6 rounded-2xl bg-background border border-border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2">{t.features.quick.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t.features.quick.description}
            </p>
          </div>
          
          {/* Card 2 */}
          <div className="group p-6 rounded-2xl bg-background border border-border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Banknote className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2">{t.features.lowInterest?.title || "Low Interest"}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t.features.lowInterest?.description || "Competitive rates designed to help your business thrive without the burden of excessive costs."}
            </p>
          </div>
          
          {/* Card 3 */}
          <div className="group p-6 rounded-2xl bg-background border border-border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2">{t.features.flexibleRepayment?.title || "Flexible Repayment"}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t.features.flexibleRepayment?.description || "Choose a repayment plan that suits your cash flow. Pay weekly or monthly with ease."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const { t } = useLanguage();
  return (
    <section id="how-it-works" className="py-12 bg-background">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-8 space-y-2">
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight">{t.howItWorks.title}</h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">{t.howItWorks.subtitle}</p>
        </div>
        <div className="relative">
          {/* Connector line for desktop */}
          <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-muted -z-10" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="group flex flex-col items-center text-center space-y-4 relative bg-background p-2">
                <div className="w-16 h-16 rounded-full bg-background border-4 border-muted flex items-center justify-center text-xl font-bold text-primary group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-md">
                  {step}
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold">{t.howItWorks.steps[step as 1|2|3|4].title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-xs">{t.howItWorks.steps[step as 1|2|3|4].description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Stats() {
  const { t } = useLanguage();
  return null;
  /* 
  return (
    <section className="py-10 bg-primary/5 border-y border-primary/10">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-4xl font-extrabold text-primary flex items-center justify-center gap-2">
              <Users className="w-8 h-8" /> 10k+
            </div>
            <p className="text-base font-medium text-muted-foreground">{t.stats.users}</p>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-extrabold text-primary flex items-center justify-center gap-2">
              <HandCoins className="w-8 h-8" /> $5M+
            </div>
            <p className="text-base font-medium text-muted-foreground">{t.stats.loans}</p>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-extrabold text-primary flex items-center justify-center gap-2">
              <Building2 className="w-8 h-8" /> 99%
            </div>
            <p className="text-base font-medium text-muted-foreground">{t.stats.satisfaction}</p>
          </div>
        </div>
      </div>
    </section>
  );
  */
}

export function Testimonials() {
  const { t } = useLanguage();
  return null;
  /*
  const handles = ["@jhamisi", "@smwangi", "@dochieng"];
  return (
    <section className="py-12 bg-muted/20">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-8 space-y-2">
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight">{t.testimonials.title}</h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">{t.testimonials.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 rounded-2xl bg-background border border-border shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-muted border-2 border-white shadow-sm">
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 20}`} 
                    alt={t.testimonials[i as 1|2|3].name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-base">{t.testimonials[i as 1|2|3].name}</h4>
                  <p className="text-xs text-primary font-medium">{handles[i-1]}</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed italic flex-grow text-sm">
                &quot;{t.testimonials[i as 1|2|3].text}&quot;
              </p>
              <div className="mt-4 flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-4 h-4 text-secondary fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
  */
}

export function CTA() {
  const { t } = useLanguage();
  const router = useRouter();
  
  return (
    <section className="py-12 px-4 md:px-6">
      <div className="container mx-auto">
        <div className="relative overflow-hidden rounded-[2rem] bg-background border border-border text-foreground px-6 py-10 md:py-14 text-center shadow-lg">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Ready to grow your business?
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              {t.cta.description || "Join thousands of entrepreneurs using Chap Chap for their funding needs. Get started in less than 5 minutes."}
            </p>
            
            <div className="flex justify-center pt-2">
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="lg"
                    className="h-12 px-8 rounded-xl text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-105 w-full sm:w-auto"
                  >
                    {t.cta?.action?.options?.apply || "Apply Now"}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-64 p-2 rounded-xl">
                  <DropdownMenuItem 
                    className="h-10 rounded-lg gap-3 cursor-pointer"
                    onClick={() => router.push("/apply")}
                  >
                    <UserPlus className="w-4 h-4 text-primary" />
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">{t.cta?.applicantType?.options?.new || "New Applicant"}</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="h-10 rounded-lg gap-3 cursor-pointer"
                    onClick={() => router.push("/apply/existing")}
                  >
                    <UserCheck className="w-4 h-4 text-primary" />
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">{t.cta?.applicantType?.options?.existing || "Existing Customer"}</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-xs font-medium text-muted-foreground pt-4">
               <span className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                 Instant Processing
               </span>
               <span className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                 Secure Platform
               </span>
               <span className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                 24/7 Support
               </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-background border-t border-border pt-10 pb-6">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
               <img src="/icon_only.png" alt="TFM Logo" className="w-8 h-8 rounded-full object-contain" />
               <span className="text-xl font-bold tracking-tight">Chap Chap</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {t.footer.aboutText || "Trust Funding Microfinance (TFM) is committed to providing accessible and fast financial solutions for the modern entrepreneur."}
            </p>
            <div className="flex gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300 cursor-pointer">
                  <div className="w-4 h-4 bg-current opacity-50" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-foreground">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">Loans</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Interest Rates</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Savings</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-foreground">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-foreground">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/legal/privacy" className="hover:text-primary transition-colors">{t.footer.privacy}</Link></li>
              <li><Link href="/legal/terms" className="hover:text-primary transition-colors">{t.footer.terms}</Link></li>
              <li><Link href="/legal/security" className="hover:text-primary transition-colors">{t.footer.security || "Security"}</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-muted-foreground">
          <p>© {new Date().getFullYear()} Trust Funding Microfinance (TFM). Licensed by the Central Authority.</p>
          <div className="flex items-center gap-1.5">
            <Lock className="w-3 h-3" />
            <span>Bank-Level Security Protocol</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
