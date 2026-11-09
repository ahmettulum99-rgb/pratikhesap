import type { CalculatorPageContent, FieldDefinition, ToolDefinition } from "./tools";

const numberField = (
  name: string,
  label: string,
  placeholder: string,
  unit = "₺",
  help?: string,
  showWhen?: FieldDefinition["showWhen"]
): FieldDefinition => ({
  name, label, type: "number", placeholder, unit, help, showWhen
});
const selectField = (
  name: string,
  label: string,
  options: { label: string; value: string }[],
  showWhen?: FieldDefinition["showWhen"]
): FieldDefinition => ({
  name, label, type: "select", options, showWhen
});
const monthOptions = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
].map((label, index) => ({ label, value: String(index + 1) }));

function content(
  definition: string,
  steps: string[],
  examples: CalculatorPageContent["examples"],
  faqs: CalculatorPageContent["faqs"],
  sources: CalculatorPageContent["sources"],
  lastUpdated = "2026-11-09"
): CalculatorPageContent {
  return { definition, steps, examples, faqs, sources, lastUpdated };
}

const officialSource = (name: string, url: string, note: string) => ({ name, url, note });
const laborCode = officialSource("4857 sayılı İş Kanunu", "https://www.mevzuat.gov.tr/mevzuatmetin/1.5.4857.pdf", "Çalışma süreleri, ihbar ve yıllık izin hükümleri; hesap sonucu hukuki uygunluk değerlendirmesi değildir.");
const treasury = officialSource("Hazine ve Maliye Bakanlığı", "https://www.hmb.gov.tr/", "Dönemsel parasal sınırlar ve ilgili resmî duyurular için.");
const incomeTaxSource = officialSource("Gelir İdaresi Başkanlığı – Gelir Vergisi Tarifesi 2026", "https://cdn.gib.gov.tr/api/gibportal-file/file/getFileResources?objectKey=arsiv/yardim-kaynaklar/yararli-bilgiler/gelir-vergisi-tarifeleri/gelir-vergisi-tarifesi-2026.pdf", "2026 ücret gelir tarifesi; oranlar yapılandırmada doğrulanmadan vergi sonucu üretilmez.");
const stampLaw = officialSource("488 sayılı Damga Vergisi Kanunu", "https://www.mevzuat.gov.tr/mevzuatmetin/1.5.488.pdf", "Damga vergisi belge türüne göre değişir; araç yalnızca yapılandırılmış belge türlerini kapsar.");
const feeLaw = officialSource("492 sayılı Harçlar Kanunu", "https://www.mevzuat.gov.tr/mevzuatmetin/1.5.492.pdf", "Tapu işlemleri için (4) sayılı tarife ve yürürlükteki değişiklikler.");

