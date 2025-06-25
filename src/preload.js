import { contextBridge, ipcRenderer } from 'electron';

// Webpage ile electron bağlantısı
contextBridge.exposeInMainWorld('electronAPI', {
    // Dosya saklama işlemleri
    store: {
        get: (key) => ipcRenderer.invoke('store-get', key),
        set: (key, value) => ipcRenderer.invoke('store-set', key, value),
        clear: () => ipcRenderer.invoke('store-clear')
    },

    // Veri aktarımı işlemleri
    onExportData: (callback) => ipcRenderer.on('export-data', callback),
    onImportData: (callback) => ipcRenderer.on('import-data', callback),

    // Temizlik işlemleri
    removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),

    // Platform bilgisi
    platform: process.platform
});