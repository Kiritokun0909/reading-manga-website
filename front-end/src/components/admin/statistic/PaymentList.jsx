import ReactPaginate from "react-paginate";
import { formatPrice } from "../../../utilities/utils";

export default function PaymentList({
  payments,
  currentPage,
  totalPages,
  onPageChange,
}) {
  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full h-96 text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Tên gói
              </th>
              <th scope="col" className="px-6 py-3">
                Thông tin khách hàng
              </th>
              <th scope="col" className="px-6 py-3">
                Giá
              </th>
              <th scope="col" className="px-6 py-3">
                Kích hoạt lúc
              </th>
              <th scope="col" className="px-6 py-3">
                Hết hạn lúc
              </th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr
                key={payment.userPlanId}
                className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-200 even:dark:bg-gray-800 border-b dark:border-gray-700"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
                >
                  {payment.planName}
                </th>
                <td className="px-6 py-4">
                  {payment.username} ({payment.email})
                </td>
                <td className="px-6 py-4">{formatPrice(payment.price)}</td>
                <td className="px-6 py-4">{payment.startAt}</td>
                <td className="px-6 py-4">{payment.endAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <ReactPaginate
          breakLabel="..."
          nextLabel="Trang kế"
          previousLabel="Trang trước"
          onPageChange={onPageChange}
          pageCount={totalPages}
          forcePage={currentPage - 1}
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
        />
      </div>
    </>
  );
}
