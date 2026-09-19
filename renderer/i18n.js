// ── Interface language (English / 日本語) ─────────────────────────────────────
// The UI is written in English throughout app.js. Rather than threading a lookup
// through every template, this layer translates the rendered DOM: each text node,
// placeholder and tooltip whose English text is in the dictionary is swapped for
// Japanese as it appears (a MutationObserver catches every re-render), and
// alert()/confirm() messages are translated the same way. Content — VN titles,
// descriptions, tags, names — is never in the dictionary, so it's left alone.
//
// To add a string: put the exact English (trimmed) in JA, or add a pattern to
// JA_PATTERNS when it contains a number or a name.
(function () {
  const JA = {
    // ── Navigation & shell ──
    'Home': 'ホーム', 'Library': 'ライブラリ', 'Browse': 'ブラウズ', 'Wishlist': 'ウィッシュリスト',
    'Stats': '統計', 'Statistics': '統計', 'Settings': '設定', 'Toggle theme': 'テーマ切替',
    'Minimize': '最小化', 'Maximize': '最大化', 'Close': '閉じる',
    'Linux alpha': 'Linux アルファ版', 'Linux support is early and less tested than Windows': 'Linux 版は初期段階で、Windows 版ほどテストされていません',

    // ── Common actions ──
    'Cancel': 'キャンセル', 'Save': '保存', 'Delete': '削除', 'Edit': '編集', 'Remove': '削除',
    'Restore': '復元', 'Discard': '破棄', 'Dismiss': '閉じる', 'Dismiss all': 'すべて閉じる',
    'Done': '完了', 'Continue': '続ける', 'Proceed': '進む', 'Change': '変更', 'Create': '作成',
    'Search': '検索', 'Searching…': '検索中…', 'Loading…': '読み込み中…', 'Load more': 'さらに読み込む',
    'Select all': 'すべて選択', 'Select none': '選択解除', 'Details': '詳細', 'Launch': '起動',
    'Import': 'インポート', 'Export': 'エクスポート', 'Unlock': 'ロック解除', 'Ignore': '無視',
    'Adding…': '追加中…', 'Locate': '場所を指定', 'Locate on device': 'このPCで場所を指定',
    'Open in browser': 'ブラウザで開く', 'Open on VNDB': 'VNDB で開く', 'Open in Explorer': 'エクスプローラーで開く',
    'View on Steam': 'Steam で見る', 'Click for details': 'クリックで詳細', 'Click to reveal': 'クリックで表示',
    'Click to unlock.': 'クリックでロック解除。', 'Yes, remove it': 'はい、削除する', 'Yes, uninstall': 'はい、アンインストールする',
    'Yes, clear': 'はい、消去する', 'Yes, restore': 'はい、復元する', 'Yes, wipe': 'はい、消去する',
    'Are you sure?': 'よろしいですか？', 'Unhide': '再表示', '↩ Unhide': '↩ 再表示', 'Scroll left': '左へスクロール', 'Scroll right': '右へスクロール',

    // ── Statuses ──
    'Unplayed': '未プレイ', 'Reading': 'プレイ中', 'Paused': '中断', 'Finished': 'クリア済み', 'Dropped': '断念',
    'All': 'すべて', 'Reading now': 'プレイ中', 'In library': 'ライブラリ内', 'In Library': 'ライブラリ内',
    'Wishlisted': 'ウィッシュリスト', 'In private list': 'プライベートリスト内',

    // ── Home ──
    'Now playing': 'プレイ中', 'Recently played': '最近プレイ', 'Recently added': '最近追加', 'Recently finished': '最近クリア',
    'The Pile': '積ん読', 'The pile': '積ん読', 'Pile of Shame': '積ん読の山', 'Your pile awaits.': '積ん読が待っています。',
    'Your shelf': 'あなたの本棚', 'see all →': 'すべて見る →', 'on the pile': '本が積ん読', 'last played': '最終プレイ',
    'Your library is empty': 'ライブラリは空です', 'Browse VNDB to add visual novels': 'VNDB からビジュアルノベルを追加しましょう',
    'or scan your games folder in Settings.': 'または設定でゲームフォルダをスキャンしてください。',
    'Browse VNDB': 'VNDB をブラウズ', 'Visual Novel': 'ビジュアルノベル', 'visual novel': 'ビジュアルノベル',

    // ── Library ──
    'Search library…': 'ライブラリを検索…', 'Search your library…': 'ライブラリを検索…', 'Library view': 'ライブラリ表示',
    'Grid': 'グリッド', 'List': 'リスト', 'Grid view': 'グリッド表示', 'List view': 'リスト表示',
    'Manage': '管理', 'Manage library': 'ライブラリを管理', 'Bulk hide / remove': '一括で非表示／削除',
    'Hide selected': '選択を非表示', 'Remove selected': '選択を削除', 'Unhide selected': '選択を再表示', '0 selected': '0 件選択',
    'No visual novels match this filter': 'このフィルターに一致するビジュアルノベルはありません',
    'Try a different filter or search term.': '別のフィルターや検索語を試してください。', 'Try a different search term.': '別の検索語を試してください。',
    'No titles match.': '一致するタイトルはありません。', 'Nothing to show.': '表示する項目はありません。',
    'Alphabetical': '五十音・アルファベット順', 'Release year': '発売年',
    '// SORT': '// 並び替え', '// FILTER': '// フィルター', '// TAG': '// タグ', '// COLLECTIONS': '// コレクション', '// SETTINGS': '// 設定',
    '+ New collection': '+ 新しいコレクション', '+ Add to collection': '+ コレクションに追加', 'New Collection': '新しいコレクション',
    'Collection name…': 'コレクション名…', 'This collection is empty': 'このコレクションは空です',
    'Click “Add to collection” above to add titles from your library.': '上の「コレクションに追加」からライブラリのタイトルを追加できます。',
    'Delete collection?': 'コレクションを削除しますか？', 'Remove from library?': 'ライブラリから削除しますか？',
    'Remove from library': 'ライブラリから削除', 'Exclude from library': 'ライブラリから除外', '↩ Include back': '↩ 戻す',
    'Add to library': 'ライブラリに追加', 'Add to Library': 'ライブラリに追加', '↩ in your library': '↩ ライブラリ内',
    'Change EXE': 'EXE を変更', 'Install location': 'インストール先', 'on device': 'このPCにあり', 'not installed': '未インストール',
    '● on device': '● このPCにあり', '○ not installed': '○ 未インストール', 'Not installed': '未インストール', 'On this PC': 'このPC',
    '■ Stop': '■ 停止', 'Tag name…': 'タグ名…', 'last played:': '最終プレイ:', 'last:': '最終:',

    // ── Browse / search ──
    'Search VNDB…': 'VNDB を検索…', 'Top Rated': '高評価', 'Most Relevant': '関連度順', 'Most Voted': '投票数順',
    'New Releases': '新作', 'Filters': 'フィルター', 'Clear all': 'すべてクリア', 'YEAR': '発売年', 'RATING': '評価',
    'LENGTH': '長さ', 'STUDIO': 'スタジオ', 'TAG': 'タグ', 'SORT': '並び替え', 'From': '開始', 'To': '終了',
    'Developer name…': '開発元名…', 'Add a tag, press Enter…': 'タグを入力して Enter…', 'Allow 18+': '18禁を許可',
    'Screenshots only': 'スクリーンショットあり', 'Only show titles that have screenshots on VNDB': 'VNDB にスクリーンショットがあるタイトルのみ表示',
    'V. short': 'とても短い', 'Short': '短い', 'Medium': '普通', 'Long': '長い', 'V. long': 'とても長い',
    'No results found.': '結果が見つかりません。', 'Looking up tag…': 'タグを検索中…', 'Connection error': '接続エラー',
    'Browse controls': 'ブラウズ設定', 'Top bar': '上部', 'Sidebar': 'サイドバー', 'No Image': '画像なし', 'NEW': '新着',
    'Browse VNDB and hover a cover': 'VNDB をブラウズしてカバーにカーソルを合わせ',
    'Hide from browse': 'ブラウズから隠す', 'Hidden from browse': 'ブラウズから非表示',

    // ── Title modal ──
    'CHARACTERS': 'キャラクター', 'DEVELOPER': '開発元', 'FINISHED': 'クリア', 'STARTED': '開始', 'STATUS': 'ステータス',
    'SCORE': 'スコア', 'LINKS': 'リンク', 'Releases': 'リリース', 'Release': 'リリース', 'Patch': 'パッチ',
    'Wrong match? Search VNDB…': '一致が違う？ VNDB を検索…', 'Reload from the start': '最初から読み込み直す',
    'Content Warning': 'コンテンツ警告', '⚠ Extreme content': '⚠ 過激なコンテンツ', "Don't show again": '今後表示しない',
    'The following content may contain highly disturbing fetish material. Proceed at your own discretion.': '以下のコンテンツには非常に不快なフェティッシュ要素が含まれている可能性があります。自己判断で進んでください。',
    'Save your game first! Force-stop the process?': '先にセーブしてください！プロセスを強制終了しますか？',

    // ── Wishlist ──
    'Search wishlist…': 'ウィッシュリストを検索…', 'Public': '公開', 'Private': 'プライベート', 'Private wishlist': 'プライベートウィッシュリスト',
    'Nothing on your wishlist': 'ウィッシュリストは空です', 'Your private wishlist is empty': 'プライベートウィッシュリストは空です',
    'to wishlist titles for later.': 'でタイトルをウィッシュリストに追加できます。',
    'Private wishlist is locked': 'プライベートウィッシュリストはロック中', '🔒 Lock now': '🔒 今すぐロック',
    'New English releases on your wishlist': 'ウィッシュリストに新しい英語版', 'Enter your PIN to unlock.': 'PIN を入力してロック解除。',
    'Wrong PIN.': 'PIN が違います。',

    // ── Stats ──
    'Your reading at a glance': '読書の概要', 'No stats yet': 'まだ統計はありません',
    'Add games to your library to start tracking your reading.': 'ライブラリにゲームを追加すると読書の記録が始まります。',
    'Total read': '総プレイ時間', 'Avg rating': '平均評価', 'saved for later': 'あとで読む', 'unplayed backlog': '未プレイの積ん読',
    'Avg finish time': '平均クリア時間', 'Longest session': '最長セッション', 'no sessions yet': 'セッションなし',
    'no playtime yet': 'プレイ時間なし', 'Longest completed': '最長クリア作品', 'Most-read developer': '最もプレイした開発元',
    'LIBRARY BREAKDOWN': 'ライブラリの内訳', 'Achievements': '実績',
    'Reading Sessions': '読書セッション', 'Reading Session': '読書セッション', 'none logged yet': 'まだ記録なし',
    '+ Add session': '+ セッションを追加', 'Added by hand': '手動で追加', 'Recently deleted': '最近削除した項目',
    'No sessions yet — play a visual novel for 30+ minutes and it\'ll show up here.': 'セッションはまだありません。ビジュアルノベルを30分以上プレイするとここに表示されます。',
    'Add Session': 'セッションを追加', 'Edit Session': 'セッションを編集', 'Title': 'タイトル', 'Date': '日付',
    'Started': '開始', 'Ended': '終了', 'Start typing a title from your library…': 'ライブラリのタイトルを入力…',
    'Pick a title from your library.': 'ライブラリからタイトルを選んでください。',
    'Fill in the date, start and end times.': '日付、開始時刻、終了時刻を入力してください。',
    'That date/time is not valid.': 'その日時は無効です。',
    'That overlaps a session already logged for this title.': 'このタイトルで記録済みのセッションと重なっています。',
    'Already counted — this session was tracked automatically': '記録済み — このセッションは自動で記録されました',
    "Add this to the title's total playtime": 'このタイトルの総プレイ時間に加える',
    'Counted toward this title’s playtime.': 'このタイトルのプレイ時間に加算されています。',
    'Not counted toward this title’s playtime.': 'このタイトルのプレイ時間には加算されていません。',
    'Finished in this session': 'このセッションでクリア', 'Last session before finishing': 'クリア前の最後のセッション',
    'Your first session of this title.': 'このタイトルの最初のセッションです。',
    'Delete this reading session? You can restore it afterwards from "Recently deleted".': 'この読書セッションを削除しますか？「最近削除した項目」から復元できます。',
    'Permanently discard this session? This one cannot be undone.': 'このセッションを完全に削除しますか？元に戻せません。',
    'DURATION': '時間', 'CLOCK': '時刻', 'SESSION': 'セッション', 'WHEN': '日時', 'SHARE': '割合', 'PROGRESS': '進捗',
    'for this title': 'このタイトル内', 'morning': '朝', 'afternoon': '午後', 'evening': '夕方', 'night': '夜', 'just now': 'たった今',
    // gap sentences (fixed ones; the {g} ones are patterns below)
    'Continued the next day.': '翌日に続きを読みました。', 'Back the following day.': '次の日に再開しました。',
    'One day between this and the last session.': '前回のセッションから1日空いています。', 'Picked it up again a day later.': '1日後に再開しました。',
    // achievements
    'First Session': '初セッション', 'Log your first reading session': '最初の読書セッションを記録する',
    '10 Hours': '10時間', '50 Hours': '50時間', '100 Hours': '100時間',
    'Log 10 total hours of reading time': '合計10時間の読書時間を記録する', 'Log 50 total hours of reading time': '合計50時間の読書時間を記録する',
    'Log 100 total hours of reading time': '合計100時間の読書時間を記録する', 'First Finish': '初クリア',
    'Complete a VN with 1h+ logged': '1時間以上記録したVNをクリアする', 'Five Completions': '5作品クリア',
    'Complete 5 VNs, each with 1h+ logged': 'それぞれ1時間以上記録したVNを5作品クリアする', 'Ten Completions': '10作品クリア',
    'Complete 10 VNs, each with 1h+ logged': 'それぞれ1時間以上記録したVNを10作品クリアする', 'The Long Haul': '長編制覇',
    'Complete a 50h+ VN you have played': 'プレイした50時間以上のVNをクリアする', 'Collector': 'コレクター',
    'Add 10 or more VNs to your library': 'ライブラリに10作品以上追加する', 'Have 25+ unplayed VNs in your library': 'ライブラリに未プレイのVNが25作品以上ある',

    // ── Scan ──
    'Scan for games': 'ゲームをスキャン', 'Scan now': '今すぐスキャン', 'Scan Results': 'スキャン結果',
    'Scan directories': 'スキャンするフォルダ', 'Add directory': 'フォルダを追加', 'No directories added yet.': 'フォルダはまだ追加されていません。',
    'Folders scanned for VN executables — add as many as you like': 'VN の実行ファイルを探すフォルダ（いくつでも追加できます）',
    'Detect VN executables across all directories and match them to VNDB entries.': 'すべてのフォルダから VN の実行ファイルを検出し、VNDB と照合します。',
    'Add Selected to Library': '選択したものをライブラリに追加', 'Review & add': '確認して追加', 'Move to Ignored': '無視に移動',
    'Ignored': '無視', 'Low confidence': '信頼度低', 'Reconnects': '再接続', 'New matches': '新しい一致',
    '— skip this folder —': '— このフォルダをスキップ —', 'New match': '新しい一致',

    // ── Settings: sections ──
    'Appearance': '外観', 'Privacy': 'プライバシー', 'NSFW / 18+': 'NSFW / 18禁', 'NSFW': 'NSFW', 'Hidden': '非表示',
    'Sync': '同期', 'Device Sync': 'デバイス同期', 'System': 'システム', 'About': '情報', 'Danger zone': '危険な操作',

    // ── Settings: Appearance ──
    'Theme': 'テーマ', 'Light, dark, or automatic by time of day': 'ライト、ダーク、または時間帯で自動',
    'Light': 'ライト', 'Dark': 'ダーク', 'Auto': '自動', 'Auto schedule': '自動切替のスケジュール',
    'Light mode between these times — dark the rest of the day': 'この時間帯はライト、それ以外はダーク',
    'Light from': 'ライト開始', 'Dark from': 'ダーク開始', 'Color palette': 'カラーパレット',
    'Background tint and accent color': '背景の色味とアクセントカラー', 'Title language': 'タイトルの言語',
    'English when available, romanized (romaji), or the original Japanese': '英語（あれば）、ローマ字、または日本語の原題',
    'English': '英語', 'Romaji': 'ローマ字', 'Japanese': '日本語', 'Card size': 'カードサイズ',
    'Cover size in Library, Browse and Wishlist': 'ライブラリ・ブラウズ・ウィッシュリストのカバーサイズ',
    'Small': '小', 'Cozy': '標準', 'Comfortable': 'ゆったり', 'Large': '大', 'Zoom': 'ズーム', 'Scale the entire interface': '画面全体の拡大率',
    'Show your shelf as a grid of covers or a detailed list': '本棚をカバーのグリッドか詳細リストで表示',
    'Sort & filters across the top, or in a compact sidebar that stays put as you scroll': '並び替えとフィルターを上部に、またはスクロールしても固定されるサイドバーに表示',

    // ── Settings: Privacy ──
    'Lock Private wishlist': 'プライベートウィッシュリストをロック',
    'Require unlocking before viewing your Private wishlist tab': 'プライベートウィッシュリストの表示前にロック解除を求める',
    'PIN': 'PIN', 'Set PIN': 'PIN を設定', 'Change PIN': 'PIN を変更', 'Remove PIN': 'PIN を削除',
    'Optional — without one, unlocking is a single click': '任意 — なしの場合はワンクリックでロック解除',
    'The PIN is optional. Without one, unlocking your Private wishlist is just a deliberate click — enough to avoid an accidental glance while sharing your screen, not real access control.': 'PIN は任意です。PIN がない場合、プライベートウィッシュリストのロック解除はクリックするだけです。画面共有中にうっかり見られるのを防ぐためのもので、本格的なアクセス制御ではありません。',
    'Stay unlocked for': 'ロック解除の維持時間', 'Until closed': '閉じるまで',
    "How long it stays unlocked while you're on this tab. Switching to Public or leaving Wishlist always re-locks it immediately.": 'このタブにいる間ロック解除が続く時間です。公開に切り替えるかウィッシュリストを離れると、すぐに再ロックされます。',
    'Enter a new PIN.': '新しい PIN を入力してください。', 'Enter your current PIN to continue.': '続けるには現在の PIN を入力してください。',
    'Enter your current PIN to remove it.': '削除するには現在の PIN を入力してください。',

    // ── Settings: NSFW / Hidden ──
    'Hide 18+ in Browse': 'ブラウズで18禁を隠す', 'Filter adult-rated titles out of browse lists and search results': '成人向けタイトルをブラウズと検索結果から除外',
    'Hide 18+ in your library': 'ライブラリで18禁を隠す', 'Remove adult-rated titles from Home, Library and Wishlist': '成人向けタイトルをホーム・ライブラリ・ウィッシュリストから除外',
    'Blur 18+ covers in Browse': 'ブラウズで18禁カバーをぼかす', 'Blur adult-rated cover images in browse and search': 'ブラウズと検索で成人向けカバー画像をぼかす',
    'Blur 18+ covers in your library': 'ライブラリで18禁カバーをぼかす', 'Blur adult-rated cover images in Home, Library and Wishlist': 'ホーム・ライブラリ・ウィッシュリストで成人向けカバー画像をぼかす',
    'Blur 18+ screenshots in Browse': 'ブラウズで18禁スクリーンショットをぼかす',
    'Blur adult-rated character art and screenshots in the detail modal, opened from Browse': 'ブラウズから開いた詳細画面で成人向けのキャラクター画像とスクリーンショットをぼかす',
    'Blur 18+ screenshots in your library': 'ライブラリで18禁スクリーンショットをぼかす',
    'Blur adult-rated character art and screenshots in the detail modal, opened from Home/Library/Wishlist': 'ホーム・ライブラリ・ウィッシュリストから開いた詳細画面で成人向けのキャラクター画像とスクリーンショットをぼかす',
    "18+ detection uses VNDB sexual-content tags (≥ 2 strong tags), so titles with only mild or optional content aren't flagged.": '18禁の判定には VNDB の性的コンテンツタグ（強いタグ2つ以上）を使うため、軽微または任意の内容だけのタイトルは対象になりません。',
    'Hide extreme content': '過激なコンテンツを隠す',
    'Titles strongly tagged with extreme content are hidden from Browse & Search entirely. Turn off to show them like anything else': '過激なコンテンツのタグが強く付いたタイトルをブラウズと検索から完全に隠します。オフにすると他と同じように表示されます',
    'Show warning for extreme content': '過激なコンテンツに警告を表示',
    'Only matters if the above is off. Blurs covers and requires clicking "Proceed" before opening one': '上がオフのときのみ有効。カバーをぼかし、開く前に「進む」のクリックを求めます',
    'Blocked tags': 'ブロックしたタグ', 'Auto-hide any title carrying a tag you block — applies across Browse & Search.': 'ブロックしたタグを持つタイトルを自動で隠します（ブラウズと検索に適用）。',
    'Turn off to temporarily allow everything, without losing your blocked list': 'オフにするとブロックリストを保ったまま一時的にすべて表示します',
    'Block tag': 'タグをブロック', 'No blocked tags yet.': 'ブロックしたタグはまだありません。', 'Hidden titles': '非表示のタイトル',
    'Individual titles you hid from a detail page. Unhide to let one appear again.': '詳細ページから個別に隠したタイトルです。再表示すると再び表示されます。',
    'Nothing hidden individually. Use “Hide from browse” on a title’s detail page.': '個別に隠したタイトルはありません。タイトルの詳細ページの「ブラウズから隠す」を使ってください。',
    'Show excluded entries': '除外した項目を表示', "Reveal entries you've excluded from the library view": 'ライブラリ表示から除外した項目を表示',

    // ── Settings: Sync ──
    'Keep your library in sync across PCs via a shared cloud folder (Google Drive, Dropbox, OneDrive, etc.). Point all your PCs at the same folder and changes sync automatically.': '共有クラウドフォルダ（Google ドライブ、Dropbox、OneDrive など）を使って複数の PC でライブラリを同期します。すべての PC で同じフォルダを指定すると自動で同期されます。',
    'What to sync': '同期する内容', 'Controls what gets merged from and written by this PC.': 'この PC が取り込む内容と書き出す内容を設定します。',
    'Library, wishlist & collections': 'ライブラリ・ウィッシュリスト・コレクション', 'Hidden tags & titles': '非表示のタグとタイトル',
    'Preferences': '各種設定', 'Stats & achievements': '統計と実績', 'Sync folder': '同期フォルダ', 'Pick a sync folder': '同期フォルダを選択',
    'Pick folder': 'フォルダを選択', 'Sync now': '今すぐ同期', 'Not yet synced': '未同期', '✓ Synced': '✓ 同期済み',
    'Select a folder that all your PCs can access — your Google Drive, Dropbox or OneDrive folder works perfectly. Tsundoku writes a single small file there.': 'すべての PC からアクセスできるフォルダを選んでください（Google ドライブ、Dropbox、OneDrive のフォルダが最適です）。Tsundoku はそこに小さなファイルを1つ書き込みます。',

    // ── Settings: System ──
    'Minimize to tray on close': '閉じるときにトレイへ最小化',
    'Keep Tsundoku running in the background when you close the window. Quit fully from the tray icon. Recommended so playtime keeps tracking while you read.': 'ウィンドウを閉じても Tsundoku をバックグラウンドで実行し続けます。完全に終了するにはトレイアイコンから。読書中もプレイ時間を記録し続けるため推奨です。',
    'Start with Windows': 'Windows 起動時に開始', 'Start on login': 'ログイン時に開始', '(background)': '（バックグラウンド）',
    'Launch Tsundoku hidden in the tray at login, so it automatically tracks your reading time even for games started from Steam or the desktop.': 'ログイン時に Tsundoku をトレイで起動し、Steam やデスクトップから起動したゲームでも自動で読書時間を記録します。',
    'Sync from VNDB': 'VNDB から同期', 'VNDB username': 'VNDB ユーザー名', 'API token (private lists)': 'API トークン（非公開リスト用）',
    'Fetch list': 'リストを取得', 'When importing, prioritize': 'インポート時に優先する側',
    'Which side wins when an import and your existing entry disagree.': 'インポート内容と既存の項目が異なる場合にどちらを優先するか。',
    'Import from VNDB': 'VNDB からインポート', 'Could not fetch list.': 'リストを取得できませんでした。',
    'Backup & restore': 'バックアップと復元', 'Save your library and preferences to a file, or restore one on another PC. Install paths stay local.': 'ライブラリと設定をファイルに保存、または別の PC で復元します。インストール先はそのままです。',
    'Choose where to save…': '保存先を選択…', 'Choose a backup file…': 'バックアップファイルを選択…', '✓ Exported': '✓ エクスポート完了',
    'Clear offline cache': 'オフラインキャッシュを消去', 'Clear cache': 'キャッシュを消去', 'Cache cleared!': 'キャッシュを消去しました！',
    'Delete locally cached cover images and character data. Re-cached automatically when you open a title online.': 'ローカルにキャッシュしたカバー画像とキャラクターデータを削除します。オンラインでタイトルを開くと自動で再キャッシュされます。',
    'Restore default settings': '既定の設定に戻す', 'Restore defaults': '既定に戻す', 'Settings reset!': '設定をリセットしました！',
    'Reset appearance and preferences to their defaults. Your library and stats are kept.': '外観と設定を既定に戻します。ライブラリと統計はそのままです。',
    'Wipe data': 'データを消去', 'Data wiped!': 'データを消去しました！',
    "Erase your library and reading stats from this PC. Backup files aren't touched, so you can re-import one afterwards.": 'この PC からライブラリと読書統計を消去します。バックアップファイルはそのままなので、後で再インポートできます。',
    'Uninstall Tsundoku': 'Tsundoku をアンインストール', 'Uninstall': 'アンインストール', 'Remove Tsundoku from this PC.': 'この PC から Tsundoku を削除します。',
    'Also delete my library data': 'ライブラリのデータも削除する',
    'Really? This permanently deletes all app files.': '本当によろしいですか？アプリのファイルをすべて完全に削除します。',
    'Really? This permanently deletes the app and your library data.': '本当によろしいですか？アプリとライブラリのデータを完全に削除します。',
    'Language': '言語', 'Interface language': '表示言語',

    // ── Settings: About ──
    'Version': 'バージョン', 'Check for updates': 'アップデートを確認', 'Restart & install': '再起動してインストール',
    'Checking for updates…': 'アップデートを確認中…', 'Update check failed. Check your connection.': 'アップデートの確認に失敗しました。接続を確認してください。',
    'Updates apply to the installed app only.': 'アップデートはインストール版にのみ適用されます。',
    'Data location': 'データの保存先', 'Download builds & changelog': 'ビルドと更新履歴をダウンロード',
    'All metadata sourced from vndb.org': 'すべてのメタデータは vndb.org から取得しています', 'Built with': '使用技術',

    // ── Found in the first Japanese test run ──
    '▶ LAST PLAYED': '▶ 最後にプレイ', '▶ CURRENTLY READING': '▶ プレイ中', '▶ FROM YOUR LIBRARY': '▶ ライブラリから',
    'playing': 'プレイ中', 'finished': 'クリア', 'logged': '記録', 'in library': 'ライブラリ内',
    'Start with Windows (background)': 'Windows 起動時に開始（バックグラウンド）',
    'Start on login (background)': 'ログイン時に開始（バックグラウンド）',
    'Import a VNDB list — statuses, wishlist and start/finish dates carry over; you pick which titles to add. Public list: enter a username. Private list: paste a read token (VNDB → Settings → Applications). Re-run any time.':
      'VNDB のリストをインポートします。ステータス、ウィッシュリスト、開始日とクリア日が引き継がれ、追加するタイトルは自分で選べます。公開リスト：ユーザー名を入力。非公開リスト：読み取りトークンを貼り付け（VNDB → Settings → Applications）。何度でも実行できます。',
    '5 min': '5分', '15 min': '15分', '30 min': '30分', '1 hour': '1時間',
    // colour scheme names (swatch tooltips)
    'banana': 'バナナ', 'clover': 'クローバー', 'rose': 'ローズ', 'cherry': 'チェリー',
    'sky': 'スカイ', 'lavender': 'ラベンダー', 'coffee': 'コーヒー', 'stone': 'ストーン',

    // ── Misc ──
    "Couldn't find the running game to stop it. If it's still open, close it from inside the game.": '停止する実行中のゲームが見つかりませんでした。まだ開いている場合は、ゲーム内から終了してください。',
    'Pick a title from your library': 'ライブラリからタイトルを選択', 'Error:': 'エラー:', 'Duration:': '時間:',
  };

  // Text containing numbers or names. Each [regex, fn]: fn gets the match and a
  // translate() for nested parts (e.g. "last played 2d ago").
  const JA_PATTERNS = [
    [/^(\d+)m ago$/, m => `${m[1]}分前`],
    [/^(\d+)h ago$/, m => `${m[1]}時間前`],
    [/^(\d+)d ago$/, m => `${m[1]}日前`],
    [/^last played (.+)$/, (m, t) => `最終プレイ ${t(m[1])}`],
    [/^last played: (.+)$/, (m, t) => `最終プレイ: ${t(m[1])}`],
    [/^last: (.+)$/, (m, t) => `最終: ${t(m[1])}`],
    [/^All \((\d+)\)$/, m => `すべて (${m[1]})`],
    [/^Ignored \((\d+)\)$/, m => `無視 (${m[1]})`],
    [/^New matches \((\d+)\)$/, m => `新しい一致 (${m[1]})`],
    [/^Low confidence \((\d+)\)$/, m => `信頼度低 (${m[1]})`],
    [/^Reconnects \((\d+)\)$/, m => `再接続 (${m[1]})`],
    [/^Recently deleted \((\d+)\)$/, m => `最近削除した項目 (${m[1]})`],
    [/^(\d+) sessions? logged$/, m => `${m[1]} 件のセッションを記録`],
    [/^(\d+) selected$/, m => `${m[1]} 件選択`],
    [/^(\d+) of (\d+)$/, m => `${m[2]} 件中 ${m[1]} 件目`],
    [/^(\d+)% of library$/, m => `ライブラリの ${m[1]}%`],
    [/^across (\d+) rated$/, m => `評価済み ${m[1]} 作品の平均`],
    [/^across (\d+) completed$/, m => `クリア済み ${m[1]} 作品の平均`],
    [/^(\d+)h average length$/, m => `平均 ${m[1]} 時間`],
    [/^of ~(\d+)h average$/, m => `平均約 ${m[1]} 時間に対して`],
    [/^of (.+) total$/, m => `合計 ${m[1]} のうち`],
    [/^Duration: (.+?)( · ends the next day)?$/, m => `時間: ${m[1]}${m[2] ? '（翌日に終了）' : ''}`],
    [/^No results for [“"](.+)[”"]\.?$/, m => `「${m[1]}」の結果はありません`],
    [/^No tag matching “(.+)”\.?$/, m => `「${m[1]}」に一致するタグはありません。`],
    [/^No VNDB tag matching “(.+)”\.?$/, m => `「${m[1]}」に一致する VNDB タグはありません。`],
    [/^No studio matching “(.+)”\.?$/, m => `「${m[1]}」に一致するスタジオはありません。`],
    [/^No title in your library matches “(.+)”\.?$/, m => `ライブラリに「${m[1]}」に一致するタイトルはありません。`],
    [/^“(.+)” is already blocked\.$/, m => `「${m[1]}」はすでにブロック済みです。`],
    [/^Add to “(.+)”$/, m => `「${m[1]}」に追加`],
    [/^VNDB search failed \((.+)\)( — try again\.)?$/, m => `VNDB の検索に失敗しました (${m[1]})${m[2] ? ' — もう一度お試しください。' : ''}`],
    [/^(\d+) titles? got a new English release$/, m => `${m[1]} 作品に新しい英語版が出ました`],
    [/^🎮 (\d+) new games? found in your folders$/, m => `🎮 フォルダで ${m[1]} 本の新しいゲームが見つかりました`],
    [/^✓ Imported — (\d+) added, (\d+) updated(, preferences restored)?\. Install paths unchanged\.$/, m => `✓ インポート完了 — 追加 ${m[1]}、更新 ${m[2]}${m[3] ? '、設定を復元' : ''}。インストール先は変更なし。`],
    [/^✓ Synced — (\d+) added, (\d+) updated\. Your playtime and install paths are unchanged\.$/, m => `✓ 同期完了 — 追加 ${m[1]}、更新 ${m[2]}。プレイ時間とインストール先は変更なし。`],
    [/^✓ Synced (.+)$/, m => `✓ 同期済み ${m[1]}`],
    [/^Fetching your list from VNDB…$/, () => 'VNDB からあなたのリストを取得中…'],
    [/^Fetching (.+)'s list from VNDB…$/, m => `VNDB から ${m[1]} のリストを取得中…`],
    [/^No importable titles for (.+)\. \(The list may be private — paste a token — or it only holds voted titles\.\)$/, m => `${m[1]} にはインポートできるタイトルがありません（リストが非公開の場合はトークンを貼り付けてください。または投票済みのタイトルしかありません）。`],
    [/^Could not launch: (.+)$/, m => `起動できませんでした: ${m[1]}`],
    [/^(Search|Scan|Import|Export) failed: (.+)$/, m => `${{ Search: '検索', Scan: 'スキャン', Import: 'インポート', Export: 'エクスポート' }[m[1]]}に失敗しました: ${m[2]}`],
    [/^Error: (.+)$/, m => `エラー: ${m[1]}`],
    // gap sentences with a duration ({g} = "3 days", "2 weeks", …)
    [/^Back to it (.+) later, the same day\.$/, (m, t) => `${t(m[1])}後、同じ日に再開しました。`],
    [/^Only (.+) away from the previous session\.$/, (m, t) => `前回のセッションからわずか${t(m[1])}です。`],
    [/^A short break — (.+) — then straight back in\.$/, (m, t) => `${t(m[1])}の短い休憩のあと、すぐに再開しました。`],
    [/^Returned after (.+?)( away)?\.$/, (m, t) => `${t(m[1])}ぶりに戻りました。`],
    [/^Picked back up (.+) later\.$/, (m, t) => `${t(m[1])}後に再開しました。`],
    [/^(.+) passed between sessions\.$/, (m, t) => `セッションの間に${t(m[1])}が経ちました。`],
    [/^Back to it (.+) after the last time\.$/, (m, t) => `前回から${t(m[1])}後に再開しました。`],
    [/^Back (?:to it )?after (.+) away\.$/, (m, t) => `${t(m[1])}ぶりに戻りました。`],
    [/^Resumed following a (.+) break\.$/, (m, t) => `${t(m[1])}の休みを経て再開しました。`],
    [/^(.+) went by before this session\.$/, (m, t) => `このセッションまでに${t(m[1])}が経ちました。`],
    [/^Returned to it (.+) later\.$/, (m, t) => `${t(m[1])}後に戻りました。`],
    [/^(\d+) visual novels?$/, m => `${m[1]} 作品`],
    [/^(.+) avg$/, m => `平均 ${m[1]}`],
    [/^(\d+) unplayed$/, m => `未プレイ ${m[1]}`],
    [/^(\d+) total$/, m => `計 ${m[1]}`],
    [/^(\d+) done$/, m => `${m[1]} 作品クリア`],
    [/^(.+) played$/, m => `${m[1]} プレイ`],
    [/^(\d+) titles? saved$/, m => `${m[1]} 作品を保存`],
    [/^(\d+) titles?$/, m => `${m[1]} 作品`],
    [/^(\d+) titles? · (.+) read$/, m => `${m[1]} 作品 · ${m[2]} プレイ`],
    [/^(\d+) \/ (\d+) unlocked$/, m => `${m[1]} / ${m[2]} 解除`],
    // library-breakdown legend ("Reading (1)") and its bar tooltips ("Reading: 1")
    [/^(Unplayed|Reading|Paused|Finished|Dropped|The Pile) \((\d+)\)$/, (m, t) => `${t(m[1])} (${m[2]})`],
    [/^(Unplayed|Reading|Paused|Finished|Dropped|The Pile): (\d+)$/, (m, t) => `${t(m[1])}: ${m[2]}`],
    // wishlist release alerts: only the prefix, the rest is a title
    [/^(Patch|Release): (.+)$/, (m, t) => `${t(m[1])}: ${m[2]}`],
    [/^(\d+) (minute|hour|day|week|month)s?$/, m => `${m[1]}${{ minute: '分', hour: '時間', day: '日', week: '週間', month: 'か月' }[m[2]]}`],
  ];

  const ATTRS = ['placeholder', 'title', 'aria-label', 'alt'];
  let lang = 'en';
  let observer = null;

  function translate(text) {
    if (lang !== 'ja' || !text) return text;
    const trimmed = text.trim();
    if (!trimmed) return text;
    let out = Object.prototype.hasOwnProperty.call(JA, trimmed) ? JA[trimmed] : null;
    if (out == null) {
      for (const [re, fn] of JA_PATTERNS) {
        const m = re.exec(trimmed);
        if (m) { out = fn(m, translate); break; }
      }
    }
    if (out == null) return text;
    // Keep the original surrounding whitespace so inline spacing doesn't collapse.
    const lead = text.match(/^\s*/)[0], trail = text.match(/\s*$/)[0];
    return lead + out + trail;
  }

  // Skip editable content and anything explicitly marked as not-for-translation.
  const SKIP = 'script, style, textarea, input, [contenteditable], [data-no-i18n]';

  function translateNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const p = node.parentElement;
      if (!p || p.closest(SKIP)) return;
      const t = translate(node.nodeValue);
      if (t !== node.nodeValue) node.nodeValue = t;
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (node.closest && node.closest('script, style, [data-no-i18n]')) return;
    for (const el of [node, ...node.querySelectorAll('*')]) {
      for (const a of ATTRS) {
        const v = el.getAttribute && el.getAttribute(a);
        if (v) { const t = translate(v); if (t !== v) el.setAttribute(a, t); }
      }
    }
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    let n; const texts = [];
    while ((n = walker.nextNode())) texts.push(n);
    for (const tn of texts) translateNode(tn);
  }

  function start(newLang) {
    lang = newLang === 'ja' ? 'ja' : 'en';
    document.documentElement.lang = lang;
    if (lang !== 'ja') { if (observer) { observer.disconnect(); observer = null; } return; }
    translateNode(document.body);
    if (observer) return;
    observer = new MutationObserver(muts => {
      for (const m of muts) {
        if (m.type === 'childList') m.addedNodes.forEach(translateNode);
        else if (m.type === 'characterData') translateNode(m.target);
        else if (m.type === 'attributes') {
          const v = m.target.getAttribute(m.attributeName);
          if (v) { const t = translate(v); if (t !== v) m.target.setAttribute(m.attributeName, t); }
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  }

  // alert()/confirm() messages go through the same dictionary.
  const nativeAlert = window.alert.bind(window), nativeConfirm = window.confirm.bind(window);
  window.alert = msg => nativeAlert(translate(String(msg)));
  window.confirm = msg => nativeConfirm(translate(String(msg)));

  window.I18N = { start, translate, get lang() { return lang; } };
})();
