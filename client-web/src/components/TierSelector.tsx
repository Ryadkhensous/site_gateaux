import React, { useEffect, useId, useRef, useState } from 'react';
import './TierSelector.css';

export interface TierOption {
  id: string;
  shape: 'single' | 'tall' | 'double' | 'triple';
  title: string;
  pieces: string;
  desc: string;
  servesMax: number;
  price: number;
  popular?: boolean;
  image?: string;
}

/* ------------------------------------------------------------------ */
/* خيارات الطوابق والأحجام المتوافقة مع الورشة الحرفية               */
/* ------------------------------------------------------------------ */
export const TIER_OPTIONS: TierOption[] = [
  {
    id: 'single-smooth',
    shape: 'single',
    title: 'طابق واحد ناعم',
    pieces: '8 - 10 قطع',
    desc: 'مثالي للاحتفالات العائلية الصغيرة والمناسبات الدافئة',
    servesMax: 10,
    price: 6000,
    image: '/images/cake_preview_1tier.jpg'
  },
  {
    id: 'single-tall',
    shape: 'tall',
    title: 'طابق واحد مرتفع بريستيج',
    pieces: '15 - 20 قطعة',
    desc: 'ارتفاع 18 سم، خيار شهير لحفلات التخرج والنجاح والمناسبات السعيدة',
    servesMax: 20,
    price: 9500,
    image: '/images/cake_preview_1tier_tall.jpg'
  },
  {
    id: 'double',
    shape: 'double',
    title: 'طابقان للاحتفالات',
    pieces: '30 - 35 قطعة',
    desc: 'طابقان متناسقان، رائع لحفلات الخطوبة والاستقبال',
    servesMax: 35,
    price: 18000,
    popular: true,
    image: '/images/cake_preview_2tiers.jpg'
  },
  {
    id: 'triple',
    shape: 'triple',
    title: '3 طوابق ملكية فاخرة',
    pieces: '50 - 65 قطعة',
    desc: 'تحفة ملكية شاملة مصممة للأعراس الفخمة والاحتفالات الكبرى',
    servesMax: 65,
    price: 32000,
    image: '/images/hero_wedding_cake.jpg'
  }
];

const fmt = (n: number): string =>
  Math.round(n)
    .toLocaleString('fr-FR')
    .replace(/\u202f|\u00a0/g, ' ');

/* Plus petite option qui couvre le nombre d'invités */
export function recommendFor(guests: number, options: TierOption[] = TIER_OPTIONS): TierOption | null {
  return options.find((o) => guests <= o.servesMax) ?? null;
}

