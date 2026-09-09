import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SEO } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  Clock,
  User,
  Search,
  ArrowRight,
  Tag,
  Sparkles,
  Mail,
  Share2,
  Compass,
  X,
  BookOpen,
  Check,
  MapPin,
  ChevronRight,
  Send,
} from "lucide-react";

export interface BlogPost {
  id: string | number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  authorRole?: string;
  date: string;
  readTime: string;
  tags?: string[];
  relatedTourTitle?: string;
  relatedTourSlug?: string;
}

// 6 High-Quality Default Articles with rich editorial content
const DEFAULT_BLOG_POSTS: BlogPost[] = [
  {
    id: "zanzibar-top-10",
    title: "Top 10 Things to Do in Zanzibar: The Ultimate Island Guide",
    slug: "top-10-things-to-do-in-zanzibar",
    excerpt: "Discover the best experiences Zanzibar has to offer, from pristine coral atolls to historic Stone Town, aromatic spice plantations, and secluded coastal hideaways.",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80",
    category: "Travel Tips",
    author: "Sarah Johnson",
    authorRole: "Zanzibar Island Specialist",
    date: "December 5, 2025",
    readTime: "6 min read",
    tags: ["Zanzibar", "Stone Town", "Beaches", "Spice Island", "Snorkeling", "Mnemba"],
    relatedTourTitle: "Zanzibar Spice, Stone Town & Beach Getaway",
    relatedTourSlug: "zanzibar",
    content: `Zanzibar is a sun-drenched archipelago off the coast of Tanzania where Arabian nights meet tropical paradise. Whether you are unwinding after an exhilarating Serengeti safari or visiting the Indian Ocean solely for its azure waters, here are the top 10 experiences you cannot afford to miss.

### 1. Wander the Labyrinthine Alleyways of Stone Town
Stone Town, a UNESCO World Heritage site, is the cultural beating heart of Zanzibar. Take your time wandering its maze of narrow corridors where Arab, Persian, Indian, and European influences blend seamlessly into Swahili architecture. Admire the intricately carved wooden brass-studded doors, visit the Old Fort, and walk past Freddie Mercury's childhood residence.

### 2. Take an Aromatic Spice Plantation Tour
Known globally as the **Spice Island**, Zanzibar's rich agricultural tradition was once the epicenter of the 19th-century spice trade. A guided plantation tour in Kizimbani lets you touch, smell, and taste fresh cinnamon bark, cloves, nutmeg, cardamom pods, and lemongrass straight from the soil.

### 3. Swim with Sea Turtles in Nungwi & Kendwa
Head to the northern tip of the island to explore Kendwa and Nungwi beaches. Because of the ocean topography, these beaches experience minimal tidal fluctuation, offering calm turquoise swimming waters throughout the day. Visit the Baraka Natural Aquarium to swim alongside rescued green sea turtles in a natural tidal pool.

### 4. Snorkel the Pristine Reefs of Mnemba Atoll
A short wooden boat ride from Matemwe leads to the world-renowned marine conservation reserve of Mnemba Atoll. The crystal-clear waters boast visibility up to 30 meters, where you can snorkel among schools of vibrant reef fish, pods of playful dolphins, and peaceful sea turtles.

> **Local Expert Tip:** Book morning snorkeling departures around 8:00 AM when ocean breezes are calmest and dolphin pods actively hunt near the outer reef.

### 5. Sail into the Sunset on a Traditional Wooden Dhow
Nothing compares to hoisting the triangular sail of a handcrafted Swahili dhow boat as the golden African sun descends into the Indian Ocean. Enjoy freshly carved tropical fruits, chilled beverages, and the soothing sounds of Swahili Taarab melodies.

### 6. Feast at Forodhani Gardens Night Market
Every evening at sunset, Stone Town's waterfront park transforms into an energetic open-air food market. Treat your palate to grilled lobster skewers, fresh calamari, sweet sugarcane juice pressed with ginger and lime, and the famous hot Zanzibar Pizza stuffed with minced beef, egg, and spiced cheese.

### 7. Meet Giant Aldabra Tortoises on Prison Island (Changuu)
Located just 5 kilometers off Stone Town, Prison Island was originally conceived as a quarantine station in the 1890s. Today, it is sanctuary to over a hundred Aldabra giant tortoises—some weighing over 200 kilograms and exceeding 150 years in age.

### 8. Spot the Rare Red Colobus Monkey in Jozani Forest
Jozani Chwaka Bay National Park is Zanzibar's only national park. Take an easy trek along elevated wooden boardwalks through mangrove ecosystems to observe the endangered Zanzibar Red Colobus monkey, a rare primate endemic solely to this island.

### 9. Dine Above the Waves at The Rock Restaurant
Perched on a solitary coral outcrop off Michamvi beach, The Rock Restaurant is an international architectural icon. At low tide you can walk straight to the stairs; at high tide, a wooden ferryman will row you to your table overlooking the open ocean.

### 10. Kitesurf along the White Sands of Paje
The steady trade winds (Kaskazi and Kusi) and shallow turquoise lagoons along the southeastern coast make Paje one of the world's most acclaimed kitesurfing hotspots. Whether you are taking your first lesson or enjoying fresh coconut water in a hammock, Paje's laid-back vibe is irresistible.`
  },
  {
    id: "serengeti-migration-timing",
    title: "Best Time to Visit Serengeti for the Great Migration: Month-by-Month Guide",
    slug: "best-time-serengeti-migration",
    excerpt: "Planning your dream safari? Discover the exact calendar of the Great Wildebeest Migration, from southern calving season to dramatic northern Mara River crossings.",
    image: "https://images.unsplash.com/photo-1547970810-dc1eac37d174?w=1200&q=80",
    category: "Safari Guide",
    author: "Michael Chen",
    authorRole: "Lead Wildlife Naturalist",
    date: "December 3, 2025",
    readTime: "8 min read",
    tags: ["Serengeti", "Great Migration", "Mara River", "Calving Season", "Wildlife", "Big Five"],
    relatedTourTitle: "Classic Serengeti Great Migration Safari",
    relatedTourSlug: "classic-serengeti-safari",
    content: `Every year, over two million wildebeest, zebras, and gazelles embark on a perpetual 1,000-kilometer clockwise pilgrimage across the Serengeti-Mara ecosystem. Timing your safari to coincide with specific chapters of this movement determines whether you witness tender newborn calves taking their first steps or heart-stopping river crossings against giant Nile crocodiles.

### January to March: Southern Serengeti & Ndutu Calving Season
During the first three months of the year, the immense herds assemble across the fertile volcanic soils of Ndutu and the Southern Serengeti. In February, an estimated 8,000 wildebeest calves are born each day during an synchronized two-to-three week birthing window.
- **Predator Action:** High concentrations of vulnerable young attract Africa's greatest concentration of big cats. Cheetahs sprint across open short-grass plains, and lion prides coordinate hunts in broad daylight.
- **Safari Tip:** Ndutu allows off-road driving with experienced guides, offering unmatched photographic opportunities.

### April to May: The Green Season & Western Corridor
As the southern plains dry out, the herds begin their relentless march northwest toward the Western Corridor and the Grumeti region.
- **Lush Landscapes:** Afternoon showers breathe vibrant life into the savannah, transforming the landscapes into a tapestry of emerald green with dramatic storm skies.
- **Fewer Crowds:** Safari lodges offer generous low-season rates and fewer vehicles at wildlife sightings.

### June to July: Grumeti River Crossings & Central Seronera
By June, herds begin gathering along the banks of the Grumeti River. Deep river pools provide the first formidable obstacles of the journey, where massive prehistoric crocodiles wait in ambush.
- **Seronera Abundance:** Central Serengeti remains teeming with year-round resident wildlife including leopards draped in acacia branches and large elephant families.

### August to October: Northern Serengeti & Mara River Crossings
This is widely regarded as the dramatic pinnacle of the Great Migration. As the herds push north into the Lamai Wedge and Northern Serengeti, they must negotiate the turbulent Mara River to reach Kenya's Maasai Mara.
- **The Crossings:** Thousands of animals gather on towering cliff-like riverbanks for hours before a single brave wildebeest leaps into the rushing current. The herd follows in an overwhelming rush of thundering hooves, churning water, and primal survival instincts.
- **Big Cat Encounters:** Northern Serengeti is famous for its rocky kopjes where pride males survey their territories from granite boulders.

> **Safari Specialist Tip:** Northern Serengeti mobile tented camps fill up 9 to 12 months ahead for peak August and September river crossings. Early planning is crucial to secure prime riverbank access.

### November to December: The Short Rains & Return South
With the arrival of the brief November rains, fresh sweet grasses sprout across eastern and southern Serengeti. The herds pivot southwards through Lobo and eastern Serengeti, completing the great annual circle of life.`
  },
  {
    id: "stone-town-guide",
    title: "A Complete Guide to Stone Town: Zanzibar's Cultural Heart",
    slug: "complete-guide-stone-town",
    excerpt: "Explore the labyrinthine alleys, carved wooden doors, vibrant spice markets, and rich maritime history of Zanzibar's UNESCO World Heritage city.",
    image: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=1200&q=80",
    category: "Destinations",
    author: "Emma Rodriguez",
    authorRole: "Cultural Historian & Travel Writer",
    date: "November 28, 2025",
    readTime: "7 min read",
    tags: ["Stone Town", "UNESCO", "Architecture", "Swahili Culture", "History", "Zanzibar"],
    relatedTourTitle: "Stone Town Heritage & Cultural Walking Tour",
    relatedTourSlug: "zanzibar",
    content: `Stone Town is not merely a destination; it is a living, breathing sensory museum. Built from coral stone and mangrove timber, this UNESCO World Heritage city has stood at the crossroads of Indian Ocean trade routes for over a millennium.

### The Secret Language of Zanzibar Doors
One of Stone Town's most enchanting features is its collection of over 500 antique wooden doors. Look closely as you walk the alleyways:
- **Arab Doors:** Feature rectangular lintels, geometric precision, and elegant Quranic calligraphic carvings along the upper frames.
- **Indian Doors:** Distinguishable by arched frames and heavy, pointed brass spikes—a historic architectural design imported from Gujarat and Punjab, originally created to prevent war elephants from battering down gates.
- **Symbolic Carvings:** Waves represent maritime trade, pineapple motifs indicate generous hospitality, and chains symbolize wealth and security.

### Essential Historical Landmarks
Stone Town's complex history is etched into its stone monuments:
- **House of Wonders (Beit-al-Ajaib):** Built by Sultan Barghash in 1883, this monumental palace was the first building in East Africa to have electricity and an electric lift.
- **The Old Fort (Ngome Kongwe):** Constructed by Omani Arabs in 1700 to defend against Portuguese attacks, it now hosts cultural festivals, an open-air amphitheater, and local artisan workshops.
- **The Anglican Cathedral & Slave Market Memorial:** Built over the final open slave market in the world, the cathedral altar stands on the exact location of the historical whipping post. Adjacent underground holding cells offer a sobering, deeply moving historical lesson.
- **The Freddie Mercury Museum:** Located in the heart of Shangani, this museum honors the life of the Queen frontman who was born Farrokh Bulsara in Stone Town in 1946.

### The Art of Swahili Coffee on Rooftop Terraces
At 5:00 PM, climb the wooden stairs to an open-air rooftop like Emerson on Hurumzi. Listen to the melodious call to prayer reverberate across hundreds of minarets while sipping traditional Swahili coffee brewed with freshly crushed cardamom pods and served with sweet peanut brittle (kashata).

> **Etiquette Guide:** Stone Town is a predominantly Islamic community with warm, welcoming traditions. When exploring outside beach resorts, dress respectfully with knees and shoulders covered, and always politely ask permission before taking portraits of locals.`
  },
  {
    id: "safari-packing-guide",
    title: "The Ultimate Safari Packing List: What to Bring (and What to Leave Behind)",
    slug: "safari-packing-list",
    excerpt: "Don't get caught unprepared! Our comprehensive packing list covers clothing palettes, camera optics, bush-plane weight limits, and medical essentials.",
    image: "https://images.unsplash.com/photo-1516298773066-c48f8e9bd92b?w=1200&q=80",
    category: "Travel Tips",
    author: "David Wilson",
    authorRole: "Expedition Outfitter",
    date: "November 25, 2025",
    readTime: "5 min read",
    tags: ["Packing List", "Safari Gear", "Camera Optics", "Health & Safety", "Bush Plane Tips"],
    relatedTourTitle: "Northern Circuit Custom Safari Expedition",
    relatedTourSlug: "safaris",
    content: `Packing for an East African safari requires striking a careful balance between practicality, bush conditions, and strict aviation weight limits. Use our field-tested checklist to ensure you are fully prepared for morning mists, sunny plains, and dust-swept trails.

### 1. Luggage Constraints: The Soft-Sided Rule
If your itinerary includes bush flights between Arusha, Serengeti, and Zanzibar, domestic airlines (such as Auric Air and Coastal Aviation) impose a strict **15 kg (33 lbs) weight limit per passenger**, including carry-on bags.
- **Crucial:** Your luggage must be soft-sided (canvas duffel or soft travel pack) with no rigid external frames so ground crews can fit bags into curved aircraft pods.

### 2. Clothing - The Neutral Safari Palette
Leave your vibrant party outfits for the Zanzibar beach resorts. Out in the bush, color choices serve important functional purposes:
- **Best Colors:** Khaki, tan, beige, olive green, and neutral earth tones blend into the savannah and don't spook wildlife.
- **Colors to Avoid:** Dark blue and black attract biting tsetse flies in wooded zones like Tarangire. Bright white reflects harsh sunlight and shows orange savannah dust within minutes.
- **The Layering Strategy:** Dawn game drives start at 6:00 AM when open-sided 4x4 vehicles are chilly (temperatures can drop to 10°C / 50°F on the Ngorongoro Crater rim). Wear light layers that you can easily peel off as the midday sun climbs to 28°C (82°F).

### 3. Footwear
You do not need heavy mountaineering boots unless you are trekking Mount Kilimanjaro or Meru.
- One pair of comfortable, closed-toe trail sneakers or lightweight hiking shoes for bush walks.
- One pair of comfortable slip-on sandals for relaxing at the safari camp or lodge pool.

### 4. Optics & Photography Essentials
- **Binoculars:** A high-quality pair of 8x42 or 10x42 binoculars is the single most valuable item you can carry. We recommend one pair per person.
- **Camera Gear:** A telephoto zoom lens (minimum 300mm, ideally 100-400mm or 150-600mm) will capture crisp close-ups of tree-climbing lions and rare raptors.
- **Dust Protection:** Safari trails generate fine dust. Keep zip-lock bags and a microfiber blower cloth handy in your daypack.
- **Power:** Bring extra camera batteries and an external power bank; cold mornings can drain lithium batteries quickly.

### 5. Health & Personal Care Checklist
- Broad-spectrum SPF 50 sunscreen and UV polarized sunglasses
- Wide-brim safari hat with chin cord
- Insect repellent containing DEET (30%) or Picaridin
- Personal medical kit: Antimalarial tablets (consult your physician), rehydration salts, antihistamines, and antiseptic wipes`
  },
  {
    id: "zanzibar-spice-sensory",
    title: "Zanzibar Spice Tour: A Fragrant Journey Through History",
    slug: "zanzibar-spice-tour",
    excerpt: "Discover why Zanzibar earned the title 'The Spice Island'. Uncover cloves, cinnamon, vanilla, nutmeg, and the island's botanical treasures.",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1200&q=80",
    category: "Experiences",
    author: "Sarah Johnson",
    authorRole: "Zanzibar Island Specialist",
    date: "November 20, 2025",
    readTime: "6 min read",
    tags: ["Spice Tour", "Swahili Cuisine", "Culinary Heritage", "Botanical", "Zanzibar"],
    relatedTourTitle: "Zanzibar Organic Spice Farm Experience",
    relatedTourSlug: "zanzibar",
    content: `For centuries, ocean vessels sailing the monsoon trade winds knew they were approaching Zanzibar before even spotting land—the sweet perfume of cloves, nutmeg, and cinnamon drifted miles across the Indian Ocean. A guided spice tour through the rural farms of Kizimbani is an unforgettable sensory adventure that connects visitors to the agricultural foundations of Swahili civilization.

### Discovering the World's Most Valuable Spices
On an authentic spice farm, you don't just view plants in neat botanical rows; you interact with living, aromatic flora:
- **Cloves (Karafuu):** In the 19th century, Sultan Seyyid Said mandated clove planting across Zanzibar and Pemba, turning the islands into the supplier of 80% of the world's cloves. You will watch how unopened flower buds turn from green to brilliant red before being dried under the equatorial sun.
- **Cinnamon (Mdalasini):** Known locally as the "three-in-one tree": its bark yields sweet culinary cinnamon, its crushed green leaves produce an intense clove aroma, and its roots contain natural medicinal camphor.
- **Nutmeg & Mace (Kungumanga):** The yellow outer fruit splits open when ripe, revealing a gleaming red lattice network (mace) wrapping the brown nutmeg kernel.
- **Black, Green & White Pepper:** Discover that all three peppers originate from the same climbing vine at different maturity stages and processing methods.
- **Vanilla:** The second most expensive spice in the world, requiring skilled farmers to hand-pollinate each delicate orchid flower during the morning bloom.

### Tropical Fruits You Must Taste Fresh
Beyond spices, Zanzibar's volcanic soil yields extraordinary tropical fruits:
- Freshly cracked custard apples and passion fruit
- Sweet red bananas and jackfruit
- Freshly husked young coconut (*madafu*) sipped straight from the shell

### The Swahili Cultural Climax
At the conclusion of the farm walk, your hosts will demonstrate traditional palm weaving, crafting custom leaf crowns, rings, and decorative baskets for every guest. The experience culminates with a traditional Swahili home-cooked lunch: aromatic spiced pilau rice, slow-simmered coconut fish, fried plantains, and lemongrass hibiscus tea.`
  },
  {
    id: "ngorongoro-crater-wonder",
    title: "Ngorongoro Crater: Exploring Africa's Garden of Eden",
    slug: "ngorongoro-crater-guide",
    excerpt: "Everything you need to know about visiting the Ngorongoro Crater, home to the highest density of wildlife in Africa, including rare black rhinos.",
    image: "https://images.unsplash.com/photo-1534177616064-ef1dbdf46760?w=1200&q=80",
    category: "Safari Guide",
    author: "Michael Chen",
    authorRole: "Lead Wildlife Naturalist",
    date: "November 15, 2025",
    readTime: "8 min read",
    tags: ["Ngorongoro Crater", "Big Five", "Black Rhino", "Caldera", "Northern Circuit", "Conservation"],
    relatedTourTitle: "Ngorongoro Crater & Lake Manyara 4x4 Safari",
    relatedTourSlug: "safaris",
    content: `Often heralded as the Eighth Wonder of the World, the Ngorongoro Crater is the world's largest intact, unfilled volcanic caldera. Formed two to three million years ago when a colossal volcano collapsed in upon itself, this breathtaking 260-square-kilometer natural amphitheater is bounded by 600-meter-high sheer rock walls, creating a permanent sanctuary for more than 25,000 large mammals.

### Why Ngorongoro is Unique in Africa
Unlike the vast migratory plains of the Serengeti where wildlife constantly moves hundreds of miles in search of food and water, Ngorongoro's floor contains permanent water sources and nutrient-dense grasses. As a result, its animal populations remain year-round residents.

### Tanzania's Premier Black Rhino Stronghold
The Ngorongoro Crater is one of the very few places in East Africa where you have a genuine opportunity to encounter the critically endangered eastern black rhinoceros (*Diceros bicornis michaeli*). Under 24-hour protection by armed anti-poaching rangers, these magnificent, prehistoric creatures can often be seen grazing peacefully in the morning mists near the Lerai Forest.

### Diverse Habitats within a Single Crater
Despite its compact size, the caldera floor boasts an astonishing mosaic of distinct ecosystems:
- **Lake Magadi:** A shallow, highly alkaline soda lake in the center of the crater. It is frequently tinted deep pink by thousands of greater and lesser flamingos filtering algae.
- **The Lerai Fever-Tree Forest:** A yellow-barked acacia forest favored by leopards, vervet monkeys, bushbucks, and massive older bull elephants whose long tusks touch the ground.
- **Gorigor Swamp & Ngoitokitok Springs:** Lush marshlands fed by subterranean springs where pods of grunting hippos lounge, surrounded by reedbeds filled with yellow weavers and grey crowned cranes.
- **Open Short-Grass Plains:** The hunting ground for Africa's densest concentration of spotted hyenas and black-maned lions, who prey on resident herds of wildebeest, zebras, and Thomson's gazelles.

### Practical Tips for Your Ngorongoro Safari
- **Early Morning Descent:** The park gates open at 6:00 AM. Descending at first light offers cooler temperatures, dramatic misty lighting over the caldera rim, and peak hunting activity before predators retreat to the shade.
- **Dress Warmly:** The crater rim sits at an elevation of 2,200 meters (7,200 feet) above sea level. Morning and evening temperatures can be surprisingly chilly, so pack a warm fleece jacket or windbreaker.
- **Combine with the Northern Circuit:** Pair a day in Ngorongoro with Tarangire National Park (famous for massive elephant herds and ancient baobab trees) and the Serengeti for the quintessential Tanzania safari.`
  }
];

