import ReactPaginate from "react-paginate";
import PlanItem from "./PlanItem";

export default function PlanList({
  plans,
  currentPage,
  totalPages,
  onPageChange,
  onDetailClick,
  onDeleteClick,
}) {
  return (
    <div>
      <div className="flex flex-wrap justify-center gap-3">
        {plans.map((plan) => (
          <PlanItem
            key={plan.planId}
            plan={plan}
            onDetailClick={onDetailClick}
            onDeleteClick={onDeleteClick}
          />
        ))}
      </div>

      <div>
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
    </div>
  );
}
