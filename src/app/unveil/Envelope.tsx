import s from "./unveil.module.css";

/* Black invitation envelope with an orange wax seal. Pure markup + CSS; the opening is
   choreographed by GSAP in Unveil.tsx through the data-* hooks. */
const SHARDS = 36;

export default function Envelope() {
  return (
    <div className={s.envWrap} data-env>
      <div className={s.env}>
        <div className={s.envBack} />
        <div className={s.card} data-card>
          <span className={s.cardKicker}>You are invited</span>
          <span className={s.cardMark}>ACIC</span>
          <span className={s.cardLine} />
          <span className={s.cardNote}>to the opening of something new</span>
        </div>
        <div className={s.burst} data-burst />
        <div className={s.pocket}>
          <span className={s.sheen} />
          <span className={s.stamp}>No. 001<br />2026</span>
          <span className={s.hand}>for the innovators of Bharath</span>
        </div>
        <div className={s.flap} data-flap>
          <div className={s.flapFace} />
          <div className={s.flapLiner} />
        </div>
        <div className={s.seal} data-seal>
          <span className={s.sealGlow} data-glow />
          <span className={s.sealDrips} />
          <span className={s.sealFace}><span>ACIC</span></span>
        </div>
        <div className={s.shards} aria-hidden="true">
          {Array.from({ length: SHARDS }, (_, i) => <span key={i} data-shard className={i % 3 ? s.shard : s.shardHot} />)}
        </div>
      </div>
      <div className={s.envShadow} />
    </div>
  );
}
