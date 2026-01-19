let currentDomain = "";
let rootDomain = "";
let settings = {};
let breakTimerInterval = null;
let currentLang = "tr"; 

// --- ÇEVİRİ SÖZLÜĞÜ ---
const TRANSLATIONS = {
    tr: {
        // Static
        btnScan: "TARA",
        tabOverview: "Genel", tabDNS: "DNS", tabWhois: "Whois", tabServer: "Sunucu",
        tabMail: "Mail", tabShifts: "Mesai", tabTools: "Araçlar", tabNotes: "Notlar",
        lblCMS: "YAZILIM (CMS)", lblPanel: "PANEL TAHMİNİ", lblSSL: "SSL DURUMU", lblIP: "IP ADRESİ",
        lblRedirect: "HTTPS YÖNLENDİRME KONTROLÜ", clickCopyHint: "Tıkla ve Müşteriye Yanıtı Kopyala",
        btnCopyTicket: "Destek Talebi Özeti Kopyala", 
        thType: "Tip", thHost: "Host", thVal: "Değer / ISP", loading: "Taranıyor...",
        lblRegInfo: "TESCİL BİLGİLERİ", btnClearCache: "Site Önbelleğini Temizle",
        lblBlacklist: "KARALİSTE (BLACKLIST)", check: "Kontrol Et",
        localTime: "YEREL SAAT", btnEndBreak: "MOLAYI BİTİR", btnMeal: "YEMEK", btnBreak: "MOLA",
        headPass: "Şifre Oluşturucu", headLinks: "Hızlı Linkler", toolIsUp: "Site Çökük mü?",
        toolProp: "DNS Yayılımı", headCmd: "Sık Kullanılan Komutlar",
        settingsTitle: "Ayarlar & Şablonlar", tabGen: "Genel", tabTpl: "Şablonlar", tabWatch: "Aranacak Değerler",
        lblSetMeal: "Yemek Süresi (Dk)", lblSetBreak: "Mola Süresi (Dk)",
        lblWatchDesc: "Her satıra bir değer girin (IP, Domain, Text). Eşleşen DNS kayıtları vurgulanacaktır.",
        btnSave: "KAYDET", btnClose: "KAPAT",
        welcomeTitle: "Hoş Geldiniz", btnUnderstood: "ANLADIM / BAŞLA",

        // Dynamic JS Results
        subdomainAlert: "Subdomain modu aktif.",
        valYes: "Var", valNo: "Yok",
        valActive: "Aktif", valError: "Hatalı", valNotFound: "Yok/Hatalı",
        valRedirYes: "Yönlendirme VAR", valRedirNo: "Yönlendirme YOK",
        valAccessErr: "Erişim Hatası",
        valRecFound: "Kayıt Bulundu", valRecNone: "Kayıt Yok", valRecEmpty: "Kayıt bulunamadı.",
        valCloudflare: "Cloudflare",
        valUnknown: "Bilinmiyor", valPrivate: "Özel/Bilinmiyor",
        valStrict: "KATI", valRelax: "ESNEK",
        alertMatch: "Ayarlarda belirttiğiniz bir değer tespit edildi.",
        breakFinished: "SÜRE DOLDU!", breakOngoing: "MOLA SÜRÜYOR",
        cmsSpecial: "Özel Yazılım"
    },
    en: {
        // Static
        btnScan: "SCAN",
        tabOverview: "Overview", tabDNS: "DNS", tabWhois: "Whois", tabServer: "Server",
        tabMail: "Mail", tabShifts: "Shifts", tabTools: "Tools", tabNotes: "Notes",
        lblCMS: "SOFTWARE (CMS)", lblPanel: "PANEL GUESS", lblSSL: "SSL STATUS", lblIP: "IP ADDRESS",
        lblRedirect: "HTTPS REDIRECT CHECK", clickCopyHint: "Click to Copy Customer Response",
        btnCopyTicket: "Copy Ticket Summary", 
        thType: "Type", thHost: "Host", thVal: "Value / ISP", loading: "Scanning...",
        lblRegInfo: "REGISTRATION INFO", btnClearCache: "Clear Site Cache",
        lblBlacklist: "BLACKLIST CHECK", check: "Check Now",
        localTime: "LOCAL TIME", btnEndBreak: "END BREAK", btnMeal: "MEAL", btnBreak: "BREAK",
        headPass: "Password Generator", headLinks: "Quick Links", toolIsUp: "Is Site Down?",
        toolProp: "DNS Propagation", headCmd: "Common Commands",
        settingsTitle: "Settings & Templates", tabGen: "General", tabTpl: "Templates", tabWatch: "Values to Watch",
        lblSetMeal: "Meal Duration (Min)", lblSetBreak: "Break Duration (Min)",
        lblWatchDesc: "Enter one value per line (IP, Domain, Text). Matching DNS records will be highlighted.",
        btnSave: "SAVE", btnClose: "CLOSE",
        welcomeTitle: "Welcome", btnUnderstood: "GET STARTED",

        // Dynamic JS Results
        subdomainAlert: "Subdomain mode active.",
        valYes: "Yes", valNo: "No",
        valActive: "Active", valError: "Error", valNotFound: "None/Error",
        valRedirYes: "Redirect Active", valRedirNo: "Redirect Missing",
        valAccessErr: "Access Error",
        valRecFound: "Records Found", valRecNone: "No Records", valRecEmpty: "No records found.",
        valCloudflare: "Cloudflare",
        valUnknown: "Unknown", valPrivate: "Private/Unknown",
        valStrict: "STRICT", valRelax: "RELAXED",
        alertMatch: "A value you configured in the settings has been detected.",
        breakFinished: "TIME IS UP!", breakOngoing: "BREAK ONGOING",
        cmsSpecial: "Custom Software"
    }
};

