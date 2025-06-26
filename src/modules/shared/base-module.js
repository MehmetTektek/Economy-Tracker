/**
 * Modül yöneticisi - Tüm modüller için ortak temel sınıf
 */

class BaseModule {
    /**
     * Constructor
     * @param {string} name - Modül adı
     * @param {HTMLElement} container - Modülün yerleştirileceği HTML elementi
     */

    constructor(name, container) {
        this.name = name; // Modül adı
        this.container = container; // Modülün yerleştirileceği HTML elementi

        this.isInitialized = false; // Modülün başlangıç durumu
        this.isVisible = false; // Modülün görünürlük durumu
        this.data = {}; // Modül verileri
        this.events = []; // Modül olayları

        this.id = `module-${name.toLowerCase()}-${Date.now()}`; // Benzersiz modül ID'si

        console.log(`BaseModule initialized: ${this.name} (${this.id})`);
    }

    async initialize() {
        if (this.isInitialized) {
            console.warn(`Module ${this.name} is already initialized.`);
            return false
        }

        try {
            // Verileri yükle
            await this.loadData();

            // UI'yi render et
            this.render();
            console.log('UI render edildi.');

            // Event listeners'ı bağla
            this.bindEvents();
            console.log('Olaylar bağlandı.');

            // Modül başlangıç durumunu güncelle
            this.isInitialized = true;
            this.isVisible = true;

            console.log(`Modül ${this.name} (${this.id}) başarıyla başlatıldı.`);
            return true;
        }
        catch (error) {
            console.error(`Modül ${this.name} (${this.id}) başlatılırken hata oluştu:`, error);
            return false;
        }
    }

    render() {
        try {
            console.log(`🎨 ${this.name} modülü render ediliyor...`);

            // Container doğrulaması
            if (!this.container) {
                console.warn(`Container elementi bulunamadı: ${this.name}`);
                return false; // Container yoksa render etme
            }

            // Modülün HTML içeriğini temizle
            this.container.innerHTML = '';

            // Modül verilerini kullanarak HTML oluştur
            const moduleHTML = this.createHTML();

            // Ekle
            if (moduleHTML) {
                this.container.innerHTML = moduleHTML;

                // Modülün görünürlüğünü güncelle
                this.applyStyles();

                // Render sonrası işlemler
                this.afterRender();

                console.log(`🎨 ${this.name} modülü başarıyla render edildi.`);
                return true;
            } else {
                console.warn(`Modül HTML içeriği oluşturulamadı: ${this.name}`);
                return false; // HTML içeriği yoksa render etme
            }
        } catch (error) {
            console.error(`Modül render edilirken hata oluştu: ${this.name} (${this.id})`, error);
            return false; // Hata durumunda false döndür
        }
    }

    // Modülün HTML içeriğini oluşturur
    createHTML() {
        // Varsayılan HTML içeriği - her modül için özelleştirilebilir
        return `
            <div class="base-module" data-module="${this.name.toLowerCase()}">
                <h2 class="module-title">${this.name} Modülü</h2>
                <p class="module-description">Bu bir BaseModule örneğidir.</p>
                <div class="module-content">
                    <!-- Modül içeriği buraya gelecek -->
                    <p>Veriler yükleniyor...</p>
                </div>
            </div>
        `;
    }

    // Modülün görünürlüğünü ve stillerini ayarlar
    applyStyles() {
        if (!this.container) return;

        // MD3 temel stillerini uygula
        this.container.classList.add('md3-container');
        this.container.classList.add('module-container');
        this.container.classList.add('${this.name.toLowerCase()}-module');

        // Modül durumuna göre stilleri ayarla
        if (this.isVisible) {
            this.container.classList.add('module-visible');
        }

        if (this.isInitialized) {
            this.container.classList.add('module-initialized');
        }

        console.log(`🎨 ${this.name} - CSS sınıfları uygulandı`);
    }

    afterRender() {
        // Bu method override edilebilir
        console.log(`🔄 ${this.name} - Render sonrası işlemler`);
    }

