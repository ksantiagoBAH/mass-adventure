import {Children,cloneElement,isValidElement,useId,type ReactNode} from 'react';

function Book(){return <>
 <path fill="var(--glass-wood)" d="M27 42c12-5 24-4 33 3 9-7 21-8 33-3v44c-13-4-23-3-33 4-10-7-20-8-33-4Z"/>
 <path fill="var(--glass-ivory)" d="M29 37c10-3 22-2 31 5 9-7 21-8 31-5v44c-12-4-22-3-31 4-9-7-19-8-31-4Z"/>
 <path d="M60 42v43" strokeWidth="1.2"/>
 <g strokeWidth=".65" opacity=".7"><path d="M35 47c6-1 12 0 19 3m-19 4c6-1 12 0 19 3m-19 4c6-1 12 0 19 3m-19 4c6-1 12 0 16 2M66 50c6-3 12-4 19-3m-19 10c6-3 12-4 19-3m-19 10c6-3 12-4 19-3m-19 10c6-3 12-4 16-3M32 83c10-2 18 0 25 5m6 0c7-5 15-7 25-5"/></g>
 </>}
function Chalice(){return <>
 <path fill="var(--glass-gold)" d="M42 52h36c0 16-7 25-18 25s-18-9-18-25Z"/>
 <ellipse cx="60" cy="52" rx="18" ry="3" fill="var(--glass-wood)" strokeWidth="1"/>
 <path fill="var(--glass-gold)" d="M57 77h6v7c5 1 5 6 0 7v4c5 0 11 1 14 5H43c3-4 9-5 14-5v-4c-5-1-5-6 0-7Z"/>
 <path d="M48 58c1 7 4 11 7 13M72 59c-1 8-4 12-9 14M56 86h8M48 97h24" strokeWidth=".65"/>
 <path d="M50 58c0 4 1 7 3 9" stroke="#fff3ba" strokeWidth="1.8" opacity=".65"/>
 </>}
function EucharisticHost({cx=60,cy=31,r=13}:{cx?:number;cy?:number;r?:number}){return <g transform={`translate(${cx} ${cy}) scale(${r/13})`}>
 <circle r="13" fill="#fff9e9" strokeWidth="1.25"/>
 <circle r="11.5" fill="none" stroke="#b7aa8d" strokeWidth=".35"/>
 <text x="0" y="5.5" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="14" fontWeight="700" textLength="23" lengthAdjust="spacingAndGlyphs" fill="#30332d" stroke="none">IHS</text>
 <path d="M-1.3-10v8M-4.1-7.5h5.6" stroke="#30332d" strokeWidth="1" strokeLinecap="square"/>
 </g>}
function Host(){return <EucharisticHost/>}
function PrayerHands(){return <>
 <path fill="var(--glass-skin)" d="M59 31c-.4-3-3.6-4-5-1.5l-2 5c-1-4-4-3.5-5-.5l-2 10c-2-2-4-.5-4.5 2.5l-3 16c-1 5-3 9-7 12l11 16c7-4 12-11 15-19 2-6 3-13 3-20ZM61 31c.4-3 3.6-4 5-1.5l2 5c1-4 4-3.5 5-.5l2 10c2-2 4-.5 4.5 2.5l3 16c1 5 3 9 7 12L79 91c-7-4-12-11-15-19-2-6-3-13-3-20Z"/>
 <g strokeWidth=".65" opacity=".85">
  <path d="m54 35-3 21m-4-14-3 18m-2-9-2 14m26-30 3 21m4-14 3 18m2-9 2 14M48 68c2-3 5-7 8-7m16 7c-2-3-5-7-8-7M44 76l5 4m27-4-5 4"/>
  <path d="M54 32c0 2 2 3 3 2m9-2c0 2-2 3-3 2M47 37l2 1m24-1-2 1M46 59l3 1m25-1-3 1"/>
 </g>
 <path fill="var(--glass-ivory)" d="m29 73 14 16-7 10-17-18ZM91 73 77 89l7 10 17-18Z"/>
 <path d="m26 81 10 12m-3-13 7 9m54-8-10 12m3-13-7 9" strokeWidth=".65"/>
 </>}

