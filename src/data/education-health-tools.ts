import { educationHealthConfig2026 } from "./education-health-config";
import type { CalculatorPageContent, FieldDefinition, ToolDefinition } from "./tools";

const updated = "2026-11-09";
const numberField = (name: string, label: string, placeholder: string, unit?: string): FieldDefinition =>
  ({ name, label, type: "number", placeholder, unit });
const dateField = (name: string, label: string): FieldDefinition => ({ name, label, type: "date" });
const selectField = (name: string, label: string, options: { label: string; value: string }[]): FieldDefinition =>
  ({ name, label, type: "select", options });
const source = (name: string, url: string, note: string) => ({ name, url, note });
const examples = (name: string): CalculatorPageContent["examples"] => [
  { title: `${name} için örnek giriş`, calculation: "Her test için doğru sayısından yanlışların sınav kılavuzundaki götürme oranına göre karşılık gelen yanlış payı çıkarılır.", result: "Resmî yıl parametreleri doğrulanmadıkça araç puan tahmini yayımlamaz." },
  { title: "Puan türünü ayırma", calculation: "Aynı netler, seçilen puan türünün farklı test katkılarıyla değerlendirilir.", result: "Kılavuzda açıklanan yıl ve puan türü seçilmeden tek bir puan değeri varsayılamaz." }
];
const examFaqs = (name: string): CalculatorPageContent["faqs"] => [
  { question: `${name} puanı nasıl hesaplanır?`, answer: "Test netleri, ilgili yılın kılavuzundaki değerlendirme yöntemi ve puan türü katsayılarına göre dönüştürülür. YKS, LGS ve ÖSYM sınavlarında yalnızca netlerin doğrusal toplamı resmî puan değildir." },
  { question: "Yanlış cevaplar doğru cevapları götürür mü?", answer: "Götürme kuralı ve uygulanışı sınavın ilgili yıl kılavuzunda açıklanır. Araçta yer alacak netler bu kuralı kılavuza uygun hesaplamalıdır." },
  { question: "Neden 2026 puan sonucu henüz gösterilmiyor?", answer: "2026 sınavına ait puan türü ağırlıkları, standartlaştırma yöntemi ve gerekli diğer parametreler birincil resmî kılavuzdan doğrulanmadan sonuç üretilmez." },
  { question: "Önceki yılın katsayıları kullanılabilir mi?", answer: "Hayır. Önceki yılın katsayıları veya norm değerleri yeni yıl için otomatik olarak geçerli kabul edilmez." },
  { question: "Netler resmî puana eşit midir?", answer: "Hayır. Net sayısı, puan hesabının girdisidir. Standart puanlama ve puan türü ağırlıkları da sonucu etkileyebilir." },
  { question: "OBP veya okul puanı dahil mi?", answer: "Sınav türüne göre ortaöğretim başarı puanı veya benzeri ek bileşenler farklı şekilde uygulanabilir. Resmî kılavuz doğrulanmadığı için bu sürümde puana eklenmez." },
  { question: "Bu sonuç tercih yaparken kullanılabilir mi?", answer: "Hayır. Resmî sonuç belgesi ve ilgili yıl tercih kılavuzu esas alınmalıdır; bu araç sınav kurumu yerine geçmez." }
];

