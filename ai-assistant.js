(function () {
  const DEFAULT_PROVIDER = 'none';
  const config = window.KWHYZOR_CONFIG || {};
  const safeKey = typeof config.AI_API_KEY === 'string' ? config.AI_API_KEY.trim() : '';
  const aiEnabled = Boolean(config.AI_ENABLED && safeKey && !safeKey.startsWith('YOUR_') && !safeKey.includes('your-'));

  function normalizeText(value) {
    return String(value || '').trim();
  }

  function clampText(value, maxLen) {
    const text = normalizeText(value);
    if (!text) return '';
    const limit = Number(maxLen) || 2000;
    return text.length > limit ? text.slice(0, limit) : text;
  }

  function loadHistory() {
    try {
      const raw = localStorage.getItem('kwhyzor_ai_history');
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function saveHistory(messages) {
    try {
      const next = Array.isArray(messages) ? messages.slice(-40) : [];
      localStorage.setItem('kwhyzor_ai_history', JSON.stringify(next));
    } catch (error) {
      console.warn('KWhyzor AI history could not be saved.', error);
    }
  }

  function detectIntent(question) {
    const q = String(question || '').toLowerCase();
    if (!q) return 'general';

    if (/hello|hi|hey|namaste|good morning|good evening|who are you|what can you do|what are you|who am i talking to/.test(q)) return 'general';
    if (/safety|danger|live wire|high voltage|electric shock|hazard|short circuit|fire|shock/.test(q)) return 'safety';
    if (/power factor|voltage|current|resistance|transformer|inverter|mcb|rccb|single phase|three phase|kva|kvar|kw|kwh|what is electricity|explain.*electric|what does .* mean|concept/.test(q)) return 'concept';
    if (/bill|billing|meter|increase|decrease|unit|consumption|why did my bill|electricity bill|monthly bill|payment|dues/.test(q)) return 'bill';
    if (/ev|electric vehicle|car|charging|battery|charger|vehicle/.test(q)) return 'ev';
    if (/solar|rooftop|pv|panel|renewable|generation|sun/.test(q)) return 'solar';
    if (/ac|air conditioner|fridge|refrigerator|fan|appliance|watt|hours.*day|power use|load|electricity use/.test(q)) return 'appliance';
    return 'general';
  }

  function phraseTailFromIntent(intent) {
    switch (intent) {
      case 'bill':
        return 'This is an estimate based on available bill history and ordinary household assumptions.';
      case 'appliance':
        return 'These numbers are based on appliance wattage, hours of use, and a standard 30-day month.';
      case 'ev':
        return 'This is an estimate that includes basic charging-loss assumptions, not a measured reading.';
      case 'solar':
        return 'Solar numbers depend on roof direction, shading, climate, and net-metering rules.';
      case 'concept':
        return 'This is a general educational explanation and may differ from local code or utility norms.';
      case 'safety':
        return 'For live electrical work, switch off and isolate power and consult a licensed electrician.';
      default:
        return 'Assumptions are clearly noted so you can interpret the estimate responsibly.';
    }
  }

  function safeNumber(value, fallback) {
    const num = Number(value);
    return Number.isFinite(num) ? num : fallback;
  }

  function getStateContext() {
    const context = {
      bills: Array.isArray(window.KWHYZOR_STATE && window.KWHYZOR_STATE.bills) ? window.KWHYZOR_STATE.bills : [],
      appliances: Array.isArray(window.KWHYZOR_STATE && window.KWHYZOR_STATE.appliances) ? window.KWHYZOR_STATE.appliances : [],
      plan: window.KWHYZOR_STATE && window.KWHYZOR_STATE.plan ? window.KWHYZOR_STATE.plan : 'Free'
    };

    if (!context.bills.length) {
      context.bills = [
        { month: 'August 2026', amount: 3140, units: 412 },
        { month: 'July 2026', amount: 2020, units: 331 }
      ];
    }

    if (!context.appliances.length) {
      context.appliances = [
        { name: 'Air Conditioner', wattage: 1500, hours_per_day: 5, quantity: 1, days_per_month: 30 },
        { name: 'Refrigerator', wattage: 150, hours_per_day: 24, quantity: 1, days_per_month: 30 },
        { name: 'Fans', wattage: 75, hours_per_day: 8, quantity: 3, days_per_month: 30 }
      ];
    }

    return context;
  }

  function extractHours(question) {
    const match = String(question).match(/(\d+(?:\.\d+)?)\s*(?:hours?|hrs?)\s*(?:per|a)?\s*(?:day|daily)?/i);
    return match ? safeNumber(match[1], 5) : 5;
  }

  function estimateAcUsage(question) {
    const hours = extractHours(question);
    const watts = /1\.5\s*ton|1500|1\.5\s*k?w|1\.5\s*kw/i.test(question) ? 1500 : /2\s*ton|2000|2\s*k?w|2\s*kw/i.test(question) ? 2000 : 1500;
    const kwh = (watts / 1000) * 30 * hours;
    return { hours, watts, kwh };
  }

  function billAnalysis(context) {
    const current = context.bills[0] || { amount: 3140, units: 412 };
    const previous = context.bills[1] || { amount: 2020, units: 331 };
    const deltaUnits = Math.max(0, Number(current.units) - Number(previous.units) || 0);
    const deltaPercent = previous.units ? ((Number(current.units) - Number(previous.units)) / Number(previous.units)) * 100 : 0;
    return {
      current,
      previous,
      deltaUnits,
      deltaPercent,
      likelyCause: deltaUnits > 40 ? 'Higher cooling and appliance usage are the likeliest contributors.' : 'A modest change in usage patterns is the most likely cause.'
    };
  }

  function shortConceptResponse(question) {
    if (/power factor/.test(question)) {
      return 'Power factor is the ratio of real power used to apparent power supplied. It tells you how effectively electricity is being converted into useful work. A power factor closer to 1 is better because it means less wasted reactive power.';
    }
    if (/voltage|current|resistance/.test(question)) {
      return 'Voltage is the electrical pressure, current is the flow of charge, and resistance opposes that flow. In simple terms, more voltage pushes more current through a given resistance, and power is the product of voltage and current.';
    }
    if (/single phase|three phase/.test(question)) {
      return 'Single-phase power is common in homes and uses one alternating waveform. Three-phase power is common in businesses and larger systems and provides smoother, more balanced power delivery.';
    }
    if (/transformer|inverter|mcb|rccb|earthing|short circuit/.test(question)) {
      return 'A transformer changes voltage levels, an inverter converts DC to AC, and protective devices like MCBs and RCCBs help prevent overloads and fault currents. Proper earthing and protection are essential for safety.';
    }
    return 'The basic electrical ideas are power, energy, voltage, current, and efficiency. In everyday use, some loads like ACs, pumps, and heaters consume far more energy than lights or small electronics.';
  }

  function generalSafetyMessage() {
    return 'For live electrical work, switch off and isolate power where appropriate, use proper protective equipment, and consult a licensed electrician or engineer. Do not rely on a chatbot for unsafe energized-system work.';
  }

  function generalEnergyAdvice(question) {
    const q = String(question || '').toLowerCase();
    if (/bill|cost|unit|electricity bill/.test(q)) {
      return 'Your electricity bill is usually driven by usage pattern, tariff slab, peak hours, and high-load appliances such as ACs, pumps, geysers, heaters, and EV chargers.';
    }
    if (/ac|air conditioner/.test(q)) {
      return 'ACs are often the biggest daily load in a home. Running time, room size, cooling set point, and insulation quality all influence energy consumption.';
    }
    if (/solar|panel|rooftop/.test(q)) {
      return 'Solar helps reduce grid import, but the size and savings depend on roof area, sunlight, temperature, and local tariff conditions. A planner should estimate both generation and self-consumption.';
    }
    if (/ev|battery|charger/.test(q)) {
      return 'EV charging can raise monthly electricity use significantly, especially if charging occurs at night or when used frequently. Battery size and charging speed determine the effect.';
    }
    if (/appliance|fan|fridge|refrigerator/.test(q)) {
      return 'High-usage appliances should be reviewed by their wattage and daily runtime. A refrigerator runs all day, while ACs and pumps often create the largest monthly swings.';
    }
    if (/voltage|current|power factor|transformer/.test(q)) {
      return 'Voltage pushes current, current drives the load, and power factor tells you how effectively the system converts power into useful work. Better power quality and proper protection reduce losses and risks.';
    }
    return 'To reduce electricity waste, start with the largest loads: AC, pump, geyser, refrigerator, and EV charging. A small reduction in daily operating hours can have a meaningful monthly impact.';
  }

  function generateOfflineAnswer(question, maybeContext) {
    const context = maybeContext || getStateContext();
    const cleaned = clampText(question, Number(config.AI_MAX_INPUT_LENGTH) || 2000);
    const intent = detectIntent(cleaned);

    if (!cleaned) {
      return {
        answer: 'Please ask a clear question about your bill, energy use, appliance load, EV charging, solar, or an electrical concept.',
        assumptions: ['No question was provided.'],
        confidence: 'Low'
      };
    }

    if (/hello|hi|hey|namaste|good morning|good evening/.test(cleaned.toLowerCase())) {
      return {
        answer: 'Hello! I am KWhyzor, your electricity intelligence assistant. I can explain your bill, estimate appliance usage, review EV charging, compare solar options, and answer basic electrical questions in simple language.',
        assumptions: ['Friendly greeting response.'],
        confidence: 'High'
      };
    }

    if (/(who are you|what is kwhyzor|what can you do|what can .* do)/.test(cleaned.toLowerCase())) {
      return {
        answer: 'KWhyzor is an electricity intelligence assistant that helps you understand why your bill changed, estimate appliance usage, model EV charging, check solar options, and explain basic electrical concepts in a clear way.',
        assumptions: ['User is asking about the product itself.'],
        confidence: 'High'
      };
    }

    if (intent === 'safety') {
      return {
        answer: `## Safety-first guidance\n\n${generalSafetyMessage()}\n\n${shortConceptResponse(cleaned)}`,
        assumptions: ['This is a safety-first explanation, not a step-by-step guide for live electrical work.'],
        confidence: 'High'
      };
    }

    if (intent === 'bill') {
      const analysis = billAnalysis(context);
      const answer = [
        '## Bill investigation',
        '',
        `Based on the available data, your current bill is around ₹${analysis.current.amount.toLocaleString()} and your previous bill was ₹${analysis.previous.amount.toLocaleString()}.`,
        `That is roughly ${Math.abs(analysis.deltaPercent).toFixed(1)}% ${analysis.deltaPercent >= 0 ? 'higher' : 'lower'} than the last bill, or about ${analysis.deltaUnits.toFixed(0)} kWh more.`,
        '',
        analysis.likelyCause,
        '',
        'This is an estimate, not a utility-verified lookup. It is a useful signal for troubleshooting your household usage pattern.'
      ].join('\n');

      return {
        answer,
        assumptions: ['Uses current vs previous bill values from user data.', 'Labels the finding as an estimate, not a certified meter reading.'],
        confidence: analysis.deltaPercent > 15 ? 'Medium' : 'Low'
      };
    }

    if (intent === 'appliance') {
      const estimate = estimateAcUsage(cleaned);
      const kwh = (estimate.watts / 1000) * estimate.hours * 30;
      const answer = [
        '## Appliance estimate',
        '',
        `Using a ${estimate.watts} W appliance running ${estimate.hours} hours/day for a 30-day month:`,
        `Estimated monthly use = ${kwh.toFixed(1)} kWh`,
        '',
        `At a simple ₹8/kWh tariff, this is roughly ₹${(kwh * 8).toFixed(0)} per month.`,
        '',
        'If many appliances run together, total consumption can rise much faster than one appliance alone.'
      ].join('\n');
      return {
        answer,
        assumptions: ['Uses a simple tariff and standard 30-day month.', 'Appliance estimates do not include weather or real-world usage variation.'],
        confidence: 'Medium'
      };
    }

    if (intent === 'ev') {
      const battery = /60\s*kwh|60kwh|70\s*kwh|80\s*kwh/.test(cleaned) ? 60 : 40;
      const charging = (battery * 0.7 * 0.9) / 0.9;
      const cost = charging * 8;
      const answer = [
        '## EV charging estimate',
        '',
        `A rough charging estimate for a ${battery} kWh EV battery from around 20% to 90% is about ${charging.toFixed(1)} kWh for that charging session.`,
        `At ₹8/kWh, that could add about ₹${cost.toFixed(0)} to the bill for that session.`,
        '',
        'Actual charging cost depends on battery size, temperature, charger efficiency, and tariff.'
      ].join('\n');
      return {
        answer,
        assumptions: ['Uses a simple charging-loss assumption.', 'This is an estimate, not a measured utility reading.'],
        confidence: 'Medium'
      };
    }

    if (intent === 'solar') {
      const load = Number(context.bills[0]?.units || 412);
      const capacity = 3;
      const generation = capacity * 110;
      const offset = Math.min(load, generation) * 8;
      const answer = [
        '## Solar estimate',
        '',
        `A 3 kW rooftop system might generate about ${generation} kWh per month under a typical rule-of-thumb assumption.`,
        `That could offset around ₹${offset.toFixed(0)} of a monthly bill under a simple ₹8/kWh rate.`,
        '',
        'Actual savings depend on roof orientation, shading, weather, sunlight hours, and the utility’s export policy.'
      ].join('\n');
      return {
        answer,
        assumptions: ['Uses a general solar-generation estimate.', 'Savings depend on site-specific conditions and local rules.'],
        confidence: 'Medium'
      };
    }

    if (intent === 'concept') {
      return {
        answer: `## Electrical concept\n\n${shortConceptResponse(cleaned)}\n\n${phraseTailFromIntent(intent)}`,
        assumptions: ['General educational explanation only.'],
        confidence: 'High'
      };
    }

    return {
      answer: `## General energy answer\n\n${generalEnergyAdvice(cleaned)}\n\nTo make this more specific, I can compare your bill, appliance use, EV charging pattern, or solar plan against your current household energy profile. ${phraseTailFromIntent(intent)}`,
      assumptions: ['General answer without detailed user data.'],
      confidence: 'Medium'
    };
  }

  function buildChatResponse(question, context) {
    const cleaned = clampText(question, Number(config.AI_MAX_INPUT_LENGTH) || 2000);
    if (!cleaned) {
      return {
        answer: 'Please enter a valid question.',
        suggestions: ['Why did my bill increase?', 'How much does my AC use?', 'How much solar might I need?'],
        configRequired: false,
        isFallback: true
      };
    }

    const result = generateOfflineAnswer(cleaned, context || getStateContext());
    const answerText = aiEnabled
      ? result.answer
      : `${result.answer}\n\n⚠️ AI provider is not configured, so KWhyzor is answering from the built-in fallback engine.`;

    return {
      answer: answerText,
      suggestions: ['Why did my bill increase?', 'How much electricity does my AC consume?', 'How much solar might I need?'],
      configRequired: !aiEnabled,
      isFallback: true,
      assumptions: result.assumptions || [],
      confidence: result.confidence || 'Medium'
    };
  }

  window.KWhyzorAI = {
    provider: config.AI_PROVIDER || DEFAULT_PROVIDER,
    isConfigured: aiEnabled,
    loadHistory: loadHistory,
    saveHistory: saveHistory,
    chat: buildChatResponse,
    generateOfflineAnswer: generateOfflineAnswer,
    detectIntent: detectIntent,
    getContext: getStateContext
  };
}());
