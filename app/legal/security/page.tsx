'use client';

import { Footer } from "@/app/_components/landing-sections";
import { ShieldCheck, Lock, Server, Eye } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

export default function SecurityPage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">{language === 'sw' ? 'Usalama' : 'Security'}</h1>
        
        <div className="prose dark:prose-invert max-w-none space-y-8">
          <p className="text-lg text-muted-foreground">
            {language === 'sw' 
              ? 'Katika Trust Funding Microfinance (TFM), kulinda data yako ya kifedha na taarifa zako binafsi ndio kipaumbele chetu kikuu. Tunatumia hatua za usalama za kiwango cha kibenki kuhakikisha uzoefu wako ni salama na wenye ulinzi.'
              : 'At Trust Funding Microfinance (TFM), protecting your financial data and personal information is our top priority. We employ bank-grade security measures to ensure your experience is safe and secure.'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            <div className="p-6 border rounded-xl bg-card">
              <Lock className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-bold text-lg mb-2">{language === 'sw' ? 'Usimbaji wa Data' : 'Data Encryption'}</h3>
              <p className="text-sm text-muted-foreground">
                {language === 'sw'
                  ? 'Data yote inayotumwa kati ya kivinjari chako na seva zetu imesimbwa kwa kutumia usimbaji wa 256-bit SSL/TLS. Taarifa zako nyeti zimesimbwa zikiwa zimehifadhiwa kwenye hifadhidata zetu.'
                  : 'All data transmitted between your browser and our servers is encrypted using 256-bit SSL/TLS encryption. Your sensitive information is encrypted at rest in our databases.'}
              </p>
            </div>
            
            <div className="p-6 border rounded-xl bg-card">
              <Server className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-bold text-lg mb-2">{language === 'sw' ? 'Miundombinu Salama' : 'Secure Infrastructure'}</h3>
              <p className="text-sm text-muted-foreground">
                {language === 'sw'
                  ? 'Seva zetu zinahifadhiwa katika vituo vya data vilivyo salama, vinavyotii viwango vya SOC 2 na ufuatiliaji wa 24/7, udhibiti wa ufikiaji wa kibayometriki, na mifumo ya umeme ya dharura.'
                  : 'Our servers are hosted in secure, SOC 2 compliant data centers with 24/7 monitoring, biometric access controls, and redundant power systems.'}
              </p>
            </div>

            <div className="p-6 border rounded-xl bg-card">
              <ShieldCheck className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-bold text-lg mb-2">{language === 'sw' ? 'Uhakiki wa Utambulisho' : 'Identity Verification'}</h3>
              <p className="text-sm text-muted-foreground">
                {language === 'sw'
                  ? 'Tunatumia uthibitishaji wa hatua nyingi (MFA) na itifaki za hali ya juu za uhakiki wa utambulisho ili kuzuia udanganyifu na kuhakikisha ni wewe tu unayeweza kufikia akaunti yako.'
                  : 'We use multi-factor authentication (MFA) and advanced identity verification protocols to prevent fraud and ensure only you can access your account.'}
              </p>
            </div>

            <div className="p-6 border rounded-xl bg-card">
              <Eye className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-bold text-lg mb-2">{language === 'sw' ? 'Ufuatiliaji wa Udanganyifu' : 'Fraud Monitoring'}</h3>
              <p className="text-sm text-muted-foreground">
                {language === 'sw'
                  ? 'Mifumo yetu ya kiotomatiki inafuatilia miamala 24/7 kwa shughuli za kutiliwa shaka. Tunatambulisha na kuchunguza mara moja tabia yoyote isiyo ya kawaida ili kulinda pesa zako.'
                  : 'Our automated systems monitor transactions 24/7 for suspicious activity. We immediately flag and investigate any unusual behavior to protect your funds.'}
              </p>
            </div>
          </div>

          <section>
            <h2 className="text-xl font-semibold mb-3">{language === 'sw' ? 'Utiifu na Kisheria' : 'Compliance & Legal'}</h2>
            <p>
              {language === 'sw' ? 'Tunazingatia kanuni zote muhimu za kifedha nchini Tanzania.' : 'We adhere to all relevant financial regulations in Tanzania.'}
            </p>
            <p className="mt-2">
              <strong>{language === 'sw' ? 'Ushughulikiaji wa Sarafu:' : 'Currency Handling:'}</strong> {language === 'sw'
                ? 'Ingawa tunaonyesha picha za sarafu ya Tanzania kwa madhumuni ya kielelezo, hatuchapishi au kuzalisha tena sarafu. Uwakilishi wote wa kidijitali kwenye tovuti hii umewekwa alama kama "SPECIMEN" na unafuata miongozo ya Benki Kuu ya Tanzania ili kuzuia ughushi na matumizi mabaya. Chanzo cha picha za sarafu: '
                : 'While we display images of Tanzanian currency for illustrative purposes, we do not print or reproduce currency. All digital representations on this site are marked as "SPECIMEN" and follow the Bank of Tanzania\'s guidelines to prevent counterfeiting and misuse. Source of currency images: '}
              <a href="https://www.bot.go.tz/Currency/BanknotesAndCoinsIssued" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Bank of Tanzania</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">{language === 'sw' ? 'Kuripoti Udhaifu' : 'Reporting a Vulnerability'}</h2>
            <p>
              {language === 'sw'
                ? 'Ikiwa unaamini umepata udhaifu wa kiusalama katika programu yetu, tafadhali wasiliana na timu yetu ya usalama mara moja kupitia security@chapchap.co.tz. Tunaendesha mpango wa uwajibikaji wa ufichuzi na tunathamini msaada wako katika kuweka jukwaa letu salama.'
                : 'If you believe you have found a security vulnerability in our application, please contact our security team immediately at security@chapchap.co.tz. We operate a responsible disclosure program and appreciate your help in keeping our platform safe.'}
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