const examTools: ToolDefinition[] = [
  {
    id: "yks-puan-hesaplama", name: "YKS (TYT/AYT) puan hesaplama", category: "egitim", popular: true, createdAt: `${updated}T09:35:30+03:00`,
    description: "TYT, AYT ve YDT test netlerini puan türüne göre değerlendirin; katsayılar yıl config’inden yönetilir.",
    title: "YKS Puan Hesaplama 2026 – TYT, AYT ve YDT | PratikHesap",
    metaDescription: "TYT, AYT ve YDT netlerinizi girerek YKS puan türü hesabına hazırlanın. 2026 katsayıları ve resmî puanlama parametreleri doğrulanmadıkça puan gösterilmez.",
    intro: "YKS puanı test netlerine ek olarak puan türüne ve ilgili yılın ÖSYM değerlendirme yöntemine bağlıdır. Resmî parametreler doğrulanana kadar puan hesabı kapalıdır.",
    formula: "Test netleri ilgili puan türünün yıl bazlı ağırlıkları ve ÖSYM standardizasyon yöntemiyle değerlendirilir; ham net toplamı sınav puanı değildir.",
    example: "TYT Türkçe ve matematik netleri ile AYT alan testlerinin katkıları, seçilen SAY/EA/SÖZ/DİL türüne göre değişir.",
    fields: [
      selectField("scoreType", "Puan türü", educationHealthConfig2026.exams.yks.scoreTypes.map((value) => ({ label: value, value }))),
      ...educationHealthConfig2026.exams.yks.sections.map((section) => numberField(section.key, section.label, "Örn. 25", "net"))
    ],
    mode: "exam-score-yks",
    content: {
      definition: "Yükseköğretim Kurumları Sınavı (YKS), TYT ile alan testlerinden oluşan ve adayları farklı puan türlerinde değerlendiren merkezi sınav sistemidir. TYT, AYT ve YDT oturumlarının her biri farklı testleri ve soru sayılarını kapsar. Adayın puan türü SAY, EA, SÖZ veya DİL olabilir; hangi testlerin ne kadar katkı sağlayacağı seçilen puan türüne göre değişir. Doğru ve yanlış cevaplardan elde edilen netler tek başına yerleştirme puanını vermez. ÖSYM, sınavın ilgili yılındaki aday performanslarını ve kılavuzda açıklanan standartlaştırma esaslarını kullanabilir; ortaöğretim başarı puanı da ayrıca değerlendirmeye katılabilir. Bu nedenle geçmiş yılın katsayılarını, ortalamalarını veya standart sapmasını yeni yıla uygulamak güvenilir bir yöntem değildir. PratikHesap’ın bu sayfası test netlerini toplamaya ve puan türü bileşenlerini doğru ayırmaya yönelik bir araçtır. 2026 puanlama parametreleri birincil ÖSYM kaynağından doğrulanmadan sayısal puan üretimi kapalı tutulur; bu, tahminî sonucu resmî gibi göstermemek içindir. Sonuç etkinleştirildiğinde de tercih, yerleşme veya başarı garantisi anlamına gelmez. Adaylar sınav yılı kılavuzunu ve ÖSYM sonuç belgesini esas almalıdır.",
      steps: ["Puan türünü seçin: SAY, EA, SÖZ veya DİL.", "TYT, AYT ve varsa YDT testlerindeki netlerinizi girin; boş bırakılan testleri sıfır olarak değerlendirin.", "ÖSYM’nin ilgili yıl kılavuzundaki ağırlıklar ve puanlama yöntemi doğrulanmadan kesin puan yayımlanmayacağını dikkate alın."],
      examples: examples("YKS"),
      faqs: examFaqs("YKS"),
      lastUpdated: updated,
      sources: [source("ÖSYM – YKS", "https://www.osym.gov.tr/", "2026 YKS kılavuzu, test ağırlıkları, standart puanlama ve OBP katkısı doğrulanmalı.")]
    }
  },
  {
    id: "lgs-puan-hesaplama", name: "LGS puan hesaplama", category: "egitim", createdAt: `${updated}T09:35:30+03:00`,
    description: "LGS test netlerinizi girin; resmî MEB hesaplama parametreleri doğrulanana kadar puan tahmini kapalıdır.",
    title: "LGS Puan Hesaplama 2026 – Test Netleri | PratikHesap",
    metaDescription: "LGS Türkçe, matematik, fen ve diğer test netlerini girin. MEB’in 2026 merkezi sınav puanlama parametreleri doğrulanmadan tahminî puan gösterilmez.",
    intro: "LGS merkezi sınav puanı test ağırlıkları ve standartlaştırma esaslarına bağlıdır. MEB’in ilgili yıl kılavuzu doğrulanana kadar bu araç resmî puan tahmini üretmez.",
    formula: "Test netleri, ilgili yılın MEB kılavuzundaki ağırlıklı standart puan yöntemiyle 100–500 ölçeğine dönüştürülür.",
    example: "Türkçe, matematik ve fen netleri ile diğer test netlerinin katkısı kılavuzdaki ağırlık ve standartlaştırmaya göre belirlenir.",
    fields: educationHealthConfig2026.exams.lgs.sections.map((section) => numberField(section.key, section.label, "Örn. 15", "net")),
    mode: "exam-score-lgs",
    content: {
      definition: "Liselere Geçiş Sistemi kapsamındaki merkezi sınav, belirli ortaöğretim kurumlarına yerleşmek isteyen öğrencilerin katıldığı sınavdır. Sınavda sözel ve sayısal bölümlerde farklı ders testleri bulunur. Öğrencilerin doğru ve yanlış cevaplarından oluşan netler, tek başına 100–500 aralığındaki merkezi sınav puanına eşit değildir. MEB’in sınav yılı kılavuzunda açıklanan test ağırlıkları, standart puan hesaplama yöntemi ve sınav istatistikleri sonuçta rol oynayabilir. Bu nedenle bir önceki yılın net-puan dönüşüm tablosunu yeni sınav için kesin sonuç gibi kullanmak yanıltıcı olabilir. PratikHesap LGS aracı, Türkçe, matematik, fen bilimleri, inkılap tarihi, din kültürü ve yabancı dil netlerini ayrı girmek için tasarlanmıştır. MEB’in 2026 merkezi sınav kılavuzundaki gerekli formül ve parametreler doğrulanmadığı için araç şu aşamada sayısal LGS puanı göstermez. Doğrulama tamamlandığında da sonuç yalnızca bilgilendirme amaçlı bir tahmin olacaktır; okul tercihleri ve yerleştirmeler için MEB’in resmî sonuç ve tercih kılavuzları kullanılmalıdır. Sınav dışı yerel yerleştirme koşulları bu hesaplamaya dahil değildir. Öğrenciler testlerin soru sayılarını ve sınav kapsamını ilgili yıl duyurusundan kontrol etmelidir. Kılavuz yayımlandığında kullanılan yöntem yıl config’ine kaynak ve güncelleme tarihiyle eklenmelidir.",
      steps: ["Altı test için doğru-yanlışlarınızdan hesapladığınız net değerlerini girin.", "MEB’in ilgili yıl kılavuzundaki sınav türü ve puanlama parametrelerinin geçerliliğini kontrol edin.", "Resmî yöntem yapılandırmaya eklenmeden önce sayısal puan üretiminin kapalı olduğunu unutmayın."],
      examples: examples("LGS"),
      faqs: examFaqs("LGS"),
      lastUpdated: updated,
      sources: [source("Millî Eğitim Bakanlığı – LGS", "https://www.meb.gov.tr/", "İlgili yıl merkezi sınav başvuru ve uygulama kılavuzu ile puanlama yöntemi doğrulanmalı.")]
    }
  },
  {
    id: "kpss-puan-hesaplama", name: "KPSS puan hesaplama", category: "egitim", createdAt: `${updated}T09:35:30+03:00`,
    description: "KPSS test netlerinizi ve puan türünüzü seçin; yılın ÖSYM katsayıları config üzerinden yönetilir.",
    title: "KPSS Puan Hesaplama 2026 – Puan Türleri ve Net | PratikHesap",
    metaDescription: "KPSS Genel Yetenek, Genel Kültür ve ilgili oturum netlerinizi girin. 2026 ÖSYM puan türü katsayıları doğrulanmadan puan gösterilmez.",
    intro: "KPSS puanı oturuma, puan türüne ve sınav yılı standartlaştırmasına göre değişir. 2026 resmî katsayıları doğrulanana kadar araç kapalıdır.",
    formula: "Netler, seçilen KPSS puan türünün test ağırlıkları ve ÖSYM standart puanlama esaslarıyla birleştirilir.",
    example: "P1, P2, P3 veya öğretmenlik türleri farklı test bileşenleri içerebilir; sınav oturumuna göre seçim yapılmalıdır.",
    fields: [
      selectField("scoreType", "KPSS puan türü", educationHealthConfig2026.exams.kpss.scoreTypes.map((value) => ({ label: value, value }))),
      ...educationHealthConfig2026.exams.kpss.sections.map((section) => numberField(section.key, section.label, "Örn. 30", "net"))
    ],
    mode: "exam-score-kpss",
    content: {
      definition: "Kamu Personel Seçme Sınavı (KPSS), kamu görevlerine başvuracak adayların farklı oturum ve puan türleri üzerinden değerlendirildiği merkezi sınavdır. Genel Yetenek ve Genel Kültür oturumlarına ek olarak Eğitim Bilimleri, alan bilgisi veya başka sınav bölümleri belirli puan türlerinde kullanılabilir. P1, P2 ve P3 gibi puan türleri aynı test bileşimiyle hesaplanmayabilir; adayın başvurduğu kadro veya program hangi puan türünü istiyorsa o tür esas alınmalıdır. Test netleri doğru ve yanlış sayılarından türetilir, ancak netleri basitçe toplamak ÖSYM puanı vermez. Standart puanlama, oturum ağırlıkları ve sınav yılına özel uygulamalar ilgili ÖSYM kılavuzunda açıklanır. Bu sayfada test netleri ve puan türü seçimi için alanlar sunulur. 2026 oturumlarına ait puan türü katsayıları ve standartlaştırma parametreleri birincil kaynakta doğrulanmadan hesaplanmış KPSS puanı gösterilmez. Adaylar başvuru koşulları, puan geçerlilik süresi ve tercih kılavuzunu ayrıca incelemelidir. Araç, atama olasılığı, başarı sırası veya kadro uygunluğu tahmini yapmaz ve resmî ÖSYM sonucunun yerine geçmez. Sınav oturumuna katılım ve puan türü geçerliliği kadro ilanına göre değişebileceğinden, adaylar ilan metnini ve güncel ÖSYM takvimini ayrıca kontrol etmelidir.",
      steps: ["Başvuracağınız kadronun istediği KPSS puan türünü seçin.", "Genel Yetenek, Genel Kültür ve varsa ilgili oturum netlerini girin.", "İlgili yılın ÖSYM kılavuzundaki puan türü ağırlıkları doğrulanmadan puan tahmini sunulmadığını dikkate alın."],
      examples: examples("KPSS"),
      faqs: examFaqs("KPSS"),
      lastUpdated: updated,
      sources: [source("ÖSYM – KPSS", "https://www.osym.gov.tr/", "İlgili yıl KPSS kılavuzları, puan türleri ve değerlendirme esasları doğrulanmalı.")]
    }
  },
  {
    id: "ales-puan-hesaplama", name: "ALES puan hesaplama", category: "egitim", createdAt: `${updated}T09:35:30+03:00`,
    description: "ALES sayısal ve sözel test netlerini puan türüne göre girin; yıl bazlı ÖSYM katsayıları kullanılır.",
    title: "ALES Puan Hesaplama 2026 – Sayısal, Sözel ve Eşit Ağırlık | PratikHesap",
    metaDescription: "ALES sayısal ve sözel netlerinizi girin; puan türünü seçin. 2026 ÖSYM standart puanlama verileri doğrulanmadan tahminî puan gösterilmez.",
    intro: "ALES puan türü sayısal, sözel veya eşit ağırlık olabilir. Resmî sınav yılı ağırlıkları ve standartlaştırma parametreleri olmadan puan hesaplanamaz.",
    formula: "Sayısal ve sözel standart puan bileşenleri, seçilen ALES türüne ait yıl bazlı katsayılarla birleştirilir.",
    example: "Aynı sayısal ve sözel netler, ALES-SAY, ALES-SÖZ ve ALES-EA için farklı katkı oluşturabilir.",
    fields: [
      selectField("scoreType", "ALES puan türü", educationHealthConfig2026.exams.ales.scoreTypes.map((value) => ({ label: value, value }))),
      ...educationHealthConfig2026.exams.ales.sections.map((section) => numberField(section.key, section.label, "Örn. 25", "net"))
    ],
    mode: "exam-score-ales",
    content: {
      definition: "Akademik Personel ve Lisansüstü Eğitimi Giriş Sınavı (ALES), lisansüstü eğitim ve akademik başvurularda kullanılan sayısal, sözel ve eşit ağırlık puan türleri sunar. Adayın sayısal ve sözel testlerdeki performansı, hangi puan türünün seçildiğine bağlı olarak farklı ağırlıklarla değerlendirilir. Doğru ve yanlış yanıtların net karşılığı sınavın kılavuzundaki kurala göre bulunur; ardından ÖSYM’nin ilgili oturum için açıkladığı standart puanlama ve ağırlıklar uygulanır. Bu yüzden test netlerini yüzdeye çevirmek veya önceki ALES döneminin net-puan tablosunu yeni döneme aynen aktarmak resmî puanı garanti etmez. PratikHesap ALES sayfasında sayısal/sözel net girişi ve puan türü seçimi için alanlar bulunur. 2026 ALES sınavları için uygulanacak değerlendirme kılavuzu ve katsayılar resmî kaynaktan teyit edilmediği sürece puan çıktısı devre dışıdır. Sonuç etkinleştirildiğinde de başvuru şartları, puanın geçerlilik süresi, kurumların taban koşulları ve adayın özel durumu ayrıca kontrol edilmelidir. Bu araç akademik kabul veya yerleşme sonucu tahmini yapmaz. Başvuru yapacağınız üniversitenin kabul koşulları ve puan geçerlilik süresi farklı olabilir. Adaylar tercih veya başvuru öncesinde kurum duyurularını ve sınav yılı kılavuzunu birlikte incelemelidir.",
      steps: ["ALES-SAY, ALES-SÖZ veya ALES-EA puan türünü seçin.", "Sayısal ve sözel test netlerinizi girin.", "ÖSYM’nin ilgili sınav dönemi kılavuzu ve standart puan parametreleri doğrulanmadan sonuç gösterilmeyeceğini dikkate alın."],
      examples: examples("ALES"),
      faqs: examFaqs("ALES"),
      lastUpdated: updated,
      sources: [source("ÖSYM – ALES", "https://www.osym.gov.tr/", "İlgili yıl ALES kılavuzu, sayısal/sözel ağırlıkları ve standart puanlama doğrulanmalı.")]
    }
  },
  {
    id: "dgs-puan-hesaplama", name: "DGS puan hesaplama", category: "egitim", createdAt: `${updated}T09:35:30+03:00`,
    description: "DGS sayısal ve sözel netleriyle puan türünüzü seçin; ÖSYM katsayıları yıl bazlı config’tedir.",
    title: "DGS Puan Hesaplama 2026 – Sayısal, Sözel ve Eşit Ağırlık | PratikHesap",
    metaDescription: "DGS sayısal ve sözel test netlerinizi girin. 2026 puan türü katsayıları ve ÖBP katkısı ÖSYM’den doğrulanmadan puan tahmini yayımlanmaz.",
    intro: "DGS puanında test bileşenleri ve ön lisans başarı puanı etkili olabilir. 2026 değerlendirme kuralları doğrulanana kadar bu sayfa kesin puan üretmez.",
    formula: "Test standart puanları, seçilen DGS puan türü ağırlıklarıyla ve ilgili yılın ÖBP kuralıyla birleştirilir.",
    example: "DGS-SAY, DGS-SÖZ ve DGS-EA aynı netlerden farklı sonuç üretebilir; ÖBP ayrıca etkili olabilir.",
    fields: [
      selectField("scoreType", "DGS puan türü", educationHealthConfig2026.exams.dgs.scoreTypes.map((value) => ({ label: value, value }))),
      ...educationHealthConfig2026.exams.dgs.sections.map((section) => numberField(section.key, section.label, "Örn. 25", "net")),
      numberField("obp", "Ön lisans başarı puanı (ÖBP)", "Örn. 60", "puan")
    ],
    mode: "exam-score-dgs",
    content: {
      definition: "Dikey Geçiş Sınavı (DGS), ön lisans mezunlarının belirli lisans programlarına geçiş başvurularında kullanılan merkezi sınavdır. DGS değerlendirmesinde sayısal ve sözel test performansı, adayın tercih ettiği puan türüne göre ele alınır. DGS-SAY, DGS-SÖZ ve DGS-EA için test ağırlıkları aynı değildir. Ön lisans akademik başarı puanının (ÖBP) değerlendirmeye katkısı da ilgili yılın kılavuzundaki kurallara göre belirlenir. Bu nedenle yalnızca doğru-yanlış netlerini toplamak ya da geçmiş dönem katsayılarını kullanmak resmî DGS puanını vermez. Bu araç adayın sayısal/sözel netlerini ve ÖBP bilgisini girmesi için tasarlanmıştır; fakat 2026 ÖSYM değerlendirme formülü, test katsayıları ve ÖBP katkısı birincil kılavuzdan doğrulanmadan sayısal puan yayımlamaz. Aday, mezun olduğu program için geçiş yapılabilecek lisans programlarını, kontenjanları ve tercih koşullarını ayrıca kontrol etmelidir. Hesaplayıcı tercih yerleşme ihtimali veya başarı sırası öngörmez. Resmî sonuçlar ve tercih kılavuzları tek yetkili referanstır; burada verilen bilgi sınav hazırlığına yardımcı genel açıklamadır. Geçiş yapılabilecek programlar mezun olunan ön lisans alanına bağlıdır ve yalnızca puan hesaplamak tercih uygunluğunu göstermez. Güncel kontenjan ve program koşullarını ÖSYM tercih kılavuzundan ayrıca kontrol edin.",
      steps: ["DGS puan türünü seçin ve sayısal/sözel netlerinizi girin.", "ÖBP alanına ilgili yıl kılavuzunun tanımladığı değeri girin; not ortalamasını doğrudan ÖBP sanmayın.", "ÖSYM’nin yıl bazlı puan katsayıları ve ÖBP uygulaması doğrulanmadan puan sonucu sunulmayacağını dikkate alın."],
      examples: examples("DGS"),
      faqs: examFaqs("DGS"),
      lastUpdated: updated,
      sources: [source("ÖSYM – DGS", "https://www.osym.gov.tr/", "İlgili yıl DGS kılavuzu, test ağırlıkları ve ÖBP katkısı doğrulanmalı.")]
    }
  }
];

