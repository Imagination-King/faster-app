// src/components/ActionCard.tsx
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface ActionCardProps {
  title: string;
  subtitle: string;
  onPress: () => void;
  isSecondary?: boolean;
}

export const ActionCard = ({
  title,
  subtitle,
  onPress,
  isSecondary,
}: ActionCardProps) => (
  <TouchableOpacity
    style={[styles.card, isSecondary && styles.secondaryCard]}
    onPress={onPress}
  >
    <Text style={styles.title}>{title} →</Text>
    <Text style={styles.subtitle}>{subtitle}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryCard: {
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#007bff",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },
});
