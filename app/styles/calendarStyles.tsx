import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  mainSplitView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 10,
  },
  mainSingleView: { flexDirection: "column" },
  leftColumn: { flex: 0.9, paddingRight: 5 },
  rightColumn: { flex: 5, paddingLeft: 5 },
  fullWidth: { width: "100%" },
  container: {
    flex: 1,
    width: "95%",
    alignSelf: "center",
  },
  calendarCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 10,
    marginVertical: 15,
    // Matches entryDetails shadow
    // iOS Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    // Android Shadow
    // elevation: 8,
    borderRightWidth: 6,
    borderBottomWidth: 6,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  contentContainer: {
    alignItems: "stretch",
    paddingBottom: 20,
  },
  headerText: {
    textAlign: "center",
    fontSize: 20,
    padding: 10,
  },
  calendar: {
    width: "100%",
    paddingBottom: 5,
  },
  dayContainer: {
    width: "100%",
    height: 60,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 2,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 0.5,
    borderColor: "gray",
  },
  dayText: {
    fontSize: 16,
    color: "#000",
    marginBottom: -1,
  },
  symbolText: {
    fontSize: 12,
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "center",
    marginTop: -1,
    marginRight: -1,
  },
  symbolBadge: {
    width: 25,
    height: 25,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  emptyBadge: {
    width: 25,
    height: 25,
    marginTop: 2,
  },
  // I don't know what I want to do with these yet
  // selectedSymbolBadge: {
  //   backgroundColor: "#2b6ef6",
  // },
  extraSymbolBadge: {
    backgroundColor: "#e0e0e0",
  },
  selectedDate: {
    backgroundColor: "#77aafdff",
    borderRadius: 12,
    width: "100%",
    height: 60,
    alignItems: "center",
    justifyContent: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  selectedDateText: {
    color: "#fff",
    fontWeight: "bold",
  },
  selectedSymbolText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  extraDayText: {
    color: "#bdbdbd",
  },
  extraSymbolText: {
    color: "#9e9e9e",
  },
  jumpButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#007bff",
  },
  jumpDisabled: {
    opacity: 0.5,
    backgroundColor: "#9ecaf8",
  },
  newEntryButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  editEntryButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
  },
  deleteEntryButton: {
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  portraitContent: {
    width: "100%",
    maxHeight: "70%",
  },
  landscapeContent: {
    width: "100%",
    maxHeight: "70%",
  },

  // The main wrapper for the entry details
  entryDetailsBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginHorizontal: 4, // Prevents shadows from clipping

    // iOS Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    // Android Shadow
    // elevation: 6,
    borderRightWidth: 6,
    borderBottomWidth: 6,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  // The date header inside the card
  entryTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    paddingBottom: 8,
  },
  // Sub-headers for "Lowest Level" and "Complete Scale"
  entryHeader: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 10,
    marginBottom: 4,
  },
  // The "No entry" placeholder
  emptyEntry: {
    marginTop: 40,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyEntryText: {
    color: "#999",
    fontSize: 16,
    fontStyle: "italic",
    textAlign: "center",
  },
  // Bullet point container
  optionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 4,
    paddingLeft: 8,
  },
  bulletText: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
  },
});
