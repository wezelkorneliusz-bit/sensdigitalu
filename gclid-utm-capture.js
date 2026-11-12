/**
 * Sens Digitalu - B2B Lead Attribution Helper (gclid / wbraid / gbraid / UTM)
 * Author: Kornel Kowalski (https://sensdigitalu.pl/)
 * License: MIT
 *
 * Przechwytuje parametry klikniec Google Ads i UTM do sessionStorage przy pierwszym wejsciu
 * i automatycznie uzupelnia ukryte pola w formularzach na wszystkich podstronach w sesji.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'sd_lead_attribution_v1';
  var TRACKED_PARAMS = [
    'gclid',
    'wbraid',
    'gbraid',
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content'
  ];

  function getStoredParams() {
    try {
      var raw = window.sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveParams(data) {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      // Ignoruj bledy przy zablokowanym sessionStorage
    }
  }

  function captureFromUrl() {
    var search = window.location.search;
    if (!search) {
      return getStoredParams();
    }

    var urlParams = new URLSearchParams(search);
    var current = getStoredParams();
    var updated = false;

    TRACKED_PARAMS.forEach(function (param) {
      var val = urlParams.get(param);
      if (val && val.trim() !== '') {
        current[param] = val.trim();
        updated = true;
      }
    });

    if (updated) {
      saveParams(current);
    }
    return current;
  }

  function populateFormFields(attribution) {
    if (!attribution) return;

    TRACKED_PARAMS.forEach(function (param) {
      if (!attribution[param]) return;
      var fields = document.querySelectorAll('input[name="' + param + '"]');
      fields.forEach(function (field) {
        if (!field.value) {
          field.value = attribution[param];
        }
      });
    });
  }

  function init() {
    var attribution = captureFromUrl();
    populateFormFields(attribution);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
