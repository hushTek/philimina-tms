'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CheckCircle, ShieldCheck, Banknote, Users, HandCoins, Building2 } from 'lucide-react';
import { useLanguage } from '@/components/language-provider';

export function Hero() {
  const { t } = useLanguage();
  return (
    <section className="relative overflow-hidden py-20 md:py-32 bg-gradient-to-b from-background to-muted/20">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              {t.hero.title}
            </h1>
            <p className="text-xl text-muted-foreground md:text-2xl max-w-[42rem] mx-auto animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-100">
              {t.hero.description}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
            <Link href="/apply">
              <Button size="lg" className="w-full sm:w-auto gap-2 text-lg h-12 px-8">
                {t.hero.applyButton} <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/status">
              <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 text-lg h-12 px-8">
                {t.hero.statusButton} <CheckCircle className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Features() {
  const { t } = useLanguage();
  return (
    <section className="py-20 bg-muted/50">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-background/50 backdrop-blur border-none shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <ShieldCheck className="w-12 h-12 text-primary mb-4" />
              <CardTitle>{t.features.secure.title}</CardTitle>
              <CardDescription>
                {t.features.secure.description}
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="bg-background/50 backdrop-blur border-none shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <Banknote className="w-12 h-12 text-primary mb-4" />
              <CardTitle>{t.features.quick.title}</CardTitle>
              <CardDescription>
                {t.features.quick.description}
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="bg-background/50 backdrop-blur border-none shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CheckCircle className="w-12 h-12 text-primary mb-4" />
              <CardTitle>{t.features.transparent.title}</CardTitle>
              <CardDescription>
                {t.features.transparent.description}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const { t } = useLanguage();
  return (
    <section className="py-20">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">{t.howItWorks.title}</h2>
          <p className="text-xl text-muted-foreground">{t.howItWorks.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                {step}
              </div>
              <h3 className="text-xl font-bold">{t.howItWorks.steps[step as 1|2|3|4].title}</h3>
              <p className="text-muted-foreground">{t.howItWorks.steps[step as 1|2|3|4].description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Stats() {
  const { t } = useLanguage();
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-4xl font-bold flex items-center justify-center gap-2">
              <Users className="w-8 h-8" /> 10,000+
            </div>
            <p className="text-primary-foreground/80">{t.stats.users}</p>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-bold flex items-center justify-center gap-2">
              <HandCoins className="w-8 h-8" /> $5M+
            </div>
            <p className="text-primary-foreground/80">{t.stats.loans}</p>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-bold flex items-center justify-center gap-2">
              <Building2 className="w-8 h-8" /> 99%
            </div>
            <p className="text-primary-foreground/80">{t.stats.satisfaction}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  const { t } = useLanguage();
  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4 md:px-6 mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t.testimonials.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-background">
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4">&quot;{t.testimonials[i as 1|2|3].text}&quot;</p>
                <p className="font-bold">{t.testimonials[i as 1|2|3].name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTA() {
  const { t } = useLanguage();
  return (
    <section className="py-20">
      <div className="container px-4 md:px-6 mx-auto text-center space-y-8 max-w-2xl">
        <h2 className="text-3xl md:text-4xl font-bold">{t.cta.title}</h2>
        <p className="text-xl text-muted-foreground">{t.cta.description}</p>
        <Link href="/apply">
          <Button size="lg" className="text-lg px-8">
            {t.cta.button}
          </Button>
        </Link>
      </div>
    </section>
  );
}

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-muted py-12">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-bold text-lg">{t.footer.about}</h3>
            <p className="text-muted-foreground text-sm">
              {t.footer.aboutText}
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-lg">{t.footer.contact}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>feisalramar@gmail.com</li>
              <li>+255 659860313</li>
              <li>Dar es Salaam, Tanzania</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:underline">{t.footer.privacy}</Link></li>
              <li><Link href="#" className="hover:underline">{t.footer.terms}</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} TMS. {t.footer.rights}
        </div>
      </div>
    </footer>
  );
}