const DEFAULT_CATEGORIES = ["All", "Travel Tips", "Safari Guide", "Destinations", "Experiences"];

// Helper component to render formatted article body with headings, callout quotes, and bullets
function ArticleContentRenderer({ content }: { content: string }) {
  const paragraphs = content.split("\n\n");

  const renderFormattedInline = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={idx} className="font-bold text-foreground">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-5 text-foreground/85 leading-relaxed font-sans">
      {paragraphs.map((block, idx) => {
        const trimmed = block.trim();

        // Level 3 Heading
        if (trimmed.startsWith("### ")) {
          return (
            <h3
              key={idx}
              className="text-2xl md:text-3xl font-bold text-foreground mt-8 mb-3 pt-2"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {trimmed.replace(/^###\s+/, "")}
            </h3>
          );
        }

        // Level 2 Heading
        if (trimmed.startsWith("## ")) {
          return (
            <h2
              key={idx}
              className="text-3xl md:text-4xl font-bold text-foreground mt-10 mb-4"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {trimmed.replace(/^##\s+/, "")}
            </h2>
          );
        }

        // Quote / Pro Tip callout
        if (trimmed.startsWith("> ")) {
          const quoteText = trimmed.replace(/^>\s+/, "");
          return (
            <blockquote
              key={idx}
              className="my-6 p-5 rounded-2xl bg-safari-gold/10 border-l-4 border-safari-gold text-safari-night dark:text-safari-gold/90 text-base md:text-lg leading-relaxed shadow-sm"
            >
              {renderFormattedInline(quoteText)}
            </blockquote>
          );
        }

        // Bulleted lists
        if (trimmed.includes("\n- ") || trimmed.startsWith("- ")) {
          const lines = trimmed.split("\n");
          return (
            <ul key={idx} className="my-4 space-y-2.5 pl-2">
              {lines.map((line, lineIdx) => {
                const isBullet = line.trim().startsWith("- ");
                const cleanLine = isBullet ? line.trim().replace(/^-\s+/, "") : line;
                return (
                  <li key={lineIdx} className="flex items-start gap-3 text-muted-foreground text-base md:text-lg leading-relaxed">
                    {isBullet && <span className="w-2 h-2 rounded-full bg-safari-gold shrink-0 mt-2.5" />}
                    <span>{renderFormattedInline(cleanLine)}</span>
                  </li>
                );
              })}
            </ul>
          );
        }

        // Normal paragraph
        return (
          <p key={idx} className="text-base md:text-lg leading-relaxed text-muted-foreground">
            {renderFormattedInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

export default function Blog() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [hasSubscribed, setHasSubscribed] = useState(false);

  // Fetch custom blog posts from site_settings (key: 'custom_blog')
  const { data: customPostsData } = useQuery({
    queryKey: ["custom-blog-posts"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "custom_blog")
          .maybeSingle();

        if (error) {
          console.warn("Could not fetch custom_blog from site_settings:", error);
          return null;
        }

        if (data?.value) {
          let rawList: any[] = [];
          if (Array.isArray(data.value)) {
            rawList = data.value;
          } else if (typeof data.value === "object" && Array.isArray((data.value as any).posts)) {
            rawList = (data.value as any).posts;
          }

          if (rawList.length > 0) {
            return rawList.map((item, idx) => ({
              id: item.id || `custom-${idx}`,
              title: item.title || "Untitled Safari Story",
              slug:
                item.slug ||
                (item.title
                  ? item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")
                  : `custom-post-${idx}`),
              excerpt:
                item.excerpt ||
                (item.content
                  ? item.content.slice(0, 160).replace(/[#*>-]/g, "").trim() + "..."
                  : "Discover our expert travel insights and tips for your Tanzania journey."),
              content:
                item.content ||
                item.body ||
                item.excerpt ||
                "Full article text will be published shortly.",
              image:
                item.image ||
                item.featured_image ||
                "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80",
              category: item.category || "Travel Tips",
              author: item.author || "Infinity Voyage Specialist",
              authorRole: item.authorRole || item.author_role || "Safari Guide",
              date:
                item.date ||
                new Date().toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }),
              readTime:
                item.readTime ||
                item.read_time ||
                `${Math.max(4, Math.ceil((item.content?.split(/\s+/).length || 500) / 200))} min read`,
              tags: Array.isArray(item.tags)
                ? item.tags
                : item.tags
                ? String(item.tags).split(",").map((t: string) => t.trim())
                : ["Tanzania", "Safari"],
              relatedTourTitle:
                item.relatedTourTitle || item.related_tour_title || "Tanzania Safari Expedition",
              relatedTourSlug: item.relatedTourSlug || item.related_tour_slug || "safaris",
            })) as BlogPost[];
          }
        }
        return null;
      } catch (err) {
        console.warn("Failed reading custom_blog:", err);
        return null;
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  // Combine custom posts if present, seamlessly falling back to high-quality defaults
  const allPosts = useMemo<BlogPost[]>(() => {
    if (customPostsData && customPostsData.length > 0) {
      // Prioritize custom posts, keep defaults that don't collide on slug
      const customSlugs = new Set(customPostsData.map((p) => p.slug));
      const nonCollidingDefaults = DEFAULT_BLOG_POSTS.filter((p) => !customSlugs.has(p.slug));
      return [...customPostsData, ...nonCollidingDefaults];
    }
    return DEFAULT_BLOG_POSTS;
  }, [customPostsData]);

  // Dynamic category tabs
  const categories = useMemo(() => {
    const postCats = allPosts.map((p) => p.category).filter(Boolean);
    const unique = Array.from(new Set([...DEFAULT_CATEGORIES, ...postCats]));
    return unique;
  }, [allPosts]);

  // Real-time filtered posts
  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      const matchesCategory =
        activeCategory === "All" || post.category.toLowerCase() === activeCategory.toLowerCase();

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const matchTitle = post.title.toLowerCase().includes(q);
      const matchExcerpt = post.excerpt.toLowerCase().includes(q);
      const matchAuthor = post.author.toLowerCase().includes(q);
      const matchCategory = post.category.toLowerCase().includes(q);
      const matchTags = post.tags?.some((tag) => tag.toLowerCase().includes(q)) ?? false;
      const matchContent = post.content.toLowerCase().includes(q);

      return matchTitle || matchExcerpt || matchAuthor || matchCategory || matchTags || matchContent;
    });
  }, [allPosts, activeCategory, searchQuery]);

  // Synchronize URL search params (?article=slug) with modal
  useEffect(() => {
    const articleSlug = searchParams.get("article");
    if (articleSlug) {
      const match = allPosts.find((p) => p.slug === articleSlug);
      if (match) {
        setSelectedPost(match);
      }
    }
  }, [searchParams, allPosts]);

  const handleOpenArticle = (post: BlogPost) => {
    setSelectedPost(post);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("article", post.slug);
        return next;
      },
      { replace: true }
    );
  };

  const handleCloseArticle = () => {
    setSelectedPost(null);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete("article");
        return next;
      },
      { replace: true }
    );
  };

  const handleShare = (post: BlogPost) => {
    const shareUrl = `${window.location.origin}/blog?article=${post.slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied!",
        description: "Article link copied to clipboard. Share with your travel companions!",
      });
    } else {
      toast({
        title: "Article Link",
        description: shareUrl,
      });
    }
  };

  const handleBookSafari = (post: BlogPost) => {
    handleCloseArticle();
    if (post.relatedTourSlug && post.relatedTourSlug !== "safaris") {
      navigate(`/tour/${post.relatedTourSlug}`);
    } else {
      navigate("/safaris");
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      toast({
        title: "Valid Email Required",
        description: "Please enter a valid email address to receive our safari journals.",
        variant: "destructive",
      });
      return;
    }

    setIsSubscribing(true);
    setTimeout(() => {
      setIsSubscribing(false);
      setHasSubscribed(true);
      toast({
        title: "Welcome Aboard! 🌍",
        description: "Thank you for subscribing to Infinity Voyage travel stories and insider tips.",
      });
      setNewsletterEmail("");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Travel Blog - Tanzania Safari Guides & Zanzibar Travel Tips"
        description="Expert travel advice, Great Migration tracking, Stone Town guides, and packing tips from Infinity Voyage Tours & Safaris local experts."
        keywords="Tanzania travel blog, Serengeti Great Migration guide, Zanzibar tips, Stone Town guide, African safari packing list, Ngorongoro Crater tips"
        url="/blog"
      />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-36 pb-28 bg-safari-night overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80"
            alt="Safari Landscape at Sunset"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-safari-night/70 via-safari-night/85 to-background"></div>
        </div>

        <div className="container-wide mx-auto px-4 md:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-safari-gold/20 text-safari-gold px-6 py-2 rounded-full text-xs md:text-sm font-bold mb-8 border border-safari-gold/30 uppercase tracking-widest shadow-lg"
            >
              <Sparkles className="w-4 h-4" /> Infinity Voyage Journal
            </motion.div>
            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight tracking-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Travel Stories & <span className="text-safari-gold italic">Safari Insights</span>
            </h1>
            <p className="text-white/85 text-lg md:text-2xl leading-relaxed max-w-3xl mx-auto font-light">
              Expert advice, wildlife timing guides, and curated island secrets straight from our local Tanzanian guides and safari naturalists.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & Category Filter Bar */}
      <section className="py-8 bg-background/95 border-b border-border/60 sticky top-20 z-30 backdrop-blur-md shadow-sm">
        <div className="container-wide mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Live Search Input */}
            <div className="relative w-full lg:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-safari-gold transition-colors" />
              <Input
                placeholder="Search stories, parks, wildlife..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-10 py-6 rounded-full border-border/60 focus:border-safari-gold/60 focus:ring-safari-gold/20 bg-muted/40 shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 w-full lg:w-auto">
              {categories.map((category) => {
                const isActive = activeCategory.toLowerCase() === category.toLowerCase();
                return (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-bold transition-all duration-300 ${
                      isActive
                        ? "bg-safari-gold text-safari-night shadow-md shadow-safari-gold/20 scale-105"
                        : "bg-muted/60 text-muted-foreground hover:bg-safari-gold/15 hover:text-safari-gold"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Blog Post Grid */}
      <section className="py-20">
        <div className="container-wide mx-auto px-4 md:px-8">
          {/* Header count indicator */}
          <div className="flex items-center justify-between mb-10 pb-4 border-b border-border/50">
            <div className="text-sm font-semibold text-muted-foreground">
              Showing <span className="text-foreground font-bold">{filteredPosts.length}</span>{" "}
              {filteredPosts.length === 1 ? "article" : "articles"}
              {activeCategory !== "All" && (
                <span> in <span className="text-safari-gold font-bold">{activeCategory}</span></span>
              )}
              {searchQuery && (
                <span> matching &ldquo;<span className="text-safari-gold">{searchQuery}</span>&rdquo;</span>
              )}
            </div>
            {(activeCategory !== "All" || searchQuery) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setActiveCategory("All");
                  setSearchQuery("");
                }}
                className="text-xs text-muted-foreground hover:text-safari-gold"
              >
                Reset filters
              </Button>
            )}
          </div>

          {filteredPosts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-24 px-6 bg-muted/20 rounded-[2.5rem] border-2 border-dashed border-border max-w-2xl mx-auto"
            >
              <div className="w-16 h-16 rounded-full bg-safari-gold/10 text-safari-gold flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3
                className="text-2xl md:text-3xl font-bold text-foreground mb-2"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                No travel stories found
              </h3>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6">
                We couldn&apos;t find any articles matching your search criteria. Try a different keyword or browse all categories.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All");
                }}
                className="bg-safari-gold hover:bg-safari-amber text-safari-night font-bold rounded-full px-8 py-6 shadow-lg"
              >
                View All Articles
              </Button>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="group h-full flex flex-col"
                >
                  <Card className="h-full flex flex-col bg-card rounded-[2rem] overflow-hidden border border-border/50 hover:border-safari-gold/50 hover:shadow-2xl transition-all duration-500 group">
                    {/* Cover Image */}
                    <div
                      className="relative h-64 overflow-hidden cursor-pointer"
                      onClick={() => handleOpenArticle(post)}
                    >
                      <img
                        src={post.image}
                        alt={post.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-safari-night/75 via-transparent to-transparent opacity-70" />
                      <div className="absolute top-5 left-5">
                        <Badge className="bg-safari-gold text-safari-night font-bold px-3.5 py-1 rounded-full shadow-md text-xs">
                          {post.category}
                        </Badge>
                      </div>
                    </div>

                    {/* Card Content */}
                    <CardContent className="p-7 md:p-8 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Meta: Date & Read Time */}
                        <div className="flex items-center gap-5 text-xs text-muted-foreground mb-4">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-safari-gold" />
                            {post.date}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-safari-gold" />
                            {post.readTime}
                          </span>
                        </div>

                        {/* Title */}
                        <h2
                          onClick={() => handleOpenArticle(post)}
                          className="text-2xl font-bold mb-4 group-hover:text-safari-gold transition-colors line-clamp-2 leading-tight cursor-pointer"
                          style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        >
                          {post.title}
                        </h2>

                        {/* Excerpt */}
                        <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>

                      {/* Footer: Author & Read More Button */}
                      <div className="flex items-center justify-between pt-5 border-t border-border/50 mt-auto">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-safari-gold/15 flex items-center justify-center font-bold text-safari-gold text-sm">
                            {post.author.charAt(0)}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-foreground block">{post.author}</span>
                            <span className="text-[10px] text-muted-foreground">{post.authorRole || "Safari Naturalist"}</span>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          className="text-safari-gold hover:text-safari-amber hover:bg-safari-gold/10 p-2 md:px-3 rounded-full font-bold group/btn text-sm"
                          onClick={() => handleOpenArticle(post)}
                          aria-label={`Read full article: ${post.title}`}
                        >
                          Read More
                          <ArrowRight className="w-4 h-4 ml-1.5 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Interactive Full Article Reading Modal */}
      <Dialog open={!!selectedPost} onOpenChange={(open) => !open && handleCloseArticle()}>
        <DialogContent className="max-w-4xl w-[95vw] max-h-[92vh] p-0 overflow-hidden flex flex-col rounded-[2rem] border border-safari-gold/30 bg-background shadow-2xl focus:outline-none">
          {selectedPost && (
            <div className="overflow-y-auto max-h-[92vh] flex flex-col">
              {/* Cover Banner */}
              <div className="relative h-64 md:h-96 w-full shrink-0 overflow-hidden bg-safari-night">
                <img
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/30" />

                {/* Top Badges */}
                <div className="absolute top-5 left-5 md:top-6 md:left-6 flex flex-wrap gap-2 items-center z-10">
                  <Badge className="bg-safari-gold text-safari-night font-bold px-4 py-1.5 rounded-full shadow-lg text-xs md:text-sm">
                    {selectedPost.category}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-black/60 text-white backdrop-blur-md border border-white/20 text-xs px-3 py-1"
                  >
                    <Clock className="w-3.5 h-3.5 mr-1 text-safari-gold inline" />
                    {selectedPost.readTime}
                  </Badge>
                </div>
              </div>

              {/* Main Article Body Container */}
              <div className="px-6 py-6 md:px-12 md:py-10 space-y-8 flex-1">
                <DialogHeader className="text-left space-y-4">
                  <DialogTitle
                    className="text-3xl md:text-5xl font-bold font-serif leading-tight text-foreground"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {selectedPost.title}
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground text-base md:text-xl leading-relaxed italic border-l-4 border-safari-gold pl-4 py-1">
                    {selectedPost.excerpt}
                  </DialogDescription>
                </DialogHeader>

                {/* Author Info & Actions Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-border/60">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-safari-gold/20 text-safari-gold border border-safari-gold/40 flex items-center justify-center font-bold text-lg">
                      {selectedPost.author.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-foreground text-base">{selectedPost.author}</div>
                      <div className="text-xs text-muted-foreground">{selectedPost.authorRole || "Safari Specialist"}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-safari-gold" />
                      {selectedPost.date}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare(selectedPost)}
                      className="rounded-full gap-2 text-xs border-border/70 hover:border-safari-gold/50"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      Share
                    </Button>
                  </div>
                </div>

                {/* Article Content Renderer */}
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <ArticleContentRenderer content={selectedPost.content} />
                </div>

                {/* Tags List */}
                {selectedPost.tags && selectedPost.tags.length > 0 && (
                  <div className="pt-6 border-t border-border/60">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-muted-foreground mb-3">
                      <Tag className="w-3.5 h-3.5 text-safari-gold" />
                      Related Topics:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedPost.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          onClick={() => {
                            setActiveCategory("All");
                            setSearchQuery(tag);
                            handleCloseArticle();
                          }}
                          className="cursor-pointer px-3.5 py-1 text-xs rounded-full hover:bg-safari-gold hover:text-safari-night transition-colors border-border/80"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Book Related Safari CTA Card */}
                <div className="mt-8 rounded-3xl p-7 md:p-9 bg-gradient-to-br from-safari-night via-slate-900 to-safari-night text-white border border-safari-gold/30 shadow-2xl relative overflow-hidden">
                  <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-safari-gold/15 rounded-full blur-3xl pointer-events-none" />
                  <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-2.5 max-w-xl">
                      <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-safari-gold font-bold">
                        <Compass className="w-4 h-4" /> Ready for the Adventure?
                      </div>
                      <h3
                        className="text-2xl md:text-4xl font-bold text-white leading-tight"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      >
                        {selectedPost.relatedTourTitle || "Experience Tanzania in Person"}
                      </h3>
                      <p className="text-white/80 text-sm md:text-base leading-relaxed font-light">
                        Our local Tanzanian guides handcraft bespoke itineraries tailored to your travel window, comfort preferences, and wildlife bucket list.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                      <Button
                        onClick={() => handleBookSafari(selectedPost)}
                        className="bg-safari-gold hover:bg-safari-amber text-safari-night font-bold px-7 py-6 rounded-full shadow-lg flex items-center justify-center gap-2 text-sm hover:scale-105 transition-all"
                      >
                        Book Related Safari
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          handleCloseArticle();
                          navigate("/plan-my-trip");
                        }}
                        className="border-white/30 text-white hover:bg-white/10 px-6 py-6 rounded-full text-sm font-semibold"
                      >
                        Plan Custom Trip
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Close modal button at bottom */}
                <div className="flex justify-center pt-2">
                  <Button
                    variant="ghost"
                    onClick={handleCloseArticle}
                    className="text-muted-foreground hover:text-foreground text-sm font-semibold"
                  >
                    Close Article
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Newsletter Section */}
      <section className="py-24 bg-safari-night relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        </div>

        <div className="container-wide mx-auto px-4 md:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="w-20 h-20 bg-safari-gold/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-safari-gold/30">
              <Mail className="w-10 h-10 text-safari-gold" />
            </div>
            <h2
              className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Join Our <span className="text-safari-gold italic">Travel Club</span>
            </h2>
            <p className="text-white/75 text-lg md:text-xl mb-10 leading-relaxed font-light">
              Receive handpicked safari guides, seasonal Great Migration alerts, and secret Zanzibar hideaways delivered directly to your inbox.
            </p>

            {hasSubscribed ? (
              <div className="bg-safari-gold/20 border border-safari-gold/40 text-safari-gold px-8 py-5 rounded-full inline-flex items-center gap-3 font-semibold text-base shadow-xl">
                <Check className="w-5 h-5 text-safari-gold" />
                You&apos;re subscribed! Keep an eye on your inbox for our latest stories.
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 py-7 px-6 rounded-full bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-safari-gold/60 focus:ring-safari-gold/30"
                  required
                />
                <Button
                  type="submit"
                  disabled={isSubscribing}
                  className="bg-safari-gold hover:bg-safari-amber text-safari-night font-bold px-10 py-7 rounded-full shadow-xl hover:scale-105 transition-all duration-300 shrink-0"
                >
                  {isSubscribing ? (
                    "Subscribing..."
                  ) : (
                    <span className="flex items-center gap-2">
                      Subscribe <Send className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
