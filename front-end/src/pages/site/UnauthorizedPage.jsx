import { useNavigate } from "react-router-dom";
import "../../styles/site/Login.css";

export default function NotFoundPage() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex justify-center flex-col">
      <div className="flex justify-center p-4">
        <h1>Bạn không có quyền truy cập đến trang này</h1>
      </div>
      <div className="flex justify-center p-4">
        <button
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          onClick={goBack}
        >
          Quay lại
        </button>
      </div>
    </div>
  );
}
