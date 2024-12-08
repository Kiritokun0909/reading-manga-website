import { fetchPlans } from "@/api/planApi";
import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import PlanModal from "./PlanModal";
import { formatPrice } from "@/utils/utils";

type PlanListProps = {
  mangaId: string;
};

export default function PlanList({ mangaId }: PlanListProps) {
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<number>(0);
  const [isShowModal, setIsShowModal] = useState(false);

  const getListPlan = async () => {
    const response = await fetchPlans(parseInt(mangaId));
    if (response.success) {
      setPlans(response.data.plans);
    } else {
      console.log(response.message);
    }
  };

  useEffect(() => {
    getListPlan();
  }, []);

  const handleDetailClick = (planId: number) => {
    setSelectedPlanId(planId);
    setIsShowModal(true);
  };

  return (
    <View style={{ marginTop: 10 }}>
      <View style={styles.planList}>
        <FlatList
          data={plans}
          horizontal={true}
          scrollEnabled={true}
          renderItem={({ item }) => (
            <View style={styles.planBox}>
              <View style={styles.planHeader}>
                <Text style={styles.planHeaderValue}>{item.planName}</Text>
              </View>
              <View style={styles.planInfo}>
                <View style={styles.planInfoRow}>
                  <Text style={styles.planInfoValue}>
                    Giá: {formatPrice(item.price)}
                  </Text>
                </View>
                <View style={styles.planInfoRow}>
                  <Text style={styles.planInfoValue}>
                    Thời hạn: {item.duration} ngày
                  </Text>
                </View>
                <View style={styles.planInfoRow}>
                  <TouchableOpacity
                    style={styles.planButton}
                    onPress={() => handleDetailClick(item.planId)}
                  >
                    <Text style={styles.planButtonText}>Chi tiết</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      </View>

      <PlanModal
        planId={selectedPlanId}
        isOpenFromPlanPage={false}
        visible={isShowModal}
        mangaId={mangaId}
        onClose={() => setIsShowModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  planList: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  planBox: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    width: 200,
    alignItems: "center",
    backgroundColor: "white",
    borderColor: "gray",
    borderWidth: 1,
    marginRight: 8,
    borderRadius: 8,
  },
  planHeader: {
    padding: 8,
  },
  planHeaderValue: {
    fontSize: 18,
    fontFamily: "OpenSans-Bold",
  },
  planInfo: {
    gap: 8,
  },
  planInfoRow: {
    alignItems: "center",
  },
  planInfoValue: {
    fontSize: 14,
    fontFamily: "OpenSans-SemiBold",
  },
  planButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: "dodgerblue",
    borderRadius: 4,
  },
  planButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "OpenSans-Bold",
  },
});
