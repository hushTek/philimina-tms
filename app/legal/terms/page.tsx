'use client';

import { Footer } from "@/app/_components/landing-sections";
import { useLanguage } from "@/components/language-provider";

export default function TermsOfService() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">{language === 'sw' ? 'Masharti ya Huduma' : 'Terms of Service'}</h1>
        
        <div className="prose dark:prose-invert max-w-none space-y-6">
          <p className="text-sm text-muted-foreground">{language === 'sw' ? 'Imesasishwa mwisho: 2/5/2026' : 'Last Updated: 2/5/2026'}</p>

          <section>
            <h2 className="text-xl font-semibold mb-3">{language === 'sw' ? '1. Makubaliano ya Masharti' : '1. Agreement to Terms'}</h2>
            <p>
              {language === 'sw' 
                ? 'Kwa kupata au kutumia huduma zinazotolewa na Trust Funding Microfinance ("TFM", "sisi", "yetu"), unakubali kufungwa na Masharti haya ya Huduma. Ikiwa hukubaliani na sehemu yoyote ya masharti, basi huwezi kupata Huduma.'
                : 'By accessing or using the services provided by Trust Funding Microfinance ("TFM", "we", "us"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the Service.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">{language === 'sw' ? '2. Huduma za Mikopo' : '2. Loan Services'}</h2>
            <p>
              {language === 'sw'
                ? 'Jukwaa letu linatoa kiolesura cha kuomba mikopo midogo. Maombi yote ya mikopo yanategemea idhini kulingana na sera zetu za mikopo. Tunahifadhi haki ya kuidhinisha au kukataa ombi lolote kwa hiari yetu pekee.'
                : 'Our platform provides an interface for applying for microfinance loans. All loan applications are subject to approval based on our credit policies. We reserve the right to approve or decline any application at our sole discretion.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">{language === 'sw' ? '3. Wajibu wa Mtumiaji' : '3. User Responsibilities'}</h2>
            <p>{language === 'sw' ? 'Unakubali:' : 'You agree to:'}</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>{language === 'sw' ? 'Kutoa taarifa sahihi, za sasa na kamili wakati wa mchakato wa maombi.' : 'Provide accurate, current, and complete information during the application process.'}</li>
              <li>{language === 'sw' ? 'Kudumisha usalama wa siri za akaunti yako.' : 'Maintain the security of your account credentials.'}</li>
              <li>{language === 'sw' ? 'Kutujulisha mara moja kuhusu matumizi yoyote yasiyoidhinishwa ya akaunti yako.' : 'Notify us immediately of any unauthorized use of your account.'}</li>
              <li>{language === 'sw' ? 'Kutumia huduma kwa madhumuni halali tu.' : 'Use the services only for lawful purposes.'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">{language === 'sw' ? '4. Haki Miliki & Matumizi ya Sarafu' : '4. Intellectual Property & Currency Usage'}</h2>
            <p>
              {language === 'sw'
                ? 'Maudhui, mpangilio, picha, muundo, mkusanyiko, na masuala mengine yanayohusiana na Tovuti yanalindwa chini ya hakimiliki zinazotumika na haki nyingine za umiliki (ikiwa ni pamoja na lakini sio tu haki miliki).'
                : 'The content, organization, graphics, design, compilation, and other matters related to the Site are protected under applicable copyrights and other proprietary (including but not limited to intellectual property) rights.'}
            </p>
            <p className="mt-2">
              <strong>{language === 'sw' ? 'Picha za Sarafu:' : 'Currency Images:'}</strong> {language === 'sw'
                ? 'Picha za noti za Kitanzania zinazoonyeshwa kwenye tovuti hii zinatumika kwa madhumuni ya kielelezo tu na sio pesa halali. Picha hizi ni nakala na zimewekwa alama kama "SPECIMEN" ili kutii mahitaji ya kisheria. Miundo asili ni mali ya '
                : 'Images of Tanzanian banknotes displayed on this site are used for illustrative purposes only and are not legal tender. These images are reproductions and are marked as "SPECIMEN" to comply with legal requirements. The original designs are the intellectual property of the '}
              <a href="https://www.bot.go.tz/Currency/BanknotesAndCoinsIssued" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Bank of Tanzania</a>. 
              {language === 'sw'
                ? ' Matumizi mabaya yoyote, uzazi, au usambazaji wa picha hizi kwa njia inayokiuka sheria za Tanzania au miongozo ya Benki Kuu ya Tanzania ni marufuku kabisa.'
                : ' Any misuse, reproduction, or distribution of these images in a manner that violates Tanzanian law or the Bank of Tanzania\'s guidelines is strictly prohibited.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">{language === 'sw' ? '5. Ukomo wa Dhima' : '5. Limitation of Liability'}</h2>
            <p>
              {language === 'sw'
                ? 'Hakuna wakati ambapo TFM, wala wakurugenzi wake, wafanyakazi, washirika, mawakala, wasambazaji, au washirika, watawajibika kwa uharibifu wowote usio wa moja kwa moja, wa bahati mbaya, maalum, wa matokeo au wa adhabu, ikiwa ni pamoja na bila ukomo, upotevu wa faida, data, matumizi, nia njema, au hasara nyingine zisizoonekana, zinazotokana na ufikiaji wako au matumizi ya au kutoweza kupata au kutumia Huduma.'
                : 'In no event shall TFM, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">{language === 'sw' ? '6. Sheria Inayoongoza' : '6. Governing Law'}</h2>
            <p>
              {language === 'sw'
                ? 'Masharti haya yataongozwa na kufafanuliwa kwa mujibu wa sheria za Jamhuri ya Muungano wa Tanzania, bila kuzingatia migongano ya sheria zake.'
                : 'These Terms shall be governed and construed in accordance with the laws of the United Republic of Tanzania, without regard to its conflict of law provisions.'}
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
