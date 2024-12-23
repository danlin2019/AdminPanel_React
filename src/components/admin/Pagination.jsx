function Pagination({ pagination, chanegePage }) {
  return (
    <nav aria-label="Page navigation example">
      <ul className="pagination">
        {/* 上一頁 */}
        <li className="page-item">
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
          <li className="page-item" key={`${i}_page`}>
            <a
              className={`page-link ${
                i + 1 === pagination.currentPage ? "active" : ""
              }`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                chanegePage(i + 1);
              }}
            >
              {i + 1}
            </a>
          </li>
        ))}

        {/* 下一頁 */}
        <li className="page-item">
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
    </nav>
  );
}


export default Pagination;