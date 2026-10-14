import {useLanguage} from '../Language';
import {Illustration} from '../Illustration';
import type {Devotion} from './Prayer';
import './prayer.css';
export default function PrayerHub({onOpen}:{onOpen:(devotion:Devotion)=>void}){
 const {t}=useLanguage();return <section className="prayer-hub"><div className="prayer-hub-heading"><div><p className="eyebrow">{t('PRAY · LET FAITH BECOME A MOMENT OF STILLNESS')}</p><h2>{t('A quiet space for prayer.')}</h2><p>{t('Pray with sacred video, spoken words, and beads that guide your place.')}</p></div></div><div className="prayer-hub-grid"><button className="prayer-hub-card" onClick={()=>onOpen('rosary')}><Illustration kind="hands" alt={t('Hands joined in prayer')}/><div><p className="eyebrow">{t('ROSARY · FOUR SETS OF MYSTERIES')}</p><h3>{t('Walk with Mary.')}</h3><p>{t('Meditate on the life of Christ, one prayer and one bead at a time.')}</p><strong>{t('Pray the Rosary')} →</strong></div></button><button className="prayer-hub-card" onClick={()=>onOpen('chaplet')}><Illustration kind="heart" alt={t('A heart as a sign of mercy')}/><div><p className="eyebrow">{t('DIVINE MERCY CHAPLET')}</p><h3>{t('Jesus, I trust in You.')}</h3><p>{t('Bring your intentions into a guided prayer of trust in God’s mercy.')}</p><strong>{t('Pray Divine Mercy')} →</strong></div></button></div></section>
}