    destroy() {
        try {
            console.log(`🗑️
        }
    }

    async loadData() {
        try {
            console.log(`Veriler yükleniyor: ${this.name} (${this.id})...`);

            // Electron API'yi kontrol et
            if (window.electronAPI && window.electronAPI.store) {
                // Electron'dan verileri yükle
                const savedData = await window.electronAPI.store.get(`${this.name.toLowerCase()}_data`);

                if (savedData) {
                    this.data = {... savedData}; //Spread operator ile verileri kopyala
                    console.log(`Electrondan veriler yüklendi: ${this.name} (${this.id})`, this.data);
                } else {
                    this.data = this.getDefaultData();
                    console.log(`Varsayılan veriler kullanılıyor: ${this.name} (${this.id})`, this.data);
                }
            } else {
                // Electron API mevcut değil, LocalStorage'dan verileri yükle
                const savedData = localStorage.getItem(`${this.name.toLowerCase()}_data`);
                if (savedData) {
                    this.data = JSON.parse(savedData); // JSON.parse ile verileri ayrıştır
                    console.log(`LocalStorage'dan veriler yüklendi: ${this.name} (${this.id})`, this.data);
                } else {
                    this.data = this.getDefaultData();
                    console.log(`Varsayılan veriler kullanılıyor: ${this.name} (${this.id})`, this.data);
                }
            }
            
            return true;
        } catch (error) {
            console.error(`Veriler yüklenirken hata oluştu: ${this.name} (${this.id})`, error);
            this.data = this.getDefaultData(); // Hata durumunda varsayılan verileri kullan
            return false;
        }
    }

    getDefaultData() {
            // Modül için varsayılan verileri döndür
            return {
                created : new Date().toISOString(), // Oluşturulma tarihi
                updated : new Date().toISOString(), // Güncellenme tarihi
                items: [], // Modül öğeleri
                settings: {} // Modül ayarları
                };

            }

    async saveData() {
        try {
            console.log(`Veriler kaydediliyor: ${this.name} (${this.id})...`);

            // Veri doğrulama
            if (!this.data) {
                console.warn(`Veri yok, kaydetme işlemi atlandı: ${this.name} (${this.id})`);
                return false; // Veri yoksa işlem yapma
            }

            this.data.updated = new Date().toISOString(); // Güncellenme tarihini ayarla

            // Electron API'yi kontrol et
            if (window.electronAPI && window.electronAPI.store) {
                // Electron'da verileri kaydet
                await window.electronAPI.store.set(`${this.name.toLowerCase()}_data`, this.data);
                console.log(`Veriler Electron'da kaydedildi: ${this.name} (${this.id})`, this.data);
            } else {
                // Electron API mevcut değil, LocalStorage'da verileri kaydet
                const dataString = JSON.stringify(this.data);
                localStorage.setItem(`${this.name.toLowerCase()}_data`, dataString);
                console.log(`${this.name} - LocalStorage'da veriler kaydedildi:`, dataString);
            }

            return true;
        } catch (error) {
            console.error(`Veriler kaydedilirken hata oluştu: ${this.name} (${this.id})`, error);
            return false; // Hata durumunda false döndür
        }
    }

    bindEvents() {
        try {
            console.log(`${this.name} event listenerları bağlanıyor...`);

            // Bağlantıları temizle
            this.unbindEvents();

            // Container doğrulaması
            if (!this.container) {
                console.warn(`Container elementi bulunamadı: ${this.name}`);
                return false;
            }

            // Click event listener
            const clickHandler = (event) => {
                this.handleClick(event);
            }

            // Form submit event listener
            const submitHandler = (event) => {
                this.handleSubmit(event);
            }

            // Container'a event listener ekle
            this.container.addEventListener('click', clickHandler);
            this.container.addEventListener('submit', submitHandler);

            // Event listenerları sakla (temizlik için)
            this.events.push({
                element: this.container,
                type : 'click',
                handler: clickHandler
            });

            this.events.push({
                element: this.container,
                type : 'submit',
                handler: submitHandler
            });

            console.log(`Event listenerlar bağlandı: ${this.name} (${this.events.length} adet)`);
        } catch (error) {
            console.error(`Event listenerlar bağlanırken hata oluştu: ${this.name} (${this.id})`, error);
            return false; // Hata durumunda false döndür
        }
    }

    /**
     * Event listenerları temizler
     */

    unbindEvents(){
        this.events.forEach(eventInfo => {
            eventInfo.element.removeEventListener(eventInfo.type, eventInfo.handler);
        });
        this.events = []; // Olayları temizle
        console.log(`Event listenerlar temizlendi: ${this.name} (${this.id})`);
    }

    /**
     * Click event yönetimi
     */

    handleClick(event) {
        console.log(`🖱️ ${this.name} - Click event:`, event.target);
        // Bu method her modül için özelleştirilebilir
    }

    /**
     * Form submit event yönetimi
     */
    handleSubmit(event) {
        event.preventDefault(); // Formun varsayılan submit davranışını engelle
        console.log(`📄 ${this.name} - Form submit event:`, event.target);
        // Bu method her modül için özelleştirilebilir
    }
}

// Dışa aktarım
export default BaseModule;