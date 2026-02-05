## Goals

* Ensure full multilingual coverage across landing and related pages.

* Merge the two CTA actions (Apply, Check Status) into one primary action button with a selectable action.

## Scope of Changes

* Landing components: [landing-sections.tsx](file:///Users/feisalramar/Documents/hushtek/clients/phmn/chap-chap/app/_components/landing-sections.tsx)

* Translations: [translations.ts](file:///Users/feisalramar/Documents/hushtek/clients/phmn/chap-chap/lib/translations.ts)

* Existing apply page headings and labels: [page.tsx](file:///Users/feisalramar/Documents/hushtek/clients/phmn/chap-chap/app/apply/existing/page.tsx)

* Site header already i18n; no change unless new strings are introduced: [site-header.tsx](file:///Users/feisalramar/Documents/hushtek/clients/phmn/chap-chap/components/site-header.tsx)

## Implementation Steps

1. Multilanguage audit and keys

* Add new translation keys for dropdowns and unified action:

  * hero.action.label, hero.action.options.apply, hero.action.options.status

  * hero.applicantType.label, hero.applicantType.options.new, hero.applicantType.options.existing

  * cta.action.label, cta.action.options.apply, cta.action.options.status

* Provide both English and Swahili entries in [translations.ts](file:///Users/feisalramar/Documents/hushtek/clients/phmn/chap-chap/lib/translations.ts).

* Replace any remaining hardcoded labels (e.g., “Existing Customer”, “Enter your NIDA number”) with translated strings.

1. Merge CTA into one action button (Hero)

* In [landing-sections.tsx](file:///Users/feisalramar/Documents/hushtek/clients/phmn/chap-chap/app/_components/landing-sections.tsx) Hero section:

  * Replace two buttons (Apply, Status) with:

    * A select for action (Apply vs Status) using translated labels

    * When action=Apply, show applicant type select (New vs Existing) using translated labels

    * A single primary button whose click:

      * Navigates to /apply or /apply/existing for Apply

      * Navigates to /status for Status

* Keep accessible labels and optional chaining with fallbacks to prevent runtime errors.

1. Merge CTA into one action button (CTA section)

* In the CTA section of [landing-sections.tsx](file:///Users/feisalramar/Documents/hushtek/clients/phmn/chap-chap/app/_components/landing-sections.tsx):

  * Mirror the Hero logic: one action select + applicant type select (visible only when action=Apply) and a single primary button.

1. i18n for Existing Apply page

* Update [app/apply/existing/page.tsx](file:///Users/feisalramar/Documents/hushtek/clients/phmn/chap-chap/app/apply/existing/page.tsx) to use translations for headings, descriptions, NIDA input placeholder, and Continue button.

* Add keys under apply.existing: title, description, nidaPlaceholder, continue.

1. Verification

* Run bun build and fix any TypeScript/i18n key errors.

* Smoke test navigation for each action:

  * Action=Apply + New → /apply

  * Action=Apply + Existing → /apply/existing (prefills, continues)

  * Action=Status → /status

## Notes

* No changes to collateral OTP or application flow logic beyond labels.

* Existing sidebar/header i18n is already integrated; we’ll only add new keys where necessary.

## Outcome

* A single, unified, multilingual CTA experience across the landing Hero and CTA sections.

* Consistent i18n coverage for all newly introduced UI text and existing customer flow.

