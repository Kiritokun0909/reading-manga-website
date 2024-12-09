import { formatPrice } from "../../../utilities/utils";

export default function PlanItem({ plan, onDetailClick, onDeleteClick }) {
  return (
    <div className="flex flex-col items-center p-3 rounded-lg bg-white w-64">
      <div>
        <strong className="text-lg">{plan.planName}</strong>
      </div>
      <div>Giá: {formatPrice(plan.price)}</div>
      <div>Thời hạn: {plan.duration} ngày</div>
      <div>Bắt đầu: {plan.startAt}</div>
      <div>Kết thúc: {plan.endAt ? plan.endAt : "Vô thời hạn"}</div>
      <div className="mt-2">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => onDetailClick(plan)}
        >
          Chi tiết
        </button>
        <button
          className="p-2 py-1.5 px-3 m-1 text-center font-bold bg-red-500 border rounded-md text-white  hover:bg-red-700 hover:text-gray-100 red:text-white-200 dark:bg-red-700"
          onClick={() => onDeleteClick(plan.planId)}
        >
          Xoá
        </button>
      </div>
    </div>
  );
}
