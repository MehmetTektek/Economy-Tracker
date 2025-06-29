import BaseModule from "../shared/base-module.js";


// DashboardModule - Ana dashboard modülü
// BaseModule sınıfından türetilir
class DashboardModule extends BaseModule {

    // Constructor 
    constructor(container) {

        // BaseModule constructor'ını çağır
        super("dashboard", container);

        // Dashboard modülüne özel başlangıç işlemleri
        this.name = "Dashboard";
        this.title = "Ana Sayfa";
        this.icon = "dashboard"; // MD3 icon name

        // Dashboard modülüne özel veriler
        this.dashboardData = {
            totalIncome: 0,
            totalExpenses: 0,
            totalDebt: 0,
            upcomingPayments: [],
        }
    }

    // Initialize metoduna override
    async initialize() {
        try{
            // BaseModule initialize işlemlerini çağır
            await super.initialize();

            // Dashboard modülüne özel başlangıç işlemleri
            console.log("Dashboard modülü başlatıldı");

            // Verileri yükle
            await this.loadDashboardData();
            
            // Eventleri dinle
            this.bindDashboardEvents();

            console.log(`${this.name} modülü başarıyla başlatıldı`);

        } catch (error) {
            console.error("Dashboard modülü başlatılırken hata oluştu:", error);
        }
    }

    // loadData Override
    async loadData(data) {
        try {
            if (data) {
                // Eğer dışarıdan veri geldiyse, doğrudan dashboardData'ya ata
                this.dashboardData = { ...this.dashboardData, ...data };
                // İstersen BaseModule'un data'sını da güncelleyebilirsin
                this.data = { ...this.data, ...data };
            } else {
                // Eğer dışarıdan veri gelmediyse, BaseModule'un orijinal loadData'sını çağır
                await super.loadData();
                this.dashboardData = { ...this.dashboardData, ...this.data };
            }
            this.calculateFinancialSummary();
            // Render'ı güncelle
            this.render();
        } catch (error) {
            console.error("Dashboard verileri yüklenirken hata oluştu:", error);
        }
    }

    // Dashboard verilerini yükle
   async loadDashboardData() {
    try {
        await this.loadData();
        const savedData = this.data
        
        if (savedData) {
            this.dashboardData = { ...this.dashboardData, ...savedData };
        }
        
        // Finansal özet hesapla
        this.calculateFinancialSummary();
        
        console.log("Dashboard verileri yüklendi:", this.dashboardData);

        } catch (error) {
            console.error("Dashboard verileri yüklenirken hata oluştu:", error);
        }
    } 

    // Finansal özet hesapla
    calculateFinancialSummary() {
        // Gelir - Gider = Bakiye
        this.dashboardData.balance = this.dashboardData.totalIncome - this.dashboardData.totalExpenses;

        // Borç durumu
        if (this.dashboardData.balance > 0) {
            this.dashboardData.debtRatio = (this.dashboardData.totalDebt / this.dashboardData.totalIncome) * 100;
        }

        console.log("Finansal özet hesaplandı:", this.dashboardData);
    }

    // Dashboard eventlerini bağla
    bindDashboardEvents() {
        console.log("Dashboard event listenerları bağlanıyor...");
    }

    // Render metoduna override
    async render() {
        try {
                   // HTML render
        const htmlContent = this.createDashboardHTML();

        // BaseModule render işlemini çağır
        await super.render(htmlContent);

        // Dashboard modülüne özel render işlemleri
        this.attachDashboardEvents();

        console.log("Dashboard modülü render edildi");
        return
    }   catch (error) {
            console.error("Dashboard modülü render edilirken hata oluştu:", error);
        }
    }

    // Dashboard HTML içeriğini oluştur
    createDashboardHTML() {
    const template = `
            <div class="dashboard-container md3-surface">
                <!-- Dashboard Başlık -->
                <header class="dashboard-header">
                    <h1 class="md3-headline-large">${this.title}</h1>
                    <p class="md3-body-medium">Finansal durumunuzun özeti</p>
                </header>

                <!-- Finansal Özet Kartları -->
                <section class="financial-summary">
                    ${this.createFinancialCards()}
                </section>

                <!-- Hızlı İşlemler -->
                <section class="quick-actions">
                    ${this.createQuickActions()}
                </section>

                <!-- Son İşlemler -->
                <section class="recent-transactions">
                    ${this.createRecentTransactions()}
                </section>
            </div>
        `;
        return template;
    }

