// AppCoordinator.js - Tüm modülleri yöneten ana sistem
// Bu dosya modül yönetimi ve koordinasyon için tasarlanmıştır
// Basit test için minimal AppCoordinator

console.log('AppCoordinator.js dosyası yüklendi');

import DashboardModule from "../../modules/dashboard/DashboardModule.js";

class AppCoordinator {
    constructor() {
        this.currentModule = null;
        this.modulecontainer = null;
        console.log('AppCoordinator instance oluşturuldu');
    }

    async initialize() {
        try {
            console.log('AppCoordinator initialize ediliyor...');

            // Dom elementlerini al
            this.modulecontainer = document.getElementById('module-container');
            if(!this.modulecontainer) {
                throw new Error('Module container bulunamadı. Lütfen HTML dosyasını kontrol edin.');
            }

            await this.loadDashboard();

            console.log('AppCoordinator initialize edildi.');
        } catch (error) {
            console.error('AppCoordinator initialize hatası:', error);
            this.showError(error.message);
        }
    }

    async loadDashboard() {
        try {
            console.log('DashboardModule yükleniyor...');
            
            // Eski modülü temizle
            this.modulecontainer.innerHTML = '';

            // Yeni modülü yükle
            this.currentModule = new DashboardModule(this.modulecontainer);

            // Start ve render
            await this.currentModule.initialize();
            await this.currentModule.render();

            console.log('DashboardModule yüklendi ve render edildi.');
    } catch (error) {
            console.error('DashboardModule yükleme hatası:', error);
            this.showError(error.message);
        }
    }

    showError(message) {
        console.error('AppCoordinator Error:', message);
        if (this.moduleContainer) {
            this.moduleContainer.innerHTML = `
                <div style="padding: 20px; color: red; border: 1px solid red; border-radius: 8px;">
                    <h3>Hata</h3>
                    <p>${message}</p>
                </div>
            `;
        }
    }
}

// Uygulama başlatma
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('DOM yüklendi, AppCoordinator başlatılıyor...');

        const app = new AppCoordinator();
        await app.initialize();

        // Debug amaçlı
        window.app = app; // AppCoordinator'u global olarak erişilebilir yap
        } catch (error) {
            console.error('AppCoordinator başlatma hatası:', error);
        }
    }
);