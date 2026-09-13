export type Difficulty = 'Easy' | 'Medium' | 'Difficult';

export type Question = {
  id: string;
  q: string;
  a: string;
  o: string[];
  difficulty: Difficulty;
};

export type Category = {
  name: string;
  icon: string;
  questions: Question[];
};

const q = (id: string, q: string, a: string, o: string[], difficulty: Difficulty): Question => ({ id, q, a, o, difficulty });

export const categories: Category[] = [
  {
    name: 'General Knowledge', icon: '🧠', questions: [
      q('gk01','What is the capital of France?','Paris',['Paris','Madrid','Rome','Berlin'],'Easy'),
      q('gk02','Which is the largest ocean on Earth?','Pacific Ocean',['Pacific Ocean','Atlantic Ocean','Indian Ocean','Arctic Ocean'],'Easy'),
      q('gk03','Which planet is known as the Red Planet?','Mars',['Mars','Venus','Jupiter','Mercury'],'Easy'),
      q('gk04','How many continents are commonly recognized?','7',['5','6','7','8'],'Easy'),
      q('gk05','What is the currency of Japan?','Yen',['Yen','Won','Baht','Yuan'],'Easy'),
      q('gk06','Who wrote Hamlet?','William Shakespeare',['William Shakespeare','Charles Dickens','Mark Twain','Jane Austen'],'Easy'),
      q('gk07','What is the largest mammal?','Blue whale',['Blue whale','African elephant','Giraffe','Hippopotamus'],'Easy'),
      q('gk08','Which country is famous for being shaped like a boot?','Italy',['Italy','Greece','Portugal','Chile'],'Easy'),
      q('gk09','Which metal has the chemical symbol Au?','Gold',['Gold','Silver','Iron','Copper'],'Medium'),
      q('gk10','Who was the first human to walk on the Moon?','Neil Armstrong',['Neil Armstrong','Buzz Aldrin','Yuri Gagarin','Michael Collins'],'Medium'),
      q('gk11','Which is the largest hot desert in the world?','Sahara Desert',['Sahara Desert','Gobi Desert','Kalahari Desert','Arabian Desert'],'Medium'),
      q('gk12','Which language has the most native speakers worldwide?','Mandarin Chinese',['Mandarin Chinese','English','Spanish','Hindi'],'Medium'),
      q('gk13','Which country gifted the Statue of Liberty to the United States?','France',['France','Canada','Spain','Italy'],'Medium'),
      q('gk14','What is the smallest prime number?','2',['0','1','2','3'],'Easy'),
      q('gk15','Which city is the capital of Australia?','Canberra',['Sydney','Melbourne','Canberra','Perth'],'Medium'),
      q('gk16','Which ancient civilization built Machu Picchu?','Inca',['Inca','Roman','Maya','Aztec'],'Medium'),
      q('gk17','Which sea separates Europe and Africa?','Mediterranean Sea',['Mediterranean Sea','Red Sea','Black Sea','Caribbean Sea'],'Medium'),
      q('gk18','What is the longest river in South America?','Amazon River',['Amazon River','Nile','Yangtze','Mississippi River'],'Medium'),
      q('gk19','Which element has atomic number 6?','Carbon',['Carbon','Oxygen','Nitrogen','Silicon'],'Difficult'),
      q('gk20','What is the only mammal capable of true sustained flight?','Bat',['Bat','Flying squirrel','Penguin','Ostrich'],'Difficult'),
      q('gk21','Which treaty formally ended World War I between Germany and the Allied powers?','Treaty of Versailles',['Treaty of Versailles','Treaty of Paris','Treaty of Rome','Treaty of Vienna'],'Difficult'),
      q('gk22','Which country has the most natural lakes?','Canada',['Canada','Russia','Brazil','United States'],'Difficult'),
      q('gk23','What is the name of the deepest known ocean trench?','Mariana Trench',['Mariana Trench','Tonga Trench','Java Trench','Puerto Rico Trench'],'Difficult'),
      q('gk24','Which philosopher taught Alexander the Great?','Aristotle',['Aristotle','Plato','Socrates','Pythagoras'],'Difficult'),
      q('gk25','What is the SI unit of luminous intensity?','Candela',['Candela','Lumen','Lux','Watt'],'Difficult'),
      q('gk26','Which empire was ruled by Mansa Musa?','Mali Empire',['Mali Empire','Songhai Empire','Roman Empire','Ottoman Empire'],'Difficult'),
      q('gk27','Which strait separates Asia from North America?','Bering Strait',['Bering Strait','Strait of Gibraltar','Bosporus','Dover Strait'],'Difficult'),
      q('gk28','Which novel begins with the line about a man being transformed into an insect?','The Metamorphosis',['The Metamorphosis','1984','The Trial','Brave New World'],'Difficult'),
      q('gk29','Which civilization developed the cuneiform writing system?','Sumerians',['Sumerians','Phoenicians','Greeks','Vikings'],'Difficult'),
      q('gk30','Which planet has the shortest day in the Solar System?','Jupiter',['Jupiter','Mercury','Mars','Saturn'],'Difficult'),
    ],
  },
  {
    name: 'Bible', icon: '📖', questions: [
      q('bi01','What is the first book of the Bible?','Genesis',['Genesis','Exodus','Matthew','Psalms'],'Easy'),
      q('bi02','Who built the ark?','Noah',['Noah','Moses','Abraham','David'],'Easy'),
      q('bi03','Who was the mother of Jesus?','Mary',['Mary','Martha','Elizabeth','Ruth'],'Easy'),
      q('bi04','Where was Jesus born?','Bethlehem',['Bethlehem','Nazareth','Jerusalem','Capernaum'],'Easy'),
      q('bi05','Who defeated Goliath?','David',['David','Saul','Samuel','Jonathan'],'Easy'),
      q('bi06','Who betrayed Jesus?','Judas Iscariot',['Judas Iscariot','Peter','Thomas','Matthew'],'Easy'),
      q('bi07','How many apostles did Jesus choose?','12',['10','11','12','13'],'Easy'),
      q('bi08','What is the last book of the Bible?','Revelation',['Revelation','Acts','Jude','Malachi'],'Easy'),
      q('bi09','Which disciple denied Jesus three times?','Peter',['Peter','John','James','Andrew'],'Medium'),
      q('bi10','What was the name of Moses’ brother?','Aaron',['Aaron','Joshua','Caleb','Eleazar'],'Medium'),
      q('bi11','How many days did Jesus fast in the wilderness?','40',['7','12','30','40'],'Medium'),
      q('bi12','Which prophet was swallowed by a great fish?','Jonah',['Jonah','Elijah','Isaiah','Jeremiah'],'Easy'),
      q('bi13','Where did Moses receive the Ten Commandments?','Mount Sinai',['Mount Sinai','Mount Carmel','Mount Zion','Mount Tabor'],'Medium'),
      q('bi14','Which Gospel is traditionally associated with a physician?','Luke',['Luke','Matthew','Mark','John'],'Medium'),
      q('bi15','What was Jesus’ first miracle recorded in John?','Turning water into wine',['Turning water into wine','Healing a blind man','Walking on water','Feeding the five thousand'],'Medium'),
      q('bi16','Which sea did Jesus calm during a storm?','Sea of Galilee',['Sea of Galilee','Dead Sea','Red Sea','Mediterranean Sea'],'Medium'),
      q('bi17','Who was known as the father of many nations?','Abraham',['Abraham','Isaac','Jacob','Moses'],'Medium'),
      q('bi18','Which book contains the famous “love” passage in chapter 13?','1 Corinthians',['1 Corinthians','Romans','Hebrews','James'],'Medium'),
      q('bi19','Who interpreted Pharaoh’s dreams in Egypt?','Joseph',['Joseph','Daniel','Moses','Aaron'],'Difficult'),
      q('bi20','Which judge was known for extraordinary strength?','Samson',['Samson','Gideon','Jephthah','Ehud'],'Medium'),
      q('bi21','Who was the first king of Israel?','Saul',['Saul','David','Solomon','Samuel'],'Difficult'),
      q('bi22','Which prophet confronted the prophets of Baal on Mount Carmel?','Elijah',['Elijah','Elisha','Isaiah','Jeremiah'],'Difficult'),
      q('bi23','Which New Testament book records the early Church after Jesus’ ascension?','Acts',['Acts','Romans','Hebrews','Revelation'],'Medium'),
      q('bi24','Which Gospel begins with a genealogy tracing Jesus’ ancestry to Abraham?','Matthew',['Matthew','Mark','Luke','John'],'Difficult'),
      q('bi25','Who was the Roman governor who sentenced Jesus to crucifixion?','Pontius Pilate',['Pontius Pilate','Herod Antipas','Felix','Festus'],'Medium'),
      q('bi26','Which apostle was also called Didymus?','Thomas',['Thomas','Philip','Bartholomew','James'],'Difficult'),
      q('bi27','Which Old Testament book tells the story of Esther?','Esther',['Esther','Ruth','Judith','Nehemiah'],'Easy'),
      q('bi28','Which king asked God for wisdom rather than riches?','Solomon',['Solomon','David','Hezekiah','Josiah'],'Medium'),
      q('bi29','Which prophet was taken up to heaven in a whirlwind?','Elijah',['Elijah','Elisha','Enoch','Isaiah'],'Difficult'),
      q('bi30','Which apostle was a tax collector before following Jesus?','Matthew',['Matthew','Peter','Andrew','James'],'Medium'),
    ],
  },
  {
    name: 'Africa & Nigeria', icon: '🌍', questions: [
      q('an01','What is the capital of Nigeria?','Abuja',['Abuja','Lagos','Kano','Ibadan'],'Easy'),
      q('an02','What is Nigeria’s currency?','Naira',['Naira','Cedi','Shilling','Dalasi'],'Easy'),
      q('an03','What are the colors of Nigeria’s national flag?','Green and white',['Green and white','Green and yellow','Red and white','Blue and green'],'Easy'),
      q('an04','In what year did Nigeria gain independence?','1960',['1957','1960','1963','1970'],'Easy'),
      q('an05','Which city is Nigeria’s largest by population?','Lagos',['Lagos','Abuja','Kano','Port Harcourt'],'Easy'),
      q('an06','What is the capital of Ghana?','Accra',['Accra','Kumasi','Lagos','Lomé'],'Easy'),
      q('an07','What is the capital of Kenya?','Nairobi',['Nairobi','Mombasa','Kisumu','Kampala'],'Easy'),
      q('an08','Which desert covers much of North Africa?','Sahara Desert',['Sahara Desert','Kalahari Desert','Namib Desert','Danakil Desert'],'Easy'),
      q('an09','Which river gives Nigeria its name?','Niger River',['Niger River','Benue River','Nile','Congo River'],'Medium'),
      q('an10','Which country is home to Mount Kilimanjaro?','Tanzania',['Tanzania','Kenya','Uganda','Ethiopia'],'Medium'),
      q('an11','What is the largest African country by land area?','Algeria',['Algeria','Sudan','Libya','Democratic Republic of the Congo'],'Medium'),
      q('an12','Which lake is the largest in Africa by surface area?','Lake Victoria',['Lake Victoria','Lake Tanganyika','Lake Malawi','Lake Chad'],'Medium'),
      q('an13','Nigeria’s federal capital territory is called what?','Abuja',['Abuja','Lagos','Kaduna','Benin City'],'Easy'),
      q('an14','What is the nickname of Nigeria’s senior men’s national football team?','Super Eagles',['Super Eagles','Flying Eagles','Golden Eaglets','Green Lions'],'Easy'),
      q('an15','What is Nigeria’s internet country-code top-level domain?','.ng',['.ng','.ni','.nig','.na'],'Medium'),
      q('an16','Which river is the major tributary of the Niger River that joins it at Lokoja?','Benue River',['Benue River','Cross River','Osun River','Kaduna River'],'Medium'),
      q('an17','Which city is the capital of Ethiopia?','Addis Ababa',['Addis Ababa','Asmara','Khartoum','Djibouti City'],'Easy'),
      q('an18','Victoria Falls lies on the border of Zambia and which country?','Zimbabwe',['Zimbabwe','Botswana','Namibia','Mozambique'],'Medium'),
      q('an19','Which country has the largest population in Africa?','Nigeria',['Nigeria','Egypt','Ethiopia','South Africa'],'Medium'),
      q('an20','Which African country was formerly known as Abyssinia?','Ethiopia',['Ethiopia','Eritrea','Somalia','Sudan'],'Difficult'),
      q('an21','Which ancient West African empire was ruled by Mansa Musa?','Mali Empire',['Mali Empire','Songhai Empire','Ghana Empire','Kanem-Bornu Empire'],'Difficult'),
      q('an22','Which lake is shared by Tanzania, the Democratic Republic of the Congo and Burundi?','Lake Tanganyika',['Lake Tanganyika','Lake Victoria','Lake Malawi','Lake Chad'],'Difficult'),
      q('an23','Which Nigerian city is widely known as the commercial capital of Nigeria?','Lagos',['Lagos','Abuja','Enugu','Jos'],'Medium'),
      q('an24','Which Nigerian river is formed by the meeting of the Niger and Benue rivers?','Niger River',['Niger River','Cross River','Imo River','Osun River'],'Difficult'),
      q('an25','Which country is completely surrounded by South Africa?','Lesotho',['Lesotho','Eswatini','Botswana','Namibia'],'Difficult'),
      q('an26','Which African country has Addis Ababa as its capital?','Ethiopia',['Ethiopia','Eritrea','Kenya','Somalia'],'Easy'),
      q('an27','What is the capital of Senegal?','Dakar',['Dakar','Bamako','Conakry','Banjul'],'Medium'),
      q('an28','Which country is home to the ancient rock-hewn churches of Lalibela?','Ethiopia',['Ethiopia','Ghana','Sudan','Morocco'],'Difficult'),
      q('an29','Which Nigerian city is associated with the historic Nok culture region?','Kaduna',['Kaduna','Lagos','Calabar','Warri'],'Difficult'),
      q('an30','Which ocean borders Nigeria to the south?','Atlantic Ocean',['Atlantic Ocean','Indian Ocean','Pacific Ocean','Arctic Ocean'],'Easy'),
    ],
  },
  {
    name: 'Science', icon: '🔬', questions: [
      q('sc01','Which planet is closest to the Sun?','Mercury',['Mercury','Venus','Earth','Mars'],'Easy'),
      q('sc02','What force pulls objects toward Earth?','Gravity',['Gravity','Magnetism','Friction','Pressure'],'Easy'),
      q('sc03','What is the chemical symbol for oxygen?','O',['O','Ox','O2','Og'],'Easy'),
      q('sc04','At sea level, what is water’s boiling point in Celsius?','100°C',['90°C','100°C','110°C','120°C'],'Easy'),
      q('sc05','What is the center of an atom called?','Nucleus',['Nucleus','Electron cloud','Shell','Molecule'],'Easy'),
      q('sc06','What process do plants use to make food using light?','Photosynthesis',['Photosynthesis','Respiration','Fermentation','Digestion'],'Easy'),
      q('sc07','Which organ pumps blood around the human body?','Heart',['Heart','Liver','Lung','Kidney'],'Easy'),
      q('sc08','What gas do humans need for normal aerobic respiration?','Oxygen',['Oxygen','Carbon dioxide','Nitrogen','Hydrogen'],'Easy'),
      q('sc09','What is the largest organ of the human body?','Skin',['Skin','Liver','Lung','Brain'],'Medium'),
      q('sc10','What is the full name of DNA?','Deoxyribonucleic acid',['Deoxyribonucleic acid','Dinitrogen acid','Deoxyribose nitrogen acid','Double nucleic acid'],'Medium'),
      q('sc11','What is the SI unit of electric current?','Ampere',['Ampere','Volt','Ohm','Watt'],'Medium'),
      q('sc12','How many bones are in a typical adult human skeleton?','206',['196','206','216','226'],'Medium'),
      q('sc13','What pigment makes blood appear red?','Hemoglobin',['Hemoglobin','Melanin','Keratin','Chlorophyll'],'Medium'),
      q('sc14','What is Earth’s natural satellite?','Moon',['Moon','Mars','Titan','Europa'],'Easy'),
      q('sc15','What is the approximate pH of neutral water at room temperature?','7',['5','6','7','8'],'Easy'),
      q('sc16','Which branch of science studies living organisms?','Biology',['Biology','Geology','Astronomy','Physics'],'Easy'),
      q('sc17','Which branch of science studies matter and its chemical changes?','Chemistry',['Chemistry','Biology','Ecology','Astronomy'],'Easy'),
      q('sc18','Which branch of physics studies motion and forces?','Mechanics',['Mechanics','Optics','Thermodynamics','Acoustics'],'Medium'),
      q('sc19','What is the approximate speed of light in vacuum?','300,000 km/s',['30,000 km/s','300,000 km/s','3,000,000 km/s','3,000 km/s'],'Medium'),
      q('sc20','Which vitamin can the human body produce in skin after sunlight exposure?','Vitamin D',['Vitamin A','Vitamin B12','Vitamin C','Vitamin D'],'Medium'),
      q('sc21','Which element is a liquid metal at typical room temperature?','Mercury',['Mercury','Aluminium','Iron','Sodium'],'Medium'),
      q('sc22','What is the smallest unit of an element that retains its chemical identity?','Atom',['Atom','Cell','Molecule','Proton'],'Medium'),
      q('sc23','Which subatomic particle has a negative electric charge?','Electron',['Electron','Proton','Neutron','Nucleus'],'Medium'),
      q('sc24','What is the powerhouse of the cell commonly called?','Mitochondrion',['Mitochondrion','Ribosome','Nucleus','Golgi apparatus'],'Difficult'),
      q('sc25','Which gas is most abundant in Earth’s atmosphere?','Nitrogen',['Nitrogen','Oxygen','Carbon dioxide','Argon'],'Medium'),
      q('sc26','What is the name of the process by which liquid changes into gas?','Vaporization',['Condensation','Vaporization','Freezing','Sublimation'],'Medium'),
      q('sc27','Which blood type is often called the universal red-cell donor?','O negative',['O negative','AB positive','A positive','B negative'],'Difficult'),
      q('sc28','Which planet has the strongest surface gravity among the eight planets?','Jupiter',['Jupiter','Earth','Neptune','Saturn'],'Difficult'),
      q('sc29','Which particle in an atomic nucleus determines the element’s atomic number?','Proton',['Proton','Neutron','Electron','Photon'],'Difficult'),
      q('sc30','Which law states that pressure and volume of a gas are inversely proportional at constant temperature?','Boyle’s law',['Boyle’s law','Ohm’s law','Hooke’s law','Faraday’s law'],'Difficult'),
    ],
  },
];

export const DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Difficult'];

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const HISTORY_KEY = 'dq-question-history-v11';
const HISTORY_LIMIT = 40;

function getHistory(): Record<string, string[]> {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '{}'); } catch { return {}; }
}

function saveHistory(history: Record<string, string[]>) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function selectQuestions(categoryIndex: number, difficulty: Difficulty | 'Mixed', count = 10): Question[] {
  const category = categories[categoryIndex];
  if (!category) return [];
  const history = getHistory();
  const recent = new Set(history[category.name] || []);
  const pool = difficulty === 'Mixed' ? category.questions : category.questions.filter((item) => item.difficulty === difficulty);
  const fresh = pool.filter((item) => !recent.has(item.id));
  const candidates = fresh.length >= count ? fresh : pool;
  const selected = shuffle(candidates).slice(0, count);
  const old = history[category.name] || [];
  history[category.name] = [...selected.map((item) => item.id), ...old.filter((id) => !selected.some((item) => item.id === id))].slice(0, HISTORY_LIMIT);
  saveHistory(history);
  return selected;
}