const TUTORIAL_CONTENT = {
    tr: `
        <p><strong>DNS, WHOIS, SSL, HOSTING LOOKUP</strong>, hosting ve sunucu yönetimi süreçlerinizi hızlandırmak için tasarlandı.</p>
        <ul style="padding-left:15px; margin:5px 0;">
            <li><strong>Genel:</strong> Site IP, SSL Durumu (Canlı Kontrol destekli), CMS ve Panel tahmini.</li>
            <li><strong>DNS:</strong> A, MX, NS, TXT (SPF/DKIM), CNAME, AAAA ve SOA kayıtlarının tamamını tarar.</li>
            <li><strong>Whois:</strong> Tescil tarihi, bitiş tarihi ve firma bilgilerini gösterir. TRABİS (.tr) entegrasyonu vardır.</li>
            <li><strong>Mail:</strong> MX kayıtlarını ve tüm TXT (SPF, DMARC, DKIM) kayıtlarını analiz eder. Karaliste kontrolü sunar.</li>
            <li><strong>Mesai & Sayaç:</strong> Vardiya takibi, Yemek ve Mola sayaçları.</li>
            <li><strong>Araçlar:</strong> Şifre oluşturucu, Cache temizleme, Wayback Machine, DNS Yayılımı, Speed Test vb.</li>
            <li><strong>Ayarlar:</strong> Yanıt şablonlarını, aranacak değerleri (IP/Domain) ve süreleri özelleştirin.</li>
        </ul>
        <p>İyi çalışmalar!</p>
    `,
    en: `
        <p><strong>DNS, WHOIS, SSL, HOSTING LOOKUP</strong> is designed to speed up your hosting and server management tasks.</p>
        <ul style="padding-left:15px; margin:5px 0;">
            <li><strong>Overview:</strong> View IP, SSL (with Live Check), CMS, and Panel info.</li>
            <li><strong>DNS:</strong> Scans all A, MX, NS, TXT (SPF/DKIM), CNAME, AAAA, and SOA records.</li>
            <li><strong>Whois:</strong> Shows registration details. Includes TRABİS support for .tr domains.</li>
            <li><strong>Mail:</strong> Analyzes MX records and all TXT policies (SPF, DMARC). Includes Blacklist check.</li>
            <li><strong>Shifts & Timer:</strong> Shift tracking, Meal and Break timers.</li>
            <li><strong>Tools:</strong> Password generator, Cache cleaner, Wayback Machine, DNS Propagation, Speed Test etc.</li>
            <li><strong>Settings:</strong> Customize templates, watch lists, and timer durations.</li>
        </ul>
        <p>Happy working!</p>
    `
};

const DEFAULTS = {
    mealDuration: 30, breakDuration: 15,
    watchList: [],
    subdomains: "",
    tpl: {
        dns_a: "Sayın Müşterimiz, {domain} alan adınız şu anda {ip} IP adresine yönlenmiş durumdadır. (Servis Sağlayıcı: {isp})",
        dns_mx: "Sayın Müşterimiz, {domain} alan adınızın e-posta servisi {mx} üzerinden hizmet vermektedir.",
        dns_ns: "Sayın Müşterimiz, {domain} alan adınızın nameserver kayıtları şöyledir: {value}",
        dns_txt: "Sayın Müşterimiz, {domain} alan adı için TXT kaydı: {value}",
        ssl_ok: "Kontrollerimizde {domain} alan adında SSL sertifikasının AKTİF olduğu görülmüştür. (Bitiş: {date})",
        ssl_err: "Kontrollerimizde {domain} alan adında geçerli bir SSL sertifikası BULUNAMAMIŞTIR. Kurulum yapılması gerekmektedir.",
        ssl_redir_ok: "{domain} sitesine erişimde HTTPS (Güvenli Bağlantı) yönlendirmesi sorunsuz çalışmaktadır.",
        ssl_redir_err: "{domain} sitesine erişimde HTTPS yönlendirmesi yoktur. Site 'Güvenli Değil' olarak açılmaktadır.",
        whois: "{domain} alan adının tescil durumu: {status}. Tescil Eden Firma: {reg}. (Oluşturma: {date})",
        cms: "Web siteniz ({domain}) {cms} altyapısı kullanmaktadır.",
        panel: "Sunucu tarafında {panel} kontrol paneli kullanıldığı tespit edilmiştir.",
        ip: "{domain} web sitesi {ip} IP adresinde barınmaktadır.",
        spf: "{domain} için SPF kaydı: {value}",
        note_linux: "df -h | grep ^/dev",
        note_mysql: "mysqlcheck -A --auto-repair -u root -p",
        note_logs: "tail -f /var/log/messages"
    }
};

const SHIFTS = [
    { name: "00-09", start: 0, end: 9, class: "bar-gray" },
    { name: "09-18", start: 9, end: 18, class: "bar-yellow" },
    { name: "10-19", start: 10, end: 19, class: "bar-yellow" },
    { name: "12-21", start: 12, end: 21, class: "bar-green" },
    { name: "15-00", start: 15, end: 24, class: "bar-green" }
];