function Candle(){return <>
 <path fill="var(--glass-gold)" d="M60 21c-1 10-9 15-9 22 0 12 18 12 18 0 0-7-7-14-9-22Z"/>
 <path fill="#fff2b2" strokeWidth=".6" d="M60 34c-1 4-4 7-4 10 0 6 8 6 8 0 0-3-3-7-4-10Z"/>
 <path fill="var(--glass-ivory)" d="M49 54h22v34H49Z"/>
 <ellipse cx="60" cy="54" rx="11" ry="3" fill="var(--glass-ivory)" strokeWidth=".8"/>
 <path d="M60 54v-5M51 56v8c0 3 4 3 4 0v-6m9-1v12c0 3 4 3 4 0V56" strokeWidth=".7"/>
 <path fill="var(--glass-gold)" d="M45 87h30v5H63v5h15l5 4H37l5-4h15v-5H45Z"/>
 <path d="M54 72v11M49 99h22" strokeWidth=".65"/>
 </>}
function Cross(){return <><path fill="var(--glass-wood)" d="M55 28h10v20h17v10H65v32H55V58H38V48h17Z"/><path opacity=".45" d="M60 32v54M42 53h36"/></>}
const drawings:Record<string,ReactNode>={
 entrance:<><path d="M34 93V49a26 26 0 0 1 52 0v44ZM42 93V49a18 18 0 0 1 36 0v44M60 37v56M42 61h36M30 97h60"/><circle cx="60" cy="37" r="4"/><path d="M60 93 43 103M60 93l17 10"/><circle cx="24" cy="78" r="3"/><circle cx="96" cy="78" r="3"/><path d="M20 89c0-7 8-7 8 0M92 89c0-7 8-7 8 0"/></>,
 greeting:<><path d="M27 39h31v23H42l-9 8v-8h-6ZM62 52h31v23H79l-10 8v-8h-7"/><path d="M34 48h16M34 54h10M70 61h15M70 67h10"/><path d="M59 21v16M53 27h12"/></>,
 penitential:<><PrayerHands/><path d="M60 18c-5 6-8 10-8 14a8 8 0 0 0 16 0c0-4-3-8-8-14Z"/></>,
 collect:<><PrayerHands/><path d="M60 17v13M54 23h12M39 31l-5-4M81 31l5-4"/></>,
 psalm:<><g transform="translate(-6 9) scale(.88)"><Book/></g><path d="M79 24v29l15-5V20ZM79 47c-10-4-12 10-2 8M94 43c-10-4-12 10-2 8"/></>,
 acclamation:<><g transform="translate(9 21) scale(.85)"><Book/></g><path d="M60 17v20M50 27h20M38 29l-6-6M82 29l6-6M26 41h-7M94 41h7"/></>,
 gospel:<><Book/><path d="M43 44v28M36 52h14M55 35l5-5 5 5M55 94l5 5 5-5"/></>,
 homily:<><path d="M37 60h46l-7 10H44ZM44 70v24h32V70M39 98h42M48 77h24M60 77v12M55 82h10"/><circle cx="60" cy="32" r="9"/><path d="M43 56v-5c0-13 34-13 34 0v5M44 51l-9-7M76 51l9-7"/></>,
 creed:<><path d="M34 31h47v61H40c-10 0-13-12-4-15h45M34 31c-10 0-10 13 0 13"/><path d="M58 42v23M51 49h14M43 71h28M43 58h8M68 58h5M43 87h28"/></>,
 intercessions:<><circle cx="60" cy="50" r="24"/><ellipse cx="60" cy="50" rx="10" ry="24"/><path d="M36 50h48M40 38h40M40 62h40M26 77l20 14h28l20-14M26 77c-1-6 3-8 8-5l15 10M94 77c1-6-3-8-8-5L71 82M38 98l8-7M82 98l-8-7"/></>,
 gifts:<><g transform="translate(19 8) scale(.75)"><Chalice/></g><ellipse cx="41" cy="76" rx="16" ry="11"/><path d="M33 72l5 6M41 70l5 6M24 88h34M36 37v25M31 42l5 5 5-5M31 51l5 5 5-5"/></>,
 offerings:<><path d="M25 65h70v8H25ZM33 73v24M87 73v24M42 73v20h36V73M59 77v11M54 81h10"/><ellipse cx="46" cy="58" rx="12" ry="5"/><path d="M69 41h13c0 11-3 15-6 15s-7-4-7-15ZM76 56v6M70 62h12M60 23v14M54 29h12"/></>,
 eucharistic:<><Host/><Chalice/><path d="M27 40l7 4M93 40l-7 4M25 55h8M95 55h-8"/></>,
 sanctus:<><path d="m60 24 3 8 9 1-7 6 2 9-7-5-7 5 2-9-7-6 9-1ZM36 48l2 6 7 1-5 5 1 7-5-4-6 4 2-7-5-5 7-1ZM84 48l2 6 7 1-5 5 1 7-5-4-6 4 2-7-5-5 7-1M39 85c5-20 14-11 21-25 7 14 16 5 21 25M43 91h34M48 96h24"/></>,
 memorial:<><g transform="translate(17 2) scale(.7)"><Cross/></g><path d="M34 78a29 29 0 0 0 53-14M86 72l1-8-8 2M86 42a29 29 0 0 0-53 14M34 48l-1 8 8-2M48 91h24"/></>,
 amen:<><g transform="translate(15 -3) scale(.75)"><Host/><Chalice/></g><path d="M25 86l16-17 9 5M95 86 79 69l-9 5M41 69l-2-9c-1-5 5-6 7-1l6 14M79 69l2-9c1-5-5-6-7-1l-6 14M33 93l-8-7M87 93l8-7"/></>,
 'our-father':<><PrayerHands/><path d="M60 17v12M54 22h12M42 25h-5M78 25h5"/><path opacity=".4" d="M39 99h42M46 103h28"/></>,
 lamb:<><path d="M37 65c-9-4-12 8-4 11-3 10 10 15 15 9 5 8 16 7 19-1 10 3 16-8 11-14 7-8-1-16-9-13-5-8-17-8-22 1-5-3-11 0-10 7ZM75 65l10-8 8 4-2 12-13 5M40 85v10M67 86v9M37 98h8M64 98h8"/><path d="M39 24a12 12 0 0 0 0 24l-2-6 4-7-4-5ZM44 24a12 12 0 0 1 0 24l2-6-4-7 4-5Z"/></>,
 communion:<><g transform="translate(0 7)"><Host/></g><path d="M30 73l13 15h34l13-15M30 73c0-6 5-7 9-3l12 9M90 73c0-6-5-7-9-3l-12 9M43 88l-5 10M77 88l5 10M50 75h20"/></>,
 thanksgiving:<><Candle/><path opacity=".5" d="M31 49c-5 6-5 15 0 21M25 44c-8 10-8 21 0 31M89 49c5 6 5 15 0 21M95 44c8 10 8 21 0 31"/></>,
 blessing:<><path d="M49 93V65l-7-13c-3-6 2-9 5-5l7 8V32c0-6 6-6 6 0v20-28c0-6 6-6 6 0v28-24c0-6 6-6 6 0v26-15c0-6 6-6 6 0v31l-7 23ZM49 93h22v6H49"/><path d="M32 28v17M25 34h14M87 27l6-4M87 39h8"/></>,
 dismissal:<><path d="M31 70V44l16-13 16 13v26ZM41 70V55h12v15M47 24v-9M42 19h10M47 70c-17 13 24 13 12 34"/><path d="M70 59h26M87 50l9 9-9 9M71 81h17M82 75l6 6-6 6"/></>,
};
// Color enclosed shapes as individual glass pieces while keeping engraved lines clear.
function colorGlass(nodes:ReactNode):ReactNode {
 return Children.map(nodes,node=>{
  if(!isValidElement<{children?:ReactNode;d?:string;fill?:string;opacity?:string|number;strokeDasharray?:string}>(node))return node;
  const props=node.props;
  const enclosed=typeof node.type==='string'&&(((node.type==='circle'||node.type==='ellipse')&&props.opacity===undefined&&!props.strokeDasharray)||(node.type==='path'&&/[zZ]/.test(props.d??'')));
  return cloneElement(node,{...(enclosed&&!props.fill?{fill:node.type==='path'?'var(--glass-gold)':'var(--glass-ivory)'}:{}),...(props.children?{children:colorGlass(props.children)}:{})});
 });
}

