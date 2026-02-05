'use client';

import { Footer } from "@/app/_components/landing-sections";
import { useLanguage } from "@/components/language-provider";

export default function PrivacyPolicy() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">{language === 'sw' ? 'Sera ya Faragha' : 'Privacy Policy'}</h1>
        
        <div className="prose dark:prose-invert max-w-none space-y-6">
          <p className="text-sm text-muted-foreground">{language === 'sw' ? 'Imesasishwa mwisho: 2/5/2026' : 'Last Updated: 2/5/2026'}</p>

          <section>
            <h2 className="text-xl font-semibold mb-3">{language === 'sw' ? '1. Utangulizi' : '1. Introduction'}</h2>
            <p>
              {language === 'sw' 
                ? 'Trust Funding Microfinance ("TFM", "sisi", au "yetu") inaheshimu faragha yako na imejitolea kulinda data yako ya kibinafsi. Sera hii ya faragha itakujulisha jinsi tunavyotunza data yako ya kibinafsi unapotembelea tovuti yetu (bila kujali unapotembelea kutoka wapi) na kukuambia kuhusu haki zako za faragha na jinsi sheria inavyokulinda.'
                : 'Trust Funding Microfinance ("TFM", "we", "us", or "our") respects your privacy and is committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">{language === 'sw' ? '2. Data Tunayokusanya' : '2. Data We Collect'}</h2>
            <p>{language === 'sw' ? 'Tunaweza kukusanya, kutumia, kuhifadhi na kuhamisha aina tofauti za data ya kibinafsi kukuhusu ambayo tumeweka pamoja kama ifuatavyo:' : 'We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:'}</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>{language === 'sw' ? 'Data ya Utambulisho:' : 'Identity Data:'}</strong> {language === 'sw' ? 'inajumuisha jina kamili, tarehe ya kuzaliwa, hali ya ndoa, Nambari ya Kitambulisho cha Taifa (NIDA), na picha ya mwombaji (selfie).' : 'includes full name, date of birth, marital status, National ID (NIDA) Number, and applicant photo (selfie).'}</li>
              <li><strong>{language === 'sw' ? 'Data ya Mawasiliano:' : 'Contact Data:'}</strong> {language === 'sw' ? 'inajumuisha nambari ya simu, anwani ya barua pepe, anwani ya makazi (mtaa, nambari ya nyumba, kata, wilaya, mkoa), na hali ya umiliki wa makazi.' : 'includes phone number, email address, residence address (street, house number, ward, district, region), and residence ownership status.'}</li>
              <li><strong>{language === 'sw' ? 'Data ya Ajira:' : 'Employment Data:'}</strong> {language === 'sw' ? 'inajumuisha hali ya ajira, jina la kampuni/biashara, anwani, na cheo.' : 'includes employment status, company/business name, address, and position.'}</li>
              <li><strong>{language === 'sw' ? 'Data ya Kifedha:' : 'Financial Data:'}</strong> {language === 'sw' ? 'inajumuisha maelezo ya mkopo (kiasi, dhumuni, mikopo iliyopo) na maelezo ya akaunti ya benki au pesa ya simu kwa utoaji/marejesho.' : 'includes loan details (amount, purpose, existing loans) and bank account or mobile money details for disbursement/repayment.'}</li>
              <li><strong>{language === 'sw' ? 'Data ya Dhamana:' : 'Collateral Data:'}</strong> {language === 'sw' ? 'inajumuisha maelezo ya mali zilizowekwa rehani na nyaraka za kusaidia.' : 'includes details of assets pledged as collateral and supporting documents.'}</li>
              <li><strong>{language === 'sw' ? 'Data ya Mdhamini:' : 'Guarantor Data:'}</strong> {language === 'sw' ? 'inajumuisha jina, nambari ya simu, uhusiano, makazi, na nambari ya NIDA ya wadhamini wako.' : 'includes name, phone number, relationship, residence, and NIDA number of your guarantors.'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">{language === 'sw' ? '3. Jinsi Tunavyotumia Data Yako' : '3. How We Use Your Data'}</h2>
            <p>
              {language === 'sw' 
                ? 'Tutatumia data yako ya kibinafsi tu wakati sheria inapoturuhusu. Kwa kawaida, tutatumia data yako ya kibinafsi katika hali zifuatazo:'
                : 'We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:'}
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>{language === 'sw' ? 'Tunapohitaji kutekeleza mkataba tunaokaribia kuingia au tumeingia nawe (k.m., kuchakata ombi lako la mkopo).' : 'Where we need to perform the contract we are about to enter into or have entered into with you (e.g., processing your loan application).'}</li>
              <li>{language === 'sw' ? 'Ambapo ni muhimu kwa maslahi yetu halali (au yale ya mtu wa tatu) na maslahi yako na haki zako za kimsingi hazibatilishi maslahi hayo.' : 'Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.'}</li>
              <li>{language === 'sw' ? 'Tunapohitaji kutii wajibu wa kisheria au wa udhibiti.' : 'Where we need to comply with a legal or regulatory obligation.'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">{language === 'sw' ? '4. Haki Miliki & Picha za Sarafu' : '4. Intellectual Property & Currency Images'}</h2>
            <p>
              <strong>{language === 'sw' ? 'Kanusho la Picha za Sarafu:' : 'Currency Images Disclaimer:'}</strong> {language === 'sw' 
                ? 'Picha za sarafu ya Tanzania zinazoonyeshwa kwenye tovuti hii ni kwa madhumuni ya kielelezo na elimu tu. Sio pesa halali. Picha hizi ni nakala zinazotumiwa kwa mujibu wa miongozo ili kuzuia kuchanganyikiwa na sarafu halisi. Chanzo cha picha hizi ni '
                : 'Images of Tanzanian currency displayed on this website are for illustrative and educational purposes only. They are not legal tender. These images are reproductions used in accordance with guidelines to prevent confusion with genuine currency. The source of these images is the '}
              <a href="https://www.bot.go.tz/Currency/BanknotesAndCoinsIssued" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Bank of Tanzania</a>. 
              {language === 'sw' ? 'Haki zote za miundo ya sarafu zinabaki na Benki Kuu ya Tanzania.' : 'All rights to the currency designs remain with the Bank of Tanzania.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">{language === 'sw' ? '5. Usalama wa Data' : '5. Data Security'}</h2>
            <p>
              {language === 'sw'
                ? 'Tumeweka hatua zinazofaa za usalama ili kuzuia data yako ya kibinafsi kupotea kwa bahati mbaya, kutumiwa au kufikiwa kwa njia isiyoidhinishwa, kubadilishwa au kufichuliwa. Kwa kuongezea, tunaweka kikomo cha ufikiaji wa data yako ya kibinafsi kwa wafanyikazi hao, mawakala, makandarasi na wahusika wengine ambao wana hitaji la kibiashara la kujua.'
                : 'We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">{language === 'sw' ? '6. Wasiliana Nasi' : '6. Contact Us'}</h2>
            <p>
              {language === 'sw' ? 'Ikiwa una maswali yoyote kuhusu sera hii ya faragha au desturi zetu za faragha, tafadhali wasiliana nasi kwa:' : 'If you have any questions about this privacy policy or our privacy practices, please contact us at:'}
              <br />
              Email: privacy@chapchap.co.tz
              <br />
              Phone: +255 123 456 789
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
