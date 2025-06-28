import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { Heart } from "./ui/Heart";

//TODO: アイテムの説明はALL_ITEMSの情報から生成できる。
export const GameRule = ({ needHeader }: { needHeader: boolean }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.section}>
          {needHeader && (
            <Text style={styles.mainTitle}>ルール</Text>
          )}
          <View style={styles.textContainer}>
            <Text style={styles.text}>
              勝利条件は、相手の体力
              <View style={styles.heartContainer}>
                <Heart />
              </View>
              を0にすることです。
            </Text>
            <Text style={styles.text}>
              お互いに1から5の書かれた数字のカード
              {/* カードコンポーネントはコメントアウト */}
              とアイテムを持った状態でゲームが始まります。
            </Text>
            <Text style={styles.text}>
              カードを選択して数字の小さい方に1ダメージが与えられます。{"\n"}
              お互いに同じ数字の場合には両者に1ダメージが与えられます。
            </Text>
            <Text style={styles.text}>
              アイテムを使用することで、カードの数値を変えたりすることができます。{"\n"}
              アイテムは、カードの勝敗を決定する時に適用されます。
            </Text>
            <Text style={styles.text}>
              カード・アイテムは使用すると、手札から消費され、次のターン以降は使用できなくなります。{"\n"}
              出せるカードのなくなると、その時点での残り体力が多い方が勝ちとなります。
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>アイテム</Text>
          <View style={styles.itemsContainer}>
            {/* グウスウ */}
            <View style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Image source={require('../assets/gusu.webp')} style={styles.itemIcon} />
                <Text style={styles.itemName}>グウスウ</Text>
              </View>
              <Text style={styles.itemDescription}>
                場に出たお互いの偶数カードの値を+2します。
              </Text>
            </View>

            {/* ムコウカ */}
            <View style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Image source={require('../assets/mukouka.webp')} style={styles.itemIcon} />
                <Text style={styles.itemName}>ムコウカ</Text>
              </View>
              <Text style={styles.itemDescription}>
                アイテム効果を適用せずに勝敗を決定します。{"\n"}
                5以上の数値のカードとつかうことはできません。
              </Text>
            </View>

            {/* リスキー */}
            <View style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Image source={require('../assets/risky.webp')} style={styles.itemIcon} />
                <Text style={styles.itemName}>リスキー</Text>
              </View>
              <Text style={styles.itemDescription}>
                自分のカードの値が-2されますが、勝利した時に2ダメージを与えます。{"\n"}
                引き分けの時には効果がありません。
              </Text>
            </View>

            {/* アベコベ */}
            <View style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Image source={require('../assets/abekobe.webp')} style={styles.itemIcon} />
                <Text style={styles.itemName}>アベコベ</Text>
              </View>
              <Text style={styles.itemDescription}>
                カードの数値による勝敗が逆転します。{"\n"}
                お互いに使用すると通常の勝敗判定となります。
              </Text>
            </View>

            {/* ウラギリ */}
            <View style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Image source={require('../assets/uragiri.webp')} style={styles.itemIcon} />
                <Text style={styles.itemName}>ウラギリ</Text>
              </View>
              <Text style={styles.itemDescription}>
                引き分けたときに、相手に2ダメージを与え、自分へはダメージを与えません。{"\n"}
                お互いにウラギリを使用したときには、お互いに2ダメージが与えられます。
              </Text>
            </View>

            {/* DXモードアイテムセクション */}
            <Text style={styles.sectionTitle}>DXモードアイテム</Text>
            <Text style={styles.text}>
              アベコベ・コウリンと残り6個のアイテムから3個ずつをランダムに持った状態で始まるモードです。{"\n"}
              ランダムに選ばれるアイテムは自分と相手が同じものを1つももたないように選ばれます。
            </Text>

            {/* テンテキ */}
            <View style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Image source={require('../assets/tenteki.webp')} style={styles.itemIcon} />
                <Text style={styles.itemName}>テンテキ</Text>
              </View>
              <Text style={styles.itemDescription}>
                お互いのカードの数値の差が2のときにも勝利します。{"\n"}
                差が2のときに勝利すると、相手のすべての手札の数値を-1します。{"\n"}
                お互いがテンテキを使用して差が2のときには、お互いに1ダメージを与えてすべての手札の数値が-1されます。{"\n"}
                テンテキの勝利判定は、アベコベ・唯我独尊の勝利判定よりも優先されます。
              </Text>
            </View>

            {/* オウエン */}
            <View style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Image source={require('../assets/ouen.webp')} style={styles.itemIcon} />
                <Text style={styles.itemName}>オウエン</Text>
              </View>
              <Text style={styles.itemDescription}>
                自分のすべての手札の数値を+1します。{"\n"}
                3と一緒に使うとさらに+1します。
              </Text>
            </View>

            {/* コウリン */}
            <View style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Image source={require('../assets/kourin.webp')} style={styles.itemIcon} />
                <Text style={styles.itemName}>コウリン</Text>
              </View>
              <Text style={styles.itemDescription}>
                自分のアイテムを全て失い、神のアイテム2つを得る。{"\n"}
                3以上の数値のカードとつかうことはできません。
              </Text>
            </View>

            {/* 唯我独尊 */}
            <View style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Image source={require('../assets/kourin_yuiga_dokuson.webp')} style={styles.itemIcon} />
                <Text style={styles.itemName}>唯我独尊</Text>
              </View>
              <Text style={styles.itemDescription}>
                神のアイテム。{"\n"}
                相手のカードの値と異なる値のカードを出すと勝利するが、同じ値の時には敗北する。{"\n"}
                お互いに使用すると通常の勝敗判定となります。{"\n"}
                テンテキによる勝敗判定が優先されます。
              </Text>
            </View>

            {/* 神龍 */}
            <View style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Image source={require('../assets/kourin_sinryu.webp')} style={styles.itemIcon} />
                <Text style={styles.itemName}>神龍</Text>
              </View>
              <Text style={styles.itemDescription}>
                神のアイテム。{"\n"}
                自分のカードの値を+2する。{"\n"}
                勝利したとき、通常ダメージの代わりに自分のカードの値と相手のカードの値の差の半分のダメージ（端数は切り上げ）を与える。
              </Text>
            </View>

            {/* 全知全能 */}
            <View style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Image source={require('../assets/kourin_zenchi_zennou.webp')} style={styles.itemIcon} />
                <Text style={styles.itemName}>全知全能</Text>
              </View>
              <Text style={styles.itemDescription}>
                神のアイテム。{"\n"}
                ライフを1回復する。{"\n"}
                自分の手札のカードと相手の手札のカードを全て入れ替える。
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  section: {
    marginBottom: 32,
  },
  mainTitle: {
    fontSize: 20, // text-xl
    fontWeight: "bold",
    color: "#111827", // text-gray-900
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20, // text-xl
    fontWeight: "bold",
    color: "#111827", // text-gray-900
    marginBottom: 16,
  },
  textContainer: {
    gap: 12,
  },
  text: {
    color: "#374151", // text-gray-700
    lineHeight: 24,
    fontSize: 16,
    marginBottom: 12,
  },
  heartContainer: {
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  itemsContainer: {
    gap: 16,
  },
  itemCard: {
    padding: 16, // p-4
    backgroundColor: "#f9fafb", // bg-gray-50
    borderRadius: 8, // rounded-lg
    borderWidth: 1,
    borderColor: "#f3f4f6", // border-gray-100
    marginBottom: 16,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  itemIcon: {
    width: 40,
    height: 40,
    marginRight: 16,
  },
  itemName: {
    fontWeight: "bold",
    color: "#111827", // text-gray-900
    fontSize: 16,
  },
  itemDescription: {
    color: "#374151", // text-gray-700
    lineHeight: 20,
    fontSize: 14,
  },
});