function OliveBranch(){return <g strokeWidth=".7">
 <path d="M37 93c16-11 29-9 46-4" stroke="#53684b"/>
 <path fill="#8d9b69" d="M45 89c-7 0-10-4-9-7 6-1 10 2 9 7ZM53 86c-6-2-7-7-5-10 5 1 8 5 5 10ZM62 85c-4-3-3-8 0-10 4 3 5 7 0 10ZM70 86c0-5 4-8 8-6-1 5-4 7-8 6ZM78 88c3-4 7-4 10-1-3 4-7 5-10 1ZM51 86c1 5-2 8-6 7-2-4 1-7 6-7ZM62 85c2 4 0 8-4 8-2-4 0-7 4-8ZM72 86c4 2 5 6 2 8-4-1-5-4-2-8Z"/>
 </g>}

function PeaceGlass(){return <>
 {/* A traditional white dove with a feathered wing and olive branch. */}
 <path fill="var(--glass-ivory)" d="M50 70c-7-4-14-13-17-26-2-7-1-15 1-18 4 8 8 14 14 20 6 6 14 8 20 14l3 8Z"/>
 <path fill="#d5dcd8" d="M48 65c-5-3-10-9-13-17 6 8 12 12 19 15Z" strokeWidth=".6"/>
 <path fill="var(--glass-ivory)" d="M48 65c-8 1-17 6-22 11l-5 1 2 4-3 4c12 1 22-1 30-4 9 5 22 4 28-4 3-4 4-8 3-12 3-1 5-4 4-7-1-5-8-7-12-3-3 2-4 5-6 8-7 5-12 4-19 2Z"/>
 <path fill="var(--glass-ivory)" d="M48 66c-9-5-19-10-26-20 0 9 5 21 14 28 7 4 15 5 22 1 4-2 7-5 9-9-7 4-13 5-19 0Z"/>
 <g strokeWidth=".65" stroke="#68746d"><path d="M26 52c5 8 12 15 22 17M29 61c5 6 11 10 18 12M35 69c4 4 9 6 14 6M36 35c2 11 8 21 17 26M37 44c4 9 9 15 15 18M25 79l17-3m-15 5 13-2M69 70c2 2 5 3 7 2"/></g>
 <path fill="var(--glass-gold)" d="m84 60 7 2-7 2Z" strokeWidth=".7"/>
 <circle cx="79" cy="59" r=".8" fill="#26392d" stroke="none"/>
 <path d="M87 63c-3 9-9 16-14 23" stroke="#53684b" strokeWidth=".75"/>
 <path fill="#8d9b69" d="M81 74c-5 0-6-4-4-6 4 1 5 3 4 6ZM77 80c1-5 5-7 8-5-1 4-4 6-8 5Z" strokeWidth=".6"/>
 <OliveBranch/>
 </>}

