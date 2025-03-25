export interface FakeBrand {
  name: string;
  description: string;
  category: string;
  image: string;
  colors?: {
    primary: string;
  };
}

export const fakeBrands: FakeBrand[] = [
  {
    name: "Calorie Rocket",
    description: "Global on-demand brand delivering food from a wide range of restaurants, food trucks, and the occasional high school cafeteria.",
    category: "Food App",
    image: "FakeBrandz_CalorieRocket_AppIcon.png",
    colors: { primary: "#FF4D4D" }
  },
  {
    name: "Flash & Thread",
    description: "Aggressively hip retail brand selling men's and women's clothing and beauty products in stores, online, and via an app.",
    category: "Retail App",
    image: "FakeBrandz_FlashThread_AppIcon.png",
    colors: { primary: "#3D1D72" }
  },
  {
    name: "Kitchenerie",
    description: "Retail brand disrupting the kitchenware space with direct-to-consumer strategies and an unlimited item monthly subscription plan.",
    category: "eCommerce App",
    image: "FakeBrandz_Kitchenerie_AppIcon.png",
    colors: { primary: "#FF6B00" }
  },
  {
    name: "MovieCanon",
    description: "Up-and-coming streaming service offering exclusive content, including the latest season of 'Siberia' and the McGregor & Sons franchise.",
    category: "Video App",
    image: "FakeBrandz_MovieCanon_AppIcon.png",
    colors: { primary: "#FF2D87" }
  },
  {
    name: "PantsLabyrinth",
    description: "Direct-to-consumer clothing retailer specializing in pants, with innovative subscription plans and one-click purchases.",
    category: "eCommerce App",
    image: "FakeBrandz_PantsLabyrinth_AppIcon.png",
    colors: { primary: "#4D4D4D" }
  },
  {
    name: "PoliterWeekly",
    description: "Weekly print/digital newsmagazine focused on the nicer side of business, technology, and culture.",
    category: "Publisher App",
    image: "FakeBrandz_PoliterWeekly_AppIcon.png",
    colors: { primary: "#2D2D2D" }
  },
  {
    name: "SandwichEmperor",
    description: "Artisanal quick-service restaurant brand with an all-organic menu, smart mobile-ordering, and comfortable brick-and-mortar locations.",
    category: "QSR App",
    image: "FakeBrandz_SandwichEmperor_AppIcon.png",
    colors: { primary: "#FFD600" }
  },
  {
    name: "Steppington",
    description: "Fitness brand evolving from a step-counter app into a leader in calorie tracking, digital exercise classes, and athleisure.",
    category: "Health App",
    image: "FakeBrandz_Steppington_AppIcon.png",
    colors: { primary: "#00C853" }
  },
  {
    name: "UponVoyage",
    description: "Visionary travel brand merging a leading airline with a major booking site, offering a seamless digital experience.",
    category: "TBD",
    image: "FakeBrandz_UponVoyage_AppIcon.png",
    colors: { primary: "#2196F3" }
  },
  {
    name: "StyleRyde",
    description: "On-demand ridesharing brand offering stylish and high-performance vehicles for transportation.",
    category: "OnDemand App",
    image: "FakeBrandz_StyleRyde_AppIcon.png",
    colors: { primary: "#FF4D6B" }
  },
  {
    name: "Pyrite Financial",
    description: "Financial services brand with a strong history of keeping money safe and expanding mobile banking options.",
    category: "Finance App",
    image: "FakeBrandz_PyriteFinancial_AppIcon.png",
    colors: { primary: "#FFA000" }
  },
  {
    name: "WorkFriends",
    description: "Business- and employment-focused social network helping workers, entrepreneurs, and brands connect, featuring anonymous P2P messaging.",
    category: "Social App",
    image: "FakeBrandz_WorkFriends_Appicon.png",
    colors: { primary: "#3F51B5" }
  },
  {
    name: "Decorumsoft",
    description: "Game developer known for transitioning from text-based games to interactive, highly visual experiences like 'Proxy War 3: War of Thirst.'",
    category: "Gaming App",
    image: "FakeBrandz_Decorumsoft_AppIcon.png",
    colors: { primary: "#9C27B0" }
  },
  {
    name: "Siege Valley Health",
    description: "Largest healthcare provider in the quad-state area, operating hospitals, research centers, outpatient facilities, and urgent care clinics.",
    category: "Health App",
    image: "FakeBrandz_SiegeValleyHealth_AppIcon.png",
    colors: { primary: "#00BCD4" }
  },
  {
    name: "ClaimsJumpr",
    description: "Disruptive insurance startup covering home, auto, life, and pet insurance with an advanced fraud detection algorithm.",
    category: "Insurance App",
    image: "FakeBrandz_ClaimsJumpr_AppIcon.png",
    colors: { primary: "#4CAF50" }
  },
  {
    name: "CashBlastr",
    description: "Subsidiary of Pyrite Financial enabling quick peer-to-peer payments and small business transactions.",
    category: "Finance App",
    image: "FakeBrandz_CashBlastr_AppIcon.png",
    colors: { primary: "#FF9800" }
  },
  {
    name: "Yachtr",
    description: "Yacht-sharing and rental startup allowing luxury travelers to book yachts for short or extended trips.",
    category: "TBD",
    image: "FakeBrandz_Yachtr_AppIcon.png",
    colors: { primary: "#03A9F4" }
  },
  {
    name: "Second Act Hotels & Resorts",
    description: "Accommodations brand known for repurposing disused buildings into exceptional hotels and resorts.",
    category: "TBD",
    image: "FakeBrandz_SecondAct_AppIcon.png",
    colors: { primary: "#795548" }
  }
]; 