const API = {
    DNS: "https://dns.google/resolve",
    IP: "https://ipwho.is/",
    SSL: "https://crt.sh/?output=json&q=",
    RDAP: "https://rdap.org/domain/"
};

document.addEventListener('DOMContentLoaded', async () => {
    loadSettings();
    initLanguage(); 
    setupUI();
    startLiveClock();
    checkBreakStatus(); 
    renderHistoryChips();

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url.startsWith('http')) {
        const url = new URL(tab.url);
        startAnalysis(url.hostname, tab.id);
    }
});

// --- YARDIMCI ÇEVİRİ FONKSİYONU ---
function t(key) {
    return (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key]) ? TRANSLATIONS[currentLang][key] : key;
}

// --- DİL VE REHBER SİSTEMİ ---
function initLanguage() {
    const savedLang = localStorage.getItem('sa_lang');
    if (!savedLang) {
        document.getElementById('modalLangSelect').classList.add('show');
    } else {
        currentLang = savedLang;
        document.getElementById('selLang').value = savedLang;
        setLanguage(savedLang);
        if (!localStorage.getItem('sa_tutorial_seen')) {
            openTutorial();
            localStorage.setItem('sa_tutorial_seen', 'true');
        }
    }
}

function selectInitialLang(lang) {
    localStorage.setItem('sa_lang', lang);
    currentLang = lang;
    document.getElementById('selLang').value = lang;
    setLanguage(lang);
    document.getElementById('modalLangSelect').classList.remove('show');
    openTutorial();
    localStorage.setItem('sa_tutorial_seen', 'true');
}

function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.innerText = t(el.dataset.i18n);
    });

    document.getElementById('lblMealDur').innerText = settings.mealDuration;
    document.getElementById('lblBreakDur').innerText = settings.breakDuration;
}

function openTutorial() {
    document.getElementById('tutTitle').innerText = t('welcomeTitle');
    document.getElementById('tutBody').innerHTML = TUTORIAL_CONTENT[currentLang];
    document.getElementById('btnCloseTutorial').innerText = t('btnUnderstood');
    document.getElementById('modalTutorial').classList.add('show');
}

function setupUI() {
    document.getElementById('selLang').addEventListener('change', (e) => {
        const lang = e.target.value;
        localStorage.setItem('sa_lang', lang);
        setLanguage(lang);
    });

    const btnTr = document.getElementById('btnLangTR');
    const btnEn = document.getElementById('btnLangEN');
    if(btnTr) btnTr.addEventListener('click', () => selectInitialLang('tr'));
    if(btnEn) btnEn.addEventListener('click', () => selectInitialLang('en'));

    document.getElementById('btnHelp').onclick = openTutorial;
    document.getElementById('btnCloseTutorial').onclick = () => document.getElementById('modalTutorial').classList.remove('show');

    document.querySelectorAll('.tabs-nav .tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if(btn.closest('.modal')) return;
            document.querySelectorAll('.view-container .view-section').forEach(v => v.classList.remove('active'));
            document.querySelectorAll('.tabs-nav .tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const targetId = btn.dataset.tab;
            document.getElementById(targetId).classList.add('active');
        });
    });

    const tabSetGen = document.getElementById('tabSetGen');
    const tabSetTpl = document.getElementById('tabSetTpl');
    const tabSetWatch = document.getElementById('tabSetWatch');
    const switchSettingsTab = (activeBtn, activeDivId) => {
        [tabSetGen, tabSetTpl, tabSetWatch].forEach(b => b.classList.remove('active'));
        ['viewSetGen', 'viewSetTpl', 'viewSetWatch'].forEach(d => document.getElementById(d).style.display = 'none');
        activeBtn.classList.add('active');
        document.getElementById(activeDivId).style.display = 'block';
    };
    if(tabSetGen) {
        tabSetGen.addEventListener('click', () => switchSettingsTab(tabSetGen, 'viewSetGen'));
        tabSetTpl.addEventListener('click', () => switchSettingsTab(tabSetTpl, 'viewSetTpl'));
        tabSetWatch.addEventListener('click', () => switchSettingsTab(tabSetWatch, 'viewSetWatch'));
    }

    document.getElementById('btnSettings').onclick = () => { 
        loadSettingsToUI(); 
        document.getElementById('modalSettings').classList.add('show'); 
    };
    document.getElementById('btnCloseSettings').onclick = () => document.getElementById('modalSettings').classList.remove('show');
    document.getElementById('btnSaveSettings').onclick = saveSettingsFromUI;

    document.getElementById('btnTheme').onclick = toggleTheme;
    document.getElementById('btnScan').onclick = () => startAnalysis(document.getElementById('domainInput').value);
    document.getElementById('domainInput').addEventListener('keypress', (e) => { if (e.key === 'Enter') startAnalysis(document.getElementById('domainInput').value); });
    document.getElementById('btnShowHistory').onclick = () => { 
        const el = document.getElementById('historyChips'); 
        el.style.display = el.style.display === 'flex' ? 'none' : 'flex'; 
    };
    
    document.addEventListener('click', (e) => {
        const target = e.target.closest('.click-copy') || e.target.closest('tr');
        if(target && target.dataset.tpl) {
            handleSmartCopy(target.dataset.tpl, target.dataset.copyData);
        }
    });

    document.getElementById('btnCopyTicket').onclick = generateTicketSummary;
    document.getElementById('btnClearCache').onclick = () => chrome.browsingData.remove({ "origins": [`https://${currentDomain}`, `http://${currentDomain}`] }, { "cache": true }, () => showToast('Önbellek Temizlendi'));
    
    document.getElementById('btnStartMeal').onclick = () => startBreak('meal');
    document.getElementById('btnStartCoffee').onclick = () => startBreak('break');
    document.getElementById('btnEndBreak').onclick = endBreak;

    document.getElementById('btnGenPass').onclick = generatePassword;
    document.getElementById('btnCopyPass').onclick = () => {
        const pass = document.getElementById('genPassOut').value;
        if(pass) { navigator.clipboard.writeText(pass); showToast(pass); }
    };
    
    document.getElementById('btnExtWhois1').onclick = () => {
        if (currentDomain.endsWith('.tr')) {
            window.open(`https://www.internet.tr/whois?domain=${currentDomain}`);
        } else {
             window.open(`https://www.metunic.com.tr/whois?domain=${currentDomain}`);
        }
    };
    document.getElementById('btnExtWhois2').onclick = () => window.open(`https://lookup.icann.org/en/lookup?q=${currentDomain}`);
    
    setupQuickTools();
    generatePassword();
}

