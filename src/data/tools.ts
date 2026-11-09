import { tcmbCurrencies } from "../lib/exchange-rates";

export type CategoryId = "finans" | "tarih" | "egitim" | "gunluk-yasam";
export type FieldDefinition = {
  name: string;
  label: string;
  type: "number" | "date" | "select" | "text";
  placeholder?: string;
  unit?: string;
  help?: string;
  showWhen?: { field: string; value: string | string[] };
  options?: { label: string; value: string }[];
};
export type CalculatorMode =
  | "percentage"
  | "grade-list"
  | "course-list"
  | "weighted-list"
  | "gpa-list"
  | "exam-net"
  | "loan-plan"
  | "currency"
  | "electricity"
  | "marketplace-profit"
  | "unit-price"
  | "monthly-savings"
  | "trip-cost"
  | "dimensional-weight"
  | "unified-gpa"
  | "salary-increase"
  | "salary-payroll"
  | "unit-conversion";
export type CalculatorPageContent = {
  definition: string;
  steps: string[];
  examples: { title: string; calculation: string; result: string }[];
  referenceTable?: { caption: string; headers: string[]; rows: string[][] };
  faqs: { question: string; answer: string }[];
  lastUpdated: string;
  sources: { name: string; url?: string; note?: string }[];
};
export type ToolDefinition = {
  id: string;
  name: string;
  category: CategoryId;
  description: string;
  title: string;
  metaDescription: string;
  intro: string;
  formula: string;
  example: string;
  fields: FieldDefinition[];
  content?: CalculatorPageContent;
  createdAt?: string;
  mode?: CalculatorMode;
  popular?: boolean;
};
export type ToolSummary = Pick<ToolDefinition, "id" | "name" | "category" | "description" | "createdAt">;

export function isRecentlyAdded(tool: Pick<ToolDefinition, "createdAt">, now = new Date()): boolean {
  if (!tool.createdAt) return false;
  const createdAt = Date.parse(tool.createdAt);
  const age = now.getTime() - createdAt;
  return Number.isFinite(createdAt) && age >= 0 && age < 14 * 24 * 60 * 60 * 1000;
}

export const categories: { id: CategoryId; name: string; href: string; description: string }[] = [
  { id: "finans", name: "Finans", href: "/finans", description: "Bütçe, maaş, vergi ve alışveriş hesaplamaları." },
  { id: "tarih", name: "Tarih", href: "/tarih", description: "Yaş, gün farkı ve tarih planlama araçları." },
  { id: "egitim", name: "Eğitim", href: "/egitim", description: "Not, sınav ve başarı hesaplamaları." },
  { id: "gunluk-yasam", name: "Günlük Yaşam", href: "/gunluk-yasam", description: "Ölçü, dönüşüm ve günlük ihtiyaç araçları." }
];

const numberField = (
  name: string,
  label: string,
  placeholder: string,
  unit?: string,
  help?: string,
  showWhen?: FieldDefinition["showWhen"]
): FieldDefinition => ({ name, label, type: "number", placeholder, unit, help, showWhen });
const dateField = (name: string, label: string): FieldDefinition => ({ name, label, type: "date" });
const textField = (name: string, label: string, placeholder: string, help?: string): FieldDefinition =>
  ({ name, label, type: "text", placeholder, help });
const selectField = (name: string, label: string, options: FieldDefinition["options"]): FieldDefinition =>
  ({ name, label, type: "select", options });

const letterGradeOptions = [
  { label: "Harf notu seçin", value: "" },
  { label: "AA (4,00)", value: "AA" },
  { label: "BA (3,50)", value: "BA" },
  { label: "BB (3,00)", value: "BB" },
  { label: "CB (2,50)", value: "CB" },
  { label: "CC (2,00)", value: "CC" },
  { label: "DC (1,50)", value: "DC" },
  { label: "DD (1,00)", value: "DD" },
  { label: "FD (0,50)", value: "FD" },
  { label: "FF (0,00)", value: "FF" }
];

