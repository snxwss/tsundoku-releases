const { contextBridge, ipcRenderer, webFrame } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // VNDB
  vndbSearch:  (query, sort, opts) => ipcRenderer.invoke('vndb-search', query, sort, opts),
  vndbGet:     (id)           => ipcRenderer.invoke('vndb-get', id),
  vndbBrowse:  (sort, opts)   => ipcRenderer.invoke('vndb-browse', sort, opts),
  vndbTopRated: (opts)        => ipcRenderer.invoke('vndb-top-rated', opts),
  vndbTagSearch: (name)       => ipcRenderer.invoke('vndb-tag-search', name),
  vndbProducerSearch: (name)  => ipcRenderer.invoke('vndb-producer-search', name),
  steamAppDetails: (vnId)     => ipcRenderer.invoke('steam-appdetails', vnId),

  // Store
  entriesGetAll: () => ipcRenderer.invoke('entries-get-all'),
  entryEnrich:   (meta) => ipcRenderer.invoke('entry-enrich', meta),

  // Zoom (uses Chromium zoom factor — scales correctly without layout breakage)
  setZoom: (factor) => { try { webFrame.setZoomFactor(factor); } catch {} },

  // Library / Wishlist membership
  addToList:      (meta, list) => ipcRenderer.invoke('entry-add-to-list', meta, list),
  removeFromList: (id,   list) => ipcRenderer.invoke('entry-remove-from-list', id, list),

  // Hide / unhide from browse & search discovery
  hideEntry:   (meta) => ipcRenderer.invoke('entry-hide', meta),
  unhideEntry: (id)   => ipcRenderer.invoke('entry-unhide', id),

  // Library
  libraryAddScanned:   (meta, exePath) => ipcRenderer.invoke('library-add-scanned', meta, exePath),
  libraryUpdateStatus: (id, status)    => ipcRenderer.invoke('library-update-status', id, status),
  libraryUpdateExe:    (id, exePath)   => ipcRenderer.invoke('library-update-exe', id, exePath),
  libraryExclude:      (id)            => ipcRenderer.invoke('library-exclude', id),
  libraryUnexclude:    (id)            => ipcRenderer.invoke('library-unexclude', id),

  // Files / launch / scan
  pickExe:    ()               => ipcRenderer.invoke('pick-exe'),
  launchVN:   (exePath, id)    => ipcRenderer.invoke('launch-vn', exePath, id),
  isVNRunning: (id)            => ipcRenderer.invoke('is-vn-running', id),
  stopVN:      (id)            => ipcRenderer.invoke('stop-vn', id),
  onVNStopped: (cb)            => ipcRenderer.on('vn-stopped', (_e, id) => cb(id)),
  onVNStarted: (cb)            => ipcRenderer.on('vn-started', (_e, id) => cb(id)),
  setAutoStart: (enabled)      => ipcRenderer.invoke('set-auto-start', enabled),
  scanFolder: ()               => ipcRenderer.invoke('scan-folder'),

  // Settings
  getSettings:   ()          => ipcRenderer.invoke('get-settings'),
  writeSetting:  (key, val)  => ipcRenderer.invoke('write-setting', key, val),
  addScanDir:    ()          => ipcRenderer.invoke('add-scan-dir'),
  removeScanDir: (dir)       => ipcRenderer.invoke('remove-scan-dir', dir),

  // Backup / restore
  exportData: () => ipcRenderer.invoke('export-data'),
  importData: () => ipcRenderer.invoke('import-data'),

  // Version
  getVersion: () => ipcRenderer.invoke('get-version'),
  getInstallPath: () => ipcRenderer.invoke('get-install-path'),
  getDataPath: () => ipcRenderer.invoke('get-data-path'),
  openPath: (p) => ipcRenderer.invoke('open-path', p),
  wishlistGetReleases: (ids) => ipcRenderer.invoke('wishlist-get-releases', ids),

  // Auto-update
  getUpdateState:  ()   => ipcRenderer.invoke('get-update-state'),
  checkForUpdates: ()   => ipcRenderer.invoke('check-for-updates'),
  quitAndInstall:  ()   => ipcRenderer.invoke('quit-and-install'),
  onUpdateStatus:  (cb) => ipcRenderer.on('update-status', (_e, s) => cb(s)),

  // External links (open in default browser)
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  uninstallApp: (deleteData) => ipcRenderer.invoke('uninstall-app', deleteData),

  // Window controls
  winMinimize: ()   => ipcRenderer.send('win-minimize'),
  winMaximize: ()   => ipcRenderer.send('win-maximize'),
  winClose:    ()   => ipcRenderer.send('win-close'),
  winIsMaximized: () => ipcRenderer.invoke('win-is-maximized'),
  setWindowIcon:  (dataUrl) => ipcRenderer.invoke('win-set-icon', dataUrl),
  onWinMaximized: (cb) => ipcRenderer.on('win-maximized', (_e, v) => cb(v)),
  onWindowShown:  (cb) => ipcRenderer.on('window-shown', () => cb()),
  onEntriesChanged: (cb) => ipcRenderer.on('entries-changed', () => cb()),
});