function toggleTheme() {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('sa_theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
}

function setupQuickTools() {
    document.getElementById('toolIsUp').onclick = () => window.open(`https://downforeveryoneorjustme.com/${currentDomain}`);
    document.getElementById('toolArchive').onclick = () => window.open(`https://web.archive.org/web/*/${currentDomain}`);
    document.getElementById('toolProp').onclick = () => window.open(`https://dnschecker.org/#A/${currentDomain}`);
    document.getElementById('toolInto').onclick = () => window.open(`https://intodns.com/${currentDomain}`);
    document.getElementById('blacklistResult').onclick = () => window.open(`https://mxtoolbox.com/SuperTool.aspx?action=blacklist:${currentDomain}`);

    // Yeni Linkler
    document.getElementById('toolSpeed').onclick = () => window.open(`https://pagespeed.web.dev/analysis?url=https://${currentDomain}`);
    document.getElementById('toolSucuri').onclick = () => window.open(`https://sitecheck.sucuri.net/results/${currentDomain}`);
    document.getElementById('toolGT').onclick = () => window.open(`https://gtmetrix.com/analyze.html?url=https://${currentDomain}`);
    document.getElementById('toolTrends').onclick = () => window.open(`https://trends.google.com/trends/explore?q=${currentDomain}`);
}

async function startAnalysis(domain, tabId) {
    if(!domain) return;
    domain = domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    currentDomain = domain;
    
    const parts = domain.split('.');
    rootDomain = parts.length > 2 ? parts.slice(-2).join('.') : domain;

    document.getElementById('domainInput').value = currentDomain;
    addToHistory(currentDomain);
    renderHistoryChips();
    resetUI();

    measureTTFB(currentDomain);
    analyzeDNS();
    analyzeWhois(); 
    analyzeAdvancedSSL();
    
    if(tabId) { analyzeHeaders(tabId); detectCMS(tabId); } 
    else { analyzeHeadersFetch(currentDomain); }
    
    updateCardData('cardIP', {domain: currentDomain});
    updateCardData('cardSSL', {domain: currentDomain});
    updateCardData('cardRedirect', {domain: currentDomain});
}

function resetUI() {
    document.getElementById('dnsBody').innerHTML = '';
    document.getElementById('mailDnsBody').innerHTML = '';
    document.getElementById('mailDnsEmpty').style.display = 'none';
    document.getElementById('mailDnsEmpty').innerText = t('valRecEmpty');
    document.getElementById('dnsLoading').style.display = 'block';
    
    document.getElementById('whoisContent').innerText = t('loading');
    document.getElementById('subdomainAlert').style.display = 'none';
    document.getElementById('subdomainAlert').innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${t('subdomainAlert')}`;
    
    document.getElementById('mxList').innerText = t('loading');
    
    ['valCMS', 'valSSL', 'valPanel', 'valIP', 'lblTTFB', 'lblLoc', 'lblCF', 'valSPF', 'valDMARC', 'valSSLRedirect'].forEach(id => {
        document.getElementById(id).innerText = '...';
    });
}

// --- DNS VE MAIL ANALİZİ (Fix: Array TXT, All Records, _dmarc visibility) ---
async function analyzeDNS() {
    const tbody = document.getElementById('dnsBody');
    const mailBody = document.getElementById('mailDnsBody');
    
    try {
        tbody.innerHTML = '';
        mailBody.innerHTML = '';
        
        let scanList = [];
        if (currentDomain !== rootDomain) {
            document.getElementById('subdomainAlert').style.display = 'block';
            scanList.push({ domain: currentDomain, label: 'SUB' });
        }
        scanList.push({ domain: rootDomain, label: 'ANA' });
        
        // Standart subdomains
        ['www', 'mail', 'ftp', 'webmail'].forEach(p => { 
            if(`${p}.${rootDomain}` !== currentDomain) scanList.push({ domain: `${p}.${rootDomain}`, label: p }); 
        });

        // Kullanıcı tanımlı subdomains
        if (settings.subdomains) {
            settings.subdomains.split(',').forEach(sub => {
                sub = sub.trim();
                if (sub) scanList.push({ domain: `${sub}.${rootDomain}`, label: sub });
            });
        }

        scanList.push({ domain: `_dmarc.${rootDomain}`, label: 'DMARC' });

        let mxRecords = [];
        let isCloudflare = false;
        let mailRecordsFound = false;

        for (let item of scanList) {
            const records = await fetchDNS(item.domain);
            records.forEach(rec => {
                const tr = document.createElement('tr');
                let val = rec.data;
                let tplKey = "dns_a"; 
                if(rec.type === 'MX') tplKey = "dns_mx";
                if(rec.type === 'NS') tplKey = "dns_ns";
                if(rec.type === 'TXT') tplKey = "dns_txt";

                let copyData = { domain: item.domain, value: val, ip: val, isp: "...", mx: val };

                if(rec.type === 'NS' && val.includes('cloudflare.com')) isCloudflare = true;

                const match = checkWatchList(val);
                if (match) {
                    tr.classList.add('highlight-match');
                    tr.title = `${t('alertMatch')} (${match})`;
                }

                if(rec.type === 'A') {
                    if(item.domain === currentDomain) {
                        document.getElementById('valIP').innerText = val;
                        updateCardData('cardIP', {domain: currentDomain, ip: val});
                    }
                    fetchISP(val, tr, (isp) => {
                        let d = JSON.parse(tr.dataset.copyData || "{}");
                        d.isp = isp;
                        tr.dataset.copyData = JSON.stringify(d);
                    });
                }

                if(rec.type === 'MX') {
                    mxRecords.push(val);
                    let mxHost = val.split(' ').pop();
                    copyData.mx = mxHost;
                    resolveMXIP(mxHost, tr);
                }

                if(rec.type === 'TXT') {
                    if(val.includes('v=spf1')) {
                        document.getElementById('valSPF').innerHTML = parseSPF(val);
                        updateCardData('valSPF', {domain:item.domain, value:val}, true);
                    }
                    if(val.includes('v=DMARC1')) {
                        document.getElementById('valDMARC').innerText = t('valYes');
                        updateCardData('valDMARC', {domain:item.domain, value:val}, true);
                    }
                }

                tr.dataset.tpl = tplKey;
                tr.dataset.copyData = JSON.stringify(copyData);
                
                tr.innerHTML = `
                    <td><span class="badge bg-blue">${rec.type}</span> <span style="font-size:9px; opacity:0.6">(${item.label})</span></td>
                    <td style="font-size:10px">${rec.name.slice(0,-1)}</td>
                    <td><div style="word-break:break-all">${val}</div><div class="meta-info" style="font-size:9px; color:var(--success)"></div></td>
                `;
                
                // _dmarc filtresi kaldırıldı, her şeyi göster
                tbody.appendChild(tr);

                const isMailRelated = 
                    rec.type === 'MX' || 
                    (rec.type === 'TXT'); // Tüm TXT kayıtlarını Mail sekmesinde de göster (SPF/DKIM kaçmasın diye)

                if (isMailRelated) {
                    mailRecordsFound = true;
                    const mailTr = tr.cloneNode(true);
                    mailTr.dataset.tpl = tplKey;
                    mailTr.dataset.copyData = JSON.stringify(copyData);
                    mailBody.appendChild(mailTr);
                }
            });
        }

        if (!mailRecordsFound) document.getElementById('mailDnsEmpty').style.display = 'block';
        document.getElementById('lblCF').innerHTML = isCloudflare ? `<span style="color:orange">${t('valCloudflare')}</span>` : t('valNo');
        document.getElementById('mxList').innerText = mxRecords.length > 0 ? `${mxRecords.length} ${t('valRecFound')}` : t('valRecNone');
        document.getElementById('blacklistResult').dataset.copyData = JSON.stringify({domain: currentDomain});

    } catch (error) {
        console.error("DNS Error:", error);
    } finally {
        document.getElementById('dnsLoading').style.display = 'none';
    }
}

function checkWatchList(value) {
    if (!settings.watchList || settings.watchList.length === 0) return null;
    for (let item of settings.watchList) {
        if (item && item.trim() !== "" && value.toLowerCase().includes(item.toLowerCase())) {
            return item;
        }
    }
    return null;
}

async function fetchDNS(domain) {
    const types = ['A', 'MX', 'NS', 'TXT', 'CNAME', 'AAAA', 'SOA'];
    let records = [];
    await Promise.all(types.map(async (type) => {
        try {
            const res = await fetch(`${API.DNS}?name=${domain}&type=${type}`).then(r => r.json());
            if(res.Answer) {
                res.Answer.forEach(rec => {
                    // FIX: Google DNS uzun TXT kayıtlarını bazen array olarak döner. Birleştiriyoruz.
                    if (Array.isArray(rec.data)) {
                        rec.data = rec.data.join(''); // Parçalanmış SPF/DKIM keylerini birleştir
                    }
                    records.push({...rec, type});
                });
            }
        } catch(e){}
    }));
    const order = { 'A': 1, 'MX': 2, 'NS': 3, 'TXT': 4, 'CNAME': 5, 'AAAA': 6, 'SOA': 7 };
    return records.sort((a, b) => (order[a.type] || 99) - (order[b.type] || 99));
}

async function fetchISP(ip, tr, callback) {
    try {
        const d = await fetch(`${API.IP}${ip}`).then(r => r.json());
        // FIX: ipwho.is rate limit veya başarısız olursa patlamaması için kontrol
        if(d.success) {
            // FIX: Flag bazen null gelebilir veya emoji olmayabilir. Fallback eklendi.
            const flag = d.flag?.emoji ? d.flag.emoji : (d.country_code || "");
            const txt = `${flag} ${d.connection.org || d.connection.isp || "ISP Bilinmiyor"}`;
            
            if(tr) tr.querySelector('.meta-info').innerText = txt;
            if(ip === document.getElementById('valIP').innerText) {
                document.getElementById('lblLoc').innerText = `${flag} ${d.country_code || ""}`;
            }
            if(callback) callback(d.connection.org || d.connection.isp);
        } else {
            // API başarısızsa en azından boş kalmasın
            if(tr) tr.querySelector('.meta-info').innerText = "ISP Bilgisi Alınamadı";
        }
    } catch(e){
        if(tr) tr.querySelector('.meta-info').innerText = "...";
    }
}
async function resolveMXIP(host, tr) {
    try {
        const r = await fetch(`${API.DNS}?name=${host}&type=A`).then(j=>j.json());
        if(r.Answer && r.Answer[0]) {
            const ip = r.Answer[0].data;
            const d = await fetch(`${API.IP}${ip}`).then(j=>j.json());
            if(d.success) {
                const flag = d.flag?.emoji ? d.flag.emoji : (d.country_code || "");
                tr.querySelector('.meta-info').innerText = `IP: ${ip} ${flag} (${d.connection.org})`;
                let cd = JSON.parse(tr.dataset.copyData || "{}");
                cd.ip = ip; cd.isp = d.connection.org;
                tr.dataset.copyData = JSON.stringify(cd);
            }
        }
    } catch(e){}
}
function measureTTFB(d) {
    const start = performance.now();
    fetch(`https://${d}`, {mode:'no-cors', method:'HEAD'}).then(()=>{
        const ms = Math.round(performance.now() - start);
        const el = document.getElementById('lblTTFB');
        el.innerText = ms + " ms";
        el.style.color = ms < 200 ? "var(--success)" : (ms < 600 ? "var(--warning)" : "var(--danger)");
    }).catch(() => {
        document.getElementById('lblTTFB').innerText = "Err";
    });
}