const healthWarning = "Bu araç genel bilgilendirme ve yaklaşık hesaplama içindir; tıbbi tavsiye, tanı veya tedavi önerisi değildir. Kişisel sağlık durumunuz için sağlık uzmanına danışın.";
const healthSources = [
  source("Dünya Sağlık Örgütü", "https://www.who.int/", "Sağlıkla ilgili genel bilgi; hesaplama kişisel klinik değerlendirme yerine geçmez."),
  source("NIH – Office of Dietary Supplements", "https://ods.od.nih.gov/", "Beslenme ve sıvı gereksinimleri kişiye göre değişebilir.")
];
const healthFaqs = (name: string): CalculatorPageContent["faqs"] => [
  { question: `${name} sonucu kişiye özel öneri midir?`, answer: healthWarning },
  { question: "Hesaplama hangi varsayımları kullanır?", answer: "Kullanılan denklem ve varsayımlar sayfada açıklanır. Yaş, sağlık durumu, ilaçlar, aktivite ve çevre koşulları sonucu değiştirebilir." },
  { question: "Çocuklar veya hamileler için uygun mudur?", answer: "Bu araç yetişkinler için genel bir tahmin sunar; çocuklar, gebeler ve özel sağlık durumu olanlar için uygun değerlendirme sağlık uzmanına aittir." },
  { question: "Sonuç neden yaklaşık olarak gösterilir?", answer: "Genel denklemler bireysel farklılıkları ve klinik ölçümleri kapsamaz; sonuç kişisel gereksinim veya tedavi planı değildir." },
  { question: "Verilerim sunucuya gönderiliyor mu?", answer: "Hesaplama tarayıcıda yapılır; girilen sağlık bilgileri bu hesaplama için sunucuya gönderilmez." },
  { question: "Sonuçtan memnun değilsem ne yapmalıyım?", answer: "Kendi başınıza beslenme, sıvı, kilo veya tedavi değişikliği yapmak yerine sağlık uzmanına danışın." }
];