function CrossGlass(){return <>
 <path fill="#80936b" d="M31 99c13-8 22-6 29-11 9 5 17 4 29 11Z" strokeWidth=".8"/>
 <path fill="var(--glass-wood)" d="M54 27h12v23h22v12H66v35H54V62H32V50h22Z"/>
 <path d="M57 30h6v23h22v6H63v35h-6V59H35v-6h22Z" stroke="#edc998" strokeWidth=".65"/>
 <path d="m60 34-1 14m2 17-1 23M39 56h11m21 0h8" stroke="#704c34" strokeWidth=".45"/>
 <path d="M41 93c-3-10 0-18 6-24M78 93c3-10 0-18-6-24" stroke="#5c7351" strokeWidth=".8"/>
 <path fill="#8a9f76" d="M42 87c-7-1-9-5-7-8 5 0 8 3 7 8ZM43 80c-1-6 3-9 6-7 0 5-2 7-6 7ZM78 87c7-1 9-5 7-8-5 0-8 3-7 8ZM77 80c1-6-3-9-6-7 0 5 2 7 6 7Z" strokeWidth=".6"/>
 </>}

function GloriaGlass(){return <>
 <g transform="translate(0 15)"><Book/></g>
 <path fill="var(--glass-gold)" d="M58 19h4v8h8v4h-8v9h-4v-9h-8v-4h8Z" strokeWidth=".85"/>
 <path d="M43 32 39 29M77 32l4-3M60 12v-4" stroke="#ddbe77" strokeWidth=".9"/>
 <g stroke="#7d684b" strokeWidth=".65"><path d="M36 69c5 0 10 1 17 4M36 72c5 0 10 1 17 4M36 75c5 0 10 1 17 4M67 73c6-3 11-4 17-4M67 76c6-3 11-4 17-4M67 79c6-3 11-4 17-4"/></g>
 <g fill="#3e443b" strokeWidth=".8"><ellipse cx="42" cy="76" rx="2" ry="1.2" transform="rotate(-15 42 76)"/><path d="M44 76v-9l6 2v9"/><ellipse cx="48" cy="79" rx="2" ry="1.2"/><ellipse cx="72" cy="77" rx="2" ry="1.2"/><path d="M74 77v-10l5-1v9"/><ellipse cx="77" cy="76" rx="2" ry="1.2"/></g>
 </>}

