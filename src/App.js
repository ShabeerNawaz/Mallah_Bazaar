import React, { useState, useMemo, useCallback } from "react";
import {
  Search, ShoppingCart, User, Menu, X, Star, Plus, Minus, Trash2,
  LayoutGrid, Package, Users, Receipt, TrendingUp, Pencil, Check,
  ChevronRight, Home as HomeIcon, Zap, Sparkles, Smartphone, ShieldCheck, Truck,
  BadgePercent, LogOut, Eye, EyeOff, Filter
} from "lucide-react";

/* ---------------------------------------------------------------
   FONTS
--------------------------------------------------------------- */
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700;9..144,800&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600;700&display=swap');
  `}</style>
);

/* ---------------------------------------------------------------
   TOKENS
--------------------------------------------------------------- */
const C = {
  ink: "#132420",
  teal: "#0F5C52",
  tealDark: "#0A403A",
  tealSoft: "#E4EFEC",
  marigold: "#E8A33D",
  marigoldDark: "#C9832А" ,
  coral: "#D8546B",
  bg: "#F3F6F4",
  card: "#FFFFFF",
  line: "#DCE5E1",
  muted: "#5B6D67",
};
C.marigoldDark = "#C6832A";

const money = (n) => "Rs " + Math.round(n).toLocaleString("en-PK");

/* ---------------------------------------------------------------
   DATA
--------------------------------------------------------------- */
const CATEGORIES = [
  { id: "electronics", name: "Electronics", tagline: "Screens, sound & smart gear", icon: Zap, color: C.teal, img: "https://picsum.photos/seed/electro-hero/800/600" },
  { id: "cosmetics", name: "Cosmetics & Beauty", tagline: "Skincare, makeup & fragrance", icon: Sparkles, color: C.coral, img: "https://picsum.photos/seed/cosmo-hero/800/600" },
  { id: "mobiles", name: "Mobiles & Accessories", tagline: "Phones, cases & chargers", icon: Smartphone, color: C.marigoldDark, img: "https://picsum.photos/seed/mobile-hero/800/600" },
];

const seedProducts = () => [
  // Electronics
  { id: "e1", cat: "electronics", name: "45\" 4K Smart LED TV", price: 89500, mrp: 104900, rating: 4.6, stock: 14, img: "https://picsum.photos/seed/tv1/500/500", desc: "Ultra HD smart display with built-in streaming apps and slim bezel design.", badge: "Sale" },
  { id: "e2", cat: "electronics", name: "Inverter Split AC 1.5 Ton", price: 132000, mrp: 145000, rating: 4.4, stock: 8, img: "https://picsum.photos/seed/ac1/500/500", desc: "Energy-saving inverter compressor with fast cooling and low noise.", badge: "" },
  { id: "e3", cat: "electronics", name: "Automatic Washing Machine 8kg", price: 61500, mrp: 68000, rating: 4.3, stock: 11, img: "https://picsum.photos/seed/wash1/500/500", desc: "Front-load washer with 10 wash programs and child lock.", badge: "" },
  { id: "e4", cat: "electronics", name: "Bluetooth Party Speaker", price: 12800, mrp: 15500, rating: 4.5, stock: 26, img: "https://picsum.photos/seed/spk1/500/500", desc: "Deep bass speaker with 12-hour battery and RGB lights.", badge: "New" },
  { id: "e5", cat: "electronics", name: "Digital Air Fryer 5.5L", price: 15900, mrp: 18900, rating: 4.7, stock: 19, img: "https://picsum.photos/seed/fryer1/500/500", desc: "Oil-free frying with digital touch panel and 8 presets.", badge: "Sale" },
  { id: "e6", cat: "electronics", name: "Laptop Stand Cooling Pad", price: 3200, mrp: 3900, rating: 4.2, stock: 40, img: "https://picsum.photos/seed/stand1/500/500", desc: "Ergonomic aluminium stand with dual cooling fans.", badge: "" },
  { id: "e7", cat: "electronics", name: "1000W Microwave Oven", price: 22500, mrp: 25500, rating: 4.4, stock: 15, img: "https://picsum.photos/seed/micro1/500/500", desc: "20L capacity with grill function and 8 auto-cook menus.", badge: "" },
  { id: "e8", cat: "electronics", name: "Noise Cancelling Headphones", price: 9800, mrp: 12500, rating: 4.6, stock: 33, img: "https://picsum.photos/seed/head1/500/500", desc: "Over-ear wireless headphones with 30-hour playback.", badge: "New" },

  // Cosmetics
  { id: "c1", cat: "cosmetics", name: "Vitamin C Brightening Serum", price: 2400, mrp: 2900, rating: 4.7, stock: 60, img: "https://picsum.photos/seed/serum1/500/500", desc: "Lightweight serum that fades dark spots and evens skin tone.", badge: "Sale" },
  { id: "c2", cat: "cosmetics", name: "Matte Liquid Lipstick Set (6pc)", price: 1850, mrp: 2300, rating: 4.5, stock: 44, img: "https://picsum.photos/seed/lip1/500/500", desc: "Long-lasting transfer-proof matte shades, six-piece set.", badge: "New" },
  { id: "c3", cat: "cosmetics", name: "Hydrating Rose Face Toner", price: 950, mrp: 1150, rating: 4.4, stock: 70, img: "https://picsum.photos/seed/toner1/500/500", desc: "Alcohol-free toner with rose water and glycerin.", badge: "" },
  { id: "c4", cat: "cosmetics", name: "Professional Makeup Brush Kit", price: 2650, mrp: 3200, rating: 4.6, stock: 25, img: "https://picsum.photos/seed/brush1/500/500", desc: "12-piece soft bristle brush set with vegan leather pouch.", badge: "" },
  { id: "c5", cat: "cosmetics", name: "SPF 50 Sunscreen Gel", price: 1350, mrp: 1600, rating: 4.8, stock: 55, img: "https://picsum.photos/seed/spf1/500/500", desc: "Non-greasy broad-spectrum protection for daily wear.", badge: "Sale" },
  { id: "c6", cat: "cosmetics", name: "Oud & Amber Eau de Parfum", price: 4200, mrp: 5000, rating: 4.5, stock: 18, img: "https://picsum.photos/seed/perfume1/500/500", desc: "Long-lasting oriental fragrance, 100ml bottle.", badge: "" },
  { id: "c7", cat: "cosmetics", name: "Charcoal Detox Face Mask", price: 780, mrp: 950, rating: 4.3, stock: 65, img: "https://picsum.photos/seed/mask1/500/500", desc: "Deep-cleansing clay mask that draws out impurities.", badge: "" },
  { id: "c8", cat: "cosmetics", name: "18-Shade Eyeshadow Palette", price: 1990, mrp: 2400, rating: 4.6, stock: 30, img: "https://picsum.photos/seed/eye1/500/500", desc: "Blendable matte and shimmer shades for day-to-night looks.", badge: "New" },

  // Mobiles
  { id: "m1", cat: "mobiles", name: "6.5\" Smartphone 128GB", price: 42500, mrp: 47500, rating: 4.5, stock: 20, img: "https://picsum.photos/seed/phone1/500/500", desc: "Triple camera, 6GB RAM, all-day battery life.", badge: "Sale" },
  { id: "m2", cat: "mobiles", name: "Wireless Earbuds Pro", price: 5400, mrp: 6800, rating: 4.4, stock: 48, img: "https://picsum.photos/seed/buds1/500/500", desc: "Active noise cancellation with touch controls.", badge: "New" },
  { id: "m3", cat: "mobiles", name: "65W Fast Charger + Cable", price: 2100, mrp: 2500, rating: 4.6, stock: 80, img: "https://picsum.photos/seed/charger1/500/500", desc: "GaN fast charging adapter with braided USB-C cable.", badge: "" },
  { id: "m4", cat: "mobiles", name: "Shockproof Phone Case", price: 890, mrp: 1100, rating: 4.3, stock: 90, img: "https://picsum.photos/seed/case1/500/500", desc: "Military-grade drop protection, crystal clear back.", badge: "" },
  { id: "m5", cat: "mobiles", name: "10000mAh Power Bank", price: 3600, mrp: 4300, rating: 4.5, stock: 52, img: "https://picsum.photos/seed/power1/500/500", desc: "Dual-port fast charging portable power bank.", badge: "Sale" },
  { id: "m6", cat: "mobiles", name: "Smart Watch Fitness Band", price: 6800, mrp: 8200, rating: 4.4, stock: 27, img: "https://picsum.photos/seed/watch1/500/500", desc: "Heart-rate, SpO2 tracking with 7-day battery.", badge: "New" },
];

/* ---------------------------------------------------------------
   PRICE-TAG CARD (signature element)
--------------------------------------------------------------- */
const TagCard = ({ children, style, className = "", notch = true }) => (
  <div
    className={className}
    style={{
      position: "relative",
      background: C.card,
      border: `1px solid ${C.line}`,
      clipPath: notch ? "polygon(18px 0,100% 0,100% 100%,0 100%,0 18px)" : undefined,
      ...style,
    }}
  >
    {notch && (
      <span style={{
        position: "absolute", top: 6, left: 6, width: 8, height: 8, borderRadius: "50%",
        background: C.bg, border: `1px solid ${C.line}`,
      }} />
    )}
    {children}
  </div>
);

/* ---------------------------------------------------------------
   SMALL UI PIECES
--------------------------------------------------------------- */
const Stars = ({ rating }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
    {[1, 2, 3, 4, 5].map((i) => (
      <Star key={i} size={12} fill={i <= Math.round(rating) ? C.marigold : "none"} color={C.marigold} />
    ))}
    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: C.muted, marginLeft: 2 }}>{rating.toFixed(1)}</span>
  </div>
);

const Badge = ({ children, tone = "teal" }) => {
  const tones = {
    teal: { bg: C.tealSoft, fg: C.tealDark },
    coral: { bg: "#F9E4E8", fg: C.coral },
    marigold: { bg: "#FBEBD2", fg: C.marigoldDark },
  };
  const t = tones[tone];
  return (
    <span style={{
      background: t.bg, color: t.fg, fontSize: 11, fontWeight: 700, padding: "3px 8px",
      letterSpacing: 0.3, textTransform: "uppercase", fontFamily: "Inter, sans-serif",
    }}>{children}</span>
  );
};

const Button = ({ children, onClick, variant = "primary", style, ...rest }) => {
  const variants = {
    primary: { background: C.teal, color: "#fff", border: `1px solid ${C.teal}` },
    marigold: { background: C.marigold, color: C.ink, border: `1px solid ${C.marigold}` },
    ghost: { background: "transparent", color: C.teal, border: `1px solid ${C.teal}` },
    plain: { background: "transparent", color: C.ink, border: "1px solid transparent" },
  };
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 13.5, padding: "10px 18px",
        cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8,
        transition: "opacity .15s ease", ...variants[variant], ...style,
      }}
      onMouseOver={(e) => (e.currentTarget.style.opacity = 0.85)}
      onMouseOut={(e) => (e.currentTarget.style.opacity = 1)}
      {...rest}
    >
      {children}
    </button>
  );
};

/* ---------------------------------------------------------------
   HEADER
--------------------------------------------------------------- */
const Header = ({ go, cartCount, auth, onSearch, query, catOpen, setCatOpen }) => (
  <header style={{ position: "sticky", top: 0, zIndex: 40, background: C.card, borderBottom: `1px solid ${C.line}` }}>
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "12px 20px", display: "flex", alignItems: "center", gap: 18 }}>
      <div onClick={() => go("home")} style={{ cursor: "pointer", display: "flex", alignItems: "baseline", gap: 4, flexShrink: 0 }}>
        <span style={{ fontFamily: "Fraunces, serif", fontWeight: 800, fontSize: 25, color: C.tealDark }}>Mallah</span>
        <span style={{ fontFamily: "Fraunces, serif", fontWeight: 500, fontStyle: "italic", fontSize: 25, color: C.marigold }}>Bazaar</span>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", background: C.bg, border: `1px solid ${C.line}`, padding: "9px 14px", gap: 8, minWidth: 0 }}>
        <Search size={16} color={C.muted} />
        <input
          value={query}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search TVs, lipstick, phone cases..."
          style={{ border: "none", outline: "none", background: "transparent", flex: 1, fontFamily: "Inter, sans-serif", fontSize: 13.5, color: C.ink, minWidth: 0 }}
        />
      </div>

      <nav style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
        <button onClick={() => go("cart")} style={{ position: "relative", background: "none", border: "none", cursor: "pointer", padding: 8 }} aria-label="Cart">
          <ShoppingCart size={21} color={C.ink} />
          {cartCount > 0 && (
            <span style={{
              position: "absolute", top: 2, right: 2, background: C.coral, color: "#fff", fontSize: 10, fontWeight: 800,
              width: 16, height: 16, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
            }}>{cartCount}</span>
          )}
        </button>
        <button onClick={() => go(auth.user ? "account" : "login")} style={{ background: "none", border: "none", cursor: "pointer", padding: 8, display: "flex", alignItems: "center", gap: 6 }}>
          <User size={21} color={C.ink} />
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: C.ink, display: window.innerWidth < 640 ? "none" : "inline" }}>
            {auth.user ? auth.user.name.split(" ")[0] : "Sign in"}
          </span>
        </button>
      </nav>
    </div>

    <div style={{ borderTop: `1px solid ${C.line}`, background: C.tealDark }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", gap: 22, overflowX: "auto" }}>
        <button onClick={() => go("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, padding: "10px 0", color: "#fff", fontFamily: "Inter,sans-serif", fontWeight: 600, fontSize: 13 }}>
          <HomeIcon size={14} /> Home
        </button>
        {CATEGORIES.map((c) => (
          <button key={c.id} onClick={() => go("category", c.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: "10px 0", color: "#EAF3F1", fontFamily: "Inter,sans-serif", fontWeight: 600, fontSize: 13, whiteSpace: "nowrap" }}>
            {c.name}
          </button>
        ))}
        {auth.isAdmin && (
          <button onClick={() => go("admin")} style={{ background: "none", border: "none", cursor: "pointer", padding: "10px 0", color: C.marigold, fontFamily: "Inter,sans-serif", fontWeight: 700, fontSize: 13, marginLeft: "auto" }}>
            Admin Dashboard
          </button>
        )}
      </div>
    </div>
  </header>
);

/* ---------------------------------------------------------------
   PRODUCT CARD
--------------------------------------------------------------- */
const ProductCard = ({ p, go, addToCart }) => {
  const off = Math.round(100 - (p.price / p.mrp) * 100);
  return (
    <TagCard style={{ display: "flex", flexDirection: "column", cursor: "pointer" }}>
      <div onClick={() => go("product", p.id)} style={{ position: "relative" }}>
        <img src={p.img} alt={p.name} style={{ width: "100%", height: 170, objectFit: "cover", display: "block" }} />
        {p.badge && (
          <span style={{ position: "absolute", top: 10, right: 0 }}>
            <Badge tone={p.badge === "Sale" ? "coral" : "marigold"}>{p.badge}</Badge>
          </span>
        )}
      </div>
      <div style={{ padding: "12px 14px 14px", display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
        <div onClick={() => go("product", p.id)} style={{ fontFamily: "Inter,sans-serif", fontWeight: 600, fontSize: 13.5, color: C.ink, lineHeight: 1.35, minHeight: 36 }}>
          {p.name}
        </div>
        <Stars rating={p.rating} />
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 2 }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 16, color: C.tealDark }}>{money(p.price)}</span>
          {p.mrp > p.price && (
            <>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: C.muted, textDecoration: "line-through" }}>{money(p.mrp)}</span>
              <span style={{ fontFamily: "Inter,sans-serif", fontSize: 11.5, fontWeight: 700, color: C.coral }}>{off}% off</span>
            </>
          )}
        </div>
        <div style={{ fontSize: 11.5, color: p.stock > 0 ? C.muted : C.coral, fontFamily: "Inter,sans-serif" }}>
          {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
        </div>
        <Button
          variant="primary"
          style={{ marginTop: 6, justifyContent: "center", width: "100%", opacity: p.stock === 0 ? 0.4 : 1 }}
          disabled={p.stock === 0}
          onClick={(e) => { e.stopPropagation(); addToCart(p); }}
        >
          <ShoppingCart size={14} /> Add to Cart
        </Button>
      </div>
    </TagCard>
  );
};

/* ---------------------------------------------------------------
   HOME VIEW
--------------------------------------------------------------- */
const Home = ({ products, go, addToCart }) => {
  const featured = products.filter((p) => p.badge === "Sale").slice(0, 4);
  return (
    <div>
      {/* HERO */}
      <section style={{ background: `linear-gradient(120deg, ${C.tealDark}, ${C.teal})`, padding: "56px 20px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", alignItems: "center", gap: 40, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 380px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <span style={{ width: 26, height: 2, background: C.marigold }} />
              <span style={{ color: C.marigold, fontFamily: "Inter,sans-serif", fontWeight: 700, fontSize: 12.5, letterSpacing: 1.5, textTransform: "uppercase" }}>Electronics · Beauty · Mobiles</span>
            </div>
            <h1 style={{ fontFamily: "Fraunces,serif", fontWeight: 700, fontSize: "clamp(32px,5vw,52px)", color: "#fff", lineHeight: 1.08, margin: 0 }}>
              One shop, three aisles worth trusting.
            </h1>
            <p style={{ color: "#D8E8E4", fontFamily: "Inter,sans-serif", fontSize: 15.5, lineHeight: 1.6, maxWidth: 460, margin: "18px 0 26px" }}>
              From TVs to lipstick to phone chargers — genuine stock, fair price tags, and delivery across Pakistan. Browse freely; create an account only when you're ready to check out.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Button variant="marigold" onClick={() => go("category", "electronics")}>Shop Electronics <ChevronRight size={15} /></Button>
              <Button variant="ghost" style={{ color: "#fff", borderColor: "#ffffff55" }} onClick={() => go("category", "cosmetics")}>Shop Beauty <ChevronRight size={15} /></Button>
            </div>
          </div>
          <div style={{ flex: "1 1 300px", display: "flex", justifyContent: "center" }}>
            <TagCard style={{ width: 260, padding: 20, background: "#fff", transform: "rotate(-3deg)" }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: C.muted, letterSpacing: 1 }}>TODAY'S TAG</div>
              <div style={{ fontFamily: "Fraunces,serif", fontWeight: 700, fontSize: 20, margin: "6px 0", color: C.ink }}>Up to 20% off</div>
              <div style={{ fontSize: 13, color: C.muted, fontFamily: "Inter,sans-serif", marginBottom: 10 }}>Serums, speakers & smartphones</div>
              <div style={{ borderTop: `1px dashed ${C.line}`, paddingTop: 10, display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "Inter,sans-serif", fontSize: 12, fontWeight: 700, color: C.teal }}>MLH-BAZAAR</span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: C.muted }}>#0126</span>
              </div>
            </TagCard>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section style={{ borderBottom: `1px solid ${C.line}`, background: C.card }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "18px 20px", display: "flex", gap: 30, flexWrap: "wrap" }}>
          {[[ShieldCheck, "Genuine products"], [Truck, "Nationwide delivery"], [BadgePercent, "Fair, transparent pricing"]].map(([Icon, t], i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon size={17} color={C.teal} />
              <span style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, color: C.ink }}>{t}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORY TILES */}
      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "46px 20px 10px" }}>
        <h2 style={{ fontFamily: "Fraunces,serif", fontWeight: 700, fontSize: 26, color: C.ink, margin: "0 0 20px" }}>Shop by aisle</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 18 }}>
          {CATEGORIES.map((c) => (
            <TagCard key={c.id} style={{ cursor: "pointer", overflow: "hidden" }}>
              <div onClick={() => go("category", c.id)}>
                <div style={{ position: "relative" }}>
                  <img src={c.img} alt={c.name} style={{ width: "100%", height: 150, objectFit: "cover", display: "block" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg,#00000090,transparent 60%)" }} />
                  <div style={{ position: "absolute", bottom: 10, left: 14, color: "#fff", fontFamily: "Fraunces,serif", fontWeight: 700, fontSize: 19 }}>{c.name}</div>
                </div>
                <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "Inter,sans-serif", fontSize: 12.5, color: C.muted }}>{c.tagline}</span>
                  <ChevronRight size={16} color={c.color} />
                </div>
              </div>
            </TagCard>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "40px 20px 60px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "Fraunces,serif", fontWeight: 700, fontSize: 26, color: C.ink, margin: 0 }}>Today's best tags</h2>
          <BadgePercent size={20} color={C.coral} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))", gap: 16 }}>
          {featured.map((p) => <ProductCard key={p.id} p={p} go={go} addToCart={addToCart} />)}
        </div>
      </section>
    </div>
  );
};

/* ---------------------------------------------------------------
   CATEGORY VIEW
--------------------------------------------------------------- */
const CategoryView = ({ catId, products, go, addToCart, query }) => {
  const [sort, setSort] = useState("pop");
  const cat = CATEGORIES.find((c) => c.id === catId);
  let list = products.filter((p) => p.cat === catId);
  if (query) list = list.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
  if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
  if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
  if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);

  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "30px 20px 60px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12.5, color: C.muted, fontFamily: "Inter,sans-serif", marginBottom: 14 }}>
        <span onClick={() => go("home")} style={{ cursor: "pointer" }}>Home</span> <ChevronRight size={12} /> <span style={{ color: C.ink, fontWeight: 600 }}>{cat.name}</span>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "Fraunces,serif", fontWeight: 700, fontSize: 30, color: C.ink, margin: 0 }}>{cat.name}</h1>
          <p style={{ fontFamily: "Inter,sans-serif", color: C.muted, fontSize: 13.5, margin: "4px 0 0" }}>{cat.tagline} · {list.length} products</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Filter size={14} color={C.muted} />
          <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ border: `1px solid ${C.line}`, padding: "8px 10px", fontFamily: "Inter,sans-serif", fontSize: 13, background: C.card, color: C.ink }}>
            <option value="pop">Most popular</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
            <option value="rating">Top rated</option>
          </select>
        </div>
      </div>
      {list.length === 0 ? (
        <div style={{ padding: 60, textAlign: "center", color: C.muted, fontFamily: "Inter,sans-serif" }}>No products match your search.</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))", gap: 16 }}>
          {list.map((p) => <ProductCard key={p.id} p={p} go={go} addToCart={addToCart} />)}
        </div>
      )}
    </div>
  );
};

/* ---------------------------------------------------------------
   PRODUCT DETAIL
--------------------------------------------------------------- */
const ProductDetail = ({ pid, products, go, addToCart }) => {
  const p = products.find((x) => x.id === pid);
  const [qty, setQty] = useState(1);
  if (!p) return null;
  const off = Math.round(100 - (p.price / p.mrp) * 100);
  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "30px 20px 70px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12.5, color: C.muted, fontFamily: "Inter,sans-serif", marginBottom: 20 }}>
        <span onClick={() => go("home")} style={{ cursor: "pointer" }}>Home</span> <ChevronRight size={12} />
        <span onClick={() => go("category", p.cat)} style={{ cursor: "pointer" }}>{CATEGORIES.find(c => c.id === p.cat).name}</span> <ChevronRight size={12} />
        <span style={{ color: C.ink, fontWeight: 600 }}>{p.name}</span>
      </div>
      <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
        <TagCard style={{ flex: "1 1 360px", padding: 0, maxWidth: 440 }}>
          <img src={p.img} alt={p.name} style={{ width: "100%", height: 400, objectFit: "cover", display: "block" }} />
        </TagCard>
        <div style={{ flex: "1 1 320px" }}>
          {p.badge && <Badge tone={p.badge === "Sale" ? "coral" : "marigold"}>{p.badge}</Badge>}
          <h1 style={{ fontFamily: "Fraunces,serif", fontWeight: 700, fontSize: 28, color: C.ink, margin: "10px 0 8px" }}>{p.name}</h1>
          <Stars rating={p.rating} />
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, margin: "16px 0" }}>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 28, color: C.tealDark }}>{money(p.price)}</span>
            {p.mrp > p.price && (
              <>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 15, color: C.muted, textDecoration: "line-through" }}>{money(p.mrp)}</span>
                <Badge tone="coral">{off}% off</Badge>
              </>
            )}
          </div>
          <p style={{ fontFamily: "Inter,sans-serif", fontSize: 14.5, lineHeight: 1.7, color: C.muted, maxWidth: 440 }}>{p.desc}</p>
          <div style={{ fontSize: 13, color: p.stock > 0 ? C.teal : C.coral, fontFamily: "Inter,sans-serif", fontWeight: 700, margin: "8px 0 20px" }}>
            {p.stock > 0 ? `${p.stock} units in stock` : "Currently out of stock"}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 22 }}>
            <div style={{ display: "flex", alignItems: "center", border: `1px solid ${C.line}` }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ border: "none", background: "none", padding: "8px 12px", cursor: "pointer" }}><Minus size={14} /></button>
              <span style={{ padding: "0 14px", fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>{qty}</span>
              <button onClick={() => setQty(Math.min(p.stock, qty + 1))} style={{ border: "none", background: "none", padding: "8px 12px", cursor: "pointer" }}><Plus size={14} /></button>
            </div>
            <Button variant="primary" style={{ flex: 1, justifyContent: "center" }} disabled={p.stock === 0} onClick={() => addToCart(p, qty)}>
              <ShoppingCart size={15} /> Add to Cart
            </Button>
          </div>
          <div style={{ display: "flex", gap: 20, borderTop: `1px solid ${C.line}`, paddingTop: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: C.muted, fontFamily: "Inter,sans-serif" }}><ShieldCheck size={15} color={C.teal} /> Genuine product</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: C.muted, fontFamily: "Inter,sans-serif" }}><Truck size={15} color={C.teal} /> Delivered in 3-5 days</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------
   CART
--------------------------------------------------------------- */
const CartView = ({ cart, updateQty, removeItem, go, auth }) => {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "34px 20px 70px" }}>
      <h1 style={{ fontFamily: "Fraunces,serif", fontWeight: 700, fontSize: 28, color: C.ink, margin: "0 0 24px" }}>Your Cart</h1>
      {cart.length === 0 ? (
        <TagCard style={{ padding: 50, textAlign: "center" }}>
          <ShoppingCart size={30} color={C.muted} style={{ marginBottom: 10 }} />
          <p style={{ fontFamily: "Inter,sans-serif", color: C.muted, marginBottom: 16 }}>Your cart is empty.</p>
          <Button variant="primary" onClick={() => go("home")}>Start Shopping</Button>
        </TagCard>
      ) : (
        <div style={{ display: "flex", gap: 30, flexWrap: "wrap" }}>
          <div style={{ flex: "2 1 420px", display: "flex", flexDirection: "column", gap: 12 }}>
            {cart.map((i) => (
              <TagCard key={i.id} style={{ display: "flex", gap: 14, padding: 12, alignItems: "center" }}>
                <img src={i.img} alt={i.name} style={{ width: 74, height: 74, objectFit: "cover" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "Inter,sans-serif", fontWeight: 600, fontSize: 13.5, color: C.ink }}>{i.name}</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, color: C.tealDark, fontSize: 14, marginTop: 4 }}>{money(i.price)}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", border: `1px solid ${C.line}` }}>
                  <button onClick={() => updateQty(i.id, Math.max(1, i.qty - 1))} style={{ border: "none", background: "none", padding: "6px 10px", cursor: "pointer" }}><Minus size={12} /></button>
                  <span style={{ padding: "0 10px", fontFamily: "'JetBrains Mono',monospace", fontSize: 13 }}>{i.qty}</span>
                  <button onClick={() => updateQty(i.id, i.qty + 1)} style={{ border: "none", background: "none", padding: "6px 10px", cursor: "pointer" }}><Plus size={12} /></button>
                </div>
                <button onClick={() => removeItem(i.id)} style={{ border: "none", background: "none", cursor: "pointer", padding: 8 }}><Trash2 size={16} color={C.coral} /></button>
              </TagCard>
            ))}
          </div>
          <TagCard style={{ flex: "1 1 260px", padding: 20, alignSelf: "flex-start" }}>
            <div style={{ fontFamily: "Fraunces,serif", fontWeight: 700, fontSize: 18, marginBottom: 16 }}>Order Summary</div>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Inter,sans-serif", fontSize: 13.5, color: C.muted, marginBottom: 8 }}>
              <span>Subtotal</span><span style={{ fontFamily: "'JetBrains Mono',monospace" }}>{money(subtotal)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Inter,sans-serif", fontSize: 13.5, color: C.muted, marginBottom: 14 }}>
              <span>Delivery</span><span style={{ fontFamily: "'JetBrains Mono',monospace" }}>Free</span>
            </div>
            <div style={{ borderTop: `1px dashed ${C.line}`, paddingTop: 14, display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
              <span style={{ fontFamily: "Inter,sans-serif", fontWeight: 700 }}>Total</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 17, color: C.tealDark }}>{money(subtotal)}</span>
            </div>
            <Button variant="primary" style={{ width: "100%", justifyContent: "center" }} onClick={() => go(auth.user ? "checkout" : "login")}>
              {auth.user ? "Place Order" : "Sign in to Order"} <ChevronRight size={15} />
            </Button>
            {!auth.user && <p style={{ fontFamily: "Inter,sans-serif", fontSize: 11.5, color: C.muted, marginTop: 10 }}>You can browse freely, but an account is needed to place an order.</p>}
          </TagCard>
        </div>
      )}
    </div>
  );
};

/* ---------------------------------------------------------------
   AUTH VIEWS
--------------------------------------------------------------- */
const AuthView = ({ mode, setMode, users, login, signup, go, error }) => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const set = (k, v) => setForm({ ...form, [k]: v });

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: "50px 20px 80px" }}>
      <TagCard style={{ padding: 28 }}>
        <h1 style={{ fontFamily: "Fraunces,serif", fontWeight: 700, fontSize: 24, color: C.ink, margin: "0 0 4px" }}>
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.muted, margin: "0 0 22px" }}>
          {mode === "login" ? "Sign in to place and track your orders." : "Sign up to check out — browsing never requires an account."}
        </p>

        {error && <div style={{ background: "#F9E4E8", color: C.coral, fontSize: 12.5, padding: "9px 12px", marginBottom: 14, fontFamily: "Inter,sans-serif" }}>{error}</div>}

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {mode === "signup" && (
            <>
              <input placeholder="Full name" value={form.name} onChange={(e) => set("name", e.target.value)} style={inputStyle} />
              <input placeholder="Phone number" value={form.phone} onChange={(e) => set("phone", e.target.value)} style={inputStyle} />
            </>
          )}
          <input placeholder="Email address" value={form.email} onChange={(e) => set("email", e.target.value)} style={inputStyle} />
          <div style={{ position: "relative" }}>
            <input placeholder="Password" type={showPw ? "text" : "password"} value={form.password} onChange={(e) => set("password", e.target.value)} style={{ ...inputStyle, width: "100%", boxSizing: "border-box" }} />
            <button onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 10, top: 9, background: "none", border: "none", cursor: "pointer" }}>
              {showPw ? <EyeOff size={16} color={C.muted} /> : <Eye size={16} color={C.muted} />}
            </button>
          </div>
        </div>

        <Button
          variant="primary"
          style={{ width: "100%", justifyContent: "center", marginTop: 18 }}
          onClick={() => (mode === "login" ? login(form.email, form.password) : signup(form))}
        >
          {mode === "login" ? "Sign In" : "Create Account"}
        </Button>

        <p style={{ textAlign: "center", fontFamily: "Inter,sans-serif", fontSize: 12.5, color: C.muted, marginTop: 16 }}>
          {mode === "login" ? "New here?" : "Already have an account?"}{" "}
          <span onClick={() => setMode(mode === "login" ? "signup" : "login")} style={{ color: C.teal, fontWeight: 700, cursor: "pointer" }}>
            {mode === "login" ? "Create an account" : "Sign in"}
          </span>
        </p>
        <p style={{ textAlign: "center", fontFamily: "Inter,sans-serif", fontSize: 11, color: C.muted, marginTop: 6 }}>
          Admin demo: admin@bazaar.pk / admin123
        </p>
      </TagCard>
    </div>
  );
};
const inputStyle = { border: `1px solid ${C.line}`, padding: "10px 12px", fontFamily: "Inter,sans-serif", fontSize: 13.5, outline: "none", background: C.bg, color: C.ink };

/* ---------------------------------------------------------------
   CHECKOUT
--------------------------------------------------------------- */
const CheckoutView = ({ cart, auth, placeOrder, go }) => {
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Sukkur");
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const [placed, setPlaced] = useState(false);

  if (placed) {
    return (
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "70px 20px", textAlign: "center" }}>
        <TagCard style={{ padding: 36 }}>
          <Check size={30} color={C.teal} style={{ marginBottom: 10 }} />
          <h1 style={{ fontFamily: "Fraunces,serif", fontSize: 24, margin: "0 0 8px" }}>Order placed!</h1>
          <p style={{ fontFamily: "Inter,sans-serif", color: C.muted, fontSize: 13.5, marginBottom: 20 }}>Thank you, {auth.user.name}. We'll deliver to {city} soon.</p>
          <Button variant="primary" onClick={() => go("home")}>Continue Shopping</Button>
        </TagCard>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "34px 20px 70px" }}>
      <h1 style={{ fontFamily: "Fraunces,serif", fontWeight: 700, fontSize: 26, color: C.ink, margin: "0 0 20px" }}>Checkout</h1>
      <TagCard style={{ padding: 22, marginBottom: 16 }}>
        <div style={{ fontFamily: "Inter,sans-serif", fontWeight: 700, fontSize: 13.5, marginBottom: 10 }}>Delivery details</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input value={auth.user.name} readOnly style={inputStyle} />
          <input value={auth.user.email} readOnly style={inputStyle} />
          <input placeholder="Delivery address" value={address} onChange={(e) => setAddress(e.target.value)} style={inputStyle} />
          <input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} style={inputStyle} />
        </div>
      </TagCard>
      <TagCard style={{ padding: 22 }}>
        <div style={{ fontFamily: "Inter,sans-serif", fontWeight: 700, fontSize: 13.5, marginBottom: 10 }}>Payment</div>
        <p style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.muted, marginBottom: 14 }}>Cash on Delivery</p>
        <div style={{ borderTop: `1px dashed ${C.line}`, paddingTop: 14, display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ fontFamily: "Inter,sans-serif", fontWeight: 700 }}>Total to pay</span>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 17, color: C.tealDark }}>{money(subtotal)}</span>
        </div>
        <Button
          variant="primary"
          style={{ width: "100%", justifyContent: "center" }}
          disabled={!address}
          onClick={() => { placeOrder({ address, city, items: cart, total: subtotal }); setPlaced(true); }}
        >
          Confirm Order
        </Button>
        {!address && <p style={{ fontSize: 11.5, color: C.coral, marginTop: 8, fontFamily: "Inter,sans-serif" }}>Enter a delivery address to continue.</p>}
      </TagCard>
    </div>
  );
};

/* ---------------------------------------------------------------
   ACCOUNT VIEW
--------------------------------------------------------------- */
const AccountView = ({ auth, orders, logout, go }) => {
  const mine = orders.filter((o) => o.email === auth.user.email);
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "34px 20px 70px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1 style={{ fontFamily: "Fraunces,serif", fontWeight: 700, fontSize: 26, color: C.ink, margin: 0 }}>My Account</h1>
        <Button variant="ghost" onClick={logout}><LogOut size={14} /> Sign out</Button>
      </div>
      <TagCard style={{ padding: 20, marginBottom: 20 }}>
        <div style={{ fontFamily: "Inter,sans-serif", fontWeight: 700, fontSize: 14 }}>{auth.user.name}</div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.muted, marginTop: 4 }}>{auth.user.email} · {auth.user.phone || "—"}</div>
      </TagCard>
      <div style={{ fontFamily: "Inter,sans-serif", fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Order history</div>
      {mine.length === 0 ? (
        <p style={{ fontFamily: "Inter,sans-serif", color: C.muted, fontSize: 13 }}>No orders yet. <span onClick={() => go("home")} style={{ color: C.teal, cursor: "pointer", fontWeight: 700 }}>Start shopping</span></p>
      ) : mine.map((o, idx) => (
        <TagCard key={idx} style={{ padding: 16, marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Inter,sans-serif", fontSize: 13 }}>
            <span style={{ fontWeight: 700 }}>Order #{o.id}</span>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", color: C.tealDark, fontWeight: 700 }}>{money(o.total)}</span>
          </div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 4, fontFamily: "Inter,sans-serif" }}>{o.items.length} items · {o.city}</div>
        </TagCard>
      ))}
    </div>
  );
};

/* ---------------------------------------------------------------
   ADMIN DASHBOARD
--------------------------------------------------------------- */
const AdminView = ({ products, setProducts, orders, users, logout, go }) => {
  const [tab, setTab] = useState("overview");
  const [editing, setEditing] = useState(null);

  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const emptyProduct = { id: "", cat: "electronics", name: "", price: 0, mrp: 0, rating: 4.5, stock: 0, img: "https://picsum.photos/seed/new" + Date.now() + "/500/500", desc: "", badge: "" };

  const saveProduct = (p) => {
    if (products.find((x) => x.id === p.id)) {
      setProducts(products.map((x) => (x.id === p.id ? p : x)));
    } else {
      setProducts([...products, { ...p, id: "p" + Date.now() }]);
    }
    setEditing(null);
  };
  const deleteProduct = (id) => setProducts(products.filter((p) => p.id !== id));

  const Stat = ({ icon: Icon, label, value, tone }) => (
    <TagCard style={{ padding: 18, flex: "1 1 200px" }}>
      <Icon size={18} color={tone} />
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 22, color: C.ink, marginTop: 10 }}>{value}</div>
      <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.muted, marginTop: 2 }}>{label}</div>
    </TagCard>
  );

  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "30px 20px 70px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <h1 style={{ fontFamily: "Fraunces,serif", fontWeight: 700, fontSize: 27, color: C.ink, margin: 0 }}>Admin Dashboard</h1>
        <Button variant="ghost" onClick={logout}><LogOut size={14} /> Sign out</Button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24, borderBottom: `1px solid ${C.line}` }}>
        {[["overview", "Overview", LayoutGrid], ["products", "Products", Package], ["orders", "Orders", Receipt], ["customers", "Customers", Users]].map(([id, label, Icon]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            background: "none", border: "none", cursor: "pointer", padding: "10px 14px", display: "flex", alignItems: "center", gap: 6,
            fontFamily: "Inter,sans-serif", fontWeight: 700, fontSize: 13, color: tab === id ? C.teal : C.muted,
            borderBottom: tab === id ? `2px solid ${C.teal}` : "2px solid transparent",
          }}><Icon size={14} /> {label}</button>
        ))}
      </div>

      {tab === "overview" && (
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <Stat icon={TrendingUp} label="Total revenue" value={money(revenue)} tone={C.teal} />
          <Stat icon={Receipt} label="Orders placed" value={orders.length} tone={C.coral} />
          <Stat icon={Package} label="Products listed" value={products.length} tone={C.marigoldDark} />
          <Stat icon={Users} label="Registered customers" value={users.length} tone={C.teal} />
        </div>
      )}

      {tab === "products" && (
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
            <Button variant="primary" onClick={() => setEditing(emptyProduct)}><Plus size={14} /> Add Product</Button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {products.map((p) => (
              <TagCard key={p.id} style={{ padding: 12, display: "flex", alignItems: "center", gap: 14 }}>
                <img src={p.img} style={{ width: 48, height: 48, objectFit: "cover" }} />
                <div style={{ flex: 1, minWidth: 160 }}>
                  <div style={{ fontFamily: "Inter,sans-serif", fontWeight: 600, fontSize: 13 }}>{p.name}</div>
                  <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11.5, color: C.muted }}>{CATEGORIES.find(c => c.id === p.cat)?.name} · stock {p.stock}</div>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, color: C.tealDark, fontSize: 13.5 }}>{money(p.price)}</div>
                <button onClick={() => setEditing(p)} style={{ border: "none", background: "none", cursor: "pointer", padding: 6 }}><Pencil size={15} color={C.teal} /></button>
                <button onClick={() => deleteProduct(p.id)} style={{ border: "none", background: "none", cursor: "pointer", padding: 6 }}><Trash2 size={15} color={C.coral} /></button>
              </TagCard>
            ))}
          </div>
        </div>
      )}

      {tab === "orders" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {orders.length === 0 && <p style={{ fontFamily: "Inter,sans-serif", color: C.muted }}>No orders yet.</p>}
          {orders.map((o, i) => (
            <TagCard key={i} style={{ padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Inter,sans-serif", fontSize: 13 }}>
                <span style={{ fontWeight: 700 }}>Order #{o.id} — {o.name}</span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", color: C.tealDark, fontWeight: 700 }}>{money(o.total)}</span>
              </div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 4, fontFamily: "Inter,sans-serif" }}>{o.email} · {o.city} · {o.items.length} items</div>
            </TagCard>
          ))}
        </div>
      )}

      {tab === "customers" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {users.length === 0 && <p style={{ fontFamily: "Inter,sans-serif", color: C.muted }}>No customers registered yet.</p>}
          {users.map((u, i) => (
            <TagCard key={i} style={{ padding: 14, display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontFamily: "Inter,sans-serif", fontWeight: 600, fontSize: 13 }}>{u.name}</div>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.muted }}>{u.email} · {u.phone || "—"}</div>
              </div>
            </TagCard>
          ))}
        </div>
      )}

      {editing && (
        <div style={{ position: "fixed", inset: 0, background: "#00000066", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60, padding: 20 }}>
          <TagCard style={{ padding: 24, width: 420, maxHeight: "85vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontFamily: "Fraunces,serif", fontWeight: 700, fontSize: 18 }}>{editing.id ? "Edit Product" : "Add Product"}</div>
              <button onClick={() => setEditing(null)} style={{ border: "none", background: "none", cursor: "pointer" }}><X size={18} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input placeholder="Product name" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} style={inputStyle} />
              <select value={editing.cat} onChange={(e) => setEditing({ ...editing, cat: e.target.value })} style={inputStyle}>
                {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <div style={{ display: "flex", gap: 10 }}>
                <input placeholder="Price" type="number" value={editing.price} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} style={{ ...inputStyle, flex: 1 }} />
                <input placeholder="MRP" type="number" value={editing.mrp} onChange={(e) => setEditing({ ...editing, mrp: Number(e.target.value) })} style={{ ...inputStyle, flex: 1 }} />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <input placeholder="Stock" type="number" value={editing.stock} onChange={(e) => setEditing({ ...editing, stock: Number(e.target.value) })} style={{ ...inputStyle, flex: 1 }} />
                <select value={editing.badge} onChange={(e) => setEditing({ ...editing, badge: e.target.value })} style={{ ...inputStyle, flex: 1 }}>
                  <option value="">No badge</option>
                  <option value="Sale">Sale</option>
                  <option value="New">New</option>
                </select>
              </div>
              <textarea placeholder="Description" value={editing.desc} onChange={(e) => setEditing({ ...editing, desc: e.target.value })} style={{ ...inputStyle, minHeight: 70, fontFamily: "Inter,sans-serif" }} />
              <input placeholder="Image URL" value={editing.img} onChange={(e) => setEditing({ ...editing, img: e.target.value })} style={inputStyle} />
            </div>
            <Button variant="primary" style={{ width: "100%", justifyContent: "center", marginTop: 16 }} onClick={() => saveProduct(editing)}>
              <Check size={14} /> Save Product
            </Button>
          </TagCard>
        </div>
      )}
    </div>
  );
};

/* ---------------------------------------------------------------
   FOOTER
--------------------------------------------------------------- */
const Footer = () => (
  <footer style={{ background: C.tealDark, marginTop: 40 }}>
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "36px 20px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
      <div>
        <div style={{ fontFamily: "Fraunces,serif", fontWeight: 800, fontSize: 20, color: "#fff" }}>Mallah <span style={{ fontStyle: "italic", fontWeight: 500, color: C.marigold }}>Bazaar</span></div>
        <p style={{ fontFamily: "Inter,sans-serif", fontSize: 12.5, color: "#B9CFC9", maxWidth: 260, marginTop: 8 }}>Electronics, beauty and mobile essentials, delivered across Pakistan.</p>
      </div>
      <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12.5, color: "#B9CFC9" }}>
        © 2026 Mallah Bazaar. Demo storefront built for a family business.
      </div>
    </div>
  </footer>
);

/* ---------------------------------------------------------------
   ROOT APP
--------------------------------------------------------------- */
export default function App() {
  const [products, setProducts] = useState(seedProducts());
  const [view, setView] = useState({ name: "home", param: null });
  const [cart, setCart] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useState({ user: null, isAdmin: false });
  const [authMode, setAuthMode] = useState("login");
  const [authError, setAuthError] = useState("");
  const [query, setQuery] = useState("");

  const go = useCallback((name, param = null) => {
    window.scrollTo(0, 0);
    setAuthError("");
    setView({ name, param });
  }, []);

  const addToCart = (p, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === p.id);
      if (existing) return prev.map((i) => (i.id === p.id ? { ...i, qty: i.qty + qty } : i));
      return [...prev, { ...p, qty }];
    });
  };
  const updateQty = (id, qty) => setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
  const removeItem = (id) => setCart((prev) => prev.filter((i) => i.id !== id));

  const signup = (form) => {
    if (!form.name || !form.email || !form.password) { setAuthError("Please fill in all fields."); return; }
    if (users.find((u) => u.email === form.email)) { setAuthError("An account with this email already exists."); return; }
    const newUser = { name: form.name, email: form.email, phone: form.phone, password: form.password };
    setUsers((prev) => [...prev, newUser]);
    setAuth({ user: newUser, isAdmin: false });
    go(cart.length ? "checkout" : "account");
  };

  const login = (email, password) => {
    if (email === "admin@bazaar.pk" && password === "admin123") {
      setAuth({ user: { name: "Admin", email }, isAdmin: true });
      go("admin");
      return;
    }
    const u = users.find((u) => u.email === email && u.password === password);
    if (!u) { setAuthError("Incorrect email or password."); return; }
    setAuth({ user: u, isAdmin: false });
    go(cart.length ? "checkout" : "account");
  };

  const logout = () => { setAuth({ user: null, isAdmin: false }); go("home"); };

  const placeOrder = (order) => {
    const withMeta = { ...order, id: 1000 + orders.length, email: auth.user.email, name: auth.user.name };
    setOrders((prev) => [...prev, withMeta]);
    setCart([]);
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: C.bg, minHeight: "100vh", color: C.ink }}>
      <FontLoader />
      <Header go={go} cartCount={cartCount} auth={auth} onSearch={setQuery} query={query} />

      {view.name === "home" && <Home products={products} go={go} addToCart={addToCart} />}
      {view.name === "category" && <CategoryView catId={view.param} products={products} go={go} addToCart={addToCart} query={query} />}
      {view.name === "product" && <ProductDetail pid={view.param} products={products} go={go} addToCart={addToCart} />}
      {view.name === "cart" && <CartView cart={cart} updateQty={updateQty} removeItem={removeItem} go={go} auth={auth} />}
      {view.name === "login" && <AuthView mode={authMode} setMode={setAuthMode} users={users} login={login} signup={signup} go={go} error={authError} />}
      {view.name === "checkout" && auth.user && <CheckoutView cart={cart} auth={auth} placeOrder={placeOrder} go={go} />}
      {view.name === "account" && auth.user && !auth.isAdmin && <AccountView auth={auth} orders={orders} logout={logout} go={go} />}
      {view.name === "admin" && auth.isAdmin && <AdminView products={products} setProducts={setProducts} orders={orders} users={users} logout={logout} go={go} />}

      <Footer />
    </div>
  );
}