const toolCatalog: ToolDefinition[] = [
  {
    id: "yuzde-hesaplama", name: "Yüzde hesaplama", category: "finans", popular: true,
    description: "Bir tutarın belirli bir yüzdeye karşılık gelen değerini bulun.",
    title: "Yüzde Hesaplama – Bir Sayının Yüzdesini Bulun | PratikHesap",
    metaDescription: "Bir sayının yüzdesini, iki değer arasındaki oranı veya değişimi; yüzde ekleme ve çıkarma işlemlerini tek araçta hesaplayın.",
    intro: "Yüzde aracı beş işlemi destekler: bir sayının yüzdesi, bir değerin başka bir değere oranı, iki değer arasındaki yüzde değişim, yüzde ekleme ve yüzde çıkarma.",
    formula: "Yüzde tutarı = A × B ÷ 100. Oran = A ÷ B × 100. Değişim = (Bitiş − Başlangıç) ÷ |Başlangıç| × 100. İki değer arasındaki yüzde fark = |A − B| ÷ ((|A| + |B|) ÷ 2) × 100.",
    example: "2.000'in %15'i 300'dür. 100'den 125'e değişim %25 artış; 40 ile 60 arasındaki yüzde fark ise %40'tır.",
    content: {
      definition: "Yüzde, bir bütünü 100 eşit parçaya ayırdığımızda bu parçalardan kaçının söz konusu olduğunu anlatan bir gösterimdir. “%25” ifadesi, bütünün dörtte biriyle aynı oranı belirtir. Yüzdeler fiyat indirimi ve artışını karşılaştırırken, bir değerin toplam içindeki payını bulurken ya da iki ölçüm arasındaki değişimi ifade ederken kullanılır. Bu hesaplayıcı tek bir işleme bağlı kalmaz: seçilen moda göre bir sayının yüzde tutarını, bir değerin başka bir değerin yüzde kaçı olduğunu, başlangıçtan bitişe yüzde değişimi ve yüzde ekleme veya çıkarma sonrasındaki değeri hesaplar. Her modun istediği girdiler farklı olduğu için önce işlem türünü seçin. Yüzde değişiminde başlangıç değeri referans alınır; başlangıç sıfırsa oran matematiksel olarak tanımsızdır. Araç, para alanlarında görünse de genel sayılarla da kullanılabilir. Sonuç, girilen değerlerin aritmetik karşılığıdır; tek başına fiyat, ücret veya resmî bir oran hakkında hüküm vermez. Karşılaştırma yaparken aynı ölçü birimini ve aynı başlangıç koşullarını kullanmak önemlidir. Bir yüzde tutarı ile yüzde puanı aynı şey değildir: örneğin %20'den %25'e geçiş beş yüzde puanlık, başlangıç oranına göreyse %25'lik göreli artıştır. Aracın değişim modu ikinci türden, başlangıç değerine bağlı hesabı verir. Bu ayrım, anket oranları veya performans verileri yorumlanırken yanlış çıkarım yapmayı önlemeye yardımcı olur.",
      steps: [
        "Önce açılır listeden yapmak istediğiniz işlemi seçin; gerekli giriş alanları buna göre görüntülenir.",
        "İstenen sayı, taban, başlangıç veya bitiş değerlerini girin. Ondalıklar için virgül kullanabilirsiniz.",
        "Hesapla düğmesine basın. Sonuçla birlikte işlem türüne uygun kısa formül açıklaması gösterilir."
      ],
      examples: [
        { title: "Bir sayının yüzdesini bulma", calculation: "2.400 × 15 ÷ 100", result: "2.400 sayısının %15'i 360'tır." },
        { title: "Bir değerin toplam içindeki payı", calculation: "45 ÷ 180 × 100", result: "45, 180'in %25'idir." }
      ],
      faqs: [
        { question: "Bir sayının yüzdesi nasıl bulunur?", answer: "Sayıyı yüzde oranıyla çarpıp 100'e bölün. Örneğin 2.400'ün %15'i 2.400 × 15 ÷ 100 = 360 eder." },
        { question: "Bir değer diğerinin yüzde kaçı nasıl hesaplanır?", answer: "Pay olan değeri taban değere bölüp 100 ile çarpın. Taban sıfır olamaz; sıfıra bölme tanımsızdır." },
        { question: "Yüzde artış ve azalış arasındaki fark nedir?", answer: "İkisi de seçilen başlangıç değerine göre hesaplanır. Bitiş başlangıçtan büyükse artış, küçükse azalış olarak gösterilir." },
        { question: "Bir sayıya yüzde eklemek için hangi işlem yapılır?", answer: "Önce sayının yüzde tutarı bulunur, sonra bu tutar ilk sayıya eklenir. Örneğin 200'e %10 eklenince 220 olur." },
        { question: "Yüzde çıkarma işlemi nasıl yapılır?", answer: "Yüzde tutarı ilk değerden çıkarılır. Örneğin 200'den %10 çıkarıldığında sonuç 180 olur." },
        { question: "Başlangıç değeri sıfırsa yüzde değişim bulunabilir mi?", answer: "Hayır. Değişim formülünde başlangıç değeri paydaya geldiğinden sıfır başlangıç için yüzde değişim tanımlı değildir." }
      ],
      lastUpdated: "2026-11-05",
      sources: [{ name: "Yüzde işlemleri için temel aritmetik formülleri", note: "Sonuçlar girilen değerlere dayanır; haricî veri kullanılmaz." }]
    },
    mode: "percentage",
    fields: [
      selectField("operation", "Hesaplama türü", [
        { label: "A sayısının %B'si", value: "of" },
        { label: "A, B'nin yüzde kaçı?", value: "share" },
        { label: "Başlangıçtan bitişe yüzde artış / azalış", value: "change" },
        { label: "İki sayı arasındaki yüzde fark", value: "difference" },
        { label: "A'ya yüzde ekle", value: "add" },
        { label: "A'dan yüzde çıkar", value: "subtract" }
      ]),
      numberField("amount", "Sayı (A)", "Örn. 2000", "₺", undefined, { field: "operation", value: ["of", "share", "add", "subtract"] }),
      numberField("percent", "Yüzde oranı (B)", "Örn. 15", "%", undefined, { field: "operation", value: ["of", "add", "subtract"] }),
      numberField("base", "Taban sayı (B)", "Örn. 2000", "₺", undefined, { field: "operation", value: "share" }),
      numberField("start", "Başlangıç değeri (A)", "Örn. 100", "₺", undefined, { field: "operation", value: "change" }),
      numberField("end", "Bitiş değeri (B)", "Örn. 125", "₺", undefined, { field: "operation", value: ["change", "difference"] })
    ]
  },
  {
    id: "maas-zam-artis-hesaplama", name: "Maaş zam ve artış hesaplama", category: "finans", popular: true,
    description: "Yüzde zam veya sabit artış tutarıyla yeni maaşınızı hesaplayın.",
    title: "Maaş Zam ve Artış Hesaplama – Yeni Maaş | PratikHesap",
    metaDescription: "Maaşınıza yüzde zam ya da sabit tutarlı artış uygulayın; artış miktarını ve yeni maaşınızı anında hesaplayın.",
    intro: "Yüzde zam oranını veya maaşınıza eklenecek sabit tutarı seçerek zam miktarını, yeni ücreti ve artış oranını hesaplayın. Vergi ve bordro kesintileri hesaplanmaz.",
    formula: "Yüzde zam: yeni maaş = maaş × (1 + oran ÷ 100). Sabit artış: yeni maaş = maaş + artış tutarı.",
    example: "30.000 TL maaşa %20 zam uygulanırsa yeni tutar 36.000 TL; 5.000 TL sabit artışta 35.000 TL olur.",
    content: {
      definition: "Maaş zam ve artış hesaplama, ücretteki değişikliği iki yaygın biçimde değerlendirmeye yarar: mevcut maaşa belirli bir yüzde uygulamak veya maaşa sabit bir tutar eklemek. Yüzde yöntemiyle zam tutarı mevcut maaş ile oran çarpılıp 100'e bölünerek bulunur; ardından tutar maaşa eklenir. Sabit artış yönteminde eklenecek miktar doğrudan mevcut ücrete eklenir ve artış yüzdesi, ek tutarın başlangıç maaşına oranından hesaplanır. Bu araç yalnızca aritmetik işlem yapar; brüt ve net ücreti birbirinden ayırmaz, vergi veya sigorta kesintisi uygulamaz, zam hakkı ya da yürürlük tarihi belirlemez. Sonucu doğru yorumlamak için girdiğiniz maaşın aylık mı yıllık mı olduğunu ve brüt mü net mi olduğunu not edin; karşılaştırmada aynı ücret türünü ve dönemi kullanın. Oran veya tutar, sözleşme ya da işveren tarafından belirlenen koşullara göre seçilmelidir. Birden fazla dönemde farklı zamlar varsa her artış bir önceki yeni maaş üzerinden ayrı ayrı uygulanır; oranları doğrudan toplamak aynı sonucu vermeyebilir. Bordro ve yasal kesintiler için bu hesaplayıcının sonucunu resmi maaş bordrosu olarak değerlendirmeyin.",
      steps: [
        "Artış türü alanından yüzde zam veya sabit tutarlı artış seçin.",
        "Mevcut maaşı ve seçtiğiniz yönteme karşılık gelen oranı ya da tutarı girin.",
        "Yeni maaş, zam tutarı ve artış oranı otomatik olarak hesaplanır; sonuç girilen maaş türüyle aynı bazdadır."
      ],
      examples: [
        { title: "Yüzde oranıyla zam", calculation: "30.000 × 20 ÷ 100 = 6.000 TL artış; 30.000 + 6.000", result: "Yeni maaş 36.000 TL olur." },
        { title: "Sabit tutarlı artış", calculation: "25.000 + 5.000 = 30.000 TL; 5.000 ÷ 25.000 × 100", result: "Yeni maaş 30.000 TL, artış oranı %20 olur." }
      ],
      faqs: [
        { question: "Yüzde maaş zammı nasıl hesaplanır?", answer: "Mevcut maaşı zam oranıyla çarpıp 100'e bölün. Zam tutarını mevcut maaşa ekleyerek yeni tutarı bulun." },
        { question: "Sabit tutarlı maaş artışı hesaplanabilir mi?", answer: "Evet. Artış türünde sabit tutarı seçip maaşa eklenecek miktarı girin; araç yeni maaşı ve oranı gösterir." },
        { question: "Araç brüt ve net maaş farkını hesaplıyor mu?", answer: "Hayır. Vergi, sigorta primi ve bordro kesintisi uygulamadan girdiğiniz miktara aritmetik artış yapar." },
        { question: "Maaşım 30.000 TL ve zam oranı %20 ise yeni maaşım kaç olur?", answer: "Zam tutarı 6.000 TL, hesaplanan yeni maaş 36.000 TL olur." },
        { question: "Birden fazla zammı birlikte hesaplar mı?", answer: "Hayır. Her işlem tek bir artış içindir. Birden fazla artışta sonraki oranı önceki artıştan sonraki tutara uygulayın." },
        { question: "Hesaplanan tutar bordromdaki ödemeyle aynı olur mu?", answer: "Mutlaka değil. Bordro tutarı kesinti ve kişisel koşullara bağlıdır; bu araç bordro hesabı yapmaz." }
      ],
      lastUpdated: "2026-11-05",
      sources: [{ name: "Yüzde ve toplama işlemleri için temel aritmetik formülleri", note: "Mevzuat, ücret politikası veya bordro verisi kullanılmaz." }]
    },
    mode: "salary-increase",
    fields: [
      selectField("increaseType", "Artış türü", [
        { label: "Yüzde oranıyla zam", value: "percent" },
        { label: "Sabit tutarlı artış", value: "fixed" }
      ]),
      numberField("salary", "Mevcut maaş", "Örn. 30000", "₺"),
      numberField("percent", "Zam oranı", "Örn. 20", "%", undefined, { field: "increaseType", value: "percent" }),
      numberField("increase", "Artış tutarı", "Örn. 5000", "₺", undefined, { field: "increaseType", value: "fixed" })
    ]
  },
  {
    id: "indirim-hesaplama", name: "İndirim hesaplama", category: "finans", popular: true,
    description: "İndirim oranından sonra ödeyeceğiniz fiyatı görün.",
    title: "İndirim Hesaplama – İndirimli Fiyatı Bulun | PratikHesap",
    metaDescription: "Ürün fiyatı ve indirim yüzdesini girin; indirim tutarını ve indirim sonrası ödeyeceğiniz fiyatı hemen öğrenin.",
    intro: "Bir ürünün indirim sonrası fiyatını ve cebinizde kalacak tutarı hesaplayın. İndirim oranı yüzde olarak girilir.",
    formula: "İndirim tutarı = Etiket fiyatı × İndirim oranı ÷ 100; indirimli fiyat = Etiket fiyatı − indirim tutarı",
    example: "1.000 TL'lik üründe %25 indirim 250 TL'dir; indirimli fiyat 750 TL olur.",
    fields: [numberField("amount", "Ürün fiyatı", "Örn. 1000", "₺"), numberField("percent", "İndirim oranı", "Örn. 25", "%")]
  },
  {
    id: "kdv-hesaplama", name: "KDV hesaplama", category: "finans",
    description: "KDV oranı girerek dahil fiyatı veya dahil fiyattan KDV tutarını bulun.",
    title: "KDV Hesaplama – KDV Dahil ve Hariç Fiyat | PratikHesap",
    metaDescription: "KDV hariç fiyata vergi ekleyin veya KDV dahil fiyattan vergi tutarını ayırın. Oranı kendiniz girerek iki yönde KDV hesaplayın.",
    intro: "KDV oranını ve tutarı girip hesaplama yönünü seçin. KDV hariç tutara vergi ekleyebilir veya KDV dahil fiyattan KDV tutarıyla vergi hariç bedeli ayırabilirsiniz. Uygulanacak oranı işlem türünüze göre resmî kaynaklardan kontrol edin.",
    formula: "Hariç fiyattan dahil fiyat = Hariç tutar × (1 + KDV oranı ÷ 100). Dahil fiyattan hariç fiyat = Dahil tutar ÷ (1 + KDV oranı ÷ 100); KDV = Dahil tutar − Hariç tutar.",
    example: "1.000 TL KDV hariç tutara %20 eklenirse toplam 1.200 TL olur. 1.200 TL KDV dahil fiyattan %20 KDV ayrılırsa vergi hariç tutar 1.000 TL, KDV 200 TL'dir.",
    content: {
      definition: "Katma Değer Vergisi (KDV), mal teslimi ve hizmet ifası gibi işlemlerde mevzuat kapsamında hesaplanan dolaylı bir vergidir. Bir fiyatın “KDV hariç” olması, belirtilen tutara seçilen vergi oranının ayrıca ekleneceği anlamına gelir; “KDV dahil” fiyatta ise toplam tutarın içinde vergi payı zaten bulunur. Bu hesaplayıcı, kullanıcının girdiği oran ve tutara göre iki yönde işlem yapar: hariç tutara KDV ekleyerek toplamı bulur veya dahil toplamdan KDV payını ayırarak vergi hariç bedeli hesaplar. Dahil fiyattan vergi ayrılırken oranı toplam tutara doğrudan çarpmak doğru değildir; dahil tutar, 1 + oran/100 değerine bölünür. Araç yasal vergi oranını kendiliğinden seçmez, ürün veya hizmetin hangi orana tabi olduğunu belirlemez ve vergi beyannamesi hazırlamaz. Oranlar işlem türüne ve yürürlükteki mevzuata göre değişebileceği için işlem öncesinde Gelir İdaresi Başkanlığı (GİB) veya güncel resmî düzenlemeyi kontrol edin. Matrah, istisna ve özel uygulamalar işlem koşullarına göre farklılık gösterebilir; bu hesaplayıcı bu ayrıntıları değerlendirmez. Satış belgesinde fiyatın dahil veya hariç gösterilmesi de sonucun nasıl yorumlanacağını etkiler. Tablodaki yüzdeler kolay karşılaştırma için seçilmiş örnek oranlardır; yürürlükteki mevzuatın tamamını temsil etmez. Gerçek işlemde doğru oranı bulmak, işlemin niteliğine bağlı ayrı bir adımdır. Aşağıdaki tablo yalnızca matematiksel örnektir; oranların belirli bir satışta uygulanacağını göstermez.",
      steps: [
        "KDV hariç tutardan toplamı mı, yoksa KDV dahil toplamdan vergi payını mı bulacağınızı seçin.",
        "İşleme uygulanacak oranı yetkili ve güncel kaynaktan doğrulayıp oran alanına girin; araç yasal oran önermez.",
        "Tutarı girip Hesapla düğmesine basın. Sonuçta KDV tutarı ve diğer fiyat bileşenleri gösterilir."
      ],
      examples: [
        { title: "Hariç fiyata KDV ekleme", calculation: "2.500 TL × %10 = 250 TL KDV; 2.500 + 250", result: "Örnek oranla KDV dahil tutar 2.750 TL'dir." },
        { title: "Dahil fiyattan KDV ayırma", calculation: "1.200 TL ÷ 1,20 = 1.000 TL vergi hariç bedel; 1.200 − 1.000", result: "Örnek %20 oranla KDV payı 200 TL, vergi hariç bedel 1.000 TL'dir." }
      ],
      referenceTable: {
        caption: "1.000 TL vergi hariç tutar için örnek oranlarla matematiksel karşılıklar",
        headers: ["Örnek oran", "KDV tutarı", "Örnek dahil toplam"],
        rows: [
          ["%1", "10 TL", "1.010 TL"],
          ["%10", "100 TL", "1.100 TL"],
          ["%20", "200 TL", "1.200 TL"]
        ]
      },
      faqs: [
        { question: "KDV hariç fiyata KDV nasıl eklenir?", answer: "Tutar, 1 + oran/100 katsayısıyla çarpılır. Örneğin 1.000 TL'ye örnek olarak %20 uygulanırsa toplam 1.200 TL olur." },
        { question: "KDV dahil tutarın içindeki vergi nasıl bulunur?", answer: "Dahil tutarı 1 + oran/100 değerine bölerek vergi hariç bedeli bulun; dahil toplamdan bu bedeli çıkarınca KDV payı elde edilir." },
        { question: "Bu araç doğru KDV oranını kendisi seçiyor mu?", answer: "Hayır. Oranı kullanıcı girer. Mal veya hizmete uygulanacak güncel oranı GİB ve ilgili mevzuattan doğrulayın." },
        { question: "Tablodaki %1, %10 ve %20 her üründe geçerli midir?", answer: "Hayır. Bunlar yalnızca örnek tutar hesabıdır; hangi oranın uygulanacağını göstermez. İşleme özgü oranı güncel resmî kaynaktan kontrol edin." },
        { question: "KDV dahil fiyat 1.200 TL ve oran %20 ise vergi kaç TL'dir?", answer: "Bu örnek varsayımında vergi hariç bedel 1.000 TL, içindeki KDV 200 TL olur." },
        { question: "Hesaplama beyanname veya muhasebe danışmanlığı sağlar mı?", answer: "Hayır. Araç, girilen oranla aritmetik hesap yapar; istisna, matrah, beyan ve mevzuata ilişkin profesyonel değerlendirme sunmaz." }
      ],
      lastUpdated: "2026-11-05",
      sources: [{
        name: "Gelir İdaresi Başkanlığı (GİB)",
        url: "https://www.gib.gov.tr/",
        note: "İşleme uygulanacak güncel oran ve vergi uygulaması için resmî GİB kaynaklarını kontrol edin."
      }]
    },
    fields: [
      selectField("direction", "Hesaplama yönü", [
        { label: "KDV hariç tutardan dahil fiyatı hesapla", value: "excluded-to-included" },
        { label: "KDV dahil fiyattan KDV'yi ayır", value: "included-to-excluded" }
      ]),
      numberField("amount", "Tutar", "Örn. 1000", "₺"),
      numberField("rate", "KDV oranı", "Örn. 20", "%")
    ]
  },
  {
    id: "kar-zarar-hesaplama", name: "Kâr zarar hesaplama", category: "finans",
    description: "Alış ve satış fiyatı arasındaki kâr veya zarar tutarını bulun.",
    title: "Kâr Zarar Hesaplama – Kârınızı veya Zararınızı Bulun | PratikHesap",
    metaDescription: "Alış ve satış fiyatlarınızı karşılaştırarak kâr veya zarar tutarını ve alış fiyatına göre oranını hesaplayın.",
    intro: "Bir ürünün alış ve satış bedelini karşılaştırarak işlem sonucundaki kâr ya da zarar miktarını görün. Kâr/zarar oranı alış fiyatına göre hesaplanır.",
    formula: "Kâr veya zarar = Satış fiyatı − Alış fiyatı; oran = fark ÷ alış fiyatı × 100",
    example: "800 TL'ye alınıp 1.000 TL'ye satılan üründe 200 TL, yani alış fiyatına göre %25 kâr vardır.",
    fields: [numberField("cost", "Alış fiyatı", "Örn. 800", "₺"), numberField("sale", "Satış fiyatı", "Örn. 1000", "₺")]
  },
  {
    id: "maas-artis-hesaplama", name: "Maaş artış hesaplama", category: "finans",
    description: "Maaşa eklenecek tutarı ve artış oranını birlikte hesaplayın.",
    title: "Maaş Artış Hesaplama – Yeni Maaş ve Artış Oranı | PratikHesap",
    metaDescription: "Maaşınıza eklenecek sabit tutara göre yeni maaşınızı ve artışın yüzde oranını hesaplayın.",
    intro: "Yüzde yerine maaşınıza eklenecek net tutarı biliyorsanız bu araçla yeni maaşı ve artışın mevcut maaşınıza oranını bulun.",
    formula: "Yeni maaş = Mevcut maaş + Artış tutarı; artış oranı = Artış tutarı ÷ Mevcut maaş × 100",
    example: "25.000 TL maaşa 5.000 TL eklendiğinde yeni maaş 30.000 TL, artış oranı %20 olur.",
    fields: [numberField("salary", "Mevcut maaş", "Örn. 25000", "₺"), numberField("increase", "Artış tutarı", "Örn. 5000", "₺")]
  },
  {
    id: "brut-net-maas-hesaplama", name: "Brüt-net maaş hesaplama", category: "finans", popular: true, createdAt: "2026-11-05T12:41:14+03:00",
    description: "Brüt-net bordro kapsamını, 2026 resmî kaynaklarını ve doğrulama durumunu inceleyin.",
    title: "Brüt Net Maaş Hesaplama 2026 – 12 Aylık Bordro | PratikHesap",
    metaDescription: "Brüt-net maaş hesabında gereken 2026 resmî parametrelerini ve kaynaklarını görün. Doğrulanmamış veriler tahmin edilmediği için hesaplama geçici olarak kapalıdır.",
    intro: "Bu araç için brüt/net yönü, aylık/yıllık ücret, çalışma ayı ve engellilik indirimi alanları hazırlandı. Yanlış bordro sonucu vermemek için 2026 gelir vergisi dilimleri, SGK tavanı ve asgari ücret vergi istisnalarının hesap yöntemleri resmî kaynakta doğrulanana kadar hesaplama kapalıdır.",
    formula: "Net ücret = brüt ücret − SGK işçi primi − işsizlik sigortası işçi primi − gelir vergisi (asgari ücret istisnası sonrası) − damga vergisi (asgari ücret istisnası sonrası). İşveren maliyeti = brüt ücret + işveren SGK primi + işveren işsizlik primi. Gelir vergisi kümülatif matraha göre hesaplanır.",
    example: "Araç, girilen aylık brüt tutardan ay ay yasal kesintileri ve istisnaları düşerek tahmini neti bulur. Netten brüte modunda ise girilen net tutarı sağlayan brütü her ayın kümülatif vergi matrahına göre çözer.",
    content: {
      definition: "Brüt maaş, iş sözleşmesinde veya ücret bildiriminde kesintiler yapılmadan önce belirtilen ücrettir; net maaş ise yasal kesintiler ve uygulanabilen istisnalar sonrasında çalışana kalan tutardır. Brüt ile net arasındaki fark yalnızca tek bir sabit oran değildir. SGK işçi primi, işsizlik sigortası primi, gelir vergisi tarifesi, damga vergisi, asgari ücret istisnası ve yıl içinde biriken vergi matrahı sonucu etkiler. Bu nedenle aynı brüt ücretin net karşılığı yılın her ayında aynı olmayabilir: kümülatif vergi matrahı arttıkça ücretin bir bölümü üst vergi dilimine geçebilir. Bu araç, seçtiğiniz yönde (brütten nete veya netten brüte) aylık ya da yıllık tutarı alır; yıllık tutarı 12 aya eşit dağıtır, seçtiğiniz çalışma ayı için aylık kesinti dökümünü öne çıkarır ve yılın 12 ayını tablo halinde gösterir. Engellilik indirimi derecesi isteğe bağlıdır; seçilmediğinde indirim uygulanmaz. Hesaplama, temel tam ay ücret senaryosuna dayanır ve sendika aidatı, özel sigorta, teşvik, ek ödeme, icra, kıdem/ihbar, kısmi çalışma veya kişiye özel bordro unsurlarını içermez. Mevzuat ya da çalışanın durumu farklıysa bordrodaki tutar değişebilir. Sonuç tahminidir; resmi bordro, vergi danışmanlığı veya işveren beyanı yerine geçmez. Parametreler yıl ve kaynak bilgisiyle saklanır; hesaplama yılını ve geçerlilik tarihini kontrol ederek sonucu yorumlayın.",
      steps: [
        "Brütten nete veya netten brüte hesaplama yönünü seçin; tutarın aylık mı yıllık mı olduğunu belirtin.",
        "Maaş tutarını girin, yıl içindeki çalışma ayını seçin ve varsa engellilik indirimi derecesini belirtin.",
        "Seçilen ayın kesinti dökümünü ve kümülatif matrahı, ardından SGK, vergi, istisna, net ve işveren maliyeti sütunlarını içeren 12 aylık tabloyu inceleyin."
      ],
      examples: [
        { title: "Aylık brüt ücretten nete", calculation: "Brüt ücret − SGK işçi primi − işsizlik primi − istisna sonrası vergiler", result: "Hesaplama, eksik 2026 bordro parametreleri resmî kaynaklardan doğrulandıktan sonra etkinleştirilecektir." },
        { title: "Yıllık net hedeften brüte", calculation: "Yıllık net hedef ÷ 12 = aylık net hedef; kümülatif vergi matrahı dikkate alınır", result: "Yıllık çizelge ve netten brüte çözüm mantığı hazırdır; doğrulanmayan verilerle sonuç üretilmez." }
      ],
      faqs: [
        { question: "Brüt maaştan net maaş nasıl hesaplanır?", answer: "Brüt ücretten SGK ve işsizlik işçi primleri ile istisnalar sonrası gelir ve damga vergileri düşülür. Gelir vergisi kümülatif matraha bağlı olduğundan aylar arasında değişebilir." },
        { question: "Netten brüte hesaplama kesin bordro tutarını verir mi?", answer: "Hayır. Araç, seçilen temel senaryoda hedef nete karşılık gelen brütü yaklaşıklar. Ek ödemeler, teşvikler, özel kesintiler ve işyeri bordro uygulamaları sonucu değiştirebilir." },
        { question: "Kümülatif vergi matrahı neden önemlidir?", answer: "Gelir vergisi tarifesi yıl içindeki birikimli matraha uygulanır. Matrah ilerledikçe ücretin bir bölümü üst vergi dilimine geçebilir ve net ücret etkilenebilir." },
        { question: "Engellilik indirimi hangi durumda seçilmelidir?", answer: "Yalnızca mevzuata göre ilgili indirimden yararlanma hakkınız varsa derecenizi seçin. Araç belge veya hak sahipliği doğrulamaz; uygunluğu işvereniniz ya da yetkili resmî kaynakla kontrol edin." },
        { question: "Asgari ücret istisnası tüm ücretlerden düşülür mü?", answer: "Hesaplama, yapılandırılmış yıl parametreleri kapsamında gelir ve damga vergisi istisnasını uygular; istisna kesintiyi sıfırlamakla sınırlıdır ve net ödemeyi aşan bir vergi iadesi oluşturmaz." },
        { question: "İşveren maliyeti hangi kalemleri içerir?", answer: "Brüt ücret ile yapılandırılmış oranlara göre hesaplanan işveren SGK ve işsizlik primlerini içerir. Teşvik, yan hak, fazla mesai ve diğer işveren giderleri dahil değildir." },
        { question: "Hesaplama resmî bordro veya vergi danışmanlığı yerine geçer mi?", answer: "Hayır. Etkinleştirildiğinde de sonuç bilgilendirme amaçlı bir tahmin olacaktır. Kesin bordro ve kişisel durumunuz için işveren bordro birimine veya yetkin bir uzmana başvurun." },
        { question: "Hesaplama neden şu an kullanılamıyor?", answer: "Yanlış sonuç göstermemek için SGK prime esas kazanç üst sınırı, ücret gelirleri vergi dilimleri ile asgari ücret gelir ve damga vergisi istisnalarının hesap yöntemleri resmî kaynakta doğrulanana kadar hesaplama kapalı tutuluyor." }
      ],
      lastUpdated: "2026-11-05",
      sources: [
        { name: "Gelir İdaresi Başkanlığı – Gelir vergisi tarifesi", url: "https://www.gib.gov.tr/yardim-ve-kaynaklar/yararli-bilgiler/gelir-vergisi-tarifesi", note: "Yıllık ücret gelir vergisi tarifesi ve istisna uygulamasının resmî açıklamaları." },
        { name: "Sosyal Güvenlik Kurumu", url: "https://www.sgk.gov.tr/", note: "SGK prim oranları ile prime esas kazanç alt ve üst sınırları." },
        { name: "Çalışma ve Sosyal Güvenlik Bakanlığı – Asgari ücretin net hesabı ve işverene maliyeti", url: "https://www.csgb.gov.tr/poco-pages/asgari-ucret/", note: "2026 dönemi asgari ücret tutarı ve indirimsiz işveren prim oranı." }
      ]
    },
    mode: "salary-payroll",
    fields: [
      selectField("direction", "Hesaplama yönü", [
        { label: "Brütten nete", value: "gross-to-net" },
        { label: "Netten brüte", value: "net-to-gross" }
      ]),
      selectField("period", "Ücret dönemi", [
        { label: "Aylık", value: "monthly" },
        { label: "Yıllık", value: "annual" }
      ]),
      numberField("amount", "Maaş tutarı", "Örn. 50000", "₺"),
      selectField("month", "Çalışma ayı", [
        { label: "Ocak", value: "1" },
        { label: "Şubat", value: "2" },
        { label: "Mart", value: "3" },
        { label: "Nisan", value: "4" },
        { label: "Mayıs", value: "5" },
        { label: "Haziran", value: "6" },
        { label: "Temmuz", value: "7" },
        { label: "Ağustos", value: "8" },
        { label: "Eylül", value: "9" },
        { label: "Ekim", value: "10" },
        { label: "Kasım", value: "11" },
        { label: "Aralık", value: "12" }
      ]),
      selectField("disabilityDegree", "Engellilik indirimi", [
        { label: "Yok", value: "none" },
        { label: "1. derece", value: "1" },
        { label: "2. derece", value: "2" },
        { label: "3. derece", value: "3" }
      ])
    ]
  },
  {
    id: "yas-hesaplama", name: "Yaş hesaplama", category: "tarih", popular: true,
    description: "Doğum tarihinize göre tamamlanmış yaşınızı hesaplayın.",
    title: "Yaş Hesaplama – Doğum Tarihine Göre Yaşınızı Öğrenin | PratikHesap",
    metaDescription: "Doğum tarihinizi seçin ve bugün itibarıyla tamamlanmış yaşınızı ücretsiz hesaplayın.",
    intro: "Doğum tarihinizden bugüne kadar tamamladığınız yıl sayısını bulun. Hesaplama, içinde bulunulan yılın henüz gelmemiş doğum gününü dikkate alır. 29 Şubat doğumlular için artık olmayan yıllarda 28 Şubat esas alınır.",
    formula: "Yaş = İçinde bulunulan yıl − doğum yılı; doğum günü henüz gelmediyse sonuçtan 1 çıkarılır. 29 Şubat doğumlular için artık olmayan yıllarda 28 Şubat doğum günü kabul edilir.",
    example: "1990 yılında doğan bir kişinin 2025 doğum günü geldiyse yaşı 35, gelmediyse 34'tür.",
    fields: [dateField("birthDate", "Doğum tarihi")]
  },
  {
    id: "iki-tarih-arasi-gun-hesaplama", name: "İki tarih arası gün hesaplama", category: "tarih", popular: true,
    description: "İki takvim tarihi arasındaki gün farkını öğrenin.",
    title: "İki Tarih Arası Gün Hesaplama – Gün Farkını Bulun | PratikHesap",
    metaDescription: "Başlangıç ve bitiş tarihini seçerek iki tarih arasında kaç gün olduğunu hızlıca hesaplayın.",
    intro: "İki tarih arasındaki takvim günü farkını bulun. Başlangıç ve bitiş sırasından bağımsız olarak pozitif gün sayısı verilir; iki uç tarih ayrıca sayılmaz.",
    formula: "Gün farkı = İki tarihin UTC zaman damgaları farkının 86.400.000 milisaniyeye bölümü",
    example: "1 Mart ile 8 Mart arasındaki fark 7 gündür.",
    fields: [dateField("startDate", "Başlangıç tarihi"), dateField("endDate", "Bitiş tarihi")]
  },
  {
    id: "tarihe-gun-ekleme", name: "Tarihe gün ekleme", category: "tarih",
    description: "Bir tarihe ekleyeceğiniz gün sayısından yeni tarihi bulun.",
    title: "Tarihe Gün Ekleme – İleri Tarihi Hesaplayın | PratikHesap",
    metaDescription: "Başlangıç tarihine gün sayısı ekleyerek oluşan yeni tarihi kolayca hesaplayın.",
    intro: "Bir başlangıç tarihinden belirli sayıda gün sonrasını hesaplayın. Takvim geçişleri ve artık yıllar otomatik olarak dikkate alınır.",
    formula: "Yeni tarih = Başlangıç tarihi + Girilen tam gün sayısı",
    example: "10 Nisan tarihine 20 gün eklendiğinde sonuç 30 Nisan olur.",
    fields: [dateField("date", "Başlangıç tarihi"), numberField("days", "Eklenecek gün", "Örn. 20", "gün")]
  },
  {
    id: "tarihten-gun-cikarma", name: "Tarihten gün çıkarma", category: "tarih",
    description: "Bir tarihten gün çıkararak önceki tarihi hesaplayın.",
    title: "Tarihten Gün Çıkarma – Önceki Tarihi Hesaplayın | PratikHesap",
    metaDescription: "Bir tarihten çıkarılacak gün sayısını girin ve geriye doğru oluşan tarihi bulun.",
    intro: "Belirlediğiniz gün sayısı kadar geriye giderek yeni tarihi bulun. Ay ve yıl değişiklikleri takvim kurallarına göre hesaplanır.",
    formula: "Yeni tarih = Başlangıç tarihi − Girilen tam gün sayısı",
    example: "10 Nisan tarihinden 10 gün çıkarıldığında sonuç 31 Mart olur.",
    fields: [dateField("date", "Başlangıç tarihi"), numberField("days", "Çıkarılacak gün", "Örn. 10", "gün")]
  },
  {
    id: "dogum-gunune-kalan-sure", name: "Doğum gününe kalan süre", category: "tarih",
    description: "Bir sonraki doğum gününüze kaç gün kaldığını öğrenin.",
    title: "Doğum Gününe Kalan Süre – Kaç Gün Kaldı? | PratikHesap",
    metaDescription: "Doğum tarihinizi girin; sıradaki doğum gününüze kalan gün sayısını ücretsiz hesaplayın.",
    intro: "Doğum tarihinizi seçin ve bir sonraki doğum gününüze kalan takvim gününü öğrenin. Bugün doğum gününüzse sonuç sıfır gündür. 29 Şubat doğumlular için artık olmayan yıllarda 28 Şubat esas alınır.",
    formula: "Kalan gün = Bir sonraki doğum günü − Bugünün tarihi",
    example: "Bir sonraki doğum gününüz 20 gün sonraysa araç 20 gün sonucunu verir.",
    fields: [dateField("birthDate", "Doğum tarihi")]
  },
  {
    id: "gebelik-haftasi-hesaplama", name: "Gebelik haftası hesaplama", category: "gunluk-yasam",
    description: "Son adet tarihine göre yaklaşık gebelik haftasını ve tahmini doğum tarihini bulun.",
    title: "Gebelik Haftası Hesaplama – Son Adet Tarihine Göre | PratikHesap",
    metaDescription: "Son adet tarihinizi girerek yaklaşık gebelik haftanızı ve 280 günlük hesaba dayalı tahmini doğum tarihinizi öğrenin.",
    intro: "Son adetinizin ilk gününden bugüne geçen süreyi hafta ve gün olarak gösterir; 280 günlük takvim hesabıyla tahmini doğum tarihini verir. Bu basit tarih hesabı klinik değerlendirme değildir.",
    formula: "Yaklaşık gebelik yaşı = Son adet tarihinden bugüne geçen gün ÷ 7; tahmini doğum tarihi = Son adet tarihine 280 gün ekle.",
    example: "Son adet tarihinden 63 gün geçtiyse bu hesaplama yaklaşık 9 hafta olarak gösterir. Tahmini doğum tarihi 280 gün sonrasına göre hesaplanır.",
    fields: [dateField("lastPeriod", "Son adet tarihinin ilk günü")]
  },
  {
    id: "not-ortalamasi-hesaplama", name: "Not ortalaması hesaplama", category: "egitim", popular: true,
    description: "İki sınav notunuzun basit aritmetik ortalamasını bulun.",
    title: "Not Ortalaması Hesaplama – Sınav Notu Ortalamanızı Bulun | PratikHesap",
    metaDescription: "İki sınav notunuzu girerek 100 üzerinden basit not ortalamanızı hesaplayın.",
    intro: "İki veya daha fazla not ekleyerek basit aritmetik ortalamayı bulun. En fazla 30 not girebilirsiniz; bu hesaplama okulun ağırlıklı not yönetmeliğini uygulamaz.",
    formula: "Not ortalaması = Girilen notların toplamı ÷ not sayısı",
    example: "70, 80 ve 90 notlarının ortalaması (70 + 80 + 90) ÷ 3 = 80 puandır.",
    content: {
      definition: "Not ortalaması, birden fazla puanı tek bir özet değerde toplamak için kullanılan aritmetik ölçüdür. Bu araç girilen notları toplar ve not sayısına böler; tüm notların eşit ağırlıklı olduğunu varsayar. Örneğin üç sınavın her biri dönem sonucunda aynı etkiye sahipse basit ortalama genel görünüm sağlayabilir. Ancak okulunuz sınavlara farklı katsayı veriyorsa, dersleri kredi veya saatle ağırlıklandırıyorsa ya da proje ve katılım puanlarını ayrıca hesaba katıyorsa bu basit sonuç resmî ders notunuzla aynı olmayabilir. Bu sayfada en fazla 30 sayısal not girilebilir; boş bırakılan satırlar hesaba katılmaz ve geçerli notların 0 ile 100 arasında olması gerekir. Harf notu, 4’lük sistem veya kurumun dönem sonu kuralı bu aracın kapsamına dahil değildir. Resmî başarı durumunuzu öğrenmek için okulunuzun değerlendirme ölçütlerini ve öğrenci bilgi sistemindeki sonucu esas alın. Hesaplayıcıyı farklı not senaryolarını karşılaştırmak veya eşit ağırlıklı bir ortalamayı hızlıca kontrol etmek için kullanabilirsiniz. Bir notun genel başarı içindeki etkisini yorumlarken değerlendirmelerin ağırlığını, geçme koşullarını ve varsa telafi sınavı kuralını ayrıca inceleyin. Ders ortalaması ile dönem veya genel not ortalaması farklı kapsamları anlatabilir; tek derse ait birkaç puanın sonucu tüm dersleri kapsayan GANO gibi değerlendirilmemelidir. Bu araç yalnızca ekrana yazdığınız notların eşit ağırlıklı ortalamasını verir ve öğrenci kayıtlarınıza erişmez.",
      steps: [
        "Ortalamaya dahil etmek istediğiniz notları ayrı satırlara girin; gerekirse Satır ekle ile yeni not alanları açın.",
        "Boş bırakacağınız notları tamamlamanız gerekmez; araç yalnızca girilen geçerli notları sayar.",
        "Hesapla düğmesine basın. Araç notların toplamını geçerli not sayısına böler."
      ],
      examples: [
        { title: "Üç eşit ağırlıklı sınav", calculation: "(70 + 80 + 90) ÷ 3 = 240 ÷ 3", result: "Basit not ortalaması 80 puandır." },
        { title: "İki farklı puan", calculation: "(65 + 95) ÷ 2 = 160 ÷ 2", result: "İki not eşit ağırlıklı kabul edildiğinde ortalama 80 puandır." }
      ],
      faqs: [
        { question: "Not ortalaması nasıl hesaplanır?", answer: "Girilen notların toplamını geçerli not sayısına bölün. Bu araç her notu eşit ağırlıklı sayar." },
        { question: "Notları farklı ağırlıklarla hesaplayabilir miyim?", answer: "Hayır. Bu araç basit aritmetik ortalama kullanır. Kredi veya sınav yüzdesiyle ağırlıklandırma gerekiyorsa ilgili ağırlıklı not aracını kullanın." },
        { question: "Boş not satırları ortalamayı etkiler mi?", answer: "Hayır. Tamamen boş bırakılan satırlar hesaplamaya dahil edilmez; girilen notlar ise 0–100 aralığında olmalıdır." },
        { question: "Araç kaç not kabul ediyor?", answer: "Formda en fazla 30 satıra kadar not ekleyebilirsiniz." },
        { question: "Bu sonuç dönem sonu veya okul sistemindeki resmî not mudur?", answer: "Hayır. Okulunuzun katsayı, kredi ve yuvarlama kuralları farklı olabilir; resmî sonuç için kurumunuzun duyurusunu esas alın." },
        { question: "Notları ondalıklı girebilir miyim?", answer: "Evet. Ondalık kısmı virgülle yazabilirsiniz; örneğin 82,5." }
      ],
      lastUpdated: "2026-11-05",
      sources: [{
        name: "Basit aritmetik ortalama formülü",
        note: "Kurum not yönetmeliği, ders kredisi ve sınav ağırlığı bu hesaplamaya dahil değildir."
      }]
    },
    mode: "grade-list",
    fields: [numberField("grade1", "Not", "Örn. 70", "puan")]
  },
  {
    id: "sinav-puani-hesaplama", name: "Sınav puanı hesaplama", category: "egitim",
    description: "Doğru ve yanlış cevaplarınıza göre net ve puan hesabı yapın.",
    title: "Sınav Puanı Hesaplama – Net ve Puanınızı Bulun | PratikHesap",
    metaDescription: "Doğru, yanlış ve toplam soru sayısını girin; 4 yanlışın 1 doğruyu götürdüğü 100'lük sınav puanınızı hesaplayın.",
    intro: "Doğru, yanlış ve toplam soru sayısını girip yanlış götürme kuralını seçin. Araç neti ve basit net/toplam oranını verir; resmî sınav puanı hesaplamaz.",
    formula: "Net = Doğru − Yanlış ÷ seçilen yanlış götürme katsayısı. Basit oran = Net ÷ toplam soru × 100.",
    example: "40 soruda 30 doğru ve 4 yanlış, 29 net ve 72,5 puan verir.",
    mode: "exam-net",
    fields: [
      numberField("correct", "Doğru sayısı", "Örn. 30"),
      numberField("wrong", "Yanlış sayısı", "Örn. 4"),
      numberField("total", "Toplam soru sayısı", "Örn. 40"),
      selectField("wrongPenalty", "Yanlış götürme kuralı", [
        { label: "Yanlış doğruyu götürmez", value: "0" },
        { label: "3 yanlış 1 doğruyu götürür", value: "3" },
        { label: "4 yanlış 1 doğruyu götürür", value: "4" },
        { label: "Kullanıcı tanımlı", value: "custom" }
      ]),
      numberField("customPenalty", "Kaç yanlış 1 doğruyu götürüyor?", "Örn. 4", "yanlış", undefined, { field: "wrongPenalty", value: "custom" })
    ]
  },
  {
    id: "basari-yuzdesi-hesaplama", name: "Başarı yüzdesi hesaplama", category: "egitim",
    description: "Tamamlanan veya doğru sayısının toplam içindeki yüzdesini bulun.",
    title: "Başarı Yüzdesi Hesaplama – Yüzde Başarınızı Öğrenin | PratikHesap",
    metaDescription: "Gerçekleşen ve toplam değerleri girerek başarı ya da tamamlanma yüzdenizi hesaplayın.",
    intro: "Doğru cevap, tamamlanan görev veya ulaşılan hedef miktarının toplam içindeki yüzdesini hesaplayın.",
    formula: "Başarı yüzdesi = Gerçekleşen değer ÷ Toplam değer × 100",
    example: "50 sorunun 40'ı doğruysa başarı yüzdesi 40 ÷ 50 × 100 = %80 olur.",
    fields: [numberField("achieved", "Gerçekleşen / doğru sayı", "Örn. 40"), numberField("total", "Toplam sayı", "Örn. 50")]
  },
  {
    id: "harf-notu-hesaplama", name: "Harf notu hesaplama", category: "egitim",
    description: "100'lük puanın yaygın harf notu karşılığını görüntüleyin.",
    title: "Harf Notu Hesaplama – 100'lük Notu Harf Notuna Çevirin | PratikHesap",
    metaDescription: "100 üzerinden notunuzu girerek yaygın not aralıklarına göre AA–FF harf notu karşılığını bulun.",
    intro: "100'lük notunuzu yaygın kullanılan aralıklara göre harf notuna dönüştürün. Üniversiteler ve okullar farklı değerlendirme tabloları kullanabilir; kesin sonuç için kurum yönetmeliğinizi kontrol edin.",
    formula: "AA: 90–100, BA: 85–89, BB: 80–84, CB: 75–79, CC: 70–74, DC: 60–69, DD: 50–59, FF: 0–49",
    example: "82 puan, bu hesaplamada BB harf notu aralığındadır.",
    fields: [numberField("grade", "100 üzerinden not", "Örn. 82", "puan")]
  },
  {
    id: "ders-ortalamasi-hesaplama", name: "Ders ortalaması hesaplama", category: "egitim",
    description: "Üç ders notunun eşit ağırlıklı ortalamasını hesaplayın.",
    title: "Ders Ortalaması Hesaplama – Notlarınızın Ortalamasını Bulun | PratikHesap",
    metaDescription: "Üç ders notunu girerek 100 üzerinden eşit ağırlıklı ders ortalamanızı hemen hesaplayın.",
    intro: "Ders adı ve not ekleyin; isterseniz kredi ya da ders saatine göre ağırlıklı ortalamayı seçin. En fazla 30 ders eklenebilir.",
    formula: "Eşit ortalama = notların toplamı ÷ ders sayısı. Ağırlıklı ortalama = Σ(not × kredi/saat) ÷ Σ(kredi/saat).",
    example: "80, 70 ve 90 notları eşit ağırlıkla 80 puandır. 80 notu 3 kredi, 70 notu 1 kredi ise ağırlıklı ortalama 77,5 puandır.",
    mode: "course-list",
    fields: [
      selectField("averageMode", "Ortalama türü", [
        { label: "Eşit ağırlıklı", value: "equal" },
        { label: "Kredi / ders saati ağırlıklı", value: "weighted" }
      ]),
      numberField("grade1", "Ders notu", "Örn. 80")
    ]
  },
  {
    id: "not-ortalamasi-gano-hesaplama", name: "Not ortalaması / GANO hesaplama", category: "egitim", popular: true,
    description: "Ders kredileriyle ağırlıklı ortalamayı 4'lük veya 100'lük sistemde hesaplayın.",
    title: "Not Ortalaması ve GANO Hesaplama – 4'lük / 100'lük Sistem | PratikHesap",
    metaDescription: "Ders adı, kredi ve harf notu veya puanları girin; 4'lük ya da 100'lük ağırlıklı not ortalamanızı hesaplayın.",
    intro: "Derslerinizi ve kredilerini ekleyin; notları 4'lük harf/puan veya 100'lük sistemde girerek kredi ağırlıklı ortalamayı hesaplayın. Kurumunuzun not dönüşüm tablosu farklı olabilir.",
    formula: "Ağırlıklı ortalama = Σ(ders notu × ders kredisi) ÷ Σ(ders kredisi). 4'lük sistemde harf notları AA=4,00, BA=3,50, BB=3,00, CB=2,50, CC=2,00, DC=1,50, DD=1,00, FD=0,50, FF=0,00 karşılığıyla kullanılır.",
    example: "3 kredilik AA (4,00) ve 2 kredilik BB (3,00) ile ağırlıklı 4'lük ortalama (3×4 + 2×3) ÷ 5 = 3,60 olur.",
    content: {
      definition: "Not ortalaması, farklı derslerdeki başarıyı tek bir ölçüde özetler. Genel ağırlıklı not ortalaması (GANO) hesaplanırken her dersin notu, dersin kredisiyle birlikte değerlendirilir; kredisi yüksek dersler sonuca daha fazla etki eder. Bu araç ders adını, krediyi ve notu satır satır girmenize izin verir. 4'lük sistemde yaygın harf notu karşılıklarını seçebilir veya doğrudan 0–4 arasında puan girebilirsiniz. 100'lük sistemde ise ders puanlarını 0 ile 100 arasında girersiniz. Sonuç, seçilen sistemde kredi ağırlıklı ortalamadır. Üniversitelerin harf notu karşılıkları, kredi hesaplama şekli, başarısız derslerin tekrarında hangi notun sayılacağı ve yuvarlama kuralları değişebilir. Bu nedenle hesaplayıcı sonucu resmi transkript veya öğrenci bilgi sistemi kaydının yerine geçmez. Yalnızca ortalamaya katılacak dersleri ekleyin; her ders için kredi ve not girilmelidir. Henüz sonuçlanmamış dersleri boş bırakabilir veya listeden çıkartabilirsiniz. Ders ekle/sil kontrolleriyle satır sayısını düzenleyebilir, farklı not senaryolarını karşılaştırmak için 4'lük ve 100'lük giriş biçimleri arasında geçiş yapabilirsiniz. Resmi GANO için okulunuzun güncel yönetmeliğini ve transkriptini esas alın.",
      steps: [
        "Not sistemini seçin. 4'lük sistemde harf notu veya 0–4 puan girişi, 100'lük sistemde 0–100 puan girişi kullanabilirsiniz.",
        "Her ders için ders adını, kredi miktarını ve notu girin. Gerekiyorsa Satır ekle ile ders ekleyin.",
        "Sonuç, ders kredileriyle ağırlıklandırılarak hesaplanır; boş veya eksik ders satırları için gerekli alanları tamamlayın."
      ],
      examples: [
        { title: "4'lük sistemde harf notları", calculation: "(3 kredi × AA 4,00 + 2 kredi × BB 3,00) ÷ 5 kredi", result: "Ağırlıklı ortalama 3,60 / 4,00'dır." },
        { title: "100'lük sistemde puanlar", calculation: "(3 kredi × 80 + 2 kredi × 70) ÷ 5 kredi", result: "Ağırlıklı ortalama 76 / 100'dür." }
      ],
      faqs: [
        { question: "GANO nasıl hesaplanır?", answer: "Her dersin notu kredisiyle çarpılır, çarpımlar toplanır ve toplam krediye bölünür. Sonuç seçilen not sisteminde gösterilir." },
        { question: "Harf notuyla ortalama hesaplayabilir miyim?", answer: "Evet. 4'lük sistemi ve harf notu girişini seçerek listelenen harf notlarını kullanabilirsiniz." },
        { question: "4'lük sistemde doğrudan puan girebilir miyim?", answer: "Evet. 4'lük sistem altında puan girişini seçip her ders için 0–4 aralığında değer girin." },
        { question: "100'lük sistemde ders kredisi etkili midir?", answer: "Evet. Araç her iki sistemde de notları girilen ders kredileriyle ağırlıklandırır." },
        { question: "Hesaplanan sonuç resmi üniversite GANO'm mudur?", answer: "Hayır. Kurumların not dönüşüm, kredi ve yuvarlama kuralları farklı olabilir; resmi transkriptinizi esas alın." },
        { question: "Ders ekleyip silebilir miyim?", answer: "Evet. En fazla 30 ders satırı ekleyebilir, son satırı silebilirsiniz. Hesaplamaya katılacak her derste kredi ve not gereklidir." }
      ],
      lastUpdated: "2026-11-05",
      sources: [{ name: "Kredi ağırlıklı aritmetik ortalama formülü", note: "Harf notu karşılıkları yaygın örnek değerlerdir; üniversitenizin yönetmeliği farklı olabilir." }]
    },
    mode: "unified-gpa",
    fields: [
      selectField("gradeSystem", "Not sistemi", [
        { label: "4'lük sistem", value: "4" },
        { label: "100'lük sistem", value: "100" }
      ]),
      selectField("gradeEntry", "4'lük not girişi", [
        { label: "Harf notu", value: "letter" },
        { label: "4 üzerinden puan", value: "score" }
      ]),
      numberField("grade1", "Ders notu", "Örn. 80")
    ]
  },
  {
    id: "metrekare-hesaplama", name: "Metrekare hesaplama", category: "gunluk-yasam",
    description: "Dikdörtgen, kare, üçgen, daire ve yamuk şekillerinin alanını hesaplayın.",
    title: "Alan ve Metrekare Hesaplama – Şekil Seçin | PratikHesap",
    metaDescription: "Dikdörtgen, kare, üçgen, daire veya yamuk şeklini seçerek ölçülerinden alanı ve metrekareyi hesaplayın.",
    intro: "Dikdörtgen, kare, üçgen, daire veya yamuk seçin; gerekli kenar ve yükseklik ölçülerini metre olarak girerek alanı hesaplayın.",
    formula: "Dikdörtgen: en × boy. Kare: kenar². Üçgen: taban × yükseklik ÷ 2. Daire: π × yarıçap². Yamuk: (alt taban + üst taban) × yükseklik ÷ 2.",
    example: "4 m × 5 m dikdörtgenin alanı 20 m²; 3 m taban ve 2 m yükseklikteki üçgenin alanı 3 m²'dir.",
    fields: [
      selectField("shape", "Şekil", [
        { label: "Dikdörtgen", value: "rectangle" },
        { label: "Kare", value: "square" },
        { label: "Üçgen", value: "triangle" },
        { label: "Daire", value: "circle" },
        { label: "Yamuk", value: "trapezoid" }
      ]),
      numberField("width", "En", "Örn. 4", "metre", undefined, { field: "shape", value: "rectangle" }),
      numberField("length", "Boy", "Örn. 5", "metre", undefined, { field: "shape", value: "rectangle" }),
      numberField("side", "Kenar uzunluğu", "Örn. 4", "metre", undefined, { field: "shape", value: "square" }),
      numberField("base", "Taban uzunluğu", "Örn. 3", "metre", undefined, { field: "shape", value: ["triangle", "trapezoid"] }),
      numberField("height", "Yükseklik", "Örn. 2", "metre", undefined, { field: "shape", value: ["triangle", "trapezoid"] }),
      numberField("radius", "Yarıçap", "Örn. 2", "metre", undefined, { field: "shape", value: "circle" }),
      numberField("upperBase", "Üst taban uzunluğu", "Örn. 2", "metre", undefined, { field: "shape", value: "trapezoid" })
    ]
  },
  {
    id: "boy-kilo-orani-hesaplama", name: "Boy ve kilo oranı hesaplama", category: "gunluk-yasam",
    description: "Boy ve kilonuza göre vücut kitle indeksi (VKİ) hesaplayın.",
    title: "Boy Kilo Endeksi Hesaplama – VKİ Değerinizi Bulun | PratikHesap",
    metaDescription: "Boy ve kilonuzu girerek vücut kitle indeksinizi (VKİ) hesaplayın. Sonucun genel bilgilendirme amaçlı olduğunu unutmayın.",
    intro: "Vücut kitle indeksi (VKİ), kilogram cinsinden ağırlığın metre cinsinden boyun karesine bölünmesiyle hesaplanan genel bir ölçüdür. Tek başına sağlık tanısı koymaz.",
    formula: "VKİ = Ağırlık (kg) ÷ Boy (m)²",
    example: "1,70 m boyunda ve 65 kg ağırlığındaki bir kişinin VKİ değeri yaklaşık 22,49'dur.",
    fields: [numberField("height", "Boy", "Örn. 170", "cm veya m"), numberField("weight", "Kilo", "Örn. 65", "kg")]
  },
  {
    id: "litre-donusumu", name: "Litre dönüşümü", category: "gunluk-yasam",
    description: "Litreyi mililitreye veya metreküpe, mililitreyi litreye çevirin.",
    title: "Litre Dönüşümü – Litre, Mililitre ve m³ Çevirici | PratikHesap",
    metaDescription: "Litre, mililitre ve metreküp arasında hacim dönüşümü yapın. Miktarı ve dönüşüm yönünü seçmeniz yeterli.",
    intro: "Sıvı hacimlerini litre, mililitre ve metreküp birimleri arasında dönüştürün. Dönüşüm, seçtiğiniz yöndeki standart birim eşitliklerini kullanır.",
    formula: "1 L = 1.000 ml; 1 m³ = 1.000 L",
    example: "2,5 litre 2.500 mililitreye; 1.000 litre 1 metreküpe eşittir.",
    fields: [
      numberField("amount", "Miktar", "Örn. 2,5"),
      selectField("conversion", "Dönüşüm yönü", [{ label: "Litre → mililitre", value: "l-to-ml" }, { label: "Mililitre → litre", value: "ml-to-l" }, { label: "Litre → metreküp", value: "l-to-m3" }])
    ]
  },
  {
    id: "kilogram-donusumu", name: "Kilogram dönüşümü", category: "gunluk-yasam",
    description: "Kilogram, gram ve ton arasında ağırlık dönüşümü yapın.",
    title: "Kilogram Dönüşümü – kg, Gram ve Ton Çevirici | PratikHesap",
    metaDescription: "Kilogramı grama veya tona, gramı kilograma dönüştürün. Sonuçları Türkçe sayı biçiminde görün.",
    intro: "Ağırlık miktarlarını kilogram, gram ve ton birimleri arasında dönüştürün. Sonuç, seçtiğiniz hedef birimde gösterilir.",
    formula: "1 kg = 1.000 g; 1 t = 1.000 kg",
    example: "2,5 kilogram 2.500 grama, 3.000 kilogram 3 tona eşittir.",
    fields: [
      numberField("amount", "Miktar", "Örn. 2,5"),
      selectField("conversion", "Dönüşüm yönü", [{ label: "Kilogram → gram", value: "kg-to-g" }, { label: "Gram → kilogram", value: "g-to-kg" }, { label: "Kilogram → ton", value: "kg-to-ton" }])
    ]
  },
  {
    id: "saat-dakika-donusturme", name: "Saat dakika dönüştürme", category: "gunluk-yasam",
    description: "Saat, dakika ve saniye arasında süre dönüşümü yapın.",
    title: "Saat Dakika Dönüştürme – Süre Birimi Hesaplayıcı | PratikHesap",
    metaDescription: "Saat ve dakika arasındaki dönüşümü yapın; ayrıca dakika değerini saniyeye çevirin.",
    intro: "Zaman miktarlarını saat, dakika ve saniye arasında dönüştürün. Ondalıklı girişler de hesaplamaya dahil edilir.",
    formula: "1 saat = 60 dakika; 1 dakika = 60 saniye",
    example: "1,5 saat 90 dakikaya; 120 dakika 2 saate eşittir.",
    fields: [
      numberField("amount", "Süre", "Örn. 1,5"),
      selectField("conversion", "Dönüşüm yönü", [{ label: "Saat → dakika", value: "hours-to-minutes" }, { label: "Dakika → saat", value: "minutes-to-hours" }, { label: "Dakika → saniye", value: "minutes-to-seconds" }])
    ]
  },
  {
    id: "birim-donusturme", name: "Birim dönüştürme", category: "gunluk-yasam", popular: true,
    description: "Uzunluk, ağırlık, hacim, alan, sıcaklık ve süre birimlerini dönüştürün.",
    title: "Birim Dönüştürme – Uzunluk, Ağırlık, Hacim ve Daha Fazlası | PratikHesap",
    metaDescription: "Uzunluk, ağırlık, hacim, alan, sıcaklık ve süre birimleri arasında hızlı ve ücretsiz dönüşüm yapın.",
    intro: "Bir kategori seçin; dönüştürülecek miktarı ve başlangıç/hedef birimleri girerek sonucu görün. Eski litre, kilogram ve süre dönüştürücüleri de kullanılmaya devam eder.",
    formula: "Sonuç = Girilen miktar × kaynak biriminin temel birim katsayısı ÷ hedef biriminin temel birim katsayısı. Sıcaklık dönüşümleri ilgili doğrusal formülleri kullanır.",
    example: "2,5 km = 2.500 m; 20 °C = 68 °F.",
    content: {
      definition: "Birim dönüştürme, aynı fiziksel büyüklüğü farklı ölçü birimleriyle ifade etmeyi sağlar. Bu araç uzunluk, ağırlık, hacim, alan, sıcaklık ve süre kategorilerini kapsar. Örneğin kilometreyi metreye, kilogramı grama, litreyi metreküpe veya saati dakikaya çevirebilirsiniz. Önce kategori seçilir; ardından miktar, kaynak birim ve hedef birim belirlenir. Uzunluk, ağırlık, hacim, alan ve süre dönüşümleri ortak bir temel birim katsayısına göre yapılır. Sıcaklık için yalnızca katsayı kullanılamadığı için Santigrat, Fahrenheit ve Kelvin arasındaki ayrı dönüşüm formülleri uygulanır. Sonuç, girilen değerin matematiksel eşdeğeridir; yuvarlama ekranda Türkçe sayı biçimiyle gösterilir. Birimler arasında dönüştürme yaparken aynı büyüklüğün seçildiğinden emin olun: kilogram bir ağırlık birimi, litre ise hacim birimidir ve aralarında genel bir doğrudan dönüşüm yoktur; yoğunluk gibi ek bilgi gerekir. Benzer biçimde, gündelik dilde kullanılan ton burada metrik ton anlamındadır. Bu hesaplayıcı ölçüm cihazlarının doğruluğunu veya ürün özelliklerini doğrulamaz. Eski litre, kilogram ve saat-dakika araçları da özel dönüşüm seçenekleriyle kullanılmaya devam eder. Ölçekleri karşılaştırırken kaynak ve hedef birim adlarını kontrol etmek, sonucu yanlış yorumlamayı önler.",
      steps: [
        "Uzunluk, ağırlık, hacim, alan, sıcaklık veya süre kategorilerinden birini seçin.",
        "Dönüştürülecek miktarı girin ve başlangıç ile hedef birimleri belirleyin.",
        "Sonuç, geçerli birim dönüşüm formülüyle otomatik olarak güncellenir."
      ],
      examples: [
        { title: "Uzunluk dönüşümü", calculation: "2,5 km × 1.000 m/km", result: "2,5 kilometre 2.500 metredir." },
        { title: "Sıcaklık dönüşümü", calculation: "20 °C × 9 ÷ 5 + 32", result: "20 derece Santigrat 68 derece Fahrenheit'tır." }
      ],
      faqs: [
        { question: "Hangi birim kategorileri dönüştürülebilir?", answer: "Uzunluk, ağırlık, hacim, alan, sıcaklık ve süre kategorileri desteklenir." },
        { question: "Kilogramı litreye çevirebilir miyim?", answer: "Doğrudan hayır. Kilogram kütle, litre hacim birimidir; dönüşüm için maddenin yoğunluğu gibi ek bilgi gerekir." },
        { question: "Sıcaklık dönüşümleri nasıl yapılır?", answer: "Santigrat, Fahrenheit ve Kelvin arasındaki dönüşümler her ölçeğe özgü formüllerle hesaplanır." },
        { question: "Ondalıklı miktar girebilir miyim?", answer: "Evet. Türkçe sayı biçiminde ondalık virgül kullanabilirsiniz; örneğin 2,5." },
        { question: "Ton hangi anlamda kullanılıyor?", answer: "Ağırlık kategorisindeki ton, 1.000 kilogram olan metrik tonu ifade eder." },
        { question: "Litre ve kilogram araçları çalışmaya devam ediyor mu?", answer: "Evet. Ayrı litre, kilogram ve saat-dakika sayfaları korunmuştur; bu sayfa daha fazla birim seçeneği sunar." }
      ],
      lastUpdated: "2026-11-05",
      sources: [{ name: "Uluslararası birim eşitlikleri ve tanımlı dönüşüm formülleri", note: "Sonuçlar standart birim ilişkilerine dayanır." }]
    },
    mode: "unit-conversion",
    fields: [
      selectField("category", "Birim kategorisi", [
        { label: "Uzunluk", value: "length" },
        { label: "Ağırlık", value: "weight" },
        { label: "Hacim", value: "volume" },
        { label: "Alan", value: "area" },
        { label: "Sıcaklık", value: "temperature" },
        { label: "Süre", value: "time" }
      ]),
      numberField("amount", "Miktar", "Örn. 2,5"),
      selectField("fromUnit", "Başlangıç birimi", [{ label: "Kilometre (km)", value: "km" }]),
      selectField("toUnit", "Hedef birim", [{ label: "Metre (m)", value: "m" }])
    ]
  },
  {
    id: "dortluk-not-sistemi-hesaplama", name: "4'lük not sistemi hesaplama", category: "egitim", popular: true,
    description: "Harf notu ve ders kredilerini kullanarak 4 üzerinden ağırlıklı ortalamanızı bulun.",
    title: "4'lük Not Sistemi Hesaplama – Üniversite GPA ve AGNO | PratikHesap",
    metaDescription: "Üniversite harf notlarınızı ve AKTS ya da yerel kredi değerlerinizi girin; 4'lük sistemde ağırlıklı not ortalamanızı (GPA/AGNO) hesaplayın.",
    intro: "Derslerin harf notunu ve kredi değerini ekleyerek 4,00 üzerinden ağırlıklı ortalamayı hesaplayın. En fazla 30 ders eklenebilir. İsteğe bağlı önceki toplam kredi ve ortalamayı girerek kümülatif AGNO'yu da hesaplayabilirsiniz.",
    formula: "4'lük ortalama = Σ (harf notu katsayısı × ders kredisi) ÷ Σ ders kredisi. Bu hesaplayıcıda AA=4,00; BA=3,50; BB=3,00; CB=2,50; CC=2,00; DC=1,50; DD=1,00; FD=0,50; FF=0,00 kullanılır.",
    example: "3 kredilik AA ve 2 kredilik BB için ortalama: (4,00 × 3 + 3,00 × 2) ÷ (3 + 2) = 3,60 / 4,00.",
    mode: "gpa-list",
    fields: [selectField("grade1", "Ders harf notu", letterGradeOptions)]
  },
  {
    id: "agirlikli-not-ortalamasi-hesaplama", name: "Ağırlıklı not ortalaması", category: "egitim", popular: true,
    description: "Sınav notlarınızı vize, final ve ödev yüzdelerine göre birleştirin.",
    title: "Ağırlıklı Not Ortalaması Hesaplama – Vize Final Notu | PratikHesap",
    metaDescription: "Vize, final ve ödev notlarını kendi yüzdeleriyle birleştirin. Ağırlık toplamı %100 olacak şekilde dönem notunuzu hesaplayın.",
    intro: "Üç değerlendirme notunu (ör. vize, final ve ödev) kendi ağırlıklarıyla hesaplayıp dönem ortalamasını bulun. Ağırlık yüzdelerinin toplamı tam olarak %100 olmalıdır.",
    formula: "Ağırlıklı ortalama = (1. not × 1. ağırlık + 2. not × 2. ağırlık + 3. not × 3. ağırlık) ÷ 100",
    example: "70 vize (%40), 80 final (%50) ve 100 ödev (%10): 70×0,40 + 80×0,50 + 100×0,10 = 78 puan.",
    mode: "weighted-list",
    fields: [numberField("score1", "Değerlendirme notu", "Örn. 70", "puan")]
  },
  {
    id: "finalde-gerekli-not-hesaplama", name: "Finalde gerekli not hesaplama", category: "egitim",
    description: "Hedef dönem ortalaması için finalden almanız gereken notu öğrenin.",
    title: "Finalde Kaç Almalıyım? Gerekli Final Notu Hesaplama | PratikHesap",
    metaDescription: "Ara sınav notunuzu, final yüzdesini ve hedef ortalamayı girin; hedefe ulaşmak için finalde gereken notu hesaplayın.",
    intro: "Ara sınav notunuz ve finalin ders başarı notuna katkı yüzdesiyle hedef dönem notuna ulaşmak için final sınavından kaç almanız gerektiğini hesaplayın. Dersinizin resmi değerlendirme ağırlıklarını kullanın.",
    formula: "Gerekli final notu = [Hedef dönem notu − Ara sınav notu × (1 − Final ağırlığı)] ÷ Final ağırlığı",
    example: "Vize 60, vize ağırlığı %40, final ağırlığı %60 ve hedef 70 ise finalden en az (70 − 60×0,40) ÷ 0,60 = 76,67 gerekir.",
    fields: [
      numberField("currentGrade", "Ara sınav / vize notu", "Örn. 60", "puan"),
      numberField("targetGrade", "Hedef dönem notu", "Örn. 70", "puan"),
      numberField("finalWeight", "Final sınavı ağırlığı", "Örn. 60", "%")
    ]
  },
  {
    id: "kredi-taksit-hesaplama", name: "Kredi taksit hesaplama", category: "finans",
    description: "Kredi tutarı, aylık faiz ve vadeye göre yaklaşık eşit taksiti bulun.",
    title: "Kredi Taksit Hesaplama – Aylık Taksit ve Geri Ödeme | PratikHesap",
    metaDescription: "Kredi tutarı, aylık faiz oranı ve vade ayını girin; yaklaşık eşit taksiti, toplam geri ödemeyi ve faiz tutarını görün.",
    intro: "Kredi tutarı, aylık faiz oranı ve vade bilgisiyle sabit taksitli ödeme planının yaklaşık aylık taksitini hesaplayın. Vergi, sigorta, tahsis ücreti ve bankaya özel koşullar bu tahmine dahil değildir.",
    formula: "Aylık taksit = Anapara × r × (1+r)^n ÷ [(1+r)^n − 1]. Faizsiz durumda taksit = Anapara ÷ vade; r aylık faiz oranı, n ay sayısıdır.",
    example: "100.000 TL kredi, aylık %2 faiz ve 12 ay vadede sabit taksit yaklaşık 9.455,96 TL; toplam geri ödeme yaklaşık 113.471,52 TL'dir. Gerçek banka teklifi masraf ve sözleşme koşullarına göre değişir.",
    fields: [
      numberField("principal", "Kredi tutarı", "Örn. 100000", "₺"),
      numberField("monthlyRate", "Aylık faiz oranı", "Örn. 2,5", "%"),
      numberField("months", "Vade", "Örn. 12", "ay"),
      numberField("fee", "Aylık diğer gider (isteğe bağlı)", "Örn. 0", "₺")
    ],
    mode: "loan-plan"
  },
  {
    id: "bilesik-faiz-hesaplama", name: "Bileşik faiz hesaplama", category: "finans",
    description: "Başlangıç tutarını faiz sıklığı ve süreyle bileşik olarak hesaplayın.",
    title: "Bileşik Faiz Hesaplama – Faiz Getirisi ve Dönem Sonu Tutarı | PratikHesap",
    metaDescription: "Başlangıç tutarı, yıllık oran ve süreyle bileşik faiz hesabı yapın; yıllık, aylık veya günlük bileşikleşme sıklığını seçin.",
    intro: "Başlangıç birikiminin belirli bir yıllık oranla düzenli aralıklarla bileşik getiride nasıl büyüyeceğini tahmin edin. Ek yatırımlar, vergiler, enflasyon ve masraflar hesaba dahil değildir.",
    formula: "Dönem sonu tutarı = Başlangıç tutarı × (1 + yıllık oran ÷ bileşikleşme sayısı)^(bileşikleşme sayısı × yıl)",
    example: "10.000 TL, yıllık %12 nominal oran ve aylık bileşikleşmeyle 1 yıl sonunda yaklaşık 11.268,25 TL olur; vergiler ve ek ödemeler hesaba dahil değildir.",
    fields: [
      numberField("principal", "Başlangıç tutarı", "Örn. 10000", "₺"),
      numberField("annualRate", "Yıllık oran", "Örn. 12", "%"),
      numberField("years", "Süre", "Örn. 5", "yıl"),
      selectField("periods", "Bileşikleşme sıklığı", [
        { label: "Yıllık", value: "1" },
        { label: "Üç aylık", value: "4" },
        { label: "Aylık", value: "12" },
        { label: "Günlük (365)", value: "365" }
      ])
    ]
  },
  {
    id: "basit-faiz-hesaplama", name: "Basit faiz hesaplama", category: "finans",
    description: "Anapara, yıllık faiz oranı ve gün sayısıyla basit faiz getirisini hesaplayın.",
    title: "Basit Faiz Hesaplama – Faiz Getirisi ve Anapara | PratikHesap",
    metaDescription: "Anapara, yıllık faiz oranı ve gün sayısını girerek 365 günlük yıl varsayımıyla basit faiz getirisini ve dönem sonu tutarını hesaplayın.",
    intro: "Anapara, yıllık faiz oranı ve gün sayısını kullanarak bileşikleşme olmadan yaklaşık faiz tutarını hesaplayın. Hesaplamada 365 günlük yıl varsayılır; vergi, masraf ve sözleşme koşulları dahil değildir.",
    formula: "Basit faiz = Anapara × Yıllık faiz oranı ÷ 100 × Gün sayısı ÷ 365; dönem sonu tutarı = anapara + faiz.",
    example: "10.000 TL anapara, yıllık %10 ve 180 gün için basit faiz yaklaşık 493,15 TL; toplam yaklaşık 10.493,15 TL olur.",
    fields: [
      numberField("principal", "Anapara", "Örn. 10000", "₺"),
      numberField("annualRate", "Yıllık faiz oranı", "Örn. 10", "%"),
      numberField("days", "Süre", "Örn. 180", "gün")
    ]
  },
  {
    id: "doviz-hesaplama", name: "Döviz hesaplama", category: "finans",
    description: "TCMB gösterge satış kuruyla döviz tutarının yaklaşık TL karşılığını bulun.",
    title: "Döviz Hesaplama – Güncel TCMB Kuruyla TL Çevirici | PratikHesap",
    metaDescription: "Döviz miktarını seçin; TCMB'nin yayımladığı satış kuruna göre yaklaşık Türk lirası karşılığını, kur tarihini ve birimini görün.",
    intro: "Döviz tutarını TCMB'nin XML bülteninde yayımlanan ForexSelling (gösterge satış) kuru üzerinden yaklaşık Türk lirasına çevirin. TCMB kuru hafta sonu ve resmî tatillerde yenilenmeyebilir; banka ve işlem kuruluşlarının uyguladığı kur farklı olabilir.",
    formula: "Yaklaşık TL karşılığı = Döviz tutarı × TCMB ForexSelling kuru ÷ kur bültenindeki birim.",
    example: "TCMB bülteninde 1 USD satış kuru 35,00 TL ise 100 USD için yaklaşık karşılık 100 × 35,00 = 3.500 TL olur. Gösterilen oran örnektir; araç bülten verisini kullanır.",
    fields: [
      numberField("amount", "Döviz tutarı", "Örn. 100"),
      selectField("direction", "Dönüşüm yönü", [
        { label: "Dövizden TL'ye", value: "to-try" },
        { label: "TL'den dövize", value: "from-try" }
      ]),
      selectField("currency", "Döviz türü", tcmbCurrencies.map(({ code, name }) => ({ label: name, value: code })))
    ],
    mode: "currency"
  },
  {
    id: "yakit-tuketimi-hesaplama", name: "Yakıt tüketimi hesaplama", category: "gunluk-yasam",
    description: "Mesafe ve yakıt miktarından 100 km tüketimini ve yakıt maliyetini bulun.",
    title: "Yakıt Tüketimi Hesaplama – Araç 100 km'de Kaç Litre Yakar? | PratikHesap",
    metaDescription: "Gidilen mesafe, harcanan benzin veya motorin ve litre fiyatıyla aracın L/100 km tüketimini ve yakıt maliyetini hesaplayın.",
    intro: "Kilometre sayacı veya yol bilgisayarından aldığınız mesafe ve yakıt miktarıyla ortalama tüketimi litre/100 km cinsinden hesaplayın. Litre fiyatını girerek yakıt harcamasını da yaklaşık görün.",
    formula: "Ortalama tüketim (L/100 km) = Harcanan yakıt (L) ÷ Mesafe (km) × 100; yakıt maliyeti = litre × litre fiyatı",
    example: "500 km'de 35 litre yakıt ve 45 TL/litre fiyatla tüketim 7 L/100 km, yakıt maliyeti 1.575 TL'dir.",
    fields: [
      numberField("distance", "Gidilen mesafe", "Örn. 500", "km"),
      numberField("fuel", "Harcanan yakıt", "Örn. 35", "L"),
      numberField("price", "Yakıt litre fiyatı", "Örn. 45", "₺/L")
    ]
  },
  {
    id: "elektrik-faturasi-hesaplama", name: "Elektrik tüketim maliyeti", category: "gunluk-yasam",
    description: "kWh tüketimi ve birim fiyatla yaklaşık enerji bedelini hesaplayın.",
    title: "Elektrik Faturası Hesaplama – kWh Tüketim Maliyeti | PratikHesap",
    metaDescription: "Elektrik tüketiminizi kWh, enerji birim fiyatını TL/kWh olarak girin; yaklaşık enerji bedelinizi hesaplayın.",
    intro: "Elektrik tüketimini ve kullandığınız tarifenin enerji birim fiyatını çarparak yaklaşık enerji bedelini bulun. Bu basit tahmin vergi, dağıtım, kademe veya diğer fatura kalemlerini içermez.",
    formula: "Yaklaşık enerji bedeli = Tüketim (kWh) × Enerji birim fiyatı (TL/kWh)",
    example: "250 kWh tüketim ve 2,50 TL/kWh enerji birim fiyatında yaklaşık enerji bedeli 625 TL'dir; toplam fatura farklı olabilir.",
    fields: [
      selectField("mode", "Hesaplama türü", [
        { label: "Tüketim ve birim fiyat", value: "consumption" },
        { label: "Cihaz gücü ve kullanım süresi", value: "device" }
      ]),
      numberField("usage", "Elektrik tüketimi", "Örn. 250", "kWh", undefined, { field: "mode", value: "consumption" }),
      numberField("unitPrice", "Enerji birim fiyatı", "Örn. 2,5", "₺/kWh"),
      numberField("watts", "Cihaz gücü", "Örn. 1500", "W", undefined, { field: "mode", value: "device" }),
      numberField("hoursPerDay", "Günlük kullanım", "Örn. 4", "saat", undefined, { field: "mode", value: "device" }),
      numberField("days", "Gün sayısı", "Örn. 30", "gün", undefined, { field: "mode", value: "device" })
    ],
    mode: "electricity"
  },
  {
    id: "pazaryeri-net-kar-hesaplama", name: "Pazaryeri net kâr hesaplama", category: "finans", createdAt: "2026-11-05T10:35:47+03:00",
    description: "Ürün maliyeti, indirim, komisyon ve ek giderlere göre tahmini satış kârını hesaplayın.",
    title: "Pazaryeri Net Kâr Hesaplama – Komisyon ve Gider Sonrası | PratikHesap",
    metaDescription: "Satış fiyatı, maliyet, indirim, komisyon ve giderleri girerek pazaryeri satışından kalan tahmini kârı ve oranları hesaplayın.",
    intro: "Satış fiyatı, ürün maliyeti, komisyon, kargo ve diğer giderleri girerek kalan tahmini kârı bulun. Vergi ve platforma özel kesintiler yalnızca girdiğiniz giderler arasındaysa hesaba katılır.",
    formula: "Tahmini kâr = indirimli satış fiyatı − ürün maliyeti − seçilen komisyon matrahındaki komisyon − kargo − ek giderler.",
    example: "1.000 TL satış, 500 TL maliyet, %10 komisyon, 50 TL kargo ve 20 TL giderde (indirim yok) tahmini kâr 330 TL'dir.",
    mode: "marketplace-profit",
    fields: [
      numberField("salePrice", "Liste satış fiyatı", "Örn. 1000", "₺"),
      numberField("productCost", "Ürün maliyeti", "Örn. 500", "₺"),
      numberField("discountPercent", "İndirim", "Örn. 10", "%"),
      numberField("commissionRate", "Komisyon oranı", "Örn. 10", "%"),
      selectField("commissionBasis", "Komisyon hangi tutar üzerinden?", [
        { label: "İndirim öncesi liste fiyatı", value: "list" },
        { label: "İndirim sonrası satış fiyatı", value: "discounted" }
      ]),
      numberField("shipping", "Kargo gideri", "Örn. 50", "₺"),
      numberField("extraExpenses", "Diğer giderler", "Örn. 20", "₺")
    ]
  },
  {
    id: "birim-fiyat-karsilastirma", name: "Birim fiyat karşılaştırma", category: "gunluk-yasam", createdAt: "2026-11-05T10:35:47+03:00",
    description: "Paket fiyatlarını uyumlu miktar birimine göre karşılaştırıp ekonomik seçeneği bulun.",
    title: "Birim Fiyat Karşılaştırma – Hangi Paket Daha Ekonomik? | PratikHesap",
    metaDescription: "İki veya daha fazla ürünün fiyat, miktar ve paket adedini girin; ortak birim fiyatlarını karşılaştırarak ekonomik seçeneği bulun.",
    intro: "Ürün fiyatı, paket miktarı ve paket adedini girin. Uyumlu birimleri ortak ölçüye çevirip birim fiyatı karşılaştırır; ağırlık, hacim ve adet birbirine dönüştürülmez.",
    formula: "Birim fiyat = Paket fiyatı ÷ (miktar × paket adedi), miktar ortak temel birime dönüştürülür.",
    example: "500 g ürün 60 TL ise kilogram fiyatı 120 TL'dir. 1 kg ürün 110 TL ise ikinci ürün birim fiyat bakımından ekonomiktir.",
    mode: "unit-price",
    fields: [
      numberField("price1", "1. ürün fiyatı", "Örn. 60", "₺"),
      numberField("quantity1", "1. ürün miktarı", "Örn. 500"),
      selectField("unit1", "1. ürün birimi", [
        { label: "Kilogram", value: "kg" }, { label: "Gram", value: "g" },
        { label: "Litre", value: "l" }, { label: "Mililitre", value: "ml" },
        { label: "Adet", value: "adet" }, { label: "Metre", value: "m" }, { label: "Santimetre", value: "cm" }
      ])
    ]
  },
  {
    id: "aylik-katkili-birikim-hesaplama", name: "Aylık katkılı birikim hesaplama", category: "finans", createdAt: "2026-11-05T10:35:47+03:00",
    description: "Başlangıç birikimi ve düzenli aylık katkıların varsayımsal dönem sonu tutarını görün.",
    title: "Aylık Katkılı Birikim Hesaplama – Düzenli Yatırım Tahmini | PratikHesap",
    metaDescription: "Başlangıç tutarı, aylık katkı, varsayımsal yıllık oran ve süreyle katkı toplamını ve tahmini getiriyi ayrı hesaplayın.",
    intro: "Başlangıç tutarı ile her ay eklenen katkının varsayımsal getiri oranında nasıl birikebileceğini hesaplayın. Getiri garanti değildir; vergi, ücret, enflasyon ve piyasa dalgalanması dahil değildir.",
    formula: "Her ay bakiye, yıllık varsayımsal oran ÷ 12 ile büyütülür; katkı, seçime göre ay başında veya sonunda eklenir.",
    example: "10.000 TL başlangıç, ay sonunda 1.000 TL katkı ve yıllık nominal %12 varsayımla 12 ay sonunda yaklaşık 23.000 TL civarında bir tutar oluşur.",
    mode: "monthly-savings",
    fields: [
      numberField("principal", "Başlangıç tutarı", "Örn. 10000", "₺"),
      numberField("contribution", "Aylık katkı", "Örn. 1000", "₺"),
      numberField("annualRate", "Varsayımsal yıllık oran", "Örn. 12", "%"),
      numberField("months", "Süre", "Örn. 12", "ay"),
      selectField("timing", "Katkı zamanı", [
        { label: "Ay sonunda", value: "end" },
        { label: "Ay başında", value: "beginning" }
      ]),
      numberField("target", "Hedef tutar (isteğe bağlı)", "Örn. 50000", "₺")
    ]
  },
  {
    id: "yolculuk-maliyeti-hesaplama", name: "Yolculuk maliyeti hesaplama", category: "gunluk-yasam", createdAt: "2026-11-05T10:35:47+03:00",
    description: "Girilen mesafe, araç tüketimi, yakıt fiyatı ve diğer giderlerle yol maliyetini tahmin edin.",
    title: "Yolculuk Maliyeti Hesaplama – Yakıt ve Kişi Başı Tutar | PratikHesap",
    metaDescription: "Mesafe, 100 km yakıt tüketimi, litre fiyatı, geçiş giderleri ve kişi sayısıyla yolculuk maliyetini hesaplayın.",
    intro: "Mesafe, aracınızın tüketimi ve kendi girdiğiniz yakıt fiyatına göre yolculuk yakıt giderini hesaplayın. Mesafe ve fiyat otomatik alınmaz; geçiş ve diğer giderleri isteğe bağlı ekleyin.",
    formula: "Yakıt gideri = mesafe × (tek yön veya gidiş-dönüş katsayısı) × tüketim ÷ 100 × litre fiyatı. Yol toplamı = yakıt + ek giderler.",
    example: "300 km tek yön, 7 L/100 km ve 40 TL/L ile yakıt gideri 840 TL'dir; ek giderler bunun üzerine eklenir.",
    mode: "trip-cost",
    fields: [
      numberField("distance", "Tek yön mesafe", "Örn. 300", "km"),
      numberField("consumption", "Araç tüketimi", "Örn. 7", "L/100 km"),
      numberField("fuelPrice", "Yakıt fiyatı", "Örn. 40", "₺/L"),
      selectField("journey", "Yolculuk yönü", [
        { label: "Tek yön", value: "one-way" },
        { label: "Gidiş dönüş", value: "round-trip" }
      ]),
      numberField("otherCosts", "Geçiş ve diğer giderler", "Örn. 0", "₺"),
      numberField("people", "Yolcu sayısı", "Örn. 1", "kişi")
    ]
  },
  {
    id: "desi-hacim-hesaplama", name: "Desi ve hacim ağırlığı hesaplama", category: "gunluk-yasam", createdAt: "2026-11-05T10:35:47+03:00",
    description: "Paket ölçüleri ve girilen desi böleniyle hacim ağırlığını hesaplayın.",
    title: "Desi Hesaplama – Kargo Hacim Ağırlığı ve Paket Hacmi | PratikHesap",
    metaDescription: "Paket en, boy ve yüksekliğini, ölçü birimini ve taşıyıcı desi bölenini girerek desi ile hacim ağırlığını hesaplayın.",
    intro: "Paket ölçülerinden hacmi ve sizin belirlediğiniz desi bölenine göre hacim ağırlığını bulun. Taşıyıcıların bölenleri ve ücretlendirme kuralları farklı olabilir; gönderi ücretini otomatik belirlemez.",
    formula: "Hacim (cm³) = en × boy × yükseklik. Hacim ağırlığı (kg) = hacim (cm³) ÷ girilen desi böleni.",
    example: "30 × 20 × 10 cm paket ve 3.000 böleniyle hacim 6.000 cm³, hacim ağırlığı 2 kg'dır.",
    mode: "dimensional-weight",
    fields: [
      numberField("width", "En", "Örn. 30"),
      numberField("length", "Boy", "Örn. 20"),
      numberField("height", "Yükseklik", "Örn. 10"),
      selectField("sizeUnit", "Ölçü birimi", [
        { label: "Santimetre", value: "cm" }, { label: "Milimetre", value: "mm" }, { label: "Metre", value: "m" }
      ]),
      numberField("divisor", "Desi böleni", "Taşıyıcınızın değerini girin"),
      numberField("actualWeight", "Gerçek ağırlık (isteğe bağlı)", "Örn. 1,5", "kg")
    ]
  },
  {
    id: "is-gunu-hesaplama", name: "İş günü hesaplama", category: "tarih",
    description: "İki tarih arasındaki seçtiğiniz çalışma günlerini sayın; tatilleri siz tanımlayın.",
    title: "İş Günü Hesaplama – İki Tarih Arası Hafta İçi Gün Sayısı | PratikHesap",
    metaDescription: "Başlangıç ve bitiş dahil seçenekleri, cumartesi çalışma seçimi ve kullanıcı tanımlı tam gün tatillerle iş günü sayısını hesaplayın.",
    intro: "İş günü sayımında başlangıç/bitiş dahil durumunu seçin, isterseniz cumartesiyi iş günü sayın ve tam gün tatilleri kendiniz girin. Resmî tatil takvimi otomatik alınmaz; yarım günler ayrı hesaplanmaz.",
    formula: "İş günü = seçilen tarih aralığındaki pazartesi-cuma günleri (isteğe bağlı cumartesi) − kullanıcı tarafından girilen tam gün tatilleri.",
    example: "Pazartesiden sonraki pazartesiye kadar iki uç tarih hariç tutulursa hafta içi 4 iş günü sayılır.",
    fields: [
      dateField("startDate", "Başlangıç tarihi"),
      dateField("endDate", "Bitiş tarihi"),
      selectField("includeStart", "Başlangıç tarihini say", [{ label: "Hariç", value: "no" }, { label: "Dahil", value: "yes" }]),
      selectField("includeEnd", "Bitiş tarihini say", [{ label: "Dahil", value: "yes" }, { label: "Hariç", value: "no" }]),
      selectField("saturday", "Cumartesiyi iş günü say", [{ label: "Hayır", value: "no" }, { label: "Evet", value: "yes" }]),
      textField("holidays", "Çıkarılacak tam gün tatiller (isteğe bağlı)", "YYYY-MM-DD, YYYY-MM-DD", "Resmî tatilleri otomatik indirmez; tarihleri virgülle ayırarak kendiniz girin.")
    ]
  }
];

export const legacyCalculatorRedirects: Record<string, string> = {
  "/not-ortalamasi-hesaplama": "/not-ortalamasi-gano-hesaplama",
  "/ders-ortalamasi-hesaplama": "/not-ortalamasi-gano-hesaplama",
  "/maas-zam-hesaplama": "/maas-zam-artis-hesaplama",
  "/maas-artis-hesaplama": "/maas-zam-artis-hesaplama"
};
const hiddenLegacyIds = new Set(["not-ortalamasi-hesaplama", "ders-ortalamasi-hesaplama", "maas-zam-hesaplama", "maas-artis-hesaplama"]);
export const tools = toolCatalog.filter((tool) => !hiddenLegacyIds.has(tool.id));

export const getTool = (slug: string): ToolDefinition | undefined => tools.find((tool) => tool.id === slug);
export const getCategory = (id: string) => categories.find((category) => category.id === id);
