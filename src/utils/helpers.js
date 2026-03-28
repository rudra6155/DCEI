/**
 * DCEI Helper Utilities
 */

export function getRiskColor(score) {
  if (score <= 30) return '#10b981'
  if (score <= 50) return '#f59e0b'
  if (score <= 70) return '#f97316'
  return '#ef4444'
}

export function getRiskCategory(score) {
  if (score <= 30) return 'Low'
  if (score <= 50) return 'Moderate'
  if (score <= 70) return 'High'
  return 'Critical'
}

export function getRiskBgColor(score) {
  if (score <= 30) return 'rgba(16, 185, 129, 0.15)'
  if (score <= 50) return 'rgba(245, 158, 11, 0.15)'
  if (score <= 70) return 'rgba(249, 115, 22, 0.15)'
  return 'rgba(239, 68, 68, 0.15)'
}

export function formatScore(n) {
  if (n === null || n === undefined || isNaN(n)) return '0.0'
  return Number(n).toFixed(1)
}

export function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371
  const toRad = deg => (deg * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

const INFRA_NOTES = {
  'Mumbai': "India's primary DC hub; 11 submarine cable landings, Tier-1 connectivity; SEEPZ & BKC enterprise zones; highest DC density nationally",
  'Navi Mumbai': "Emerging DC corridor; planned 2,000+ MW capacity; lower land cost than Mumbai city; CIDCO-planned infrastructure",
  'Chennai': "TATA, NTT, CtrlS flagship facilities; 3 submarine cable landings (SMW4, i2i, TIISSC); Tamil Nadu DC Policy 2021",
  'Bengaluru': "Silicon Valley of India; deep tech talent pool; proximity to Chennai cables; KIADB IT parks; SaaS & cloud-native ecosystem",
  'Hyderabad': "Telangana's HITEC City corridor; data protection legislation champion; 1,500+ MNCs; T-Hub innovation campus",
  'Delhi': "NCT political & administrative hub; NIXI internet exchange; dense fiber backbone; DSIIDC industrial zones",
  'Noida': "Delhi NCR edge; Yamuna Expressway corridor; UP IT Policy incentives; 40+ operational data centers",
  'Pune': "~150 km from Mumbai; growing IT ecosystem; MIDC industrial zones; Maharashtra IT/ITES incentives; Hinjewadi IT Park",
  'Kolkata': "Eastern gateway; CESC reliable power; COLT & Tata network presence; Bengal Silicon Valley Hub initiative",
  'Ahmedabad': "GIFT City SEZ; Gujarat IT/ITeS Policy; proximity to Surat manufacturing; Dholera SIR greenfield",
  'Jaipur': "Rajasthan Invest Summit pipeline; RIICO IT parks; Mahindra SEZ; emerging BPO/KPO corridor",
  'Kochi': "Submarine cable landing (SMW4); Kerala Startup Mission; CIAL Infopark; high literacy & English proficiency",
  'Visakhapatnam': "Andhra Pradesh IT Policy; deep-water port proximity; VUDA industrial clusters; Andhra University talent pool",
  'Coimbatore': "Tier-2 tech hub; TIDEL Park; strong manufacturing base; SITRA research institute; cost-competitive real estate",
  'Indore': "MP IT Investment Policy 2023; Smart City Mission; Pithampur SEZ; emerging BPM sector; IIM-Indore proximity",
  'Bhubaneswar': "STPI-certified IT park; Odisha IT Policy; Infosys, TCS campus presence; Smart City greenfield advantage",
  'Lucknow': "UP IT Policy 2022 incentives; UPEIDA industrial development; Gomti Nagar IT zone; state capital connectivity",
  'Gurugram': "Cyber City Gurgaon; Udyog Vihar industrial; NCR enterprise hub; Golf Course Road corridor; Haryana IT Policy",
  'Chandigarh': "UT + Punjab/Haryana capital; Mohali IT Park; PEC University talent; government connectivity node",
  'Guwahati': "Northeast India gateway; BharatNet expansion; STPI Guwahati; low land cost; strategic connectivity node",
  'Patna': "Bihar Industrial Area Development Authority zones; NIT Patna talent; growing BPO sector",
  'Bhopal': "MP Smart City; MPIDC IT parks; MANIT proximity; state capital power reliability",
  'Thiruvananthapuram': "Technopark Phase III; Kerala IT policy; underwater cable proximity (Kochi SMW4 ~200 km); human development advantage",
  'Nagpur': "Zero Mile City; MIHAN SEZ & airport proximity; VNIT talent; central India logistics hub",
  'Nashik': "Wine Valley tech pivot; MIDC zones; proximity to Mumbai corridor; growing IT/ITeS",
  'Mangalore': "Karnataka coastal zone; MRPL industrial complex; low heat island; NITK Surathkal talent pipeline",
  'Mysore': "Karnataka Tier-2 incentives; Infosys heritage campus; tourism + tech blend; lower land & power costs",
  'Raipur': "Chhattisgarh IT Policy 2019; NIT Raipur talent; steel industry power infrastructure; low congestion",
  'Ranchi': "Jharkhand IT Policy; NIT Jamshedpur proximity; low land cost; Birsa Munda airport connectivity",
  'Vadodara': "GIDC Waghodia; M.S. University talent; proximity to GIFT City; Gujarat IT Policy incentives",
  'Surat': "Diamond & textile export hub diversifying to tech; SVNIT talent; Gujarat Maritime Board connectivity",
  'Ludhiana': "Punjab industrial powerhouse; hosiery/textile-to-tech transition; Ferozepur Road IT corridor",
  'Agra': "Tourism economy; UP IT Policy; proximity to Delhi NCR; Yamuna Expressway connectivity",
  'Varanasi': "BHU massive talent pool; Smart City Mission; STPI Varanasi; Purvanchal growth corridor",
  'Jamnagar': "Reliance refinery corridor; Gujarat Maritime advantage; emerging industrial diversification",
  'Gandhinagar': "GIFT City IFSC; Gujarat capital administrative advantage; Infocity IT Park; fiber ring node",
  'Vijayawada': "AP capital corridor; Amaravati proximity; Polavaram project power pipeline; NIT Warangal talent",
  'Madurai': "Tamil Nadu Tier-2 IT push; IIM Kozhikode alumni; Theppakulam IT Park; cultural & educational hub",
  'Tiruchirappalli': "NIT Trichy excellence; BHEL township infrastructure; TIDEL Park presence; aviation connectivity",
  'Hubli-Dharwad': "Karnataka twin cities; BVB College of Engineering; rail junction connectivity; lower cost base",
  'Aurangabad': "Maharashtra AURIC City; Chhatrapati Sambhajinagar rebranding; automotive-to-tech transition; DMIC corridor",
  'Thane': "Mumbai Metropolitan Region; Wagle Estate industrial; MIDC Thane; lower cost vs. Mumbai city",
  'Faridabad': "Haryana NCR industrial; YMCA University; proximity to Delhi; HSIIDC zones",
  'Ghaziabad': "UP NCR growth corridor; Sahibabad industrial; NH-9 connectivity; proximity to Delhi markets",
  'Dehradun': "Emerging hill-station tech hub; Doon Valley climate advantage; low heat island; IIT Roorkee proximity; SIDCUL Haridwar",
  'Jodhpur': "Blue City solar advantage; IIT Jodhpur research; Rajasthan Renewable Energy push; RIICO IT Park",
  'Kanpur': "IIT Kanpur innovation; UP IT policy; leather & textile-to-tech; UPSIDA industrial estates",
  'Greater Noida': "Yamuna Expressway IT corridor; knowledge park clusters; Expo Mart & data center zone; UP government IT incentives",
  'Naya Raipur': "Smart city greenfield; GIFT-City style planning; very low existing DC density; Chhattisgarh government incentives; tabula-rasa infrastructure",
  'Amaravati': "New capital city infrastructure; AP government IT policy incentives; greenfield advantage; SkyCity masterplan",
}

export function getInfraNote(cityName) {
  if (INFRA_NOTES[cityName]) return INFRA_NOTES[cityName]
  // Generic fallback based on name matching
  const lower = cityName.toLowerCase()
  if (lower.includes('metro') || lower.includes('navi') || lower.includes('greater')) {
    return `${cityName} is part of a major metropolitan region with improving IT infrastructure and growing data center potential.`
  }
  return `${cityName} offers emerging data center opportunities with state government IT policies and improving connectivity infrastructure.`
}
