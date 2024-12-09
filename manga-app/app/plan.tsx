import { fetchPurchasedPlans } from "@/api/accountApi";
import { ITEMS_PER_PAGE } from "@/utils/HandleCode";
import { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { formatPrice } from "@/utils/utils";
import PlanModal from "@/components/plan/PlanModal";

export default function PlanPage() {
  const [plans, setPlans] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedPlanId, setSelectedPlanId] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showToast = (type: string, title: string, message: string = "") => {
    Toast.show({
      type: type,
      text1: title,
      text2: message,
    });
  };

  useEffect(() => {
    getPlans(currentPage);
  }, []);

  const getPlans = async (pageNumber: number) => {
    const response = await fetchPurchasedPlans(pageNumber, ITEMS_PER_PAGE);
    if (pageNumber === 1) {
      setPlans(response.plans);
    } else {
      setPlans([...plans, ...response.plans]);
    }

    setTotalPages(response.totalPages);
  };

  const handleNextPage = async () => {
    if (currentPage > totalPages) return;
    const nextPage = currentPage + 1;
    await getPlans(nextPage);
    setCurrentPage(nextPage);
  };

  const handleOpenModal = (planId: number) => {
    setSelectedPlanId(planId);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {plans.length === 0 && (
        <View
          style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
        >
          <Text>Bạn chưa mua gói nào</Text>
        </View>
      )}
      <FlatList
        data={plans}
        keyExtractor={(item) => item.startAt.toString()}
        horizontal={false}
        numColumns={1}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={true}
        renderItem={({ item }) => (
          <View style={styles.planItem}>
            <View style={styles.planHeader}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.planTitle}>{item.planName}</Text>
                <Text
                  style={
                    item.planStatus === "active"
                      ? styles.planStatusActive
                      : styles.planStatusInactive
                  }
                >
                  {item.planStatus === "active" ? "Còn thời hạn" : "Hết hạn"}
                </Text>
              </View>
              <View>
                <TouchableOpacity
                  style={styles.detailButton}
                  onPress={() => handleOpenModal(item.planId)}
                >
                  <Text style={styles.detailText}>Chi tiết</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ marginTop: 2 }}>
              <Text style={styles.planInfo}>
                Giá: {formatPrice(item.price)}
              </Text>
              <Text style={styles.planInfo}>
                Ngày kích hoạt: {item.startAt}
              </Text>
              <Text style={styles.planInfo}>Ngày hết hạn: {item.endAt}</Text>
            </View>
          </View>
        )}
        onEndReached={handleNextPage}
        onEndReachedThreshold={0.5}
      />

      <PlanModal
        planId={selectedPlanId}
        visible={isModalVisible}
        isOpenFromPlanPage={true}
        onClose={() => handleCloseModal()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
  },
  planItem: {
    flexDirection: "column",
    backgroundColor: "white",
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    width: 300,
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  planTitle: {
    fontSize: 16,
    fontFamily: "OpenSans-Bold",
    marginRight: 8,
  },
  planStatusActive: {
    color: "green",
    fontFamily: "OpenSans-SemiBold",
  },
  planStatusInactive: {
    color: "red",
    fontFamily: "OpenSans-SemiBold",
  },
  planInfo: {
    fontFamily: "OpenSans-Regular",
  },
  detailButton: {
    backgroundColor: "blue",
    padding: 6,
    borderRadius: 5,
  },
  detailText: {
    color: "white",
    fontSize: 16,
    fontFamily: "OpenSans-Bold",
  },
});