// --- WHOIS ANALİZİ ---
async function analyzeWhois() {
    const el = document.getElementById('whoisContent');
    const card = document.getElementById('whoisCard');
    const target = (currentDomain !== rootDomain) ? rootDomain : currentDomain;

    try {
        const res = await fetch(`${API.RDAP}${target}`).then(r => r.json());
        const regName = res.entities?.[0]?.vcardArray?.[1]?.find(x => x[0] === 'fn')?.[3] || t('valPrivate');
        const events = res.events || [];
        const regDate = events.find(e => e.eventAction === 'registration')?.eventDate || "---";
        const status = res.status ? res.status.join(', ') : t('valUnknown');
        
        let txt = `Domain: ${target}\nDurum: ${status}\nFirma: ${regName}\nKayıt: ${regDate.split('T')[0]}`;
        
        if (target.endsWith('.tr') && status === t('valUnknown')) {
            txt += "\n(.tr domainleri için aşağıdaki TRABİS butonunu kullanın)";
        }

        el.innerText = txt;
        card.dataset.copyData = JSON.stringify({ domain: target, reg: regName, date: regDate.split('T')[0], status: status });
    } catch(e) { 
        el.innerText = "RDAP verisi alınamadı (veya .tr kısıtlaması)."; 
    }
}

