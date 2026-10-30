import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeftIcon, ArrowRightIcon, Cross2Icon, HomeIcon, MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import { MobileScroll } from "./mobile";
import "./site-overrides.css";

type View = "intro" | "dashboard" | "dish" | "table";
const dishes = [
  { name:"KALY’S BURRATA TO SHARE", description:"Creamy burrata cheese with vine-ripened cherry tomatoes, artisan pesto, balsamic reduction, house-made focaccia", price:44000, image:"/assets/kaly/burrata.png", tone:"#f3eadb" },
  { name:"WARM SHRIMPS", description:"Butterfly shrimps gently poached and tossed in a light lemon-butter sauce infused with sesame oil", price:22000, image:"/assets/kaly/warm-shrimps.png", tone:"#e8dfcb" },
  { name:"OXTAIL CROQUETTES", description:"Crispy golden bites filled with slow-cooked, tender oxtail. Served with a smoky dipping sauce", price:32000, image:"/assets/kaly/oxtail-croquettes.png", tone:"#e9d8c5" },
];
const menuGroups = [
  { heading:"STARTERS", cards:[{ name:"MEZZE / STARTERS", image:"/assets/kaly/burrata.png" }] },
  { heading:"MAIN COURSE", featured:true, cards:[
    { name:"KALY’S MAINS", image:"/assets/kaly/tonights-catch.png" },
    { name:"PIZZETTAS", image:"/assets/kaly/oxtail-croquettes.png" },
    { name:"PASTA", image:"/assets/kaly/warm-shrimps.png" },
  ] },
  { heading:"DESSERT", cards:[{ name:"DESSERTS", image:"/assets/kaly/dessert-fondant.png" }] },
  { heading:"DRINKS", cards:[{ name:"SIGNATURE COCKTAILS", image:"/assets/kaly/signature-cocktail.png" }] },
  { heading:"CIGARS", cards:[{ name:"TOBACCO SELECTION", image:"/assets/kaly/tobacco-selection.png" }] },
];
const featuredItems = [
  { eyebrow:"TONIGHT AT KALY", title:["Tonight’s","Catch"], label:"BAKED SALMON", meta:"₦59,500", cta:"View dish", image:"/assets/kaly/tonights-catch.png", alt:"Baked salmon, tonight's featured dish", action:"dish" },
  { eyebrow:"VALENTINE’S AT KALY", title:["Two Nights,","One Story"], label:"13 & 14 FEBRUARY", meta:"An intimate evening of exceptional food, music and moments made for two.", cta:"Discover the evening", image:"/assets/kaly/valentines-at-kaly.png", alt:"A couple enjoying a romantic Valentine's dinner at KALY", action:"next" },
  { eyebrow:"ONE NIGHT IN ITALY", title:["La Dolce","Notte"], label:"29 AUGUST", meta:"Experience Italian elegance through an authentic menu crafted for one unforgettable night.", cta:"Explore the experience", image:"/assets/kaly/italian-elegance.png", alt:"An elegant Italian dinner experience at KALY", action:"next" },
];
const money = (value:number) => `₦${value.toLocaleString("en-NG")}`;

function Header({ back, home }:{ back?:()=>void; home?:()=>void }) { return <header className="topbar"><button className="icon-button" onClick={back ?? home} aria-label="Go back"><ArrowLeftIcon/></button><img className="brand-logo" src="/assets/kaly/kaly-logo.svg" alt="KALY Restaurant Bar Lounge"/><button className="icon-button" onClick={home} aria-label="Return to menu home"><HomeIcon/></button></header>; }