function ScrollGlass({letter=false}:{letter?:boolean}){return <>
 <path fill="var(--glass-ivory)" d="M37 28h48c-4 4-5 8-5 13v46H38c-6 0-8-3-8-7 0-5 4-8 8-8V39c-5-1-7-4-7-7s3-5 6-4Z"/>
 <path fill="#d8c79e" d="M37 28c7 0 7 11 0 11h-1c-6 0-7-11 1-11ZM38 72c7 0 7 15 0 15h42c7 0 7-15 0-15Z" strokeWidth="1"/>
 <path d="M38 75c-4 0-5 6-1 8M82 76c2 2 2 5 0 7" strokeWidth=".65"/>
 <path d="M46 39h26M46 47h25M46 54h20M46 61h24" stroke="#816f54" strokeWidth=".75"/>
 {letter?<><path fill="#a64446" d="M59 62h6v27l-3-3-3 3Z" strokeWidth=".6"/><circle cx="62" cy="66" r="5" fill="#9e363f" strokeWidth=".7"/><path d="M62 63v6m-2-4h4" stroke="#dcb093" strokeWidth=".6"/></>:<path d="M58 37v9m-3-6h6" stroke="#816f54" strokeWidth=".65"/>}
 </>}

function DescendingDove(){return <>
 <path fill="var(--glass-ivory)" d="M57 43C44 39 33 28 28 17c-3 11 0 22 7 29 6 6 13 8 21 7l4 8 4-8c8 1 15-1 21-7 7-7 10-18 7-29-5 11-16 22-29 26Z"/>
 <path fill="var(--glass-ivory)" d="m55 46 1 10-4 10 8-3 8 3-4-10 1-10c2-3 0-7-5-7s-7 4-5 7Z"/>
 <g stroke="#69756d" strokeWidth=".6"><path d="M31 25c4 12 12 20 22 22M32 34c5 9 12 14 21 16M37 43c5 6 10 8 16 9M89 25c-4 12-12 20-22 22M88 34c-5 9-12 14-21 16M83 43c-5 6-10 8-16 9M58 54l-2 7m6-7 2 7"/></g>
 <path fill="var(--glass-gold)" d="m58 46 2 5 2-5Z" strokeWidth=".6"/>
 <circle cx="57.5" cy="44" r=".5" fill="#26392d" stroke="none"/><circle cx="62.5" cy="44" r=".5" fill="#26392d" stroke="none"/>
 </>}
function ConsecrationGlass(){return <>
 <g transform="translate(9 2) scale(.85)"><DescendingDove/></g>
 <g transform="translate(12 40) scale(.8)"><Chalice/></g>
 <EucharisticHost cy={66} r={10}/>
 </>}