// --- SSL ANALİZİ (Live Check Fallback) ---
async function analyzeAdvancedSSL() {
    const cardSSL = document.getElementById('cardSSL');
    let foundInCrt = false;

    try {
        const res = await fetch(`${API.SSL}${currentDomain}`).then(r => r.json());
        // Süresi geçmemişleri filtrele ve en yeniyi al
        const validCerts = res
            .filter(c => new Date(c.not_after) > new Date())
            .sort((a, b) => b.id - a.id);

        const valid = validCerts[0];
        
        if(valid) {
            foundInCrt = true;
            const date = new Date(valid.not_after).toLocaleDateString();
            let issuer = "Unknown";
            if (valid.issuer_name) {
                const match = valid.issuer_name.match(/O=([^,]+)/);
                if (match && match[1]) issuer = match[1];
                else issuer = valid.issuer_name.substring(0, 15) + "...";
            }
            document.getElementById('valSSL').innerHTML = `<span class="text-green">${t('valActive')} (${date})</span><br><span style="font-size:9px; color:var(--text-sub)">${issuer}</span>`;
            cardSSL.dataset.tpl = "ssl_ok";
            updateCardData('cardSSL', {domain: currentDomain, date: date, issuer: issuer});
        } 
    } catch(e) { foundInCrt = false; }

    // FALLBACK: Eğer crt.sh bulamazsa manuel fetch ile kontrol et (Live Check)
    if (!foundInCrt) {
        try {
            await fetch(`https://${currentDomain}`, { mode: 'no-cors' });
            // Hata yoksa site HTTPS ile açılıyor demektir
            document.getElementById('valSSL').innerHTML = `<span class="text-green">${t('valActive')} (Live Check)</span>`;
            cardSSL.dataset.tpl = "ssl_ok";
            updateCardData('cardSSL', {domain: currentDomain, date: "Bilinmiyor", issuer: "Canlı Kontrol"});
        } catch (e) {
            document.getElementById('valSSL').innerHTML = `<span class="text-red">${t('valNotFound')}</span>`;
            cardSSL.dataset.tpl = "ssl_err";
        }
    }
    
    // Redirect Kontrolü
    try {
        const r = await fetch(`http://${currentDomain}`, {method: 'HEAD', redirect: 'follow'});
        const box = document.getElementById('cardRedirect');
        const txt = document.getElementById('valSSLRedirect');
        
        if(r.url.startsWith('https')) {
            txt.innerHTML = `<span class="text-green"><i class="fas fa-check"></i> ${t('valRedirYes')}</span>`;
            box.style.borderLeftColor = "var(--success)";
            box.dataset.tpl = "ssl_redir_ok";
        } else {
            txt.innerHTML = `<span class="text-red"><i class="fas fa-times"></i> ${t('valRedirNo')}</span>`;
            box.style.borderLeftColor = "var(--danger)";
            box.dataset.tpl = "ssl_redir_err";
        }
    } catch(e) { 
        document.getElementById('valSSLRedirect').innerText = t('valAccessErr'); 
    }
}