function Dashboard({ openDish, openTable, count }:{ openDish:()=>void; openTable:()=>void; count:number }) {
  const [featuredIndex,setFeaturedIndex]=useState(0);
  const featured=featuredItems[featuredIndex];
  const nextFeatured=()=>setFeaturedIndex(current=>(current+1)%featuredItems.length);
  useEffect(()=>{const timer=window.setInterval(nextFeatured,7000);return()=>window.clearInterval(timer)},[]);
  return <MobileScroll className="app-screen dashboard-scroll"><main className="dashboard">
    <Header home={()=>window.scrollTo({top:0,behavior:"smooth"})}/>
    <section className="greeting"><p>EXCEPTIONAL FOOD</p><h1>Good evening</h1><span>BRINGS PEOPLE TOGETHER</span></section>
    <section className="featured-wrap" aria-label="Featured experiences">
      <button className="featured-card" onClick={featured.action==="dish"?openDish:nextFeatured} aria-label={`${featured.eyebrow}: ${featured.title.join(" ")}`}>
        <AnimatePresence mode="wait">
          <motion.img key={featured.image} src={featured.image} alt={featured.alt} initial={{opacity:0,scale:1.035}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:1.02}} transition={{duration:.55,ease:[.22,1,.36,1]}}/>
        </AnimatePresence>
        <div className="featured-shade"/>
        <AnimatePresence mode="wait">
          <motion.div className="featured-copy" key={featured.title.join("-")} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.4}}>
            <p>{featured.eyebrow}</p><h2>{featured.title[0]}<br/>{featured.title[1]}</h2><span>{featured.label}</span><strong className={featured.action==="dish"?"":"featured-description"}>{featured.meta}</strong><em>{featured.cta} <ArrowRightIcon/></em>
          </motion.div>
        </AnimatePresence>
      </button>
      <div className="feature-dots" aria-label={`Featured item ${featuredIndex+1} of ${featuredItems.length}`}>{featuredItems.map((item,index)=><button key={item.title.join("-")} className={index===featuredIndex?"active":""} onClick={()=>setFeaturedIndex(index)} aria-label={`Show ${item.title.join(" ")}`}/>)}</div>
    </section>
    <section className="menu-intro"><h2>What can we tempt you with?</h2><p>Our menu has something for every part of your evening.</p></section>
    <div className="course-list">{menuGroups.map(group=><section className={`course-section${group.featured?" main-course-section":""}`} key={group.heading} aria-labelledby={`course-${group.heading.replace(/\s+/g,"-").toLowerCase()}`}>
      <div className="course-heading"><h3 id={`course-${group.heading.replace(/\s+/g,"-").toLowerCase()}`}>{group.heading}</h3><span/></div>
      <div className="menu-card-grid">{group.cards.map(card=><button className="menu-card" key={card.name} onClick={openDish} aria-label={`View ${card.name}`}><img src={card.image} alt=""/><span className="menu-card-shade"/><strong>{card.name}</strong><ArrowRightIcon/></button>)}</div>
    </section>)}</div>
    <p className="dashboard-footer">KALY · RESTAURANT · BAR · LOUNGE</p>
  </main>{count>0&&<button className="floating-table" onClick={openTable}>View Table <span>{count}</span></button>}</MobileScroll>;
}

function DishGallery({index,setIndex,add,count,home,table}:{index:number;setIndex:(n:number)=>void;add:()=>void;count:number;home:()=>void;table:()=>void}) { const dish=dishes[index]; const next=()=>setIndex((index+1)%dishes.length); const previous=()=>setIndex((index-1+dishes.length)%dishes.length); return <MobileScroll className="app-screen dish-scroll"><main className="dish-page" style={{background:dish.tone} as CSSProperties}>
  <Header back={home} home={home}/><p className="eyebrow">MEZZE / STARTERS</p>
  <div className="dish-dots" aria-label={`Dish ${index+1} of ${dishes.length}`}>{dishes.map((_,i)=><button key={i} className={i===index?"active":""} onClick={()=>setIndex(i)} aria-label={`View ${dishes[i].name}`}/>)}</div>
  <AnimatePresence mode="wait"><motion.section className="dish-copy" key={dish.name} initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}><h1>{dish.name}</h1><p>{dish.description}</p></motion.section></AnimatePresence>
  <div className="dish-stage"><AnimatePresence mode="wait"><motion.img key={dish.name} src={dish.image} alt={dish.name} initial={{opacity:0,x:55,rotate:3}} animate={{opacity:1,x:0,rotate:0}} exit={{opacity:0,x:-55,rotate:-3}} transition={{duration:.45,ease:[.22,1,.36,1]}}/></AnimatePresence></div>
  <AnimatePresence mode="wait"><motion.strong className="dish-price" key={dish.price} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}}>{money(dish.price)}</motion.strong></AnimatePresence>
  <button className="swipe-prompt" onClick={next}><span className="swipe-copy-mobile">Swipe to see next dish</span><span className="swipe-copy-wide">Next dish</span><ArrowRightIcon/></button><div className="dish-actions"><button className="previous-dish" onClick={previous} aria-label="Previous dish"><ArrowLeftIcon/></button><button className="add-table" onClick={add}>Add to Table <span>({count})</span></button>{count>0?<button className="open-table" onClick={table} aria-label="View table"><ArrowRightIcon/></button>:<span/>}</div>
  </main></MobileScroll>; }