function EntranceGlass(){return <>
 <path fill="var(--glass-gold)" d="M27 94V52C27 34 43 21 60 14c17 7 33 20 33 38v42Z"/>
 <path fill="var(--glass-ivory)" d="M34 94V53c0-15 11-26 26-32 15 6 26 17 26 32v41Z"/>
 <path fill="#5a85ad" d="M41 57c0-14 8-22 19-29 11 7 19 15 19 29Z"/>
 <path fill="#ecc862" d="m60 29 7 13-7 15-7-15Z"/>
 <path d="M41 57h38M60 29v28m-18-5 36-9m-33 0 32 9" strokeWidth="1.1"/>
 <path fill="var(--glass-wood)" d="M41 59h38v35H41Z"/>
 <path fill="var(--glass-wood)" d="M45 63h11v25H45ZM64 63h11v25H64Z" strokeWidth="1"/>
 <path d="M60 59v35m-12-28 5 19m14-19 5 19M24 95h72M20 100h80M16 105h88" strokeWidth="1.1"/>
 <path fill="#eee7d3" d="M19 80c-7 6-8 14-8 23h19c0-9-1-17-8-23ZM98 80c-7 6-8 14-8 23h19c0-9-1-17-8-23Z"/>
 <circle cx="20" cy="76" r="5" fill="var(--glass-skin)"/><circle cx="99" cy="76" r="5" fill="var(--glass-skin-deep)"/>
 <path fill="#d1a640" d="M18 84h4v17h-4ZM97 84h4v17h-4Z" strokeWidth=".8"/>
 <path d="M20 88v8m-3-5h6M99 88v8m-3-5h6M15 89l-1 10m12-10 1 10M94 89l-1 10m12-10 1 10" strokeWidth=".7"/>
 <path fill="#edca61" d="M57 12V5h6v7h6v5h-6v7h-6v-7h-6v-5Z" strokeWidth="1"/>
 </>}

function CommunionGlass(){return <>
 <path fill="#ae373f" d="M36 46h48v55H36Z"/>
 <path fill="var(--glass-wood)" d="M55 32h10v20h19v12H65v47H55V64H36V52h19Z"/>
 <path d="M59 36v19H40v5h19v47M69 56h11" strokeWidth=".8"/>
 <path fill="var(--glass-skin)" d="M51 71c-1-8-6-11-9-6l-2 16-7 9 7 12 12-12 5-15-2-10c-1-3-4-2-4 1ZM69 71c1-8 6-11 9-6l2 16 7 9-7 12-12-12-5-15 2-10c1-3 4-2 4 1Z"/>
 <path d="m44 69-1 13-5 8m10-19-1 13-4 7m9-19-2 12M76 69l1 13 5 8m-10-19 1 13 4 7m-9-19 2 12" strokeWidth=".7"/>
 <path fill="var(--glass-ivory)" d="m33 89 15 11-11 23-16-15ZM87 89l-15 11 11 23 16-15Z"/>
 <path d="m29 96 8 7-5 13m9-12-5 13m55-21-8 7 5 13m-9-12 5 13" strokeWidth=".8"/>
 <path fill="#eac558" d="m28 103 3 1 1-3 3 1-1 3 3 1-1 3-3-1-1 3-3-1 1-3-3-1Z" strokeWidth=".6"/>
 <EucharisticHost cy={61}/>
 </>}

