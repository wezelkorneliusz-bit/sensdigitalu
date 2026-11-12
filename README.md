# Sens Digitalu — GA4, GTM & Google Ads B2B Lead Tracking Starter

Praktyczny zestaw wdrożeniowy open-source dla firm B2B, e-commerce i wdrożeniowców stron WWW, przygotowany przez atelier technologiczno-analityczne **[Sens Digitalu – Kornel Kowalski](https://sensdigitalu.pl/)**.

Repozytorium rozwiązuje trzy najczęstsze problemy analityczne w małych i średnich firmach:
1. **Utratę parametrów kliknięć reklamowych (`gclid`, `wbraid`, `gbraid`, `utm_*`)** podczas przejścia użytkownika po wielu podstronach przed wysłaniem formularza.
2. **Fałszywe konwersje w Google Tag Managerze** wynikające z nasłuchiwania kliknięcia przycisku zamiast potwierdzonego wysłania formularza (`dataLayer.push`).
3. **Brak danych o jakości leadów (Offline Conversions)** między formularzem na stronie a systemem CRM.

---

## Zawartość repozytorium

- `gclid-utm-capture.js` — lekki skrypt Vanilla JS (bez zależności i bez cookies reklamowych, wykorzystujący `sessionStorage`), który przechwytuje parametry `gclid`, `wbraid`, `gbraid` oraz `utm_*` przy wejściu na stronę i automatycznie uzupełnia ukryte pola formularza (`<input type="hidden">`).
- `gtm-b2b-lead-container.json` — gotowy szablon eksportu kontenera Google Tag Manager (Web) z konfiguracją zmiennych warstwy danych (`dataLayer`) oraz tagiem zdarzenia `generate_lead` dla GA4.

---

## Szybkie wdrożenie (3 kroki)

### Krok 1: Dodaj ukryte pola do formularza kontaktowego

Umieść wewnątrz tagu `<form>` ukryte pola:

```html
<input type="hidden" name="gclid" value="">
<input type="hidden" name="wbraid" value="">
<input type="hidden" name="gbraid" value="">
<input type="hidden" name="utm_source" value="">
<input type="hidden" name="utm_medium" value="">
<input type="hidden" name="utm_campaign" value="">
```

### Krok 2: Podepnij skrypt `gclid-utm-capture.js`

Załaduj plik `gclid-utm-capture.js` przed zamknięciem `</body>` lub przez tag Custom HTML w Google Tag Managerze. Skrypt zapisze parametry z adresu URL przy pierwszym wejściu w sesji i wypełni pola formularza nawet wtedy, gdy użytkownik przejdzie na inne podstrony (np. cennik lub ofertę), zanim wyśle zapytanie.

### Krok 3: Wyślij potwierdzone zdarzenie `generate_lead` do `dataLayer`

Po otrzymaniu pozytywnej odpowiedzi HTTP 200 z backendu / formularza AJAX wywołaj:

```javascript
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'generate_lead',
  lead_source: 'formularz_kontaktowy',
  form_id: 'kontakt_glowny'
});
```

Następnie zaimportuj plik `gtm-b2b-lead-container.json` w panelu Google Tag Manager (*Administracja -> Importuj kontener -> Scalaj*) i podmień identyfikator strumienia GA4 na własny.

---

## Powiązane opracowania techniczne i narzędzia

- Pełny przewodnik: [Śledzenie leadów B2B: Jak połączyć kliknięcie w Google Ads z podpisaną umową w CRM?](https://sensdigitalu.pl/artykuly/sledzenie-leadow-b2b-offline-conversions.html)
- Poradnik GTM: [Jak poprawnie śledzić zdarzenia formularzy w Google Tag Managerze?](https://sensdigitalu.pl/artykuly/sledzenie-zdarzen-formularzy-gtm.html)
- Prywatność i odzyskiwanie danych: [Consent Mode v2 i analityka Server-Side](https://sensdigitalu.pl/artykuly/consent-mode-v2-server-side-gtm.html)
- Narzędzie online: [Procedura audytu GA4 w 10 krokach (Checklista)](https://sensdigitalu.pl/zasoby/checklista-audyt-ga4.html)
- Usługi wdrożeniowe: [Naprawa analityki GA4, GTM i Server-Side – Sens Digitalu](https://sensdigitalu.pl/analityka-ga4-gtm.html)

---

## Licencja i autor

Udostępniono na licencji MIT.  
Autor: **Kornel Kowalski** — [Sens Digitalu](https://sensdigitalu.pl/) (Toruń, Polska).  
Kontakt: `kontakt@sensdigitalu.pl`