function handleSmartCopy(tplKey, jsonData) {
    const data = typeof jsonData === 'string' ? JSON.parse(jsonData || "{}") : jsonData;
    let tpl = settings.tpl[tplKey] || DEFAULTS.tpl[tplKey] || "Şablon Bulunamadı";
    for (const [key, val] of Object.entries(data)) { tpl = tpl.replace(new RegExp(`{${key}}`, 'g'), val || ""); }
    tpl = tpl.replace(/{domain}/g, currentDomain).replace(/{.*?}/g, '...');
    navigator.clipboard.writeText(tpl).then(() => showToast(tpl));
}
function showToast(msg) {
    const t = document.getElementById('toast');
    t.innerText = msg;
    t.style.display = 'block';
    setTimeout(() => t.style.display = 'none', 3000);
}
function updateCardData(id, data, isParent = false) {
    const el = document.getElementById(id);
    if(!el) return;
    const target = isParent ? el.parentElement : el;
    let d = JSON.parse(target.dataset.copyData || "{}");
    target.dataset.copyData = JSON.stringify({...d, ...data});
}
function analyzeHeadersFetch(d) {
    fetch(`https://${d}`).then(r=>{ const h=[]; for(let [k,v] of r.headers) h.push({name:k,value:v}); renderHeaders(h); });
}
function analyzeHeaders(tId) {
    chrome.scripting.executeScript({target:{tabId:tId}, func:()=>{
        const r=new XMLHttpRequest(); r.open('HEAD', document.location, false); r.send(null);
        return r.getAllResponseHeaders();
    }}, (res)=>{
        if(res&&res[0]) {
            const h = res[0].result.trim().split(/[\r\n]+/).map(l=>{const p=l.split(': '); return {name:p[0], value:p.slice(1).join(': ')}});
            renderHeaders(h);
        }
    });
}
function renderHeaders(headers) {
    const tb = document.getElementById('headersBody'); tb.innerHTML='';
    let srv="?";
    headers.forEach(h=>{
        const tr=document.createElement('tr'); tr.innerHTML=`<td><b>${h.name}</b></td><td>${h.value}</td>`;
        tb.appendChild(tr);
        if(h.name.toLowerCase()==='server') srv=h.value;
    });
    let panel = t('valPrivate');
    if(srv.includes('LiteSpeed')||srv.includes('Apache')) panel="cPanel/CyberPanel";
    if(srv.includes('IIS')||srv.includes('Win')) panel="Plesk (Windows)";
    if(srv.includes('nginx')) panel="Plesk/Nginx";
    document.getElementById('valPanel').innerText = panel;
    updateCardData('valPanel', {domain:currentDomain, panel:panel}, true);
}

