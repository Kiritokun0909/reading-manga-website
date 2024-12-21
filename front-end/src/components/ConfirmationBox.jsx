export default function ConfirmationBox({
  title,
  message,
  onConfirm,
  onClose,
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
      <div className="flex flex-col justify-center border shadow rounded-lg px-8 py-2 bg-white">
        <div className="w-full text-center">
          <h4>{title ? title : "Xác nhận"}</h4>
        </div>

        <div className="w-full text-center mt-4">
          <p>{message ? message : "Bạn có chắc muốn xoá?"}</p>
        </div>

        <div className="flex justify-center mt-8">
          <button
            className="p-2 py-1.5 px-3 m-1 text-center bg-violet-700 border rounded-md text-white  hover:bg-violet-500 hover:text-gray-100 dark:text-gray-200 dark:bg-violet-700"
            onClick={onClose}
          >
            Huỷ
          </button>
          <button
            onClick={onConfirm}
            className="z-10 p-2 py-1.5 px-3 m-1 text-center bg-red-700 border rounded-md text-white  hover:bg-red-500 hover:text-gray-100 red:text-white-200 dark:bg-red-700"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}
