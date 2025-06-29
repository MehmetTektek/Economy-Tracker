
import DashboardModule from './src/modules/dashboard/DashboardModule.js';

// Global değişkenler
let dashboardInstance = null; // Dashboard modülünün instance'ı

// Log helper
function logToPage(message, type = 'info') {
    const logOutput = document.getElementById('log-output');
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = document.createElement('div');

    logEntry.innerHTML = `[${timestamp}] ${type.toUpperCase()}: ${message}`;
    logOutput.appendChild(logEntry);

    // Son log
    logOutput.scrollTop = logOutput.scrollHeight;
}

// Dashboard modülünü başlat
function initializeDashboard() {
    try {
        logToPage('Dashboard modülü başlatılıyor...', 'info');

        // Instance check
        if (dashboardInstance) {
            dashboardInstance.destroy(); // Önceki instance varsa yok et
        }

        // Yeni instance oluştur
        dashboardInstance = new DashboardModule(document.getElementById('dashboard-container'));

        // Başlatma işlemi
        dashboardInstance.initialize()

        logToPage('Dashboard modülü başarıyla başlatıldı.', 'success');
    } catch (error) {
        logToPage(`Dashboard modülü başlatılırken hata oluştu: ${error.message}`, 'error');
        console.error('Dashboard modülü başlatma hatası:', error);
    }   
}

// Test verisi
function loadTestData() {
    try {
        if (!dashboardInstance) {
            logToPage('Dashboard modülü başlatılmadı. Lütfen önce başlatın.', 'error');
            return;
        }

        logToPage('Test verileri yükleniyor...', 'info');

        // Dummy data
        const mockData = {
            totalIncome: 8500.00,
            totalExpenses: 3200.75,
            totalDebt: 0, // veya örnek bir borç
            balance: 15750.50,
            transactions: [
                {
                    id: 1,
                    type: 'income',
                    amount: 5000,
                    description: 'Maaş Geliri',
                    date: new Date().toISOString(),
                    category: 'Maaş'
                },
                {
                    id: 2,
                    type: 'expense',
                    amount: 1200,
                    description: 'Market Alışverişi',
                    date: new Date().toISOString(),
                    category: 'Gıda'
                },
                {
                    id: 3,
                    type: 'expense',
                    amount: 800,
                    description: 'Elektrik Faturası',
                    date: new Date().toISOString(),
                    category: 'Faturalar'
                }
            ]
        };

        dashboardInstance.loadData(mockData);
        logToPage('Test verileri başarıyla yüklendi.', 'success');
    } catch (error) {
        logToPage(`Test verileri yüklenirken hata oluştu: ${error.message}`, 'error');
        console.error('Test verileri yükleme hatası:', error);
    }
}

function destroyDashboard() {
    try {
        if (!dashboardInstance) {
            logToPage('Dashboard modülü başlatılmadı. Lütfen önce başlatın.', 'error');
            return;
        }

        logToPage('Dashboard modülü temizleniyor...', 'info');

        // Dashboard modülünü yok et
        dashboardInstance.destroy();
        dashboardInstance = null; // Instance'ı temizle

        logToPage('Dashboard modülü başarıyla temizlendi.', 'success');
    } catch (error) {
        logToPage(`Dashboard modülü temizlenirken hata oluştu: ${error.message}`, 'error');
        console.error('Dashboard modülü temizleme hatası:', error);
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('init-btn').addEventListener('click', initializeDashboard);
    document.getElementById('load-data-btn').addEventListener('click', loadTestData);
    document.getElementById('destroy-btn').addEventListener('click', destroyDashboard);

    logToPage('Dashboard modülü hazır. Lütfen bir işlem seçin.', 'info');
});

// Console mesajlarını sayfaya yazdırma
const originalConsoleLog = console.log;
console.log = function(...args) {
    originalConsoleLog.apply(console, args);
    logToPage(args.join(' '), 'console');
};