// --- CMS TESPİTİ ---
function detectCMS(tId) {
    chrome.scripting.executeScript({target:{tabId:tId}, func:()=>{
        const metaGen = document.querySelector('meta[name="generator"]')?.content?.toLowerCase() || "";
        if (metaGen.includes('wordpress')) return 'WordPress';
        if (document.querySelector('link[href*="/wp-content/"]') || document.querySelector('script[src*="/wp-content/"]')) return 'WordPress';
        if (metaGen.includes('joomla')) return 'Joomla';
        if (document.querySelector('script[src*="/media/jui/js"]')) return 'Joomla';
        if (metaGen.includes('drupal')) return 'Drupal';
        if (document.querySelector('link[href*="/sites/default/files/"]')) return 'Drupal';
        if (document.querySelector('link[href*="cdn.shopify.com"]')) return 'Shopify';
        if (document.querySelector('script[src*="route=common/home"]') || document.querySelector('link[href*="catalog/view/theme"]')) return 'OpenCart';
        if (metaGen.includes('vbulletin')) return 'vBulletin';
        if (document.documentElement.innerHTML.includes('laravel')) return 'Laravel (PHP)';
        return null;
    }}, (r)=>{
        let res = (r && r[0] && r[0].result) ? r[0].result : t('cmsSpecial');
        document.getElementById('valCMS').innerText = res;
        updateCardData('valCMS', {domain:currentDomain, cms:res}, true);
    });
}
function parseSPF(t){ if(t.includes('-all')) return `<b style="color:green">${t('valStrict')}</b>`; return `<b style="color:orange">${t('valRelax')}</b>`; }
function generateTicketSummary() {
    const t = `Domain: ${currentDomain}\nIP: ${document.getElementById('valIP').innerText}\nPanel: ${document.getElementById('valPanel').innerText}`;
    navigator.clipboard.writeText(t).then(()=>showToast('Özet Kopyalandı'));
}
function generatePassword() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let pass = ""; for(let i=0; i<16; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
    document.getElementById('genPassOut').value = pass;
}
function loadSettings() {
    const s = JSON.parse(localStorage.getItem('sa_settings') || '{}');
    settings = { ...DEFAULTS, ...s, tpl: { ...DEFAULTS.tpl, ...(s.tpl || {}) } };
}
function loadSettingsToUI() {
    document.getElementById('setMealMin').value = settings.mealDuration;
    document.getElementById('setBreakMin').value = settings.breakDuration;
    document.getElementById('setSearchValues').value = (settings.watchList || []).join('\n');
    document.getElementById('setSubdomains').value = settings.subdomains || "";
    Object.keys(settings.tpl).forEach(k => {
        const el = document.getElementById(`tpl_${k}`);
        if(el) el.value = settings.tpl[k];
    });
}
function saveSettingsFromUI() {
    settings.mealDuration = document.getElementById('setMealMin').value;
    settings.breakDuration = document.getElementById('setBreakMin').value;
    settings.watchList = document.getElementById('setSearchValues').value.split('\n').map(x => x.trim()).filter(x => x !== "");
    settings.subdomains = document.getElementById('setSubdomains').value.trim();

    Object.keys(settings.tpl).forEach(k => {
        const el = document.getElementById(`tpl_${k}`);
        if(el) settings.tpl[k] = el.value;
    });
    localStorage.setItem('sa_settings', JSON.stringify(settings));
    document.getElementById('modalSettings').classList.remove('show');
    showToast(t('btnSave') + ' OK');
    setLanguage(currentLang);
}
function startLiveClock() {
    const container = document.getElementById('shiftListContainer'); container.innerHTML = '';
    SHIFTS.forEach(s => {
        container.innerHTML += `<div class="shift-row"><div class="shift-name">${s.name}</div><div class="shift-track"><div class="shift-bar ${s.class}" id="bar-${s.start}" style="width:0%"></div></div></div>`;
    });
    setInterval(() => {
        const now = new Date(); document.getElementById('liveClock').innerText = now.toLocaleTimeString();
        SHIFTS.forEach(s => {
            const bar = document.getElementById(`bar-${s.start}`);
            let sd = new Date(); sd.setHours(s.start,0,0); let ed = new Date(); ed.setHours(s.end,0,0);
            if(s.end===24) ed.setHours(23,59,59);
            if(now >= sd && now <= ed) bar.style.width = ((now-sd)/(ed-sd))*100 + "%";
            else if(now > ed) bar.style.width="100%"; else bar.style.width="0%";
        });
    }, 1000);
}
function renderHistoryChips(){
    const c = document.getElementById('historyChips'); c.innerHTML='';
    JSON.parse(localStorage.getItem('hist')||'[]').forEach(d=>{
        const chip=document.createElement('div'); chip.className='chip'; chip.innerText=d;
        chip.onclick=()=>{document.getElementById('domainInput').value=d; startAnalysis(d);};
        c.appendChild(chip);
    });
}
function addToHistory(d){
    let h = JSON.parse(localStorage.getItem('hist')||'[]');
    if(!h.includes(d)){ h.unshift(d); if(h.length>10)h.pop(); localStorage.setItem('hist',JSON.stringify(h));}
}
function checkBreakStatus() {
    const breakEnd = localStorage.getItem('sa_break_end');
    if (breakEnd) {
        document.getElementById('breakButtons').classList.add('hidden');
        document.getElementById('activeBreakDisplay').classList.remove('hidden');
        startBreakTimerInterval(parseInt(breakEnd));
    }
}
function startBreak(type) {
    const duration = type === 'meal' ? settings.mealDuration : settings.breakDuration;
    const endTime = Date.now() + (duration * 60 * 1000);
    localStorage.setItem('sa_break_end', endTime);
    localStorage.setItem('sa_break_type', type);
    document.getElementById('breakButtons').classList.add('hidden');
    document.getElementById('activeBreakDisplay').classList.remove('hidden');
    startBreakTimerInterval(endTime);
}
function startBreakTimerInterval(endTime) {
    if (breakTimerInterval) clearInterval(breakTimerInterval);
    updateTimerDisplay(endTime);
    breakTimerInterval = setInterval(() => { updateTimerDisplay(endTime); }, 1000);
}
function updateTimerDisplay(endTime) {
    const now = Date.now();
    const diff = endTime - now;
    const statusText = document.getElementById('breakStatusText');
    const display = document.getElementById('breakCountdown');
    if (diff <= 0) {
        display.innerText = "00:00";
        statusText.innerText = t('breakFinished');
        statusText.style.color = "var(--danger)";
        display.style.color = "var(--danger)";
    } else {
        statusText.innerText = t('breakOngoing');
        statusText.style.color = "var(--accent)";
        display.style.color = "var(--accent)";
        const m = Math.floor(diff / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        display.innerText = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
}
function endBreak() {
    if (breakTimerInterval) clearInterval(breakTimerInterval);
    localStorage.removeItem('sa_break_end');
    localStorage.removeItem('sa_break_type');
    document.getElementById('breakButtons').classList.remove('hidden');
    document.getElementById('activeBreakDisplay').classList.add('hidden');
}