const otherTools: ToolDefinition[] = [
  {
    id: "lise-diploma-notu-hesaplama", name: "Lise diploma notu hesaplama", category: "egitim", createdAt: `${updated}T09:35:30+03:00`,
    description: "9, 10, 11 ve 12. sınıf yıl sonu başarı puanlarından basit diploma puanı ortalaması bulun.",
    title: "Lise Diploma Notu Hesaplama – 9, 10, 11 ve 12. Sınıf | PratikHesap",
    metaDescription: "Lise 9, 10, 11 ve 12. sınıf yıl sonu başarı puanlarını girin; dört yılın basit ortalamasını hesaplayın.",
    intro: "Dört yılın yıl sonu başarı puanlarını kullanarak aritmetik ortalama hesaplayın. Nakil, sınıf tekrarı ve özel durumlar MEB kurallarına göre ayrıca değerlendirilmelidir.",
    formula: "Örnek diploma puanı = (9. sınıf + 10. sınıf + 11. sınıf + 12. sınıf yıl sonu başarı puanı) ÷ 4.",
    example: "Dört sınıf puanı eşit ağırlıklı aritmetik ortalama ile değerlendirilir; resmî e-Okul diploma puanı farklı kayıtlara bağlı olabilir.",
    fields: [
      numberField("grade9", "9. sınıf yıl sonu başarı puanı", "Örn. 80", "puan"),
      numberField("grade10", "10. sınıf yıl sonu başarı puanı", "Örn. 85", "puan"),
      numberField("grade11", "11. sınıf yıl sonu başarı puanı", "Örn. 90", "puan"),
      numberField("grade12", "12. sınıf yıl sonu başarı puanı", "Örn. 95", "puan")
    ],
    mode: "diploma-grade",
    content: {
      definition: "Lise diploma notu, öğrencinin ortaöğretim öğrenimi boyunca elde ettiği başarıyı özetleyen bir puandır ve yükseköğretime geçişte ortaöğretim başarı puanı gibi bileşenlerin belirlenmesinde etkili olabilir. Genel bir açıklama olarak 9, 10, 11 ve 12. sınıf yıl sonu başarı puanlarının ortalaması alınır; ancak sınıf tekrarı, nakil, hazırlık, mezuniyet türü, ders veya dönem kayıtlarının eksikliği gibi durumlar resmî hesaplamayı etkileyebilir. Bu hesaplayıcı dört sınıf için girilen puanların basit aritmetik ortalamasını verir. Puanların 0 ile 100 arasında girilmesi beklenir ve her sınıf aynı ağırlıktadır. Araç, e-Okul verilerine erişmez, diploma belgesi üretmez ve adayın resmî ortaöğretim başarı puanını doğrulamaz. Özellikle merkezi sınavlara eklenen OBP katkısı, diploma puanının kendisiyle aynı değildir ve ÖSYM’nin ilgili yıl kurallarıyla hesaplanır. Eksik sınıf puanını tahmin ederek doldurmak yerine okul kayıtlarından doğrulamak gerekir. Gösterilen sonuç hazırlık amaçlı yaklaşık ortalamadır; kesin bilgi için okul idaresi, e-Okul veya MEB’in yürürlükteki mevzuatını esas alın. Farklı okul türü veya sınıf tekrarı bulunan öğrenciler kendi kayıt koşullarını ayrıca kontrol etmelidir.",
      steps: ["Her sınıfın yıl sonu başarı puanını 0–100 aralığında girin.", "Dört puan eşit ağırlıklı toplanıp dörde bölünür.", "Sınıf tekrarı, nakil veya özel eğitim durumu varsa okul kayıtları ve MEB uygulamasını ayrıca doğrulayın."],
      examples: [
        { title: "Dört benzer puan", calculation: "(80 + 82 + 84 + 86) ÷ 4", result: "Basit ortalama 83 puandır." },
        { title: "Yükselen başarı", calculation: "(70 + 75 + 85 + 90) ÷ 4", result: "Basit ortalama 80 puandır." }
      ],
      faqs: [
        { question: "Diploma notu nasıl hesaplanır?", answer: "Bu araç 9–12. sınıf yıl sonu başarı puanlarının basit ortalamasını verir; resmî kayıt ve istisnalar MEB kurallarına bağlıdır." },
        { question: "Diploma notu ile OBP aynı şey mi?", answer: "Hayır. Ortaöğretim başarı puanı ve sınav puanına eklenen katkı ilgili ÖSYM kurallarına göre ayrıca hesaplanır." },
        { question: "Sınıflar eşit ağırlıklı mı?", answer: "Bu hesaplayıcı dört sınıfa eşit ağırlık verir. Özel okul kaydı, sınıf tekrarı veya nakil durumunu doğrulamaz." },
        { question: "Puanı 100'ün üzerinde girebilir miyim?", answer: "Hayır. Yıl sonu başarı puanları 0–100 aralığında olmalıdır." },
        { question: "Bir sınıfın notu eksikse ne yapmalıyım?", answer: "Eksik notu okul veya e-Okul kaydından doğrulayın; araç eksik puan üzerinden resmî sonuç oluşturmaz." },
        { question: "Bu sonuç resmî diploma puanı mıdır?", answer: "Hayır. Sonuç aritmetik tahmindir; resmî diploma kaydı MEB/e-Okul üzerinden kontrol edilmelidir." }
      ],
      lastUpdated: updated,
      sources: [source("Millî Eğitim Bakanlığı", "https://www.meb.gov.tr/", "Ortaöğretim mevzuatı ve diploma kayıtları için; özel öğrenci durumları okuldan doğrulanmalı.")]
    }
  },
  {
    id: "ideal-kilo-hesaplama", name: "İdeal kilo hesaplama", category: "gunluk-yasam", createdAt: `${updated}T09:35:30+03:00`,
    description: "Boyunuza göre yetişkin BMI referans aralığındaki yaklaşık ağırlık bandını görün.",
    title: "İdeal Kilo Hesaplama – Boya Göre Yaklaşık Sağlıklı Kilo Aralığı | PratikHesap",
    metaDescription: "Boyunuzu girin; yetişkin BMI referans aralığına göre yaklaşık kilo bandını hesaplayın. Sonuç tıbbi tavsiye değildir.",
    intro: `${healthWarning} Yetişkinler için BMI referans aralığından hesaplanan yaklaşık aralık gösterilir.`,
    formula: "Ağırlık aralığı = BMI sınırı × boy(m)²; yetişkin referans aralığı 18,5–24,9 BMI olarak alınır.",
    example: "Boyun metre cinsinden karesi, alt ve üst BMI sınırıyla çarpılarak referans kilo aralığı bulunur.",
    fields: [numberField("height", "Boy", "Örn. 170", "cm")],
    mode: "ideal-weight",
    medicalDisclaimer: true,
    content: {
      definition: "“İdeal kilo” tek ve herkes için geçerli bir sayı değildir. Yaş, kas ve kemik yapısı, gebelik, etnik köken, sağlık durumu ve vücut kompozisyonu ağırlığın sağlıkla ilişkisini etkiler. Bu sayfa, yetişkinler için sık kullanılan vücut kitle indeksi (BMI/VKİ) referans bandından yaklaşık bir ağırlık aralığı hesaplar. BMI, kilogram cinsinden ağırlığın metre cinsinden boyun karesine bölünmesiyle bulunur; bu hesaplayıcı BMI 18,5 ile 24,9 arasındaki ağırlıkları yalnızca matematiksel referans olarak verir. Bu aralık bir tanı ölçütü veya hedef kilo önerisi değildir. Çocuk ve ergenlerde yaşa ve cinsiyete göre büyüme eğrileri kullanılır; yetişkin BMI sınırları uygulanmamalıdır. Sporcularda kas kütlesi yüksekliği, yaşlılarda kas kaybı veya ödem gibi etkenler BMI yorumunu sınırlayabilir. Araç kalori hedefi, diyet veya kilo verme planı sunmaz. Sonuç kişisel sağlık değerlendirmesi yerine geçmediği için kilo değişikliği planlayanların hekim veya diyetisyenle görüşmesi gerekir. Tıbbi tavsiye değildir; gebelik, kronik hastalık, yeme bozukluğu öyküsü veya hızlı kilo değişimi varsa profesyonel destek alın. İki kişi aynı boy ve kiloda olsa bile sağlık profilleri farklı olabilir. Bu nedenle hesaplanan bant, vücut yapısını veya laboratuvar bulgularını kapsayan kapsamlı değerlendirme olarak sunulmaz.",
      steps: ["Boyunuzu santimetre olarak girin.", "Araç, boyun metreye çevrilmiş karesini 18,5 ve 24,9 BMI sınırlarıyla çarpar.", "Gösterilen aralığı tanı veya kişisel hedef olarak yorumlamayın; sağlık uzmanına danışın."],
      examples: [
        { title: "Boy 170 cm", calculation: "1,70² × 18,5 ile 1,70² × 24,9", result: "Yaklaşık yetişkin referans bandı 53,5–72,0 kg." },
        { title: "Boy 160 cm", calculation: "1,60² × 18,5 ile 1,60² × 24,9", result: "Yaklaşık yetişkin referans bandı 47,4–63,7 kg." }
      ],
      faqs: healthFaqs("İdeal kilo hesabı"),
      lastUpdated: updated,
      sources: healthSources
    }
  },
  {
    id: "gunluk-kalori-ihtiyaci-hesaplama", name: "Günlük kalori ihtiyacı hesaplama", category: "gunluk-yasam", createdAt: `${updated}T09:35:30+03:00`,
    description: "Mifflin–St Jeor denklemi ve aktivite çarpanıyla yaklaşık günlük enerji harcamasını tahmin edin.",
    title: "Günlük Kalori İhtiyacı Hesaplama – BMR ve Aktivite | PratikHesap",
    metaDescription: "Yaş, boy, kilo ve aktivite düzeyini girin; Mifflin–St Jeor ile yaklaşık günlük enerji harcamasını hesaplayın. Tıbbi tavsiye değildir.",
    intro: `${healthWarning} Yetişkinlere yönelik genel enerji tahmini sunar; kişisel beslenme planı değildir.`,
    formula: "BMR: erkek için 10×kg + 6,25×cm − 5×yaş + 5; kadın için 10×kg + 6,25×cm − 5×yaş − 161. Tahmini günlük harcama = BMR × aktivite katsayısı.",
    example: "Denklem dinlenme enerji tahminini üretir; seçilen aktivite katsayısı günlük toplamı yaklaşık olarak ölçekler.",
    fields: [
      numberField("age", "Yaş", "Örn. 30", "yaş"),
      selectField("sex", "Denklem seçimi", [{ label: "Kadın denklemi", value: "female" }, { label: "Erkek denklemi", value: "male" }]),
      numberField("height", "Boy", "Örn. 170", "cm"),
      numberField("weight", "Ağırlık", "Örn. 70", "kg"),
      selectField("activity", "Aktivite düzeyi", [
        { label: "Düşük – 1,2", value: "1.2" },
        { label: "Hafif – 1,375", value: "1.375" },
        { label: "Orta – 1,55", value: "1.55" },
        { label: "Yüksek – 1,725", value: "1.725" },
        { label: "Çok yüksek – 1,9", value: "1.9" }
      ])
    ],
    mode: "daily-calories",
    medicalDisclaimer: true,
    content: {
      definition: "Günlük kalori ihtiyacı ifadesi çoğunlukla vücudun dinlenme enerji harcaması ile günlük hareketliliğin toplamına ilişkin yaklaşık bir tahmini anlatır. Mifflin–St Jeor denklemi, yetişkinlerde bazal metabolizma hızını (BMR) yaş, boy, ağırlık ve denklem seçimiyle tahmin etmek için kullanılan yöntemlerden biridir. BMR, gün boyunca tam dinlenme varsayımındaki enerji ihtiyacına yaklaşır; günlük toplam harcama aktivite katsayısıyla yaklaşık hesaplanır. Bu katsayılar kişilerin gerçek hareketliliğini tam yansıtmayabilir ve cihaz, egzersiz, iş, uyku, vücut kompozisyonu, ilaçlar veya sağlık durumundaki farklılıkları ölçmez. Sonuç, tüketilmesi gereken kalori miktarına dair tıbbi reçete, kilo verme hedefi ya da beslenme planı değildir. Gebelik ve emzirme, çocukluk, ileri yaş, kronik hastalık veya yeme bozukluğu gibi durumlarda genel formüller uygun olmayabilir. Araç yalnızca yetişkinler için matematiksel bir tahmin verir ve sağlık verilerini tarayıcıda işler. Beslenme veya vücut ağırlığı değişikliği planlarken hekim ve diyetisyenden destek alın. Tıbbi tavsiye değildir; ölçüm ve kişisel klinik değerlendirme yerine kullanılamaz. Günlük hareket düzeyi öznel seçildiğinden aynı kişinin farklı dönemlerdeki sonucu değişebilir. Bu hesaplama metabolizma ölçümü yapmaz ve enerji harcamasını laboratuvar verileriyle doğrulamaz.",
      steps: ["Yaş, boy ve ağırlığı girin; denklem seçimi için uygun grubu belirleyin.", "Aktivite düzeyini günlük rutininize ilişkin kabaca seçin.", "BMR ve aktivite çarpanıyla bulunan tahmini günlük enerji harcamasını tıbbi hedef olarak kabul etmeyin."],
      examples: [
        { title: "Dinlenme metabolizması", calculation: "10 × ağırlık + 6,25 × boy − 5 × yaş ± denklem sabiti", result: "BMR, denklemin verdiği yaklaşık kcal/gün değeridir." },
        { title: "Aktiviteyle tahmin", calculation: "BMR × 1,55 (orta aktivite örneği)", result: "Sonuç toplam enerji harcaması için yaklaşık bir tahmindir; kişisel reçete değildir." }
      ],
      faqs: healthFaqs("Günlük kalori ihtiyacı"),
      lastUpdated: updated,
      sources: [
        source("Mifflin MD ve diğerleri – Resting energy expenditure", "https://pubmed.ncbi.nlm.nih.gov/2305711/", "Yetişkinler için tahmin denklemi; kişisel ölçüm veya klinik değerlendirme yerine geçmez."),
        ...healthSources
      ]
    }
  },
  {
    id: "gunluk-su-ihtiyaci-hesaplama", name: "Günlük su ihtiyacı hesaplama", category: "gunluk-yasam", createdAt: `${updated}T09:35:30+03:00`,
    description: "Ağırlık ve seçilebilir mL/kg varsayımıyla günlük sıvı için genel bir hesap örneği oluşturun.",
    title: "Günlük Su İhtiyacı Hesaplama – Kişisel Varsayım | PratikHesap",
    metaDescription: "Ağırlık ve kendi seçtiğiniz mL/kg katsayısıyla günlük su hesabı örneği alın. Bu sonuç kişisel tıbbi öneri değildir.",
    intro: `${healthWarning} Sonuç kullanıcı seçtiği varsayıma dayalı genel hesap örneğidir; sabit su hedefi önermez.`,
    formula: "Günlük örnek miktar (mL) = ağırlık (kg) × kullanıcının seçtiği katsayı (mL/kg).",
    example: "Katsayı kullanıcı tarafından seçilir; hava, egzersiz, beslenme ve sağlık durumu ayrıca sıvı gereksinimini değiştirebilir.",
    fields: [
      numberField("weight", "Ağırlık", "Örn. 70", "kg"),
      numberField("mlPerKg", "Hesap varsayımı", "Örn. 30", "mL/kg")
    ],
    mode: "daily-water",
    medicalDisclaimer: true,
    content: {
      definition: "Günlük su gereksinimi herkes için tek bir sayıyla açıklanamaz. Sıvı ihtiyacı vücut büyüklüğü, yaş, hava sıcaklığı, fiziksel aktivite, beslenme, ateş, gebelik, emzirme ve böbrek ya da kalp gibi sağlık durumlarına göre değişebilir. Bu araç, yalnızca kullanıcı tarafından girilen ağırlık ve mL/kg katsayısını çarparak bir matematik örneği oluşturur; varsayılan katsayı tıbbi kılavuz veya kişisel öneri değildir. Ayrıca günlük toplam su alımı yalnızca bardakla içilen sade sudan oluşmaz; yiyecek ve diğer içeceklerden gelen sıvı da hesaba katılabilir. Böbrek, kalp veya karaciğer hastalıklarında sıvı kısıtlaması ya da farklı hedefler gerekebilir. Susama hissi, idrar görünümü veya belirli bir formül tek başına herkes için güvenli hedef belirlemez. Bu nedenle sonuç, zorunlu tüketim miktarı, tedavi planı veya dehidrasyon tanısı olarak kullanılmamalıdır. Çocuklar, gebeler, emzirenler, sporcular ve hastalığı bulunan kişiler kendi koşullarına uygun yönlendirme için sağlık uzmanına danışmalıdır. Tıbbi tavsiye değildir; hesaplama tarayıcıda yapılır ve kişisel sağlık verisi sunucuya gönderilmez. Yoğun terleme veya hastalık sırasında sıvı-elektrolit dengesi farklı biçimde yönetilebilir; bireysel gereksinimi sağlık uzmanı değerlendirmelidir.",
      steps: ["Ağırlığınızı kilogram olarak girin.", "Hesap örneğinde kullanmak istediğiniz mL/kg katsayısını girin; varsayılan değer öneri anlamı taşımaz.", "Sonucu günlük tüketim hedefi olarak uygulamadan önce sağlık durumunuzu ve uzman önerisini dikkate alın."],
      examples: [
        { title: "Kullanıcı varsayımı 30 mL/kg", calculation: "70 kg × 30 mL/kg", result: "Matematiksel örnek 2.100 mL/gündür; bu kişisel tavsiye değildir." },
        { title: "Katsayıyı değiştirme", calculation: "70 kg × 25 mL/kg", result: "Seçilen varsayımla örnek 1.750 mL/gün çıkar; klinik gereksinim yerine geçmez." }
      ],
      faqs: healthFaqs("Günlük su hesabı"),
      lastUpdated: updated,
      sources: healthSources
    }
  },
  {
    id: "yumurtlama-adet-takvimi-hesaplama", name: "Yumurtlama ve adet takvimi hesaplama", category: "gunluk-yasam", createdAt: `${updated}T09:35:30+03:00`,
    description: "Son adet başlangıcı ve döngü uzunluğuna göre tahmini sonraki adet ve yumurtlama tarihlerini görün.",
    title: "Yumurtlama ve Adet Takvimi Hesaplama – Tahmini Tarihler | PratikHesap",
    metaDescription: "Son adet başlangıcı ve ortalama döngü gününü girerek tahmini sonraki adet, yumurtlama ve verimli dönem tarihlerini hesaplayın. Tıbbi tavsiye değildir.",
    intro: `${healthWarning} Döngü tahminleri değişken olabilir ve gebelikten korunma yöntemi değildir.`,
    formula: "Tahmini sonraki adet = son adet başlangıcı + döngü günü; tahmini yumurtlama = sonraki adet tarihinden yaklaşık 14 gün önce.",
    example: "28 günlük düzenli varsayımda yumurtlama yaklaşık döngünün 14. günü çevresinde tahmin edilir; kişiden kişiye değişir.",
    fields: [
      dateField("lastPeriod", "Son adetin ilk günü"),
      numberField("cycleLength", "Ortalama döngü uzunluğu", "Örn. 28", "gün"),
      numberField("periodLength", "Adet kanaması süresi", "Örn. 5", "gün")
    ],
    mode: "menstrual-calendar",
    medicalDisclaimer: true,
    content: {
      definition: "Adet döngüsü, bir kanamanın ilk gününden sonraki kanamanın ilk gününe kadar geçen süredir. Yumurtlama zamanı döngü uzunluğu, hormonlar ve kişisel biyolojik değişkenlerle farklılaşır; her kişide 28 günlük döngü veya 14. gün yumurtlama varsayımı geçerli değildir. Bu araç son adet başlangıç tarihini ve kullanıcının bildirdiği ortalama döngü uzunluğunu kullanarak sonraki adet başlangıcını yaklaşık tarihlerle tahmin eder. Tahmini yumurtlama tarihi, beklenen sonraki adetten yaklaşık 14 gün önce kabul edilen genel takvim varsayımıdır; verimli dönem için çevresindeki günler yalnızca yaklaşık aralık olarak gösterilir. Stres, hastalık, emzirme, hormonal ilaçlar, ergenlik, doğum sonrası dönem ve düzensiz döngüler bu tahminleri bozabilir. Takvim yöntemi gebelikten korunma yöntemi değildir ve gebelik olasılığını kesin belirlemez. Adet düzensizliği, yoğun ağrı, olağandışı kanama veya gebelik endişesi varsa sağlık uzmanına danışılmalıdır. Bu hesaplama tanı, doğurganlık değerlendirmesi veya tedavi önerisi sunmaz. Tıbbi tavsiye değildir; paylaşılan tahmini tarihler gerçek yumurtlama veya kanama zamanını garanti etmez. Birkaç aylık döngü kaydı kişisel düzeni anlamaya yardımcı olabilir ancak takvim tahmini yine de kesin yumurtlama testi veya klinik değerlendirme sayılmaz.",
      steps: ["Son adet kanamasının başladığı ilk günü seçin.", "Döngünüzün son birkaç aydaki ortalama uzunluğunu ve kanama süresini girin.", "Sonraki adet ve yumurtlama tarihlerini yaklaşık takvim tahmini olarak değerlendirin; gebelikten korunmak için kullanmayın."],
      examples: [
        { title: "28 günlük düzenli döngü", calculation: "Son adet başlangıcı + 28 gün; yumurtlama sonraki adetten yaklaşık 14 gün önce", result: "Takvim, yaklaşık döngü tarihlerini verir; gerçek yumurtlama günü değişebilir." },
        { title: "32 günlük döngü", calculation: "Son adet başlangıcı + 32 gün; yumurtlama tahmini sonraki adet tarihinden geriye yaklaşık 14 gün", result: "Daha uzun döngüde tahmini gün de kayar; düzensizlik hesabı güvenilmez kılabilir." }
      ],
      faqs: healthFaqs("Yumurtlama ve adet takvimi"),
      lastUpdated: updated,
      sources: [
        source("ACOG – Ovulation and the menstrual cycle", "https://www.acog.org/womens-health", "Döngü ve yumurtlama hakkında genel bilgilendirme; takvim hesabı kişisel klinik değerlendirme değildir."),
        ...healthSources
      ]
    }
  },
  {
    id: "hicri-takvim-cevirme", name: "Hicri takvim çevirme", category: "tarih", createdAt: `${updated}T09:35:30+03:00`,
    description: "Miladi tarihi Umm al-Qura Hicri takvim görünümüne çevirin.",
    title: "Hicri Takvim Çevirme – Miladi Tarihten Hicri Tarihe | PratikHesap",
    metaDescription: "Miladi tarihi seçin; tarayıcının Umm al-Qura takvim desteğiyle Hicri gün, ay ve yılı görün. Bölgesel takvim farklılıklarını dikkate alın.",
    intro: "Miladi tarihi tarayıcının Hicri Umm al-Qura takvim uygulamasıyla çevirin. Yerel dini takvim ilanları bir gün farklı olabilir.",
    formula: "Dönüşüm, ECMAScript Internationalization API ile ar-SA-u-ca-islamic-umalqura takvimi kullanılarak yapılır.",
    example: "Aynı Miladi tarih için hesaplanan Hicri gün, yerel gözlem veya resmî dini takvim ilanından farklı olabilir.",
    fields: [dateField("date", "Miladi tarih")],
    mode: "hijri-date",
    content: {
      definition: "Hicri takvim, ayın evreleri temelinde düzenlenen ve İslam dünyasında dini günler ile tarihleri ifade etmekte kullanılan takvim sistemidir. Miladi ve Hicri takvimlerin yıl uzunlukları farklı olduğu için aynı Miladi gün her yıl başka Hicri gün ve aya karşılık gelir. Bu araç, seçtiğiniz Miladi tarihi tarayıcıların uluslararası tarih biçimlendirme desteğinde bulunan Umm al-Qura takvim sistemiyle gösterir. Umm al-Qura, Suudi Arabistan’da kullanılan hesap temelli takvim sistemidir; farklı ülkelerde hilalin gözlemlenmesi veya dini otoritelerin ilanları nedeniyle başlangıç günü bir gün değişebilir. Dolayısıyla sonuç, belirli bir yerel dini günün kesin başlangıç veya bitiş zamanı olarak yorumlanmamalıdır. Özellikle Ramazan, bayram ve ibadet günleri için bulunduğunuz yerdeki yetkili kurumun ilanı esas alınmalıdır. Hesaplama tamamen tarih dönüşümüdür; saat dilimi, gün batımı ve yerel gözlem şartlarını değerlendirmez. Tarayıcıda gerekli takvim desteği bulunmadığında araç açık hata verir; başka takvimle sessizce ikame yapmaz. Hicri ay adları Türkçe gösterilir ve sonuç çevrimdışı hesaplanır. Resmî dini takvim ihtiyacında Diyanet İşleri Başkanlığı takvimini kontrol edin.",
      steps: ["Çevirmek istediğiniz Miladi tarihi seçin.", "Araç, tarayıcıdaki Umm al-Qura Hicri takvim biçimlendiricisini kullanır.", "Dini günlerde yerel yetkili kurumun ilanını esas alın; bölgesel fark nedeniyle gün değişebilir."],
      examples: [
        { title: "Tek günlük çeviri", calculation: "Miladi tarih → Umm al-Qura Hicri takvim biçimi", result: "Hicri gün, ay ve yıl gösterilir; dini gözlem tarihi garantisi verilmez." },
        { title: "Takvimler arası fark", calculation: "Aynı Miladi günün farklı ülke/kurum takviminde karşılaştırılması", result: "Hilal gözlemi ve yerel kararlar nedeniyle sonuç bir gün farklı olabilir." }
      ],
      faqs: [
        { question: "Hangi Hicri takvim kullanılır?", answer: "Tarayıcının ECMAScript Internationalization API desteğindeki Umm al-Qura takvimi kullanılır." },
        { question: "Diyanet takvimiyle aynı sonucu verir mi?", answer: "Her zaman garanti edilemez. Yerel takvim ve dini gün ilanları yöntem veya gözlem nedeniyle farklı olabilir." },
        { question: "Ramazan başlangıcını kesin gösterir mi?", answer: "Hayır. İbadet günleri için Diyanet İşleri Başkanlığı ve ilgili yerel yetkili kurum ilanlarını kontrol edin." },
        { question: "Neden tarih bir gün farklı olabilir?", answer: "Hicri ay başlangıcı yerel gözlem ve takvim yöntemine göre değişebilir." },
        { question: "Tarih bilgisi sunucuya gönderiliyor mu?", answer: "Hayır. Çeviri tarayıcıda yapılır." },
        { question: "Tarayıcı takvimi desteklemezse ne olur?", answer: "Araç desteklenmeyen takvim özelliğini açık hata olarak bildirir; farklı bir takvimle yanlış sonuç üretmez." }
      ],
      lastUpdated: updated,
      sources: [
        source("Diyanet İşleri Başkanlığı – Dini Günler", "https://vakithesaplama.diyanet.gov.tr/dinigunler.php", "Dini gün ve yerel takvim ilanlarında yetkili kaynağı kontrol edin."),
        source("ECMA-402 Internationalization API", "https://tc39.es/ecma402/", "Tarayıcı tarih biçimlendirme standardı.")
      ]
    }
  },
  {
    id: "tarihe-kac-gun-kaldi-hesaplama", name: "Tarihe kaç gün kaldı hesaplama", category: "tarih", createdAt: `${updated}T09:35:30+03:00`,
    description: "Seçtiğiniz hedef tarihe bugünden kaç tam gün kaldığını hesaplayın.",
    title: "Tarihe Kaç Gün Kaldı Hesaplama – Gün Sayacı | PratikHesap",
    metaDescription: "Hedef tarihi seçin; bugünden itibaren kaç gün kaldığını veya tarihin kaç gün önce geçtiğini anında hesaplayın.",
    intro: "Bir etkinlik, sınav veya özel güne kalan tam takvim günü sayısını bulun. Saat farkı hesaba katılmaz.",
    formula: "Gün farkı = UTC takvim günü farkı; hedef gün bugünse kalan gün 0’dır.",
    example: "Tarih bazında hesaplama, saat ve dakika yerine gece yarısından gece yarısına kadar olan takvim günlerini karşılaştırır.",
    fields: [dateField("targetDate", "Hedef tarih")],
    mode: "days-until-date",
    content: {
      definition: "Bir tarihe kaç gün kaldığını bilmek; sınav, seyahat, proje teslimi, doğum günü veya başka bir plan için zaman çizelgesi hazırlamaya yardımcı olur. Bu araç hedef tarihi bugünün takvim tarihiyle karşılaştırır ve iki tarih arasındaki tam gün farkını hesaplar. Saat, dakika, saat dilimi veya hedef günün içindeki kalan süre hesaplamaya dahil edilmez. Hedef tarih bugünün tarihiyse kalan gün 0 olarak gösterilir; tarih geçmişteyse kaç gün önce olduğu belirtilir. Takvim günü hesabı, hafta sonları ve resmî tatilleri ayıklamaz; iş günü ihtiyacı için iş günü aracını kullanmak gerekir. Tarih alanına seçilen değer tarayıcıda işlenir ve sunucuya gönderilmez. Seyahat veya başvuru sürelerinde son tarih hesaplaması yapıyorsanız kurumun saat dilimi, son başvuru saati ve tatil kuralı ayrıca kontrol edilmelidir. Bu araç resmi süre uzatımı veya hukuki başvuru son günü belirlemez. Tarih farkı matematiksel bilgi sağlar; planlama sorumluluğu ve ilgili kurum duyuruları kullanıcı tarafından doğrulanmalıdır. Artık yıllar doğru takvim günleriyle ele alınır. Sonucu takviminize aktarırken ilgili etkinliğin başlangıç saatini ve bulunduğunuz konumu da ayrıca göz önünde bulundurun.",
      steps: ["Hedef tarihi takvimden seçin.", "Araç hedef günü ve bugünün takvim gününü UTC tarih sınırlarında karşılaştırır.", "Sonucu takvim günü sayısı olarak değerlendirin; saat veya iş günü hesabı olmadığını unutmayın."],
      examples: [
        { title: "Hedef gelecek hafta", calculation: "Hedef takvim tarihi − bugünün takvim tarihi", result: "Aradaki tam gün sayısı gösterilir; bugünü ayrıca sayma seçeneği yoktur." },
        { title: "Tarih geçmişte", calculation: "Bugünün takvim tarihi − geçmiş hedef tarihi", result: "Hedef günün kaç gün önce geçtiği belirtilir." }
      ],
      faqs: [
        { question: "Bugün hedef tarihse kaç gün kaldı?", answer: "Bugünün tarihi hedef tarihse sonuç 0 gündür." },
        { question: "Geçmiş tarih girersem ne olur?", answer: "Araç tarihin kaç takvim günü önce olduğunu gösterir." },
        { question: "Saat veya dakika hesaba katılıyor mu?", answer: "Hayır. Yalnızca takvim günleri karşılaştırılır." },
        { question: "Hafta sonları ve resmî tatiller düşülüyor mu?", answer: "Hayır. Bu hesap takvim günü içindir; iş günü için iş günü hesaplama aracını kullanın." },
        { question: "Artık yıl doğru hesaplanıyor mu?", answer: "Evet. Takvim tarihi doğrulaması ve UTC gün farkı artık günleri hesaba katar." },
        { question: "Başvuru son günü için kullanabilir miyim?", answer: "Yalnızca genel gün farkı için kullanın; kurumun son saat, saat dilimi ve tatil kurallarını ayrıca doğrulayın." }
      ],
      lastUpdated: updated,
      sources: [source("ECMAScript Date standardı", "https://tc39.es/ecma262/", "Takvim tarihi ve gün hesabı için teknik referans.")]
    }
  },
  {
    id: "burc-hesaplama", name: "Burç hesaplama", category: "gunluk-yasam", createdAt: `${updated}T09:35:30+03:00`,
    description: "Doğum gün ve ayına göre Batı astrolojisindeki Güneş burcu tarih aralığını bulun.",
    title: "Burç Hesaplama – Doğum Tarihine Göre Güneş Burcu | PratikHesap",
    metaDescription: "Doğum gününüzü seçin; Batı astrolojisinde yaygın kullanılan tarih aralıklarına göre Güneş burcunuzu öğrenin.",
    intro: "Gün ve aya göre yaygın tropikal Batı astrolojisi tarih aralıklarında yer alan Güneş burcunu bulun.",
    formula: "Burç = doğum tarihinin ay-gün değerinin geleneksel tropikal burç aralıklarıyla karşılaştırılması.",
    example: "Sınır tarihlerinde saat ve doğum yeri burç geçişini etkileyebilir; araç yalnızca gün ve ayı kullanır.",
    fields: [dateField("birthDate", "Doğum tarihi")],
    mode: "zodiac-sign",
    content: {
      definition: "Batı astrolojisinde Güneş burcu, doğum anında Güneş’in Zodyak kuşağındaki konumuyla ilişkilendirilen burçtur. Günlük kullanımda burç, çoğunlukla doğum günü ve ayına göre bilinen tarih aralıklarıyla belirlenir. Bu araç yaygın tropikal astroloji tarih aralıklarını kullanarak yalnızca yaklaşık Güneş burcu adını gösterir. Burç başlangıç ve bitiş günleri yıl, saat dilimi ve Güneş’in burç değiştirdiği kesin ana bağlı olarak küçük farklılık gösterebilir. Sınır tarihlerinde doğum saati ve doğum yeri bilinmeden kesin astrolojik harita çıkarılamaz. Yükselen burç için doğum saati ve yer bilgisi, doğum haritasının diğer unsurları için de daha kapsamlı astronomik hesap gerekir; bu araç bunları sunmaz. Astroloji bilimsel bir kişilik veya gelecek tahmin yöntemi olarak kabul edilmemelidir. Burç sonucu eğlence ve genel bilgi amaçlıdır; kişilik, sağlık, finans veya ilişki kararlarının temeli yapılmamalıdır. Tarih alanı yalnızca gün/ay çıkarımı için kullanılır; girilen kişisel bilgi tarayıcıda işlenir. Doğum tarihi burç aralıklarının sınır günlerinden biriyse uzman astroloji yazılımı veya efemeris verisiyle kesin an ayrıca kontrol edilmelidir. Takvimdeki burç aralıkları kültürel gelenektir ve kişisel özelliklerin ölçümü olarak doğrulanmış değildir.",
      steps: ["Doğum tarihinizi girin.", "Araç gün ve ayı yaygın tropikal burç aralıklarıyla eşleştirir.", "Sınır tarihlerinde doğum saati ve yerinin sonucu değiştirebileceğini unutmayın."],
      examples: [
        { title: "Aralık ortası doğum günü", calculation: "15 Aralık, yaygın tropikal tarih aralıklarıyla karşılaştırılır", result: "Yay burcu aralığına denk gelir." },
        { title: "Sınır günü", calculation: "Burç geçiş tarihindeki doğum için saat ve konum gerekir", result: "Araç yalnızca genel tarih aralığı tahmini verir." }
      ],
      faqs: [
        { question: "Burç yalnızca doğum gününe göre mi bulunur?", answer: "Bu araç yaygın tarih aralıklarına göre yaklaşık Güneş burcunu bulur; sınır tarihlerinde saat ve konum etkili olabilir." },
        { question: "Yükselen burç hesaplanıyor mu?", answer: "Hayır. Yükselen burç için doğum saati ve doğum yeriyle daha ayrıntılı hesap gerekir." },
        { question: "Hangi astroloji sistemi kullanılıyor?", answer: "Yaygın tropikal Batı astrolojisi tarih aralıkları kullanılır." },
        { question: "Burç bilimsel bir tahmin midir?", answer: "Hayır. Burç sonucu eğlence ve genel bilgi amaçlıdır; bilimsel kişilik veya gelecek tahmini olarak değerlendirilmemelidir." },
        { question: "Sınır tarihlerinde sonuç neden farklı olabilir?", answer: "Güneş’in burç değiştirdiği kesin saat her yıl değişebilir; zaman dilimi ve doğum yeri önemlidir." },
        { question: "Doğum tarihim kaydediliyor mu?", answer: "Hayır. Burç hesabı tarayıcıda yapılır." }
      ],
      lastUpdated: updated,
      sources: [source("NASA – Sun and seasons", "https://science.nasa.gov/sun/", "Astronomik mevsimler ve Güneş hareketi hakkında genel bilgi; astrolojik yorum bilimsel iddia değildir.")]
    }
  }
];

export const educationHealthTools: ToolDefinition[] = [...examTools, ...otherTools];
