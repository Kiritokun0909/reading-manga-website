import { useEffect, useState } from "react";
import { getListPlanByMangaId } from "../../../api/SiteService";
import { toast } from "react-toastify";
import PlanItem from "./PlanItem";
import PlanModal from "./PlanModal";

export default function PlanList({ mangaId }) {
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [isShowModal, setIsShowModal] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await getListPlanByMangaId(mangaId);
        setPlans(response.plans);
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchPlans();
  }, [mangaId]);

  const handleDetailClick = (planId) => {
    setSelectedPlanId(planId);
    setIsShowModal(true);
  };

  return (
    <div className="overflow-x-auto h-48 w-full p-2">
      <div className="flex flex-wrap gap-3 justify-center">
        {plans.map((plan) => (
          <div className="flex-shrink-0 w-auto" key={plan.planId}>
            <PlanItem plan={plan} onDetailClick={handleDetailClick} />
          </div>
        ))}
      </div>

      {isShowModal && (
        <PlanModal
          planId={selectedPlanId}
          onClose={() => setIsShowModal(false)}
        />
      )}
    </div>
  );
}
