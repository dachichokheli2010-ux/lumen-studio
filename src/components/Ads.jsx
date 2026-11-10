import { useLayoutEffect, useRef } from "react";
import { useI18n } from "../i18n.jsx";
import { TEMPLATES } from "../data.js";
import { gsap } from "../scroll.js";
import { SplitReveal, useRise } from "./Reveal.jsx";
import { Arrow } from "./Hero.jsx";

const look = (id) => TEMPLATES.find((x) => x.id === id);

// Concept ad formats, typeset in the gallery's styles. Illustrative only.
function StoryAd({ sponsored }) {
  const tpl = look("forge");
  return (
    <div className="ad ad-story" style={{ "--a-bg": tpl.look.bg, "--a-fg": tpl.look.fg, "--a-accent": tpl.look.accent, "--a-art": tpl.look.art }}>
      <div className="ad-progress"><i /><i /><i /></div>
      <div className="ad-brand"><b>{tpl.name[0]}</b><span>{tpl.name}<em>{sponsored}</em></span></div>
      <div className="ad-art" />
      <p className="ad-head">{tpl.headline}</p>
      <span className="ad-cta">Join now</span>
    </div>
  );
}

function SearchAd({ sponsored }) {
  const tpl = look("ember");
  return (
    <div className="ad ad-search">
      <div className="ad-search-bar">
        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M16 16l4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        wine bar tbilisi
      </div>
      <div className="ad-result">
        <p className="ad-url"><b>{sponsored}</b> · {tpl.domain}</p>
        <p className="ad-title">{tpl.name}: natural wine bar in Sololaki</p>
        <p className="ad-desc">Open fire, natural wine and long dinners. Book a table for tonight in two taps.</p>
        <p className="ad-links">{tpl.nav.map((n) => <span key={n}>{n}</span>)}</p>
      </div>
      <div className="ad-result ad-ghost"><i /><i /><i /></div>
      <div className="ad-result ad-ghost"><i /><i /></div>
    </div>
  );
}

function FeedAd({ sponsored }) {
  const tpl = look("nomad");
  return (
    <div className="ad ad-feed" style={{ "--a-bg": tpl.look.bg, "--a-fg": tpl.look.fg, "--a-accent": tpl.look.accent, "--a-art": tpl.look.art }}>
      <div className="ad-brand"><b>{tpl.name[0]}</b><span>{tpl.name}<em>{sponsored}</em></span></div>
      <div className="ad-square">
        <p className="ad-head">{tpl.headline}</p>
      </div>
      <div className="ad-bar"><span>Small-group tours</span><span className="ad-cta">Book a tour</span></div>
    </div>
  );
}

const FORMATS = [StoryAd, SearchAd, FeedAd];

export default function Ads({ onAddFeature }) {
  const { t, lang } = useI18n();
  const a = t.ads;
  const scope = useRise(".ad-fig, .chan", [lang]);
  const flow = useRef();

  // Formats drift at slightly different speeds; the campaign rail fills as you read it.
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray(".ad-fig").forEach((el, i) => {
        gsap.fromTo(el, { yPercent: 3 + i * 3 }, {
          yPercent: -(3 + i * 3), ease: "none",
          scrollTrigger: { trigger: ".ad-formats", start: "top bottom", end: "bottom top", scrub: true },
        });
      });
      gsap.fromTo(".flow-rail i", { scaleY: 0 }, {
        scaleY: 1, ease: "none",
        scrollTrigger: { trigger: flow.current, start: "top 75%", end: "bottom 55%", scrub: true },
      });
    });
    return () => mm.revert();
  }, [lang]);

  return (
    <section className="ads" id="ads" ref={scope}>
      <div className="ads-head wrap">
        <SplitReveal className="h2" text={a.title} />
        <p className="lead">{a.sub}</p>
      </div>

      <div className="ad-formats wrap">
        {FORMATS.map((Ad, i) => (
          <figure className="ad-fig" key={i}>
            <Ad sponsored={a.sponsored} />
            <figcaption>{a.formats[i]}</figcaption>
          </figure>
        ))}
      </div>
      <p className="ads-note wrap">{a.formatsNote}</p>

      <div className="ads-grid wrap">
        <div className="ads-channels">
          <h3 className="h3">{a.channelsTitle}</h3>
          <ul>
            {a.channels.map(([name, text]) => (
              <li className="chan" key={name}>
                <span className="chan-name">{name}</span>
                <span className="chan-text">{text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="ads-flow" ref={flow}>
          <h3 className="h3">{a.flowTitle}</h3>
          <div className="flow">
            <div className="flow-rail" aria-hidden="true"><i /></div>
            <ol>
              {a.flow.map(([name, text]) => (
                <li key={name}><strong>{name}</strong><span>{text}</span></li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <div className="ads-close wrap">
        <p>{a.budget}</p>
        <button type="button" className="btn btn-flare" onClick={() => onAddFeature("ads")}>
          {a.add}<Arrow />
        </button>
      </div>
    </section>
  );
}