    createFinancialCards() {
        return `
            <div class="financial-cards-grid">
                <!-- Toplam Bakiye -->
                <div class="md3-card financial-card balance-card">
                    <div class="card-content">
                        <span class="md3-label-large">Toplam Bakiye</span>
                        <span class="md3-headline-medium">${this.formatCurrency(this.dashboardData.balance || 0)}</span>
                    </div>
                    <div class="card-icon">
                        <span class="material-icons">account_balance_wallet</span>
                    </div>
                </div>

                <!-- Gelir -->
                <div class="md3-card financial-card income-card">
                    <div class="card-content">
                        <span class="md3-label-large">Toplam Gelir</span>
                        <span class="md3-headline-medium">${this.formatCurrency(this.dashboardData.totalIncome)}</span>
                    </div>
                    <div class="card-icon">
                        <span class="material-icons">trending_up</span>
                    </div>
                </div>

                <!-- Gider -->
                <div class="md3-card financial-card expense-card">
                    <div class="card-content">
                        <span class="md3-label-large">Toplam Gider</span>
                        <span class="md3-headline-medium">${this.formatCurrency(this.dashboardData.totalExpenses)}</span>
                    </div>
                    <div class="card-icon">
                        <span class="material-icons">trending_down</span>
                    </div>
                </div>

                <!-- Borç -->
                <div class="md3-card financial-card debt-card">
                    <div class="card-content">
                        <span class="md3-label-large">Toplam Borç</span>
                        <span class="md3-headline-medium">${this.formatCurrency(this.dashboardData.totalDebt)}</span>
                    </div>
                    <div class="card-icon">
                        <span class="material-icons">credit_card</span>
                    </div>
                </div>
            </div>
        `;
    }


    formatCurrency(amount) {
        // Amount yoksa 0 olarak ayarla
        const value = amount || 0;

        // Türk Lirası formatında döndür
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    }

    // Hızlı işlemler HTML içeriğini oluştur
    createQuickActions() {
        return `
            <div class="quick-actions-grid">
                <h3 class="md3-title-medium">Hızlı İşlemler</h3>

                <div class="actions-container">
                    <!-- Gelir Ekle -->
                    <button class="md3-button md3-button-filled quick-action-btn" data-action="add-income">
                        <span class="material-icons">add_circle</span>
                        <span class="button-text">Gelir Ekle</span>
                    </button>

                    <!-- Gider Ekle -->
                    <button class="md3-button md3-button-filled quick-action-btn" data-action="add-expense">
                        <span class="material-icons">remove_circle</span>
                        <span class="button-text">Gider Ekle</span>
                    </button>

                    <!-- Rapor Görüntüle -->
                    <button class="md3-button md3-button-outlined quick-action-btn" data-action="view-report">
                        <span class="material-icons">bar_chart</span>
                        <span class="button-text">Rapor Görüntüle</span>
                    </button>

                    <!-- Ayarlar -->
                    <button class="md3-button md3-button-outlined quick-action-btn" data-action="settings">
                        <span class="material-icons">settings</span>
                        <span class="button-text">Ayarlar</span>
                    </button>
                </div>
            </div>
        `;

    }

    // Son işlemler HTML içeriğini oluştur
    createRecentTransactions() {
        return `
            <div class="recent-transactions-container">
                <h3 class="md3-title-medium">Son İşlemler</h3>
                <div class="transactions-list">
                    <div class="md3-card transaction-item">
                        <div class="transaction-content">
                            <span class="md3-body-medium">Henüz işlem bulunmuyor</span>
                            <span class="md3-body-small">Gelir veya gider ekleyerek başlayın</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    createHTML() {
        return this.createDashboardHTML();
    }

    // Dashboard modülüne event listener'ları ekle
    attachDashboardEvents() {

        console.log("Dashboard event listenerları ekleniyor...");

        // Hızlı işlemler butonlarına event listener ekle
        const quickActionBtns = this.container.querySelectorAll('.quick-action-btn');

        quickActionBtns.forEach(btn => {
            btn.addEventListener('click', (event) => {
                const action = event.currentTarget.dataset.action;
                this.handleQuickAction(action);
            });
        });
    }

    // Hızlı işlem buton tıklamalarını işle
    handleQuickAction(action) {
        console.log(`Hızlı işlem: ${action}`);
        
        switch(action) {
            case 'add-income':
                console.log('Gelir ekleme sayfasına yönlendiriliyor...');
                break;
            case 'add-expense':
                console.log('Gider ekleme sayfasına yönlendiriliyor...');
                break;
            case 'view-report':
                console.log('Rapor sayfasına yönlendiriliyor...');
                break;
            case 'settings':
                console.log('Ayarlar sayfasına yönlendiriliyor...');
                break;
        }
    }
}
export default DashboardModule;