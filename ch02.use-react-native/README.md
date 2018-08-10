# 使用 React Native

這章會談及**橋接**，並看看 React Native 底層如何運作與 React 網頁版的差異。

## React Native 如何運作

- Virtual DOM
  - 開發者描述介面外觀及頁面顯示的那一層
  - 記憶體計算必要改變，再將少部分必須改變的東西 render
  - 提升效能的好處，但實際價值是抽象化運用
    - Browser DOM
    - Objective-C API
    - Java API
  - 橋接器，render 回傳的 markup 翻譯為不同的目標平台 (Web、App、Windows、Ubuntu、桌面應用程式)

## Render 生命週期

1. 元件掛載時：

```
網頁顯示程序 -> 將 React 元件載入 DOM -> 顯示 React 元件
```

2. React 接手 render：

```
狀態/屬性改變 -> 在 Virtual DOM 計算差異 -> 顯示 React 元件
```

Render 回傳 HTML markup

React Native 不在主要 UI 執行緒執行，所以它可以異步進行那些呼叫而不影響使用者體驗

## React Native 建立元件

React Native 元件原則上和一般的 React 元件一樣，差在 render 和樣式上有所不同

### 使用各種 View

- `<View>`，類比 `<div>`
- `<Text>`，類比 `<span>`
- `<FlastList>` 與 child items，類比 `<ul><li>`
- `<Image>`，類比 `<img>`

其他元件隨各平台定義。舉例 `<DatePickerIOS>`。可運用 “特定平台元件實作” 方式做不同平台實作分開存放。

### 使用 JSX

- markup、控制邏輯，甚至是樣式，都用 JSX 語言編寫
- 取代以不同技術為分類，JSX 使用不同目的為分類：為每個元件在單一檔案中規範樣式、markup 和行為

### 設定原生物件樣式

- 簡化版 CSS
  - flexbox 作 layout
  - 精簡 CSS 規則，並強制統一
- 支援 inline 樣式設定
- 延伸樣式物件工具

## 目標平台 API

- 常用功能
- 非同步原生 API
- 非全部功能都橋接
- 特定 React 元件 (獨立封裝來增加彈性)

## 本章總結

- React 和 React Native 編寫元件不相同，一個是網頁，一個是手機
- 樣式設定有一定的差異，變成使用 CSS 的子集合及可使用 inline 語法設定樣式