export default function LessonIllustration({id}:{id:string}){
 const unique=useId().replaceAll(':','');
 const clip=unique+'glass',shine=unique+'shine',texture=unique+'texture',diamonds=unique+'diamonds';
 const paints=[['gold','#fff0a5','#d9a944','#90602d'],['ivory','#fff9e8','#dedcd0','#a1a9b4'],['skin','#f6dfbe','#dbb38c','#9b6c55'],['skin-deep','#dfb18c','#b88163','#745044'],['skin-shadow','#d4aa85','#b78064','#805447'],['wood','#e2b376','#ad7545','#70452c'],['blue','#9cc9da','#5383a2','#2c4667'],['ruby','#b44a52','#a33c49','#813443']];
 const blues=['#247dc0','#71c9df','#3554a3','#a4dfeb'];
 return <svg className="lesson-vignette stained-glass" viewBox="0 0 120 150" fill="none" aria-hidden="true" style={Object.fromEntries(paints.map(([name])=>['--glass-'+name,'url(#'+unique+name+')']))}>
  <defs>
   {paints.map(([name,light,mid,dark])=><linearGradient key={name} id={unique+name} x1="0" y1="0" x2="1" y2=".8" gradientUnits="objectBoundingBox"><stop stopColor={light}/><stop offset=".42" stopColor={mid}/><stop offset="1" stopColor={dark}/></linearGradient>)}
   <filter id={texture} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency=".22 .12" numOctaves="3" seed="12" result="grain"/>
    <feColorMatrix in="grain" type="matrix" values="0 0 0 0 .4 0 0 0 0 .45 0 0 0 0 .55 0 0 0 .32 0"/>
    <feBlend in="SourceGraphic" mode="soft-light"/>
   </filter>
   <clipPath id={clip}><path d="M17 137V52C17 29 39 13 60 5c21 8 43 24 43 47v85Z"/></clipPath>
   <pattern id={diamonds} width="32" height="40" patternUnits="userSpaceOnUse">
    <path fill={blues[0]} d="M0 0h32v40H0Z"/>
    <path fill={blues[1]} d="m0 0 16 20L0 40-16 20Z"/>
    <path fill={blues[2]} d="m32 0 16 20-16 20-16-20Z"/>
    <path fill={blues[3]} d="M0 0 16-20 32 0 16 20Z"/>
    <path d="m0 0 16 20L32 0M0 40l16-20 16 20" stroke="#19272e" strokeWidth="1.9"/>
   </pattern>
   <linearGradient id={shine} x1="20" y1="15" x2="100" y2="135" gradientUnits="userSpaceOnUse"><stop stopColor="#fffde6" stopOpacity=".3"/><stop offset=".45" stopColor="#fffde6" stopOpacity="0"/><stop offset="1" stopColor="#061438" stopOpacity=".3"/></linearGradient>
  </defs>
  <g className="glass-window">
   <g clipPath={'url(#'+clip+')'} className="glass-panes" filter={'url(#'+texture+')'} stroke="#20292d" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round">
    <path fill={'url(#'+diamonds+')'} d="M10 0h100v140H10Z"/>
    <path fill="#a92d40" fillRule="evenodd" d="M17 137V52C17 29 39 13 60 5c21 8 43 24 43 47v85ZM23 131V53c0-20 18-34 37-42 19 8 37 22 37 42v78Z"/>
    <path d="m20 47 6 1m1-15 5 3m4-13 4 5m9-14 3 5m16-5-3 5m19 4-4 5m13 5-5 3m12 11-6 1M17 65h6m74 0h6M17 83h6m74 0h6M17 101h6m74 0h6M17 119h6m74 0h6M37 131v6m23-6v6m23-6v6"/>
    <path fill="#efc85c" d="M60 31C43 43 26 63 26 86s16 39 34 45c18-6 34-22 34-45S77 43 60 31Z" strokeWidth="2.4"/>
    {Array.from({length:20},(_,i)=>{const angle=i*Math.PI/10;const x=60+Math.sin(angle)*32,y=83+Math.cos(angle)*47;return <path key={i} d={`M${60+Math.sin(angle)*25} ${83+Math.cos(angle)*36}L${x} ${y}`} strokeWidth="1"/>;})}
    <path fill="var(--glass-ruby)" d="M60 42C46 51 34 68 34 86s11 30 26 36c15-6 26-18 26-36S74 51 60 42Z"/>

    <g className="glass-symbol" transform={id==='communion'?'translate(0 -1)':'translate(12 34) scale(.8)'} strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round">
     {({communion:<CommunionGlass/>,entrance:<EntranceGlass/>,peace:<PeaceGlass/>,cross:<CrossGlass/>,gloria:<GloriaGlass/>,first:<ScrollGlass/>,second:<ScrollGlass letter/>,consecration:<ConsecrationGlass/>} as Record<string,ReactNode>)[id]??colorGlass(drawings[id]??drawings.entrance)}
    </g>
    <path fill={'url(#'+shine+')'} stroke="none" d="M10 0h100v140H10Z"/>
    <path fill="#d4e8f1" opacity=".12" stroke="none" d="m24 47 10-9-4 88h-6ZM80 22l8 8-7 99h-6Z"/>
    <path d="M17 55h22m42 0h22M17 115h23m40 0h23" strokeWidth="1.2"/>
   </g>
   <path className="glass-stone" fillRule="evenodd" d="M10 141V52C10 25 35 8 60 0c25 8 50 25 50 52v89ZM17 137V52C17 29 39 13 60 5c21 8 43 24 43 47v85Z"/>
   <path className="glass-masonry" d="m12 42 7 2m-2-16 6 5m7-18 5 6M47 5l3 7m23-7-3 7m20 3-5 6m18 7-6 5m10 9-7 2M10 65h7m86 0h7M10 88h7m86 0h7M10 111h7m86 0h7"/>
   <path className="glass-frame" d="M17 137V52C17 29 39 13 60 5c21 8 43 24 43 47v85ZM13 139V52C13 27 37 10 60 2c23 8 47 25 47 50v87ZM10 141h100M14 145h92"/>
  </g>
 </svg>;
}