export const regulatedTools: ToolDefinition[] = [
  {
    id: "kidem-tazminati-hesaplama", name: "Kıdem tazminatı hesaplama", category: "finans", popular: true, createdAt: "2026-11-09T09:19:47+03:00",
    description: "Hizmet süresi, giydirilmiş brüt ücret ve dönem tavanına göre kıdem tutarını tahmin edin.",
    title: "Kıdem Tazminatı Hesaplama 2026 – Brüt Tutar ve Tavan | PratikHesap",
    metaDescription: "İşe giriş ve çıkış tarihinizle, düzenli ücret ekleri ve dönem tavanını dikkate alan brüt kıdem tazminatı tahmini yapın. Mevzuat varsayımlarını inceleyin.",
    intro: "Kıdem tazminatı hesabı, hizmet süresi ve tazminata esas ücret yanında hak kazanma koşullarına ve ilgili dönem tavanına bağlıdır. Araç brüt tutar tahmini verir; hak kazanma durumunu belirlemez.",
    formula: "Yaklaşık brüt kıdem = min(aylık giydirilmiş brüt ücret, yürürlükteki tavan) × hizmet süresi (yıl).",
    example: "Düzenli aylık ücret ve menfaatler birlikte değerlendirilir; tavanı aşan ücret varsa hesaplama yalnız doğrulanmış dönem tavanını esas alır.",
    fields: [
      numberField("monthlyGross", "Aylık brüt ücret", "Örn. 60000"),
      numberField("regularBenefits", "Düzenli aylık ücret ekleri", "Örn. 5000"),
      { name: "startDate", label: "İşe giriş tarihi", type: "date" },
      { name: "endDate", label: "İşten ayrılış tarihi", type: "date" }
    ],
    mode: "severance",
    content: content(
      "Kıdem tazminatı, iş sözleşmesinin sona ermesi durumunda 1475 sayılı İş Kanunu’nun yürürlükte bırakılan 14. maddesindeki şartlarla gündeme gelebilen bir işçilik alacağıdır. Bu hesapta yalnızca çalışılan takvim süresi ve son brüt ücret bilgisi yeterli olmayabilir: sona erme nedeni, kıdem koşulları, düzenli para veya para ile ölçülebilir menfaatlerin niteliği ve tazminat tavanı da önem taşır. Bu nedenle araç, kullanıcının girdiği işe giriş ve ayrılış tarihleriyle aylık ücret ve düzenli ekleri kullanarak koşullu brüt bir matematik tahmini sunar; işçinin tazminata hak kazanıp kazanmadığını karara bağlamaz. Uygulanacak tavan, yürürlük tarihine göre değişebildiğinden hesaplama tarihinde geçerli resmî değer yapılandırmadan alınır; doğrulanmayan değerle sonuç gösterilmez. Ücretsiz izin, aralıklı çalışma, işyeri devri, ölüm, askerlik, emeklilik veya özel fesih durumları hukuki değerlendirme gerektirebilir. Kullanıcı yalnızca düzenli ve ücret niteliğinde olduğunu düşündüğü kalemleri girmeli; tek seferlik ya da masraf karşılığı ödemeleri otomatik olarak ücrete eklememelidir. Gösterilen sonuç brüt tutardır; vergi, kesinti ve net ödeme tahmini bu aracın kapsamında değildir. Kesin hesap için sözleşme, bordro, hizmet dökümü ve fesih belgeleri birlikte incelenmelidir.",
      ["Aylık brüt ücreti ve düzenli ücret eklerini girin; işe giriş ve ayrılış tarihlerini seçin.", "Araç, hizmet süresini ve tazminata esas aylık tutarı hesaplar; sonucu ilgili dönem tavanıyla sınırlar.", "Tazminat hakkı ve ücret kalemlerinin hukuki niteliği ayrıca doğrulanmalıdır; sonuç yalnızca brüt tahmindir."],
      [
        { title: "Tavanın altında ücret", calculation: "Aylık esas ücret × tam hizmet yılı", result: "Dönem tavanı aşılmadığında yaklaşık brüt karşılık, esas ücret ve hizmet süresinin çarpımıdır." },
        { title: "Tavanın üzerindeki ücret", calculation: "min(aylık esas ücret, dönem tavanı) × hizmet yılı", result: "Hesaplanan brüt tutarda her hizmet yılı için en fazla geçerli tavan dikkate alınır." }
      ],
      [
        { question: "Kıdem tazminatına herkes hak kazanır mı?", answer: "Hayır. Hak kazanma koşulları iş sözleşmesinin sona erme biçimine ve kanundaki şartlara bağlıdır; araç bu hukuki koşulları değerlendirmez." },
        { question: "Kıdem hesabında hangi ücret kullanılır?", answer: "Genellikle sona erme tarihindeki son brüt ücret ve niteliği uygun düzenli menfaatler önem taşır. Hangi ödemenin dahil olacağı somut bordro ve mevzuata bağlıdır." },
        { question: "Kıdem tazminatı tavanı neden seçilen döneme göre değişiyor?", answer: "Tavan resmî düzenlemeyle belirlenen dönemsel bir sınırdır. İşten ayrılış tarihinde yürürlükte olan doğrulanmış değer kullanılmalıdır." },
        { question: "Araç kıdem tazminatının netini hesaplar mı?", answer: "Hayır. Bu araç brüt tutar tahmini verir; vergi ve diğer kesintiler kapsam dışıdır." },
        { question: "İşe giriş ve çıkış tarihleri neden isteniyor?", answer: "Hizmet süresini takvim tarihleri üzerinden belirlemek için gereklidir. Aralıklı çalışma veya hizmet birleştirme gibi durumlar ayrıca ele alınmaz." },
        { question: "Düzenli prim veya yemek yardımı eklenebilir mi?", answer: "Yalnızca niteliği ve düzenliliği tazminata esas ücrete dahil edilebilecek kalemleri değerlendirmek gerekir; bu araç ödeme kalemlerinin hukuki niteliğini sınıflandırmaz." },
        { question: "Bu sonuç resmi kıdem hesabı mıdır?", answer: "Hayır. Sonuç bilgi amaçlı matematik tahminidir; fesih nedeni ve hak sahipliği için uzman değerlendirmesi gerekir." }
      ],
      [
        officialSource("1475 sayılı İş Kanunu, m.14", "https://www.mevzuat.gov.tr/mevzuatmetin/1.5.1475.pdf", "Kıdem tazminatının kanuni koşulları ve hesap esasları."),
        treasury,
        stampLaw
      ]
    )
  },
  {
    id: "ihbar-tazminati-hesaplama", name: "İhbar tazminatı hesaplama", category: "finans", createdAt: "2026-11-09T09:19:47+03:00",
    description: "Hizmet süresine göre ihbar süresini ve brüt ihbar tazminatı tahminini bulun.",
    title: "İhbar Tazminatı Hesaplama – İhbar Süresi ve Brüt Tutar | PratikHesap",
    metaDescription: "İşe giriş ve ayrılış tarihlerine göre 4857 sayılı Kanun’daki ihbar süresini ve brüt ihbar tazminatı tahminini hesaplayın.",
    intro: "Hizmet süresiyle belirlenen yasal ihbar haftalarını ve aylık brüt ücrete göre yaklaşık brüt karşılığı hesaplayın. Fesih bildiriminin geçerliliği değerlendirilmez.",
    formula: "Brüt ihbar tahmini = aylık brüt ücret ÷ 30 × ihbar gün sayısı.",
    example: "Hizmet süresine göre yasal bildirim süresi hafta olarak belirlenir; haftalar yedi gün kabul edilerek brüt günlük ücretle çarpılır.",
    fields: [
      numberField("monthlyGross", "Aylık brüt ücret", "Örn. 60000"),
      { name: "startDate", label: "İşe giriş tarihi", type: "date" },
      { name: "endDate", label: "İşten ayrılış tarihi", type: "date" }
    ],
    mode: "notice",
    content: content(
      "İhbar süresi, belirsiz süreli iş sözleşmesinin sona erdirilmesinden önce karşı tarafa yapılması gereken bildirim süresini ifade eder. 4857 sayılı İş Kanunu’nun 17. maddesi, bildirim süresini işçinin işyerindeki kıdemine göre kademelendirir. Bildirim süresine uyulmaması halinde doğabilecek ihbar tazminatının tutarı ücret bilgisine ve süreye bağlıdır; ancak fesihte bildirim yapılıp yapılmadığı, sözleşmenin belirli veya belirsiz süreli oluşu, haklı nedenle fesih ve özel sözleşme hükümleri sonuca etki edebilir. Bu hesaplayıcı yalnızca giriş ve ayrılış tarihleriyle yaklaşık hizmet süresini belirler, kanundaki genel süre basamağını seçer ve aylık brüt ücretten brüt parasal karşılık üretir. Düzenli ücret eklerinin dahil edilmesi duruma göre değişebileceğinden temel araç bunların hukuki niteliğini incelemez. Brüt sonuçtan vergi veya başka kesintileri düşmez ve net ödeme sözü vermez. Bildirim süresinin iş arama izni, yıllık izinle ilişkisi ya da fesih bildiriminin geçerliliği gibi konular da burada çözümlenmez. Sonucu, iş sözleşmesi ve gerçek çalışma kayıtlarıyla birlikte değerlendirin; uyuşmazlık varsa yetkili uzmana başvurun. Hizmet süresindeki sınırlar kanundaki hafta basamaklarının başlangıcını belirler; fesih tarihi, bildirim tarihiyle aynı olmak zorunda değildir. Kullanılan tarihler, hesaplayıcının seçtiği genel basamağı etkilediği için kayıtlarla karşılaştırılmalıdır.",
      ["İşe giriş ve ayrılış tarihini girerek aynı işverendeki hizmet süresini belirtin.", "Aylık brüt ücreti girin; hesaplayıcı kanundaki genel kıdem basamağını ve hafta sayısını uygular.", "Brüt tutarı ve kullanılan süreyi inceleyin; fesih şartları ve sözleşme hükümleri ayrıca değerlendirilmelidir."],
      [
        { title: "Altı aydan kısa hizmet", calculation: "Aylık brüt ücret ÷ 30 × 14 gün", result: "Genel kuraldaki iki haftalık bildirim süresine karşılık gelen brüt örnek." },
        { title: "Üç yılı aşan hizmet", calculation: "Aylık brüt ücret ÷ 30 × 56 gün", result: "Genel kuraldaki sekiz haftalık bildirim süresine karşılık gelen brüt örnek." }
      ],
      [
        { question: "İhbar süresi neye göre belirlenir?", answer: "Belirsiz süreli iş sözleşmesinde 4857 sayılı İş Kanunu m.17’deki hizmet süresi basamakları esas alınır." },
        { question: "İhbar tazminatı net mi brüt mü gösterilir?", answer: "Araç yalnızca aylık brüt ücretten hesaplanan brüt tutarı gösterir; kesintileri ve net ödemeyi hesaplamaz." },
        { question: "Her işten ayrılışta ihbar tazminatı olur mu?", answer: "Hayır. Sözleşme türü, fesih nedeni ve bildirim koşulları önemlidir; araç hak kazanma durumunu tespit etmez." },
        { question: "İhbar süresi hafta mı gün mü hesaplanır?", answer: "Kanundaki süre haftayla ifade edilir. Tutar hesabında bir hafta yedi takvim günü kabul edilerek parasal karşılık gösterilir." },
        { question: "İş arama izni veya yıllık izin hesaba giriyor mu?", answer: "Hayır. Araç yalnızca genel ihbar süresi ve brüt ücret üzerinden yaklaşık tutarı gösterir." },
        { question: "Düzenli yan haklar brüt ücrete eklenmeli mi?", answer: "Bu durum ödemenin niteliğine ve uygulanacak kurala bağlıdır. Araç, hangi yan hakkın dahil edileceğine karar vermez." },
        { question: "Sonuç hukuki danışmanlık yerine geçer mi?", answer: "Hayır. Sözleşme ve fesih koşullarının değerlendirilmesi için yetkili uzmana başvurun." }
      ],
      [laborCode]
    )
  },
  {
    id: "yillik-izin-ucreti-hesaplama", name: "Yıllık izin ücreti hesaplama", category: "finans", createdAt: "2026-11-09T09:19:47+03:00",
    description: "Yıllık izin günlerini ve izin dönemindeki ya da kullanılmamış izindeki brüt ücreti hesaplayın.",
    title: "Yıllık İzin Ücreti Hesaplama – İzin Gün Sayısı ve Brüt Tutar | PratikHesap",
    metaDescription: "Hizmet süresi ve yaşınıza göre yıllık izin alt sınırını, kullandığınız izin günlerinin veya kullanılmamış izin alacağının brüt karşılığını bulun.",
    intro: "Kanundaki asgari izin günlerini hizmet süresi ve yaş bilgisiyle tahmin edin; kullanılan izin ve işten ayrılışta kullanılmamış izin senaryolarını ayrı gösterin.",
    formula: "Günlük brüt ücret = aylık brüt ücret ÷ 30; brüt izin dönemi karşılığı = günlük ücret × izin günü.",
    example: "İzin hakkı, hizmet yılı ve yaş koşullarına göre kanuni asgari gün sayısıyla karşılaştırılır; parasal sonuç brüt olarak gösterilir.",
    fields: [
      numberField("monthlyGross", "Aylık brüt ücret", "Örn. 45000"),
      { name: "startDate", label: "İşe giriş tarihi", type: "date" },
      { name: "asOfDate", label: "İzin / ayrılış tarihi", type: "date" },
      numberField("age", "Yaş", "Örn. 35", "yaş"),
      numberField("usedDays", "Kullanılacak izin günü", "Örn. 14", "gün"),
      numberField("unusedDays", "İşten ayrılırken kalan izin günü", "Örn. 0", "gün")
    ],
    mode: "annual-leave",
    content: content(
      "Yıllık ücretli izin, 4857 sayılı İş Kanunu kapsamındaki işçiler için çalışma yılına bağlı dinlenme hakkıdır. Kanun, hizmet süresine göre asgari izin günleri belirler; 18 yaşından küçük veya 50 yaşından büyük çalışanlar için ayrıca asgari koruma bulunur. Bu nedenle izin hesabı yalnızca yaşa veya yalnızca çalışılan yıla bakılarak yapılamaz. Araç, aynı işyerindeki hizmet süresi ve yaşı kullanarak genel asgari izin gününü tahmin eder. Kullanılan yıllık izin döneminde ücret, çalışılmayan izin günleri için ücretli izin kuralı kapsamında değerlendirilir; iş sözleşmesi sona erdiğinde kullanılmamış ve doğmuş izin haklarının ücreti ise farklı bir ödeme senaryosudur. Bu iki durumu karıştırmamak için araç kullanılan izin günü ile işten ayrılışta kalan günü ayrı alır ve brüt tutarları ayrı gösterir. Aylık ücretin günlük karşılığı için 30 günlük hesap varsayımı kullanılır. Toplu iş sözleşmesi daha fazla izin verebilir; kısmi yıl, ücretsiz izin, devreden izin kayıtları ve ücretin değişken bileşenleri sonucu etkileyebilir. Araç işveren kayıtlarını doğrulamaz, izin hakkının doğup doğmadığına karar vermez ve kesinti sonrası net tutarı hesaplamaz. Kesin hesap için çalışma ve izin kayıtlarınızı inceleyin.",
      ["Aylık brüt ücreti, işe giriş tarihini, izin/ayrılış tarihini ve yaşı girin.", "Kullanılacak izin gününü ve işten ayrılışta kalan izin gününü birbirinden ayrı belirtin.", "Araç kanuni asgari izin süresini ve iki ayrı brüt ücret karşılığını gösterir; işyeri sözleşmesi daha fazla hak tanıyabilir."],
      [
        { title: "Kullanılacak izin dönemi", calculation: "Aylık brüt ücret ÷ 30 × kullanılan izin günü", result: "Bu tutar izin dönemi ücretinin yaklaşık brüt karşılığıdır; normal maaşa ek bir ikramiye anlamına gelmez." },
        { title: "İşten ayrılışta kullanılmamış izin", calculation: "Aylık brüt ücret ÷ 30 × kalan izin günü", result: "İş sözleşmesinin sona ermesinde kalan izin günlerine ilişkin yaklaşık brüt alacak gösterilir." }
      ],
      [
        { question: "Asgari yıllık izin günü nasıl bulunur?", answer: "4857 sayılı Kanun m.53’teki hizmet süresi aralıkları ve 18 yaş altı/50 yaş üstü için özel alt sınırlar dikkate alınır." },
        { question: "Kullanılan izin ücreti ayrıca mı ödenir?", answer: "Yıllık izin ücretli dinlenme hakkıdır; bu araç izin günlerine karşılık gelen brüt ücret değerini gösterir, ek ödeme/prim iddiası oluşturmaz." },
        { question: "Kullanılmayan izin işten ayrılınca ne olur?", answer: "Kanundaki koşullarda sözleşmenin sona erdiği tarihte kullanılmamış izin hakkı ücret alacağına dönüşebilir. Araç yalnızca verilen gün sayısının matematik karşılığını hesaplar." },
        { question: "İşveren daha uzun izin verebilir mi?", answer: "Evet. İş sözleşmesi veya toplu iş sözleşmesi kanuni asgari sürelerin üzerinde hak tanıyabilir." },
        { question: "Araç net izin ücreti verir mi?", answer: "Hayır. Sonuçlar brüt tutar tahminidir; bordro kesintileri hesaplanmaz." },
        { question: "Deneme süresi izin hesabına katılır mı?", answer: "Hizmet süresi ve özel çalışma ilişkileri hukuki değerlendirme gerektirir. Araç girilen süreyi kullanır, hizmet kaydını doğrulamaz." },
        { question: "Kısmi süreli çalışanlar için sonuç kesin midir?", answer: "Hayır. Çalışma biçimi, kayıtlar ve sözleşme koşulları sonucu etkileyebilir; araç genel bilgilendirme sağlar." }
      ],
      [laborCode]
    )
  },
  {
    id: "kira-artis-orani-hesaplama", name: "Kira artış oranı hesaplama", category: "finans", popular: true, createdAt: "2026-11-09T09:19:47+03:00",
    description: "En son yayımlanan TÜFE 12 aylık ortalamasını yapılandırılmış resmî veriden kullanın.",
    title: "Kira Artış Oranı Hesaplama 2026 – TÜFE 12 Aylık Ortalama | PratikHesap",
    metaDescription: "Mevcut kira tutarını girin; seçilen yenileme dönemi için doğrulanmış TÜİK TÜFE 12 aylık ortalama oranına göre örnek yeni kira tutarını hesaplayın.",
    intro: "TÜFE 12 aylık ortalama oranını kaynak ve açıklanma tarihiyle config üzerinden kullanın. Mevzuat sınırları ve kira sözleşmenizin koşulları ayrıca kontrol edilmelidir.",
    formula: "Örnek yeni kira = mevcut kira × (1 + TÜFE 12 aylık ortalaması ÷ 100).",
    example: "Araç, config’teki en son doğrulanmış oranı mevcut kira tutarına uygular ve kullanılan veri dönemini açıklar.",
    fields: [
      numberField("currentRent", "Mevcut kira tutarı", "Örn. 20000"),
      selectField("renewalMonth", "Kira yenileme ayı", monthOptions)
    ],
    mode: "rent-increase",
    content: content(
      "Kira artış oranı hesabında kullanılacak üst sınır, kiralananın türü, sözleşme koşulları ve yürürlükteki mevzuata göre değerlendirilmelidir. Konut ve çatılı işyeri kiralarında Türk Borçlar Kanunu’nun 344. maddesi tüketici fiyat endeksinin on iki aylık ortalamalara göre değişimini esas alan bir sınır düzenler; özel geçici düzenlemeler de dönemsel olarak bu uygulamayı değiştirebilir. Bu araç, kullanıcının mevcut kira tutarına yapılandırılmış TÜİK verisindeki seçili veya en son yayımlanmış on iki aylık ortalama oranını uygular ve yalnızca aritmetik sonuç verir. Oranın hangi istatistik dönemine ait olduğu ve TÜİK’in açıklama tarihi sonuçla birlikte gösterilmelidir; henüz yayımlanmamış ay için tahmin yapılmamalıdır. Yenileme ayı seçimi, TÜİK’in ilgili döneme ait verisinin kullanılabilir olup olmadığını belirlemeye yarar. Sözleşmedeki artış hükmü, kira türü, mahkeme kararı veya taraflar arasındaki özel anlaşmalar genel hesaplamadan farklı sonuç doğurabilir. Araç yasal danışmanlık vermez, sözleşmeyi incelemez ve artışın uygulanabilirliğini onaylamaz. Veri config’te güncel değilse sonuç göstermemek, eski oranı güncelmiş gibi sunmaktan daha güvenlidir. Gerçek artış tarihindeki resmî veriyi ve mevzuatı kontrol edin.",
      ["Kira yenileme ayını seçin; araç yalnızca o dönem için yayımlanmış ve yapılandırmada bulunan resmî oranı kullanır.", "Mevcut kira tutarını girin.", "Yeni örnek tutarı, uygulanan oranı, TÜİK veri dönemini ve güncelleme tarihini kontrol edin; sözleşme ve mevzuat koşullarını ayrıca değerlendirin."],
      [
        { title: "TÜFE oranını uygulama", calculation: "Mevcut kira × (1 + yapılandırılmış TÜFE oranı ÷ 100)", result: "Gösterilen yeni tutar, seçilen ayın resmî verisiyle yapılan matematik örneğidir." },
        { title: "Yayımlanmamış dönem", calculation: "İlgili ay için yayımlanmış TÜFE oranı yok", result: "Araç gelecek ayın oranını tahmin etmez ve veri olmadığı durumda sonuç üretmez." }
      ],
      [
        { question: "Kira artışı hangi TÜFE değerine göre hesaplanır?", answer: "Genel olarak TBK m.344’teki 12 aylık ortalama TÜFE değişimi dikkate alınır; uygulanacak kural kira türü ve yürürlükteki mevzuata bağlıdır." },
        { question: "Araç oranı kendisi mi tahmin eder?", answer: "Hayır. Yalnızca yapılandırılmış ve yayımlanmış TÜİK verisi kullanılmalıdır; geleceğe dönük oran tahmini yapılmaz." },
        { question: "Konut ve işyeri kiralarında aynı kural mı var?", answer: "Kira türü, sözleşme ve yürürlükteki özel düzenlemeler önemlidir. Araç tüm hukuki istisnaları değerlendirmez." },
        { question: "Oran güncel değilse ne olur?", answer: "Veri dönemi ve güncelleme tarihi açıklanmalıdır; ilgili dönem oranı doğrulanamıyorsa güncel sonuç gösterilmemelidir." },
        { question: "Ev sahibi daha yüksek artış yapabilir mi?", answer: "Bu, sözleşme ve mevzuatın somut duruma uygulanmasına bağlıdır; araç hukuki uyuşmazlık veya uygulanabilirlik kararı vermez." },
        { question: "Yeni kira tutarı zorunlu sözleşme bedeli midir?", answer: "Hayır. Sonuç, girilen tutara oran uygulanarak bulunan bilgilendirme amaçlı matematik karşılığıdır." },
        { question: "Kaynak TÜİK verisi nereden kontrol edilir?", answer: "TÜFE bültenleri ve veri tabloları TÜİK’in resmî veri portalında yayımlanır." }
      ],
      [
        officialSource("TÜİK – Veri Portalı", "https://data.tuik.gov.tr/", "TÜFE bültenleri ve 12 aylık ortalama değişim serileri; kullanılacak dönem değeri yapılandırmada kaynak tarihiyle tutulur."),
        officialSource("6098 sayılı Türk Borçlar Kanunu, m.344", "https://www.mevzuat.gov.tr/mevzuatmetin/1.5.6098.pdf", "Kira bedelinin belirlenmesine ilişkin hükümler.")
      ]
    )
  },
  ...(["konut", "ihtiyac", "tasit"] as const).map((kind): ToolDefinition => {
    const config = {
      konut: { id: "konut-kredisi-hesaplama", name: "Konut kredisi hesaplama", title: "Konut Kredisi Hesaplama – Aylık Taksit ve Amortisman | PratikHesap", search: ["konut kredisi taksit hesaplama", "ev kredisi geri ödeme", "konut finansmanı amortisman tablosu"] },
      ihtiyac: { id: "ihtiyac-kredisi-hesaplama", name: "İhtiyaç kredisi hesaplama", title: "İhtiyaç Kredisi Hesaplama – KKDF, BSMV ve Taksit | PratikHesap", search: ["ihtiyaç kredisi taksit hesaplama", "tüketici kredisi geri ödeme", "kredi KKDF BSMV hesaplama"] },
      tasit: { id: "tasit-kredisi-hesaplama", name: "Taşıt kredisi hesaplama", title: "Taşıt Kredisi Hesaplama – Aylık Taksit ve Geri Ödeme | PratikHesap", search: ["taşıt kredisi hesaplama", "araç kredisi aylık taksit", "taşıt kredisi amortisman tablosu"] }
    }[kind];
    return {
      id: config.id, name: config.name, category: "finans", createdAt: "2026-11-09T09:19:47+03:00",
      description: `${config.name} türü için aylık faiz, vade ve doğrulanmış KKDF/BSMV varsayımlarıyla ödeme planı hazırlayın.`,
      title: config.title,
      metaDescription: `${config.name}; aylık faiz ve vade girerek eşit taksit, toplam geri ödeme, faiz vergileri ve aylık amortisman tablosunu hesaplayın.`,
      intro: `${config.name} için aylık banka faizini kullanıcı girer. KKDF ve BSMV seçilen finansman türüne göre kaynaklı yapılandırmadan alınır; bankaya özel ücret, sigorta ve kampanya koşulları dahil değildir.`,
      formula: "Aylık eşit taksit, dönem faiz oranı ve seçilen kredi vergilerinin eklenmiş nakit akışına göre anüite formülüyle hesaplanır; aylık tabloda faiz, vergiler ve anapara ayrıştırılır.",
      example: "Aylık oran ve vade değiştiğinde taksit ile toplam finansman maliyeti değişir; amortisman tablosu her ay kalan borcu gösterir.",
      fields: [
        numberField("principal", "Kredi anaparası", "Örn. 1000000"),
        numberField("monthlyRate", "Aylık faiz oranı", "Örn. 2,5", "%"),
        numberField("months", "Vade", "Örn. 120", "ay"),
        selectField("applyKkdf", "KKDF uygula", [{ label: "Ürün için geçerliyse uygula", value: "yes" }, { label: "Uygulama", value: "no" }]),
        selectField("applyBsmv", "BSMV uygula", [{ label: "Ürün için geçerliyse uygula", value: "yes" }, { label: "Uygulama", value: "no" }])
      ],
      mode: "amortized-loan",
      content: content(
        `${config.name}, belirli bir anaparanın kararlaştırılan vadede faiz ve ürün için geçerli vergi kalemleriyle geri ödenmesini modelleyen bir finansman hesabıdır. Konut finansmanı, tüketici ihtiyaç kredisi ve taşıt kredileri aynı ödeme formülünü kullanabilse de vergi istisnaları, kredi vade veya tahsis koşulları ve kurum teklifleri bakımından aynı değildir. Bu sayfada aylık faiz oranı kullanıcı tarafından girilir; oran bir banka teklifi veya garanti edilmiş piyasa verisi değildir. KKDF ve BSMV seçimleri, doğrulanmış ve ilgili kredi türüne ait yapılandırma kuralları üzerinden değerlendirilmelidir. Aylık eşit taksit yöntemi, her ödeme döneminde faiz ve vergi payı hesaplanıp kalan borca anapara ödemesi uygulanmasıyla çalışır. Amortisman çizelgesi, başlangıç borcunu, dönem faizini, vergi tutarlarını, ödemedeki anapara payını ve kalan anaparayı gösterir. Tahsis ücreti, ekspertiz, sigorta, ipotek, erken ödeme, gecikme, değişken faiz ve banka kampanyaları temel çizelgeye dahil edilmez. Kredi/değer ve vade sınırları bankanın ve BDDK düzenlemelerinin koşullarına bağlı olabilir; bu araç kredi onayı veya borçlanma tavsiyesi değildir. Sonuçları banka ödeme planı ve sözleşme koşullarıyla karşılaştırın.`,
        ["Finansman türünü doğru sayfada seçin; anapara, bankanın teklif ettiği aylık faiz ve ay cinsinden vadeyi girin.", "KKDF/BSMV seçimlerini yalnızca yapılandırmada o ürün için geçerli olduğu belirtilen kalemlere göre yapın.", "Eşit taksiti, toplam geri ödemeyi ve amortisman tablosundaki vergi/faiz/anapara ayrımını inceleyin."],
        [
          { title: "Faizsiz örnek", calculation: "Anapara ÷ vade", result: "Faiz ve vergi sıfırsa eşit ödeme anaparanın dönem sayısına bölünmesidir." },
          { title: "Vergili örnek", calculation: "Faiz + ürün için yapılandırılmış faiz vergileri; her dönemde kalan anaparaya uygulanır", result: "Gerçek taksit tutarı girilen oran, vade ve doğrulanmış ürün parametreleriyle hesaplanır." }
        ],
        [
          { question: "Faiz oranını araç mı güncel bankalardan alıyor?", answer: "Hayır. Aylık faiz oranı kullanıcı girdisidir; bankaların fiyatları ve kampanyaları sürekli değişebilir." },
          { question: "KKDF ve BSMV her kredi türünde uygulanır mı?", answer: "Uygulama kredi türü ve yürürlükteki mevzuata bağlıdır. Araçta yalnızca doğrulanmış ürün parametresi kullanılmalıdır." },
          { question: "Amortisman tablosu neleri gösterir?", answer: "Her ayın taksitini, faizini, yapılandırılmış vergi kalemlerini, anapara ödemesini ve dönem sonu kalan borcu gösterir." },
          { question: "Dosya masrafı ve sigorta dahil mi?", answer: "Hayır. Bu sürüm kredi faiz/vergi taksit modelini kapsar; banka ücretleri ve sigorta teklife göre değişir." },
          { question: "Araç kredi onayı veya uygunluk sınırı hesaplıyor mu?", answer: "Hayır. Banka değerlendirmesi, gelir yeterliliği ve BDDK kredi/değer sınırları kapsam dışıdır." },
          { question: "Taksit bankanın teklifiyle aynı çıkar mı?", answer: "Mutlaka değil. Yuvarlama, ödeme günü, ücretler, sözleşme yöntemi ve banka uygulaması sonucu değiştirebilir." },
          { question: "Aylık oran yerine yıllık oran girebilir miyim?", answer: "Bu alan aylık nominal oran bekler. Yıllık ilan oranı sözleşme yöntemine göre dönüştürülmeden doğrudan girilmemelidir." }
        ],
        [
          officialSource("Gelir İdaresi Başkanlığı", "https://www.gib.gov.tr/", "KKDF ve BSMV uygulamasına ilişkin ilgili mevzuat ve açıklamalar."),
          officialSource("Bankacılık Düzenleme ve Denetleme Kurumu", "https://www.bddk.org.tr/", "Kredi düzenlemeleri; bu araç kredi onayı ya da limit denetimi yapmaz."),
          officialSource("Resmî Gazete", "https://www.resmigazete.gov.tr/", "Vergi oranları ve değişikliklerin yayımlandığı resmî kaynak.")
        ]
      )
    };
  }),
  {
    id: "mevduat-faiz-hesaplama", name: "Mevduat faiz getirisi hesaplama", category: "finans", popular: true, createdAt: "2026-11-09T09:19:47+03:00",
    description: "TL mevduatın vade sonu brüt ve stopaj sonrası getirisini hesaplayın.",
    title: "Mevduat Faiz Hesaplama – Stopaj Sonrası Net Getiri | PratikHesap",
    metaDescription: "TL mevduat tutarı, yıllık brüt faiz oranı ve vade gününü girin; güncel yapılandırılmış stopajla net faiz ve vade sonu bakiyeyi hesaplayın.",
    intro: "Banka faiz oranını ve vade gününü girin; vade sınıfına ve hesap tarihine uygun doğrulanmış stopaj yapılandırmasıyla basit vade faizi tahmini alın.",
    formula: "Brüt faiz = anapara × yıllık oran × gün ÷ 365; net faiz = brüt faiz × (1 − stopaj oranı).",
    example: "Araç vade sonunda ödenen basit faizi hesaplar; yenileme veya ara dönem bileşik getirisi varsaymaz.",
    fields: [
      numberField("principal", "Mevduat anaparası", "Örn. 250000"),
      numberField("annualRate", "Yıllık brüt faiz oranı", "Örn. 40", "%"),
      numberField("days", "Vade", "Örn. 92", "gün"),
      { name: "openingDate", label: "Hesap açılış / yenileme tarihi", type: "date" }
    ],
    mode: "deposit-interest",
    content: content(
      "Mevduat faiz getirisi, bankada belirli vadeyle tutulan anapara üzerinden sözleşmedeki brüt faiz oranı ve gün sayısıyla oluşan getiridir. Brüt faiz, stopaj kesintisi yapılmadan önceki tutardır; yatırımcının eline geçen net faiz, yürürlükteki stopaj uygulamasına göre daha düşüktür. Stopaj oranı yalnızca vade uzunluğuna değil, hesabın TL veya döviz cinsine, açılış ya da yenileme tarihine ve dönemsel mevzuat değişikliklerine de bağlı olabilir. Bu araç seçilen kapsam gereği TL mevduatta basit vade faizi hesabı yapar: kullanıcı bankanın teklif ettiği yıllık brüt oranı girer, sistem ise kaynak ve tarih bilgisi bulunan uygun stopaj yapılandırmasını seçer. Yayımlanmış ve doğrulanmış oran yoksa sonuç üretmek yerine kullanıcıya eksik veri bilgisi verilmelidir. Hesaplamada 365 günlük yıl varsayımı açıkça belirtilir; bankanın 360/365 gün yöntemi, küsurat ve ödeme günü farklı olabilir. Ara dönem faiz çekimi, otomatik yenileme, bileşikleşme, kampanya koşulu, hesap masrafı ve vergi istisnaları temel senaryoya dahil değildir. Sonuç garanti edilmiş getiri veya yatırım önerisi sayılmaz; gerçek net ödeme banka sözleşmesi ve vergi mevzuatıyla kontrol edilmelidir.",
      ["Anapara ve bankanın yıllık brüt faiz oranını girin.", "Vade gününü ve hesabın açılış/yenileme tarihini seçin; stopaj bu bilgilere göre belirlenir.", "Brüt faiz, stopaj, net faiz ve vade sonu toplamını inceleyin; veri tarihi ve 365 gün varsayımını kontrol edin."],
      [
        { title: "Brüt faiz örneği", calculation: "Anapara × yıllık oran × vade günü ÷ 365", result: "Sonuç, stopaj düşülmeden önceki basit faiz tutarıdır." },
        { title: "Stopaj sonrası örnek", calculation: "Brüt faiz × (1 − vade için doğrulanmış stopaj oranı)", result: "Net faiz, yalnızca seçilen tarih ve vade sınıfına ait resmî oran yapılandırılmışsa gösterilir." }
      ],
      [
        { question: "Mevduat stopajı neye göre seçilir?", answer: "Para birimi, vade ve hesabın açılış/yenileme tarihiyle yürürlükteki kararlar belirleyicidir; araç yalnızca doğrulanmış TL yapılandırmasını kullanır." },
        { question: "Faiz oranı güncel banka oranı mı?", answer: "Hayır. Yıllık brüt faiz oranını bankanızın teklifinden siz girersiniz." },
        { question: "Hesap bileşik faiz getirisi mi verir?", answer: "Hayır. Bu sürüm tek vadede basit faiz hesabı yapar; vade içi bileşikleşme ve otomatik yenileme yoktur." },
        { question: "Neden hesap açılış tarihi soruluyor?", answer: "Stopaj kararları yürürlük tarihine ve hesabın açılış/yenileme dönemine göre değişebilir." },
        { question: "365 gün varsayımı banka sonucuyla farklılık yaratır mı?", answer: "Evet. Sözleşmenin gün sayım yöntemi, ödeme tarihi, yuvarlama ve banka hesaplaması küçük farklar oluşturabilir." },
        { question: "Net faiz garantili midir?", answer: "Hayır. Bu bir tahmindir; gerçek getiri sözleşme koşulları, oran değişikliği ve yürürlükteki vergi kurallarına bağlıdır." },
        { question: "Döviz mevduatı hesaplanıyor mu?", answer: "Hayır. Bu araç yalnızca TL mevduat kapsamındadır." }
      ],
      [
        officialSource("Gelir İdaresi Başkanlığı", "https://www.gib.gov.tr/", "Mevduat faizlerinde stopaj ve yürürlükteki vergi açıklamaları."),
        officialSource("Resmî Gazete", "https://www.resmigazete.gov.tr/", "Stopaj oranlarını belirleyen Cumhurbaşkanı kararları ve yürürlük tarihleri.")
      ]
    )
  },
  {
    id: "gelir-vergisi-dilimi-hesaplama", name: "Gelir vergisi dilimi hesaplama", category: "finans", createdAt: "2026-11-09T09:19:47+03:00",
    description: "Ücret gelirinde yıllık kümülatif matraha göre vergi dilimini bulun.",
    title: "Gelir Vergisi Dilimi Hesaplama 2026 – Ücret Geliri | PratikHesap",
    metaDescription: "Yıllık kümülatif ücret matrahınızı girin; GİB’in doğrulanmış 2026 ücret tarifesine göre bulunduğunuz vergi dilimini ve yaklaşık vergiyi görün.",
    intro: "Ücret geliri için yıllık kümülatif vergi matrahını ve ilgili yılın GİB tarifesini kullanın. Tarife verisi doğrulanmadıysa hesaplama kapalıdır.",
    formula: "Hesaplanan vergi = her tarife dilimindeki matrah payı × o dilimin oranı; marjinal oran yalnızca son ulaşılan dilimin oranıdır.",
    example: "Kümülatif matrah bir sınırı geçtiğinde yalnızca sınırı aşan bölüm üst oranla vergilenir; tüm matrah tek oranla çarpılmaz.",
    fields: [
      numberField("taxableIncome", "Kümülatif ücret vergi matrahı", "Örn. 350000"),
      selectField("taxYear", "Tarife yılı", [{ label: "2026", value: "2026" }])
    ],
    mode: "income-tax",
    content: content(
      "Gelir vergisi tarifesi, vergiye tabi matrahın hangi oranlarla vergilendirileceğini artan oranlı dilimler halinde düzenler. Ücret gelirlerinde çalışan yıl boyunca ücret aldıkça kümülatif gelir vergisi matrahı büyür; bu nedenle yılın farklı aylarında ücretin marjinal olarak tabi olduğu oran değişebilir. Artan oranlı sistemde bir üst dilime geçmek, bütün yıllık gelirin yeni oranla vergilendirildiği anlamına gelmez: her dilim yalnızca kendi sınırları içindeki matrah bölümü üzerinden hesaplanır. Bu araç, yalnızca ücret geliri tarifesini ve kullanıcının girdiği kümülatif vergi matrahını kapsar; serbest meslek, kira, menkul sermaye iradı, indirimler, istisnalar veya birden fazla işverene ilişkin beyannameleri değerlendirmez. Tarifedeki tutar ve oranlar her yıl güncellenebildiğinden ilgili yılın GİB açıklaması ve Resmî Gazete tebliği kaynak olarak yapılandırmada tutulur. Parametre doğrulanmamışsa vergi sonucu gösterilmemelidir. Gelir vergisi matrahı, brüt maaşla aynı kavram değildir; bordro kesintileri ve istisnalar sonucunda oluşur. Sonuç, dilim etkisini açıklayan bilgi amaçlı bir hesaplamadır; beyanname, bordro veya vergi danışmanlığı değildir. Kesin vergi için güncel mevzuat ve kişisel durumunuzu değerlendirin.",
      ["Ücret bordrosundaki yıllık kümülatif vergi matrahını girin; brüt maaşı doğrudan matrah yerine kullanmayın.", "Tarife yılını seçin; hesaplama o yıla ait doğrulanmış ücret tarifesini kullanır.", "Toplam artan oranlı vergiyi ve marjinal dilimi inceleyin; kişisel istisna ve indirimler kapsam dışıdır."],
      [
        { title: "Bir dilim içinde kalma", calculation: "Matrahın o dilim sınırları içindeki bölümü × dilim oranı", result: "Vergi, yalnızca ilgili bölüm için tarife oranına göre hesaplanır." },
        { title: "Üst dilime geçiş", calculation: "Önceki dilimlerin vergisi + sınırı aşan matrah × üst dilim oranı", result: "Üst oran tüm matraha uygulanmaz; marjinal oran ve ortalama oran farklı olabilir." }
      ],
      [
        { question: "Vergi dilimi maaşın tamamına mı uygulanır?", answer: "Hayır. Artan oranlı tarifede her oran yalnızca ilgili dilimde kalan matrah bölümüne uygulanır." },
        { question: "Brüt maaş vergi matrahı mıdır?", answer: "Hayır. Ücret bordrosundaki vergi matrahı, yasal indirim ve kesintilerden sonra oluşabilir." },
        { question: "Kümülatif matrah neden yıl içinde artar?", answer: "Yıl içinde biriken ücret matrahı tarifedeki dilim sınırlarına doğru ilerler; bu nedenle marjinal oran değişebilir." },
        { question: "Araç tüm gelir türlerini hesaplıyor mu?", answer: "Hayır. Kapsamı ücret gelirleri için yıllık tarifeyle sınırlıdır." },
        { question: "Vergi tarifesi her yıl aynı mıdır?", answer: "Hayır. Dilim tutarları ve ilgili kurallar yıllık mevzuatla değişebilir; seçilen yılın resmî tarifesi kullanılmalıdır." },
        { question: "Ortalama vergi oranı ile marjinal oran aynı mıdır?", answer: "Hayır. Marjinal oran son ulaşılan dilimin oranı, ortalama oran ise toplam verginin toplam matraha oranıdır." },
        { question: "Sonuç beyanname veya bordro yerine geçer mi?", answer: "Hayır. Kişisel indirim ve gelir türleri dahil edilmediğinden sonuç yalnızca genel bilgilendirme amaçlıdır." }
      ],
      [incomeTaxSource, officialSource("193 sayılı Gelir Vergisi Kanunu", "https://www.mevzuat.gov.tr/mevzuatmetin/1.5.193.pdf", "Ücret gelirleri ve artan oranlı tarife için kanuni çerçeve.")]
    )
  },
  {
    id: "damga-vergisi-hesaplama", name: "Damga vergisi hesaplama", category: "finans", createdAt: "2026-11-09T09:19:47+03:00",
    description: "Belge türüne göre yapılandırılmış damga vergisi oranıyla örnek hesap yapın.",
    title: "Damga Vergisi Hesaplama – Sözleşme ve Belge Türü | PratikHesap",
    metaDescription: "Belge türünü ve vergi matrahını seçerek damga vergisi tutarını hesaplayın. Oranlar 488 sayılı Kanun tarifesine göre kaynak ve tarihle gösterilir.",
    intro: "Damga vergisi oranı belge türüne göre değişir. Kira sözleşmesi, ücret kâğıdı veya genel sözleşme için yalnızca doğrulanmış tarife değeri kullanılır.",
    formula: "Damga vergisi = vergiye tabi belge tutarı × ilgili belge türünün binde oranı; varsa kanuni üst sınır ayrıca uygulanır.",
    example: "Sözleşme bedeli ve belge sınıfına göre hesaplanır; araç imza, istisna veya mükellefiyet değerlendirmesi yapmaz.",
    fields: [
      selectField("documentType", "Belge türü", [
        { label: "Kira sözleşmesi", value: "lease" },
        { label: "Ücret kâğıdı", value: "wage" },
        { label: "Genel sözleşme", value: "contract" }
      ]),
      numberField("taxBase", "Yıllık kira / belge matrahı", "Örn. 240000", "₺", "Kira sözleşmesinde yıllık kira toplamını, diğer belgelerde vergilendirilecek tutarı girin."),
      selectField("term", "Kira sözleşmesi süresi", [{ label: "1 yıl", value: "1" }, { label: "2 yıl", value: "2" }, { label: "3 yıl", value: "3" }], { field: "documentType", value: "lease" })
    ],
    mode: "stamp-duty",
    content: content(
      "Damga vergisi, kanunda belirtilen kâğıtların düzenlenmesi veya imzalanmasıyla doğabilen ve belgenin türü ile niteliğine göre hesaplanan bir vergidir. 488 sayılı Damga Vergisi Kanunu’na ekli tabloda farklı kâğıtlar için farklı nispi veya maktu tutarlar bulunur; bu yüzden tek bir oranı tüm sözleşmelere uygulamak doğru değildir. Kira sözleşmelerinde vergi matrahı çoğunlukla sözleşme süresince belirlenen kira bedeliyle ilişkilidir; ücret kâğıtları ve genel sözleşmelerin tarifedeki yeri ve istisnaları farklı olabilir. Araç, kullanıcıdan belge sınıfını ve ilgili tutarı alarak yapılandırılmış oran üzerinden aritmetik hesap yapmayı hedefler. Belgenin birden çok nüshası, taraf sayısı, kefalet, özel şart, istisna veya muafiyet gibi unsurlar gerçek vergiyi etkileyebilir ve burada otomatik yorumlanmaz. Oranlar ve yıllık maktu tutarlar değişebileceğinden config kaynağı, tarife maddesi ve geçerlilik tarihiyle saklanır. Veri doğrulanmamışsa sonuç uydurulmaz. Araç damga vergisi beyannamesi hazırlamaz, ödeme yükümlüsünü tayin etmez ve hukuki/vergisel tavsiye sunmaz. İmzalanacak belgenin tam metni ve işlem koşulları için resmî mevzuat ya da uzman görüşü esas alınmalıdır. Belgenin düzenlenme tarihi ve işlem niteliği tarife seçiminde belirleyicidir; aynı ekonomik tutarı içeren iki farklı kâğıt farklı vergilendirme sonucu doğurabilir. Bu nedenle belgeyi doğru sınıflandırmak, yalnızca sayısal tutarı girmekten önce gelir.",
      ["Belgenin kanundaki türünü seçin; belge adının tarife sınıfıyla aynı olduğunu varsaymayın.", "Vergiye tabi sözleşme bedelini ve gerekiyorsa belge süresini girin.", "Kullanılan tarife maddesi, oran ve güncellik tarihini sonuçla birlikte kontrol edin; istisna ve mükellefiyet kapsam dışıdır."],
      [
        { title: "Bir yıllık kira sözleşmesi", calculation: "Yıllık toplam kira bedeli × kira kâğıdı tarifesindeki oran", result: "Gerçek vergi, sözleşme maddeleri ve yürürlükteki tarifeye göre belirlenir." },
        { title: "Genel sözleşme", calculation: "Belgeye konu tutar × genel sözleşme tarife oranı", result: "Belge türü doğru seçilmeden yalnızca tutar üzerinden doğru damga vergisi bulunamaz." }
      ],
      [
        { question: "Damga vergisi için tek bir oran var mı?", answer: "Hayır. 488 sayılı Kanun ekli tabloda kâğıt türüne göre farklı nispi veya maktu değerler yer alır." },
        { question: "Kira sözleşmesinin matrahı nasıl belirlenir?", answer: "Sözleşme bedeli ve süresi önem taşır; özel hükümler ve tarife uygulaması kontrol edilmelidir." },
        { question: "Ücret kâğıdı oranı her sözleşmede kullanılabilir mi?", answer: "Hayır. Belge sınıfına özgü tarife oranı kullanılmalıdır." },
        { question: "Kefil veya birden çok nüsha vergiyi etkiler mi?", answer: "Belge düzeni ve kanuni hükümler sonucu etkileyebilir; araç tüm özel belge unsurlarını incelemez." },
        { question: "Araç vergiyi kimin ödeyeceğini belirler mi?", answer: "Hayır. Mükellefiyet ve taraflar arasındaki sorumluluk değerlendirmesi kapsam dışıdır." },
        { question: "Oran değişirse eski tarihli sözleşmede ne olur?", answer: "Uygulanacak mevzuat, kâğıdın düzenlenme tarihi ve işlem koşullarına bağlıdır; kaynak ve tarih kontrol edilmelidir." },
        { question: "Sonuç resmî beyanname hesabı mı?", answer: "Hayır. Sonuç yalnızca yapılandırılmış tarife üzerinden genel tutar tahminidir." }
      ],
      [stampLaw, officialSource("Gelir İdaresi Başkanlığı", "https://www.gib.gov.tr/", "Damga vergisi tarifeleri ve uygulama açıklamaları.")]
    )
  },
  {
    id: "tapu-harci-hesaplama", name: "Tapu harcı hesaplama", category: "finans", createdAt: "2026-11-09T09:19:47+03:00",
    description: "Taşınmaz satış bedeli üzerinden alıcı ve satıcı tapu harcı paylarını görün.",
    title: "Tapu Harcı Hesaplama 2026 – Alıcı ve Satıcı Payı | PratikHesap",
    metaDescription: "Taşınmaz beyan/satış tutarını girin; doğrulanmış harç oranıyla alıcı ve satıcı paylarını ve toplam tapu harcını hesaplayın.",
    intro: "Satış tutarına göre alıcı ve satıcı harcını ayrı gösterin. Döner sermaye ve özel işlem ücretleri, doğrulanmış ayrı değerler olmadan sonuca eklenmez.",
    formula: "Taraf başına harç = harca esas taşınmaz bedeli × taraf için geçerli oran; toplam = taraf paylarının toplamı.",
    example: "Taraf oranları config’te ayrı tutulur; beyan edilen satış bedeli ve güncel tarife sonucu belirler.",
    fields: [
      numberField("propertyValue", "Harca esas taşınmaz bedeli", "Örn. 5000000"),
      selectField("party", "Hangi tarafın payı?", [
        { label: "Alıcı", value: "buyer" },
        { label: "Satıcı", value: "seller" },
        { label: "Alıcı ve satıcı toplamı", value: "both" }
      ])
    ],
    mode: "title-deed",
    content: content(
      "Tapu harcı, taşınmaz satış veya devir işlemlerinde Harçlar Kanunu’na ekli tarifeye göre hesaplanan kamu harcıdır. Satışta harca esas beyan edilen bedel, taşınmazın niteliği ve uygulanabilir mevzuat tutarı etkiler. Tarafların alıcı ve satıcı olarak ödeyeceği paylar ayrı ayrı değerlendirilmelidir; sözleşmede masrafların taraflar arasında farklı paylaşılması, kanuni yükümlülük ve tapu işlemindeki tahakkukla aynı şey olmayabilir. Bu araç, kullanıcı tarafından girilen harca esas bedel üzerinden config’te doğrulanmış oranlarla alıcı payını, satıcı payını veya iki taraf toplamını gösterir. Değerleme, belediye emlak vergisi asgari bedeli, istisna, bağış, miras, şirket devri, kat irtifakı veya başka tapu işlemleri genel satış hesabından farklı kurallara tabi olabilir. Döner sermaye hizmet bedeli ve işlem bazlı başka ücretler ayrıca belirlenebildiğinden, kaynak doğrulanmadan toplam harca eklenmez. Kullanıcı satış bedelini kendi işlemine uygun şekilde girmeli; bu hesaplayıcı taşınmaz değerini tespit etmez, vergi kaçırma veya düşük beyanı desteklemez ve tapu müdürlüğünün tahakkukunu değiştirmez. Gösterilen sonuç bilgilendirme amaçlı tahmindir. Güncel tarifeyi, işlem türünü ve resmi tahakkuk tutarını Tapu ve Kadastro biriminden doğrulayın.",
      ["Taşınmaz işleminde harca esas alınan bedeli girin; hesaplayıcı beyan değerini doğrulamaz.", "Alıcı, satıcı veya iki taraf toplamı seçeneğini belirleyin.", "Sonuçtaki kullanılan oranı ve hariç bırakılan ek masrafları kontrol edin; özel devir türleri bu hesapta yer almaz."],
      [
        { title: "Alıcı payı", calculation: "Harca esas bedel × alıcı için yapılandırılmış oran", result: "Alıcı tarafının yaklaşık harcı gösterilir." },
        { title: "İki taraf toplamı", calculation: "Harca esas bedel × (alıcı oranı + satıcı oranı)", result: "Her iki tarafın harç toplamı ayrı paylarla birlikte gösterilir." }
      ],
      [
        { question: "Tapu harcı hangi bedel üzerinden hesaplanır?", answer: "İşlemde harca esas alınan beyan ve kanuni değerler önemlidir; araç bedeli veya taşınmaz değerini doğrulamaz." },
        { question: "Alıcı ve satıcı harcı aynı mı?", answer: "Tarafların yükümlülüğü ve yürürlükteki oranlar ilgili tarife ve işlem türüne göre incelenmelidir; araç payları ayrı gösterir." },
        { question: "Döner sermaye ücreti dahil mi?", answer: "Hayır. Ayrı ve doğrulanmış işlem ücreti verisi olmadan hesaplamaya eklenmez." },
        { question: "Her tapu işlemi bu araçla hesaplanabilir mi?", answer: "Hayır. Araç genel satış senaryosunu kapsar; bağış, miras ve özel devirlerin kuralları farklı olabilir." },
        { question: "Sözleşmede harcı tek tarafın ödemesi sonucu değiştirir mi?", answer: "Taraflar arası masraf paylaşımı, kanuni tahakkuk ve sorumlulukla aynı olmayabilir." },
        { question: "Hesaplama resmi tahakkuk yerine geçer mi?", answer: "Hayır. Kesin tutar için tapu işlemindeki resmî tahakkuk geçerlidir." },
        { question: "Harç oranı hangi kaynaktan kontrol edilir?", answer: "492 sayılı Harçlar Kanunu’nun ilgili tarifesi ve yürürlükteki değişiklikler esas alınır." }
      ],
      [feeLaw, officialSource("Tapu ve Kadastro Genel Müdürlüğü", "https://www.tkgm.gov.tr/", "Tapu işlemleri ve güncel tahakkuk bilgileri.")]
    )
  },
  {
    id: "altin-hesaplama", name: "Altın hesaplama", category: "finans", createdAt: "2026-11-09T09:19:47+03:00",
    description: "Gram altın fiyatıyla gram, çeyrek, yarım ve tam altın için teorik karşılık bulun.",
    title: "Altın Hesaplama – Gram, Çeyrek, Yarım ve Tam Altın | PratikHesap",
    metaDescription: "Gram altın fiyatını girin; seçilen gram, çeyrek, yarım veya tam altının tanımlı ağırlığına göre teorik metal karşılığını hesaplayın.",
    intro: "Canlı fiyat yerine gram fiyatını siz girin. Sonuç, yapılandırılmış ürün ağırlığıyla teorik metal karşılığıdır; işçilik, prim ve alış-satış farkı dahil değildir.",
    formula: "Teorik değer = girilen gram fiyatı × seçilen ürünün yapılandırılmış saf altın ağırlığı.",
    example: "Ürün ağırlıkları kaynaklı config’ten alınır; piyasa satış fiyatı, işçilik ve makas hesaplamaya dahil edilmez.",
    fields: [
      numberField("gramPrice", "Gram altın fiyatı", "Örn. 6500"),
      selectField("product", "Altın türü", [
        { label: "Gram", value: "gram" },
        { label: "Çeyrek", value: "quarter" },
        { label: "Yarım", value: "half" },
        { label: "Tam", value: "full" }
      ])
    ],
    mode: "gold-value",
    content: content(
      "Altın hesaplamasında seçilen ürünün tanımı, ağırlığı, ayarı ve kullanılan fiyat türü sonucu belirler. Gram altın fiyatı ile ziynet veya sikke ürününün mağaza satış fiyatı aynı kavram değildir; ürün fiyatında işçilik, darphane/marka primi, piyasa alış-satış farkı ve satıcı marjı bulunabilir. Bu araç, kullanıcının girdiği bir gram fiyatını kaynaklı ürün ağırlığıyla çarparak yalnızca teorik karşılık üretir. Canlı fiyat bağlantısı bu sürümde bulunmaz; fiyatı ve fiyatın hangi piyasa/alış-satış yönünü temsil ettiğini kullanıcı kendisi girmelidir. Gram, çeyrek, yarım ve tam ürünler için kullanılacak standart ağırlık config’te kaynak ve güncelleme tarihiyle tanımlanmalıdır; doğrulanmamış ürün ağırlığıyla hesaplama yapılmamalıdır. Farklı ayar veya koleksiyon ürünleri için aynı ağırlık değeri geçerli olmayabilir. Sonuç bir kuyumcu teklifi, yatırım önerisi veya anlık piyasa fiyatı değildir. Alım-satım öncesinde ürünün ayarını, net altın içeriğini, güncel fiyatı ve satıcının uyguladığı işçilik/komisyonu ayrıca kontrol edin. Bu hesaplayıcı, altın fiyatı tahmin etmez ve altın kurunu sunucuya göndermez; yalnızca girilen fiyatla tarayıcıda hesaplama yapar. Fiyatın alış veya satış yönü seçilen amaca uygun olmalı; tek bir piyasa fiyatı tüm ürün ve satıcılarda aynı değeri garanti etmez. Ağırlık tanımının standart ürüne ait olduğu da ayrıca kontrol edilmelidir.",
      ["Gram altın fiyatını güvenilir biçimde edindiğiniz kaynaktan girin; fiyatın alış mı satış mı olduğunu not edin.", "Gram, çeyrek, yarım veya tam altın türünü seçin.", "Teorik ağırlık karşılığını inceleyin; işçilik, prim ve alış-satış makası dahil değildir."],
      [
        { title: "Gram ürün", calculation: "Girilen gram fiyatı × yapılandırılmış gram ağırlığı", result: "Gram altın için teorik fiyat karşılığı hesaplanır." },
        { title: "Çeyrek, yarım veya tam ürün", calculation: "Girilen gram fiyatı × seçilen ürünün yapılandırılmış net altın ağırlığı", result: "Ürün satış fiyatı değil, yalnızca teorik metal karşılığı gösterilir." }
      ],
      [
        { question: "Altın fiyatı otomatik ve canlı çekiliyor mu?", answer: "Hayır. Bu araçta fiyat manuel girilir; doğrulanmış ve uygun kullanım koşullu canlı kaynak olmadan otomatik fiyat iddia edilmez." },
        { question: "Çeyrek altının kuyumcu fiyatı bu sonuçla aynı mı?", answer: "Hayır. İşçilik, prim, ürün çeşidi ve alış-satış makası farklı fiyat oluşturabilir." },
        { question: "Hangi fiyatı girmeliyim?", answer: "Kullanım amacınıza göre güncel ve güvenilir kaynaktaki gram alış veya satış değerini girin; sonucu hangi fiyat türüyle hesapladığınızı not edin." },
        { question: "Altın ayarı hesaba katılıyor mu?", answer: "Bu sade hesap yalnızca config’te tanımlı ürünün saf altın ağırlığını kullanır; farklı ayar ve ürün özellikleri ayrıca değerlendirilmelidir." },
        { question: "Sonuç yatırım tavsiyesi midir?", answer: "Hayır. Hesaplama yalnızca girdiğiniz fiyat ve tanımlı ağırlığın çarpımıdır." },
        { question: "Canlı fiyat neden eklenmedi?", answer: "TCMB döviz servisi altın satış fiyatı sağlamaz. Kaynak, erişim koşulları ve veri kullanım izni doğrulanmadan canlı fiyat yayımlanmaz." },
        { question: "Ağırlık değerleri nereden gelir?", answer: "Ürün tanımı ve ağırlıkları doğrulanmış resmî/standart kaynakla yapılandırmada belirtilmelidir." }
      ],
      [
        officialSource("Darphane ve Damga Matbaası Genel Müdürlüğü", "https://www.darphane.gov.tr/", "Resmî ziynet ve sikke ürün bilgileri; kullanılacak ağırlık değerleri ayrıca kaynaklandırılır."),
        officialSource("Borsa İstanbul – Kıymetli Madenler Piyasası", "https://www.borsaistanbul.com/tr/sayfa/222/kiymetli-madenler-piyasasi", "Piyasa bilgisi; bu sürüm canlı fiyat API’si kullanmaz.")
      ]
    )
  }
];
