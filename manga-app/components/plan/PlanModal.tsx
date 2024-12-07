import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { buyPlan, fetchPlanInfo } from "@/api/planApi";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { ScrollView } from "react-native-gesture-handler";
import { formatPrice } from "@/utils/utils";
import Toast from "react-native-toast-message";

type PlanItemProps = {
  planId: number;
  isOpenFromPlanPage: boolean;
  visible: boolean;
  onClose: () => void;
};

interface Plan {
  planId: number;
  planName: string;
  price: number;
  duration: number;
  description: string;
  startAt: string;
  endAt: string;
  canReadAll: number;
  isBoughtByUser: boolean;
  mangas: any[];
}

export default function PlanModal({
  planId,
  isOpenFromPlanPage = false,
  visible,
  onClose,
}: PlanItemProps) {
  const { authState } = useAuth();

  const [plan, setPlan] = useState<Plan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const showToast = (type: string, title: string, message: string = "") => {
    Toast.show({
      type: type,
      text1: title,
      text2: message,
    });
  };

  useEffect(() => {
    getPlanInfo();
  }, [planId]);

  const getPlanInfo = async () => {
    const response = await fetchPlanInfo(planId);

    if (response.success) {
      const data = response.data;
      setPlan(data);
    }
  };

  const handleBuyPlan = async () => {
    if (!authState.authenticated) {
      showToast("error", "Vui lòng đăng nhập để mua gói!");
      return;
    }

    const response = await buyPlan(planId);

    if (response.success) {
      onClose();
    } else {
      showToast("error", "Mua gói thất bại!", response.message);
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.modalContainer}>
          <ScrollView>
            <View style={styles.header}>
              <Text style={styles.headerText}>Gói {plan?.planName}</Text>
            </View>

            <View style={styles.planInfo}>
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Text style={styles.mangaListHeaderText}>Thông tin gói</Text>
              </View>
              <View style={styles.planInfoRow}>
                <Text style={styles.planInfoLabel}>Thời hạn:</Text>
                <Text style={styles.planInfoText}>{plan?.duration} ngày</Text>
              </View>
              <View style={styles.planInfoRow}>
                <Text style={styles.planInfoLabel}>Ngày bắt đầu:</Text>
                <Text style={styles.planInfoText}>{plan?.startAt}</Text>
              </View>
              <View style={styles.planInfoRow}>
                <Text style={styles.planInfoLabel}>Ngày kết thúc:</Text>
                <Text style={styles.planInfoText}>
                  {plan?.endAt ? plan.endAt : "Vô thời hạn"}
                </Text>
              </View>
              <View style={styles.planInfoRow}>
                <Text style={styles.planInfoLabel}>Giá:</Text>
                <Text style={styles.planInfoText}>
                  {formatPrice(plan?.price)}
                </Text>
              </View>
              <View style={styles.planInfoRow}>
                <Text style={styles.planInfoLabel}>Mô tả gói:</Text>
                <Text style={styles.planInfoText}> {plan?.description}</Text>
              </View>
            </View>

            <View style={styles.mangaList}>
              <View style={styles.mangaListHeader}>
                <Text style={styles.mangaListHeaderText}>Danh sách truyện</Text>
              </View>
              <View>
                {plan?.canReadAll === 1 && (
                  <Text>Cho phép đọc tất cả các truyện trả phí</Text>
                )}
                {plan?.mangas.map((manga: any) => (
                  <View style={styles.mangaRow} key={manga.mangaId}>
                    <Image
                      source={{ uri: manga.coverImageUrl }}
                      style={styles.mangaCover}
                    />
                    <Text style={styles.mangaName}>{manga.mangaName}</Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.buttonSection}>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: "red" }]}
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText} onPress={handleBuyPlan}>
                {isOpenFromPlanPage ? "Mua lại" : "Mua ngay"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: "20%",
  },
  modalContainer: {
    flex: 1,
    width: "100%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    fontFamily: "OpenSans-Bold",
  },
  planInfo: {
    marginTop: 20,
    paddingVertical: 12,
    flexDirection: "column",
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: "gray",
    gap: 4,
  },
  planInfoRow: {
    flexDirection: "row",
    width: "80%",
  },
  planInfoLabel: {
    marginRight: 6,
    fontSize: 16,
    fontFamily: "OpenSans-SemiBold",
  },
  planInfoText: {
    fontSize: 16,
    fontFamily: "OpenSans-Regular",
  },

  mangaList: {
    flexDirection: "column",
  },
  mangaListHeader: {
    padding: 12,
    alignItems: "center",
  },
  mangaListHeaderText: {
    fontSize: 16,
    fontFamily: "OpenSans-Bold",
  },
  mangaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  mangaCover: {
    width: 120,
    height: 150,
    marginRight: 10,
  },
  mangaName: {
    fontSize: 14,
    fontFamily: "OpenSans-Regular",
  },

  buttonSection: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  closeButton: {
    backgroundColor: "#007BFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "OpenSans-Bold",
  },
});
