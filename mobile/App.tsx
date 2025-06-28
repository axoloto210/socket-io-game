import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { UserContext } from "./contexts/UserContext";
import { GameRuleModal } from "./components/GameRuleModal";
// import { RoomModeSelector } from "./components/RoomModeSelector";
import { GameRule } from "./components/GameRule";

function App() {
  const [userName, setUserName] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // ユーザー名入力処理
  const handleLogin = () => {
    if (userName.trim()) {
      setIsAuthenticated(true);
    }
  };

  return (
    <>
      <StatusBar style="auto" backgroundColor="#99d9ea" />
      <UserContext.Provider value={{ userName, setUserName }}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.headerInner}>
                <Text style={styles.title}>
                  リアクトデュエル
                </Text>
                <GameRuleModal />
              </View>
            </View>
          </View>

          {/* Main Content */}
          <ScrollView style={styles.main}>
            {!isAuthenticated ? (
              <>
                {/* ユーザー名入力カード */}
                <View style={styles.card}>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      value={userName}
                      maxLength={12}
                      onChangeText={setUserName}
                      placeholder="ユーザー名"
                      returnKeyType="done"
                      onSubmitEditing={handleLogin}
                    />
                    <TouchableOpacity
                      onPress={handleLogin}
                      style={styles.button}
                    >
                      <Text style={styles.buttonText}>
                        けってい
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* ゲームルールカード */}
                <View style={styles.card}>
                  <GameRule needHeader />
                </View>
              </>
            ) : (
              <View>room mode selector</View>
              // <RoomModeSelector />
            )}
          </ScrollView>
        </View>
      </UserContext.Provider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb", // bg-gray-50
     paddingTop: 50,
  },
  header: {
    backgroundColor: "#ffffff", // bg-white
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1, // shadow-sm
  },
  headerContent: {
    maxWidth: 1280, // max-w-7xl
    marginHorizontal: "auto",
    paddingHorizontal: 16, // px-4
    paddingVertical: 16, // py-4
  },
  headerInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: '100%',
  },
  title: {
    fontSize: 24, // text-2xl
    fontWeight: "600", // font-semibold
    color: "#111827", // text-gray-900
  },
  main: {
    flex: 1,
    maxWidth: 896, // max-w-4xl
    marginHorizontal: "auto",
    width: "100%",
  },
  card: {
    backgroundColor: "#ffffff", // bg-white
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2, // shadow
    borderRadius: 8, // rounded-lg
    padding: 24, // p-6
    marginTop: 8, // mt-2
    marginHorizontal: 16,
  },
  inputContainer: {
    flexDirection: "row",
    gap: 16, // gap-4
  },
  input: {
    flex: 1, // flex-1
    borderWidth: 1,
    borderColor: "#d1d5db", // border
    borderRadius: 6, // rounded-md
    paddingHorizontal: 12, // px-3
    paddingVertical: 8, // py-2
    fontSize: 16,
  },
  button: {
    backgroundColor: "#3b82f6", // bg-blue-500
    paddingHorizontal: 16, // px-4
    paddingVertical: 8, // py-2
    borderRadius: 6, // rounded-md
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff", // text-white
    fontSize: 16,
    fontWeight: "500",
  },
});

export default App;