function TableView({counts,update,home,back}:{counts:number[];update:(i:number,d:number)=>void;home:()=>void;back:()=>void}) { const total=dishes.reduce((sum,dish,i)=>sum+dish.price*counts[i],0); return <MobileScroll className="app-screen table-scroll"><main className="table-page"><Header back={back} home={home}/><p className="eyebrow">YOUR SELECTION</p><h1>At your table</h1><div className="table-rule"/>{dishes.map((dish,i)=>counts[i]>0&&<article className="table-item" key={dish.name}><img src={dish.image} alt=""/><div className="table-item-copy"><h2>{dish.name}</h2><p>{money(dish.price)}</p><div className="stepper"><button onClick={()=>update(i,-1)} aria-label={`Remove one ${dish.name}`}><MinusIcon/></button><span>{counts[i]}</span><button onClick={()=>update(i,1)} aria-label={`Add one ${dish.name}`}><PlusIcon/></button></div></div></article>)}{total===0&&<p className="empty-table">Your table is waiting.<br/>Explore the menu and add a dish.</p>}<div className="total"><span>TABLE TOTAL</span><strong>{money(total)}</strong></div><button className="return-menu" onClick={home}>Continue exploring</button></main></MobileScroll>; }

export default function Prototype(){ const[view,setView]=useState<View>("intro"); const[dishIndex,setDishIndex]=useState(0); const[counts,setCounts]=useState([0,0,0]); const[showJoin,setShowJoin]=useState(false); const totalCount=useMemo(()=>counts.reduce((a,b)=>a+b,0),[counts]); useEffect(()=>{const intro=window.setTimeout(()=>setView("dashboard"),3100);const join=window.setTimeout(()=>setShowJoin(true),4100);return()=>{window.clearTimeout(intro);window.clearTimeout(join)}},[]); const home=()=>setView("dashboard"); const update=(i:number,delta:number)=>setCounts(c=>c.map((n,j)=>j===i?Math.max(0,n+delta):n)); const dismissJoin=()=>{if(document.activeElement instanceof HTMLElement)document.activeElement.blur();setShowJoin(false)}; return <div className="kaly-app"><AnimatePresence mode="wait">
  {view==="intro"&&<motion.section className="intro" key="intro" exit={{opacity:0}} transition={{duration:.55}}><motion.div className="intro-glow" initial={{scale:1.2,opacity:0}} animate={{scale:1,opacity:1}} transition={{duration:1.4}}/><motion.img src="/assets/kaly/kaly-logo.svg" alt="KALY" initial={{opacity:0,y:16,scale:.96}} animate={{opacity:1,y:0,scale:1}} transition={{duration:1.1,delay:.25}}/><motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1}}>A TASTE OF THE EVENING</motion.p><button onClick={()=>setView("dashboard")}>Enter</button></motion.section>}
  {view==="dashboard"&&<motion.div className="view" key="dashboard" initial={{opacity:0}} animate={{opacity:1}}><Dashboard openDish={()=>setView("dish")} openTable={()=>setView("table")} count={totalCount}/></motion.div>}
  {view==="dish"&&<motion.div className="view" key="dish" initial={{opacity:0}} animate={{opacity:1}}><DishGallery index={dishIndex} setIndex={setDishIndex} add={()=>update(dishIndex,1)} count={totalCount} home={home} table={()=>setView("table")}/></motion.div>}
  {view==="table"&&<motion.div className="view" key="table" initial={{opacity:0}} animate={{opacity:1}}><TableView counts={counts} update={update} home={home} back={()=>setView("dish")}/></motion.div>}
  </AnimatePresence><AnimatePresence>{showJoin&&view==="dashboard"&&<motion.div className="join-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><motion.aside className="join-card" initial={{y:40,opacity:0}} animate={{y:0,opacity:1}} exit={{y:24,opacity:0}}><button className="join-close" onClick={dismissJoin} aria-label="Close"><Cross2Icon/></button><p>THE KALY LIST</p><h2>Stay in the know.</h2><span>Be first to hear about special menus, intimate evenings and what is happening at KALY.</span><label>Email address<input type="email" placeholder="you@email.com"/></label><label>Phone number<input type="tel" placeholder="+234"/></label><button className="join-submit" onClick={dismissJoin}>Join the list</button><button className="join-later" onClick={dismissJoin}>Maybe later</button></motion.aside></motion.div>}</AnimatePresence></div>;}
