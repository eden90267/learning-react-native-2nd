# 什麼是 React Native？

- 是一個 JavaScript framework，用來在 iOS 和 Android 上撰寫真實、原生 App
- 基礎是 React
- JavaScript + JSX
- 橋接 Objective-C (iOS) 或 Java (Android) 原生 API
- 非 webview 進行 render
- 可存取手機相機或是使用者位置等平台功能
- 社群也實作了對 Window、Ubuntu、網頁以及其他種平台的支援

##  React Native 優勢

- 平台標準 API 作 render
  - Cordova、Ionic 使用 HTML/CSS/JavaScript 透過 webview 實現跨平台。雖行得通但有下列缺點：
    - 效能問題
    - 無法存取平台原生 UI 元素
    - 模仿原生 UI 元素會走調
    - 動畫似的東西底下一探究竟困難，原生進版速度還很快
- React 工作與主要 UI 執行緒分離，所以不會因為跨平台犧牲效能
- 更新頻率與 React 一樣：state or props 變化，才進行畫面重新 render
- 使用網頁習慣開發手法 (語言或工具)
- 開發者經驗與跨平台開發的潛力都提升了
- 只是 JavaScript，不用重新建置應用程式，F5 即可，開發速度簡直是神的禮物
- 聰明除錯工具和錯誤報告 (Browser 開發者工具可運用)
- 提升產品生命週期，Apple 和 Google 都允許只上傳 JavaScript 改變應用程式行為，而不需要重跑一次審查流程

## React Native 風險和缺點

- 在專案多加一層，讓除錯變難。特別是 React 和目標平台間的錯誤
- 目標平台有更新，譬如釋出新的 API 時，React Native 的支援會延遲一些 (可透過自己實作 API 解決)
- 開發過程遇到路障，會演變成多數公司做法：混合方法開發 App

## 總結

- 只要使用網頁開發者使用既有的 JavaScript 知識，便可建立穩定的 App
- App 開發快速
- iOS 與 Android 共享程式碼 (缺點是增加一些應用程式設定的複雜度)
