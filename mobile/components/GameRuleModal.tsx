import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView } from "react-native";
import { GameRule } from "./GameRule";

export const GameRuleModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <View>
      <TouchableOpacity
        onPress={openModal}
        style={styles.button}
        accessibilityLabel="ルール"
      >
        <Text style={styles.buttonText}>ルール</Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.backgroundTouchable}
            activeOpacity={1}
            onPress={closeModal}
          />

          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>ルール</Text>
              <TouchableOpacity
                onPress={closeModal}
                style={styles.closeButton}
                accessibilityLabel="閉じる"
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView style={styles.modalBody}>
              <GameRule needHeader={false} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 24, // px-6
    paddingVertical: 12, // py-3
    backgroundColor: "#4f46e5", // bg-indigo-600
    borderRadius: 8, // rounded-lg
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // shadow-sm
  },
  buttonText: {
    color: "#ffffff", // text-white
    fontSize: 16,
    fontWeight: "500", // font-medium
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)", // bg-black bg-opacity-40
    justifyContent: "center",
    alignItems: "center",
    padding: 16, // p-4
  },
  backgroundTouchable: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: "#ffffff", // bg-white
    borderRadius: 12, // rounded-xl
    width: "90%", // 幅を少し調整
    maxWidth: 600, // max-w-2xl
    height: "80%", // maxHeightではなくheightに変更
    flexDirection: "column",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20, // 少し小さく
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb", // border-gray-200
  },
  modalTitle: {
    fontSize: 20, // 少し小さく
    fontWeight: "bold", // font-bold
    color: "#111827", // text-gray-900
  },
  closeButton: {
    width: 40, // w-10
    height: 40, // h-10
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  closeButtonText: {
    color: "#6b7280", // text-gray-500
    fontSize: 24, // 少し大きく
    fontWeight: "normal",
  },
  modalBody: {
    flex: 1,
    padding: 16,
  },
});