'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CheckCircle, ShieldCheck, Banknote, Users, HandCoins, Building2, ChevronDown, UserPlus, UserCheck } from 'lucide-react';
import { useLanguage } from '@/components/language-provider';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Hero() {
  const { t } = useLanguage();
  const router = useRouter();
  
  return (
    <section className="relative overflow-hidden pt-16 pb-12 md:pt-24 md:pb-20 bg-background">
      {/* Background decoration like jioresume */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center text-center space-y-10">
          <div className="space-y-6 max-w-4xl">
            {/* Badge like jioresume */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium animate-in fade-in slide-in-from-top-4 duration-1000">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              {t.hero.newBadge}
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground animate-in fade-in slide-in-from-bottom-4 duration-1000">
              {t.hero.title}
            </h1>
            <p className="text-xl text-muted-foreground md:text-2xl max-w-[48rem] mx-auto animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-100 leading-relaxed">
              {t.hero.description}
            </p>
            
            {/* Social proof like jioresume */}
            <div className="flex items-center justify-center gap-4 text-sm font-medium text-muted-foreground animate-in fade-in duration-1000 delay-200">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted overflow-hidden">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} 
                      alt="User" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <span>{t.hero.userCount}</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-6 w-full max-w-3xl animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="lg"
                    className="h-14 px-10 rounded-xl text-lg font-semibold gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 w-full sm:w-auto"
                  >
                    {t.hero?.action?.options?.apply || "Apply for Loan"}
                    <ChevronDown className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-64 p-2 rounded-xl">
                  <DropdownMenuItem 
                    className="h-12 rounded-lg gap-3 cursor-pointer"
                    onClick={() => router.push("/apply")}
                  >
                    <UserPlus className="w-5 h-5 text-primary" />
                    <div className="flex flex-col">
                      <span className="font-semibold">{t.hero?.applicantType?.options?.new || "New Applicant"}</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="h-12 rounded-lg gap-3 cursor-pointer"
                    onClick={() => router.push("/apply/existing")}
                  >
                    <UserCheck className="w-5 h-5 text-primary" />
                    <div className="flex flex-col">
                      <span className="font-semibold">{t.hero?.applicantType?.options?.existing || "Existing Customer"}</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                size="lg"
                variant="outline"
                className="h-14 px-10 rounded-xl text-lg font-semibold gap-2 border-2 hover:bg-muted transition-all duration-300 w-full sm:w-auto"
                onClick={() => router.push("/status")}
              >
                {t.hero?.action?.options?.status || "Check Loan Status"}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">{t.hero.noCreditCard}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Features() {
  const { t } = useLanguage();
  return (
    <section className="py-16 bg-muted/30">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{t.features.sectionTitle}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t.features.sectionSubtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group p-8 rounded-3xl bg-background border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-3">{t.features.secure.title}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {t.features.secure.description}
            </p>
          </div>
          
          <div className="group p-8 rounded-3xl bg-background border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Banknote className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-3">{t.features.quick.title}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {t.features.quick.description}
            </p>
          </div>
          
          <div className="group p-8 rounded-3xl bg-background border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-3">{t.features.transparent.title}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {t.features.transparent.description}
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
    <section className="py-16 bg-background">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{t.howItWorks.title}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t.howItWorks.subtitle}</p>
        </div>
        <div className="relative">
          {/* Connector line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-muted-foreground/10 -translate-y-1/2 -z-10" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="group flex flex-col items-center text-center space-y-6 relative">
                <div className="w-20 h-20 rounded-full bg-background border-4 border-muted flex items-center justify-center text-2xl font-bold text-primary group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-xl">
                  {step}
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">{t.howItWorks.steps[step as 1|2|3|4].title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{t.howItWorks.steps[step as 1|2|3|4].description}</p>
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
  return (
    <section className="py-24 bg-primary/5 border-y border-primary/10">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="space-y-4">
            <div className="text-5xl font-extrabold text-primary flex items-center justify-center gap-3">
              <Users className="w-10 h-10" /> 10,000+
            </div>
            <p className="text-xl font-medium text-muted-foreground">{t.stats.users}</p>
          </div>
          <div className="space-y-4">
            <div className="text-5xl font-extrabold text-primary flex items-center justify-center gap-3">
              <HandCoins className="w-10 h-10" /> $5M+
            </div>
            <p className="text-xl font-medium text-muted-foreground">{t.stats.loans}</p>
          </div>
          <div className="space-y-4">
            <div className="text-5xl font-extrabold text-primary flex items-center justify-center gap-3">
              <Building2 className="w-10 h-10" /> 99%
            </div>
            <p className="text-xl font-medium text-muted-foreground">{t.stats.satisfaction}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  const { t } = useLanguage();
  const handles = ["@jhamisi", "@smwangi", "@dochieng"];
  return (
    <section className="py-16 bg-muted/20">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{t.testimonials.title}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t.testimonials.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-8 rounded-3xl bg-background border border-border shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 20}`} 
                    alt={t.testimonials[i as 1|2|3].name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-lg">{t.testimonials[i as 1|2|3].name}</h4>
                  <p className="text-sm text-primary font-medium">{handles[i-1]}</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed italic flex-grow">
                &quot;{t.testimonials[i as 1|2|3].text}&quot;
              </p>
              <div className="mt-6 flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-500 fill-current" viewBox="0 0 20 20">
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
}

export function CTA() {
  const { t } = useLanguage();
  const router = useRouter();
  
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary -z-10" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80 -z-10" />
      
      {/* Decorative patterns */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

      <div className="container px-4 md:px-6 mx-auto text-center space-y-10 max-w-4xl relative">
        <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
          {t.cta.title}
        </h2>
        <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed">
          {t.cta.description}
        </p>
        
        <div className="flex flex-col items-center gap-6 pt-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="lg"
                  variant="secondary"
                  className="h-14 px-10 rounded-xl text-lg font-bold shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 w-full sm:w-auto gap-2"
                >
                  {t.cta?.action?.options?.apply || "Apply for Loan"}
                  <ChevronDown className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-64 p-2 rounded-xl">
                <DropdownMenuItem 
                  className="h-12 rounded-lg gap-3 cursor-pointer"
                  onClick={() => router.push("/apply")}
                >
                  <UserPlus className="w-5 h-5 text-primary" />
                  <div className="flex flex-col">
                    <span className="font-semibold">{t.cta?.applicantType?.options?.new || "New Applicant"}</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="h-12 rounded-lg gap-3 cursor-pointer"
                  onClick={() => router.push("/apply/existing")}
                >
                  <UserCheck className="w-5 h-5 text-primary" />
                  <div className="flex flex-col">
                    <span className="font-semibold">{t.cta?.applicantType?.options?.existing || "Existing Customer"}</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              size="lg"
              variant="outline"
              className="h-14 px-10 rounded-xl text-lg font-bold shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 w-full sm:w-auto border-white/30 text-white hover:bg-white/10 hover:text-white"
              onClick={() => router.push("/status")}
            >
              {t.cta?.action?.options?.status || "Check Loan Status"}
            </Button>
          </div>
          <div className="flex items-center gap-6 text-white/80 font-medium">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" /> {t.cta.fastApproval}
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" /> {t.cta.secureProcess}
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" /> {t.cta.support247}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-background border-t border-border pt-16 pb-8">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-primary">TFM</h3>
            <p className="text-muted-foreground leading-relaxed max-w-xs">
              {t.footer.aboutText}
            </p>
            <div className="flex gap-4">
              {/* Social icons placeholders */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer">
                  <div className="w-5 h-5 bg-current opacity-20" />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <h3 className="font-bold text-lg">{t.footer.contact}</h3>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex items-center gap-3 hover:text-primary transition-colors cursor-pointer">
                <div className="w-5 h-5 bg-primary/10 rounded flex items-center justify-center" />
                feisalramar@gmail.com
              </li>
              <li className="flex items-center gap-3 hover:text-primary transition-colors cursor-pointer">
                <div className="w-5 h-5 bg-primary/10 rounded flex items-center justify-center" />
                +255 659860313
              </li>
              <li className="flex items-center gap-3 hover:text-primary transition-colors cursor-pointer">
                <div className="w-5 h-5 bg-primary/10 rounded flex items-center justify-center" />
                Dar es Salaam, Tanzania
              </li>
            </ul>
          </div>
          <div className="space-y-6">
            <h3 className="font-bold text-lg">{t.footer.legal}</h3>
            <ul className="space-y-4 text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">{t.footer.privacy}</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">{t.footer.terms}</Link></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h3 className="font-bold text-lg">{t.footer.newsletter}</h3>
            <p className="text-sm text-muted-foreground">{t.footer.newsletterText}</p>
            <div className="flex gap-2">
              <input type="email" placeholder={t.footer.emailPlaceholder} className="bg-muted border-none rounded-lg px-4 py-2 w-full text-sm focus:ring-2 focus:ring-primary/20" />
              <Button size="sm">{t.footer.join}</Button>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Trust fund microfinance. {t.footer.rights}</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-primary transition-colors">{t.footer.privacy}</Link>
            <Link href="#" className="hover:text-primary transition-colors">{t.footer.terms}</Link>
            <Link href="#" className="hover:text-primary transition-colors">{t.footer.cookies}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
