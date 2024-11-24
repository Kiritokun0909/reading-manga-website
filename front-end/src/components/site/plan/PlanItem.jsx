export default function PlanItem({ plan, onDetailClick }) {
  const formatPrice = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value || 0);
  };

  return (
    <div className="flex flex-col items-center p-3 rounded-lg bg-gray-300 border-1 w-48">
      <div>
        <strong className="text-lg">{plan.planName}</strong>
      </div>
      <div>Giá: {formatPrice(plan.price)}</div>
      <div>Thời hạn: {plan.duration} ngày</div>
      <div className="mt-2">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => onDetailClick(plan.planId)}
        >
          Chi tiết
        </button>
      </div>
    </div>
  );
}
