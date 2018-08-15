# 樣式

做個有功能的應用程式很棒，但如果無法有效率地處理樣式，路也走不遠！

> 建立、管理你的樣式表  
> React Native 如何實作 CSS 規則

想共享 React Native 和網頁的樣式表：[https://github.com/js-next/react-style](https://github.com/js-next/react-style) 提供了一個網頁用的 React Native 樣式系統。

## 宣告與使用樣式

React Native 提供與網頁完全不一樣的方法，將樣式完全放進 JavaScript 的世界，且強迫你將樣式物件明確和元件連結在一起。這種方法讓人很不習慣。

但為了瞭解 React Native 的樣式行為，首先要想一下傳統 CSS 樣式表有哪些令人頭痛的問題：

- 所有 CSS 規則和類別名稱都是全域的，容易產生覆蓋
- CSS 樣式不需明確指定用在哪個 HTML 元素，很難找出哪些是不再使用樣式，也很難找出哪種樣式套在哪個元素上
- 雖然 SASS, LESS 這種語言企圖消滅 CSS 比較難看的問題，但許多重點問題仍然存在

React Native 則是實作了部分 CSS 樣式的子集，著重在保留樣式 API，同時仍然具有高度的表達性，如在本章會看到的，它們的定位是非常不同。而且，React Native 並不支援偽類別、動畫或選擇器，所有支援的屬性在文件有完整列表：[https://facebook.github.io/react-native/docs/view.html#style](https://facebook.github.io/react-native/docs/view.html#style)。

捨棄樣式表，在 React Native 中使用以 JavaScript 為基礎的樣式物件，這也造就了一個 React 的最強功能：強迫把你的 JavaScript 程式碼 —— 也就是元件，保持著模組化。這樣也就不得不寫出模組化的樣式了。

本節會談論如何建立和操作 React Native 中的樣式物件。

### 使用 inline 樣式

```javascript
<Text style={{fontStyle: 'italic'}}>brown</Text>
```

- inline 樣式好處就是可以馬上即用
- 但在每次 render 時被重新建立 inline 樣式物件

### 物件設定樣式

```javascript
const italic = {
  fontStyle: 'italic'
}

// ...

render() {
  return (
    <Text style={italic}>
      brown
    </Text>
  )
}
```

這樣就沒必要再 render 方法中建立樣式物件，相反，你可以將動作分離。

### 使用 StyleSheet.create

這個函式是個加了點好處的糖衣語法。

- 建立樣式表更能減少記憶體的使用
- 幫助你把程式碼整理得更乾淨
- 這些樣式表是不可變的
  - 可變的情況下就要改用純物件樣式

### 連接樣式

如果想要合併使用兩三個樣式？

```javascript
<Text style={[styles.button, styles.accentText, {color: '#FFFFFF'}]}>bababa...</Text>
```

也可將 inline 樣式加入。

若混淆情況產生，例如兩個物件指定同一個屬性，React Native 會幫你解析，以樣式最右邊的元素為優先，如果元素值為 false、null 和 undefined 則會被忽略。

所以可利用這個原則做條件樣式。

```javascript
<View style={[styles.button, this.state.touching && styles.highlight]} />
```

這個秘訣幫助你保持 render 邏輯簡潔。

想使用合併樣式就把樣式連結起來。相較於 SASS 的 @extend，或是純 CSS 的巢式覆寫類別，連結樣式是種目的更專一的工具，這可以說是好事：它使得程式邏輯保持簡單，並更容易看出正在使用及如何使用哪些樣式。

## 組織與繼承

大部分範例都在 JavaScript 檔案的尾端，以 StyleSheet.create 呼叫來使用它們。以範例來說可以，但要做真實的應用程式，就不一定會想要這樣用了。我們到底應該怎麼組織樣式？分享與繼承樣式？

### 匯出樣式物件

樣式變多、變複雜時，你會想要讓它們和你的 JavaScript 檔中的元件分開存放。

一個常見做法是另外建立一個目錄儲存元件。

- ComponentName
  - index.js
  - styles.js

在 styles.js 中，你可建立一個樣式表並匯出它。

### 以屬性傳遞樣式

你可以使用這規則建立延伸元件，延伸元件比較好控制，會被父類指定樣式。舉例來說，一個元件可以接受一個可選屬性 style 作為樣式，這就是一個類似 CSS “階層式 (cascading)” 的方法。

```javascript
class CustomizableText extends Component {
  render() {
    return (
      <Text style={[{fontSize: 18}, this.props.style]}>
        Hello, world
      </Text>
    );
  }
}
```

藉由加入 this.props.style 到樣式陣列尾端，就可以確保能覆寫前面預設的樣式。

### 樣式重用與分享

一般來說，想要重用的是樣式物件而不是樣式，以下是一些你想要在元件間分享樣式的例子。這種情況下，可以將你專案中的檔案依下列方法組織：

- js
  - components
    - Button
      - index.js
      - styles.js
  - styles
    - styles.js
    - colors.js
    - fonts.js

共享樣式，可能包括你的調色盤、字型、留白和填充距離等。

styles/styles.js 匯入其它共享樣式並匯出它們，那麼你的元件就可以匯入 styles.js 並使用共享檔案，或是你想要元件從 styles/ 目錄匯入指定的樣式表也可以。

但由於我們現在的樣式在 JavaScript 中，如何組織它們這個問題是屬於一般程式碼組織問題 —— 也就是沒有標準方法。

## 定位和設計佈局

React Native 使用樣式最大改變就是定位，CSS 支援大量的定位技術：

- float
- 絕對定位
- table
- block layout
- 還有更多...

React Native 主要依靠 flexbox 及絕對定位，以及 margin 和 padding 屬性。這一小節，我們會看到如何於 React Native 建立佈局。

### 用 Flexbox 佈局

Flexbox 採用 direction-agnostic 方法 (水平對齊中線) 建立佈局。

React Native 可使用以下屬性：

- flex
- flexDirection
- flexWrap
- alignSelf
- alignItems

另外，可用以下佈局相關的值：

- height
- width
- margin
- border
- padding

Flexbox 背後的基本概念是，你應該要建立可預測具結構的佈局，即使對動態大小元件也一樣。因為我們的設計要符合多種螢幕尺吋、螢幕方向的行動裝置佈局，所以這一點額外重要。

```javascript
export default class App extends React.Component {
  render() {
    return (
      <View style={styles.parent}>
        <Text style={styles.child}> Child One </Text>
        <Text style={styles.child}> Child Two </Text>
        <Text style={styles.child}> Child Three </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F5FCFF',
    borderColor: '#0099AA',
    borderWidth: 5,
    marginTop: 30,
  },
  child: {
    flex: 1,
    borderColor: '#AA0099',
    borderWidth: 2,
    textAlign: 'center',
    fontSize: 24
  }
});
```

- 如果我們設定 alignItems，則子類就不會延展水平垂直兩項的所有空間
- alignItems 值決定另外一軸的定位點在哪，也就是決定子類在另一軸的位置，與 flexDirection 正交的那一軸

### 使用絕對定位

用法和網頁上差不多，藉由設定 position 屬性來使用。

```
position: absolute
```

接著你就可以用熟悉的

- left
- right
- top
- bottom

施用絕對屬性的子類會依父類的定位來決定定位，所以你也可以用 flexbox 設定父類元素，然後在子類使用絕對定位。

但我們不存在 z 軸，所以若想把 view 全部重疊在上面就有困難，最後一個重疊的 view 會蓋住其他的。

絕對定位也有他的優勢。舉例來說，如果你想要建立一個容器 view，位置在手機的下方狀態列，用絕對定位就很簡單：

```javascript
container: {
  position: 'absolute',
  top: 30,
  left: 0,
  right: 0,
  bottom: 0
}
```

## 整合使用

模仿一個 Mondrian 風格的畫來做佈局。

```javascript
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.parent}>
        <View style={styles.topBlock}>
          <View style={styles.leftCol}>
            <View style={[styles.cellOne, styles.base]}><Text>1</Text></View>
            <View style={[styles.base,styles.cellTwo]}><Text>2</Text></View>
          </View>
          <View style={[styles.cellThree, styles.base]}><Text>3</Text></View>
        </View>
        <View style={styles.bottomBlock}>
          <View style={[styles.cellFour, styles.base]}><Text>4</Text></View>
          <View style={[styles.cellFive, styles.base]}><Text>5</Text></View>
          <View style={[styles.bottomRight]}>
            <View style={[styles.cellSix, styles.base]}><Text>6</Text></View>
            <View style={[styles.cellSeven, styles.base]}><Text>7</Text></View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  parent: {
    flexDirection: 'column',
    position: 'absolute',
    top: 30,
    left: 0,
    right: 0,
    bottom: 0
  },
  base: {
    borderColor: '#000000',
    borderWidth: 5
  },
  topBlock: {
    flexDirection: 'row',
    flex: 5
  },
  leftCol: {
    flex: 2,
  },
  cellOne: {
    flex: 1,
    borderBottomWidth: 15
  },
  cellTwo: {
    flex: 3
  },
  cellThree: {
    flex: 5,
    backgroundColor: '#FF0000'
  },
  bottomBlock: {
    flexDirection: 'row',
    flex: 2
  },
  cellFour: {
    flex: 2,
    backgroundColor: '#0000FF'
  },
  cellFive: {
    flex: 3
  },
  bottomRight: {
    flex: 2
  },
  cellSix: {
    flex: 1
  },
  cellSeven: {
    flex: 1,
    backgroundColor: '#FFFF00'
  }
});
```

## 本章總結

React Native 別於網頁上有新的結構與方法來做樣式設定，所以有新東西需要消化一下！