/* ------------------------------------------------------------------ */
/* Mini-illustration des étages                                       */
/* ------------------------------------------------------------------ */
export function TierIcon({ shape }: { shape: 'single' | 'tall' | 'double' | 'triple' }) {
  const layouts: Record<'single' | 'tall' | 'double' | 'triple', { w: number; h: number }[]> = {
    single: [{ w: 40, h: 14 }],
    tall: [{ w: 40, h: 26 }],
    double: [{ w: 44, h: 14 }, { w: 30, h: 14 }],
    triple: [{ w: 46, h: 12 }, { w: 34, h: 12 }, { w: 22, h: 12 }]
  };

  let y = 52;
  return (
    <svg className="tier__icon" width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">
      <ellipse cx="28" cy="53" rx="24" ry="2.5" className="tier__icon-plate" />
      {layouts[shape].map((l, i) => {
        y -= l.h + 1;
        return (
          <rect key={i} x={(56 - l.w) / 2} y={y} width={l.w} height={l.h} rx="3.5" className="tier__icon-layer" />
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Prix animé (compteur)                                              */
/* ------------------------------------------------------------------ */
export function AnimatedPrice({ value, duration = 450 }: { value: number; duration?: number }) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce || from.current === value) {
      setShown(value);
      from.current = value;
      return;
    }
    const start = performance.now();
    const origin = from.current;
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(origin + (value - origin) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else from.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <span>{fmt(shown)}</span>;
}

/* ------------------------------------------------------------------ */
/* Composant principal                                                */
/* ------------------------------------------------------------------ */
export interface TierSelectorProps {
  options?: TierOption[];
  value?: string;
  onChange?: (option: TierOption) => void;
  defaultValue?: string;
}

export default function TierSelector({
  options = TIER_OPTIONS,
  value,
  onChange,
  defaultValue = options[0].id
}: TierSelectorProps) {
  const groupId = useId();
  const [inner, setInner] = useState(defaultValue);
  const [guests, setGuests] = useState(10);

  const selectedId = value ?? inner;
  const selected = options.find((o) => o.id === selectedId) ?? options[0];
  const recommended = recommendFor(guests, options);
  const tooMany = guests > options[options.length - 1].servesMax;

  const select = (opt: TierOption) => {
    setInner(opt.id);
    onChange?.(opt);
  };

  const changeGuests = (next: number | string) => {
    const n = Math.max(1, Math.min(200, Number(next) || 1));
    setGuests(n);
    const rec = recommendFor(n, options);
    if (rec) select(rec);
  };

  return (
    <section className="tiers" dir="rtl" aria-labelledby={`${groupId}-title`}>
      <h3 id={`${groupId}-title`} className="tiers__title">
        اختر عدد الطبقات وحجم الكعكة
      </h3>

      {/* ---- عدد المدعوين والتوصية بالحجم ---- */}
      <div className="guests">
        <div className="guests__label">
          <span className="guests__q">كم عدد المدعوين؟</span>
          <span className="guests__hint" aria-live="polite">
            {tooMany
              ? 'العدد كبير، تواصل معنا لطلب خاص ومخصص'
              : recommended
              ? `نوصي بـ: ${recommended.title}`
              : ''}
          </span>
        </div>

        <div className="stepper">
          <button type="button" onClick={() => changeGuests(guests - 5)} aria-label="إنقاص 5 أشخاص">
            −
          </button>
          <input
            type="number"
            inputMode="numeric"
            min="1"
            max="200"
            value={guests}
            onChange={(e) => changeGuests(e.target.value)}
            aria-label="عدد المدعوين"
          />
          <button type="button" onClick={() => changeGuests(guests + 5)} aria-label="زيادة 5 أشخاص">
            +
          </button>
        </div>
      </div>

      {/* ---- بطاقات الأحجام والطبقات ---- */}
      <fieldset className="tiers__grid">
        <legend className="sr-only">حجم الكعكة</legend>

        {options.map((opt) => {
          const isOn = opt.id === selected.id;
          const isRec = recommended?.id === opt.id;
          return (
            <label key={opt.id} className="tier">
              <input
                type="radio"
                name={groupId}
                value={opt.id}
                checked={isOn}
                onChange={() => select(opt)}
              />
              <div className="tier__body">
                <div className="tier__badges">
                  {opt.popular && <span className="badge badge--popular">الأكثر طلباً</span>}
                  {isRec && <span className="badge badge--rec">موصى به لك</span>}
                </div>

                <div className="tier__head">
                  <TierIcon shape={opt.shape} />
                  <div className="tier__text">
                    <strong className="tier__name">
                      {opt.title} <span className="tier__pieces">({opt.pieces})</span>
                    </strong>
                    <p className="tier__desc">{opt.desc}</p>
                  </div>
                </div>

                <div className="tier__foot">
                  <div className="tier__price">
                    <strong>{fmt(opt.price)} دج</strong>
                    <small>≈ {fmt(opt.price / opt.servesMax)} دج / شخص</small>
                  </div>
                  <span className="pill">حتى {opt.servesMax} شخص</span>
                </div>

                <span className="tier__check" aria-hidden="true">
                  ✓
                </span>
              </div>
            </label>
          );
        })}
      </fieldset>

      {/* ---- ملخص السعر المبدئي ---- */}
      <div className="tiers__total" aria-live="polite">
        <span>السعر المبدئي للقاعدة</span>
        <strong>
          <AnimatedPrice value={selected.price} /> دج
        </strong>
      </div>
    </section>
  );
}

