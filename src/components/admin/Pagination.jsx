function Pagination({ pagination, chanegePage }) {
  return (
    <div className="w-full">
      <ul className="flex">
        {/* 上一頁 */}
        <li className="mr-2">
          <a
            className={`page-link ${pagination.hasPrev ? "" : "disabled"}`}
            href="#"
            aria-label="Previous"
            onClick={(e) => {
              e.preventDefault();
              if (pagination.hasPrev) {
                chanegePage(pagination.currentPage - 1);
              }
            }}
          >
            <span aria-hidden="true">上一頁</span>
          </a>
        </li>

        {/* 頁碼 */}
        {[...new Array(pagination.totalPages)].map((_, i) => (
          <li className="page-item rounded transition duration-300 bg-[#318dcc] px-[0.6rem] py-[0.1rem] text-white hover:bg-[#19679c]" key={`${i}_page`}>
            <a
              className={`page-link ${i + 1 === pagination.currentPage ? "active" : ""}`}
              href="#"
              onClick={(e) => {e.preventDefault();chanegePage(i + 1);}}
            >
              {i + 1}
            </a>
          </li>
        ))}

        {/* 下一頁 */}
        <li className="ml-2">
          <a
            className={`page-link ${pagination.hasNext ? "" : "disabled"}`}
            href="#"
            aria-label="Next"
            onClick={(e) => {
              e.preventDefault();
              if (pagination.hasNext) {
                chanegePage(pagination.currentPage + 1);
              }
            }}
          >
            <span aria-hidden="true">下一頁</span>
          </a>
        </li>
      </ul>
    </div>
  );
}


export default Pagination;