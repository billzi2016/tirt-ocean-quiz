# TIRT Ocean Quiz

An adaptive forced-choice Big Five assessment built with Thurstonian IRT ideas, a 20-block / 80-statement format, and a fully static Astro frontend.

The system is designed for a clean academic interface, session-level shuffled questions, client-side scoring, and a report experience comparable to top commercial psychological assessments.

## Highlights

- 20 forced-choice blocks with 4 statements each
- Best / Worst response format
- Session-level shuffle for both blocks and statements
- Adaptive next-block selection based on current uncertainty and trait coverage
- Client-side MAP-style scoring over pairwise preferences
- Light and dark mode
- Multi-language support (10 languages: English, Chinese, Spanish, French, Japanese, Russian, Korean, Portuguese, Hindi, German; translated with Gemini)
- Static deployment with GitHub Pages

## Data And Calibration

The offline pipeline uses the OpenPsychometrics IPIP Big Five response dataset, officially listed with `n=1,015,342`, as the calibration source for item-level parameters.

The production quiz uses original forced-choice statements. The public dataset is used for offline parameter estimation and validation support, while the online app runs without a backend or database.

The raw CSV stays local under `raw_data/` and is not committed to GitHub. The repository only keeps the lightweight item-bank JSON needed by the frontend.

## Stack

- Astro
- Tailwind CSS
- TypeScript
- pnpm
- Python pipeline with pandas, NumPy, and SciPy

## Local Development

Live site:

```text
https://billzi2016.github.io/tirt-ocean-quiz/
```

```bash
pnpm install
pnpm dev
```

Open:

```text
http://127.0.0.1:4321/tirt-ocean-quiz/quiz/
```

If the default port is occupied, Astro will choose another local port.

## Build

```bash
pnpm build
```

## Offline Pipeline

Download and extract the OpenPsychometrics dataset:

```bash
python3 pipeline/01_fetch_data.py
```

Estimate simplified item parameters from the response data:

```bash
python3 pipeline/02_fit_irt.py
```

Export calibrated parameters into the frontend item bank:

```bash
python3 pipeline/03_export_blocks.py
```

Large raw data files are ignored by Git and should remain under `raw_data/`.

## Project Structure

```text
pipeline/             Offline data and parameter pipeline
public/data/          Static item bank consumed by the frontend
src/components/       Astro UI components
src/i18n/             Locale registry and UI dictionaries
src/lib/              Adaptive engine, scoring, store, and runtime logic
src/pages/            Astro routes
src/styles/           Tailwind entry and global styles
```

## Languages

Supports 10 languages (item bank & UI translated with Gemini):

- English (`en`): `/tirt-ocean-quiz/quiz/`
- Chinese (`zh`): `/tirt-ocean-quiz/zh/quiz/`
- Spanish (`es`): `/tirt-ocean-quiz/es/quiz/`
- French (`fr`): `/tirt-ocean-quiz/fr/quiz/`
- Japanese (`ja`): `/tirt-ocean-quiz/ja/quiz/`
- Russian (`ru`): `/tirt-ocean-quiz/ru/quiz/`
- Korean (`ko`): `/tirt-ocean-quiz/ko/quiz/`
- Portuguese (`pt`): `/tirt-ocean-quiz/pt/quiz/`
- Hindi (`hi`): `/tirt-ocean-quiz/hi/quiz/`
- German (`de`): `/tirt-ocean-quiz/de/quiz/`

The i18n layer is registry-based, allowing easy extension to additional locales by adding configs and text dictionaries.

## Disclaimer

1. **AI-Generated Translations**: The item bank, UI labels, trait explanations, and assessment reports across non-English locales are translated/localized using Gemini AI. While designed to preserve original psychometric nuances, variations in phrasing across languages may occur.
2. **Non-Clinical Use**: This assessment system is designed solely for self-exploration, personal insight, academic research, and technological demonstration.
3. **Not a Medical Diagnosis**: This assessment is not a clinical psychological evaluation tool, medical diagnostic tool, or employment screening system. It does not provide medical, psychiatric, or mental health diagnoses.
4. **Professional Consultation**: Users requiring psychological diagnosis or mental health guidance should consult a qualified healthcare professional.

## Method References

- Brown, A., & Maydeu-Olivares, A. (2011). *Item Response Modeling of Forced-Choice Questionnaires*. Educational and Psychological Measurement, 71(3), 460-502. https://doi.org/10.1177/0013164410375112
- Frick, S. (2023). *Estimating and Using Block Information in the Thurstonian IRT Model*. Psychometrika, 88, 1262-1284. https://doi.org/10.1007/s11336-023-09931-8
- van der Linden, W. J., & Glas, C. A. W. (Eds.). (2010). *Elements of Adaptive Testing*. Springer. https://doi.org/10.1007/978-0-387-85461-8

## License

MIT License.
