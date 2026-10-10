import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    color: "#666",
  },
  contentContainer: {
    padding: 16,
  },
  landscapeContainer: {
    paddingHorizontal: 32,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  floatingNavigation: {
    position: "absolute",
    left: 16,
    right: 16,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  pageNavigation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pageButton: {
    flex: 1,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: "#007AFF",
    borderRadius: 6,
  },
  pageButtonSpacer: {
    flex: 1,
  },
  savePageButton: {
    backgroundColor: "#28a745",
  },
  disabledPageButton: {
    opacity: 0.45,
  },
  pageButtonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 13,
  },
  pageIndicator: {
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 8,
  },
  questions: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  questionsPageSection: {
    marginBottom: 18,
  },
  questionsPageLevel: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  questionLabel: {
    fontWeight: "600",
    marginBottom: 6,
  },
  noOptions: {
    color: "#777",
    marginBottom: 10,
    fontStyle: "italic",
  },
  selector: {
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  answerField: {
    marginTop: 8,
  },
  answerInput: {
    minHeight: 60,
    borderColor: "#bbb",
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    textAlignVertical: "top",
  },
});
