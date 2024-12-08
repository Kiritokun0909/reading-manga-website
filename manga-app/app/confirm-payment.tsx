import { fetchPlanInfo } from "@/api/planApi";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

import { confirmPayment, fetchPaymentSheet } from "@/api/paymentApi";
import { useStripe } from "@stripe/stripe-react-native";
import { formatPrice } from "@/utils/utils";

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

export default function ConfirmPaymentPage() {
  const { planId, userPlanId, mangaId } = useLocalSearchParams();

  const [plan, setPlan] = useState<Plan | null>(null);

  const showToast = (type: string, title: string, message: string = "") => {
    Toast.show({
      type: type,
      text1: title,
      text2: message,
    });
  };

  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const fetchPaymentSheetParams = async () => {
    const response = await fetchPaymentSheet(plan?.price, "vnd");
    const { paymentIntent, ephemeralKey, customer } = response.data;

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    const { paymentIntent, ephemeralKey, customer } =
      await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Example, Inc.",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: "Jane Doe",
      },
      returnURL: "expo://",
    });
  };

  const openPaymentSheet = async () => {
    await initializePaymentSheet();
    const { error } = await presentPaymentSheet();

    if (error) {
      showToast("error", "Huỷ thanh toán", "Bạn đã huỷ thanh toán.");
    } else {
      console.log("mangaId", mangaId);

      const response = await confirmPayment(userPlanId);

      if (response.success) {
        showToast(
          "success",
          "Thanh toán thành công!",
          "Bạn có thể quay lại để đọc truyện."
        );
      }

      if (mangaId) {
        router.push(`/`); // Redirect to the home page
        router.push(`/manga/${mangaId}`);
      } else {
        router.push(`/`); // Redirect to the home page
        router.push(`/plan`);
      }
    }
  };

  useEffect(() => {
    getPlanInfo();
    initializePaymentSheet();
  }, [planId]);

  const getPlanInfo = async () => {
    const response = await fetchPlanInfo(planId);

    if (response.success) {
      const data = response.data;
      setPlan(data);
    }
  };

  return (
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

          <View style={styles.mangaListSection}>
            <View style={styles.mangaListHeader}>
              <Text style={styles.mangaListHeaderText}>Danh sách truyện</Text>
            </View>
            <View style={styles.mangaList}>
              {plan?.canReadAll === 1 && (
                <Text>Cho phép đọc tất cả các truyện trả phí</Text>
              )}
              {plan?.mangas.map((manga: any) => (
                <View style={styles.mangaRow} key={manga.mangaId}>
                  <Image
                    source={{ uri: manga.coverImageUrl }}
                    style={styles.mangaCover}
                  />
                  <View style={{ width: 200 }}>
                    <Text style={styles.mangaName}>{manga.mangaName}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={openPaymentSheet}
          >
            <Text style={styles.closeButtonText}>Thanh toán</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    width: "100%",
    padding: 20,
    backgroundColor: "white",
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

  mangaListSection: {
    flexDirection: "column",
  },
  mangaListHeader: {
    padding: 12,
    alignItems: "center",
  },
  mangaList: {
    gap: 10,
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
