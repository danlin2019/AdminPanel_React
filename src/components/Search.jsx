import { FaSearch } from "react-icons/fa"; 
import { useEffect, useState } from "react";

function Search({ getProducts, handleSearch, handSortItem }) {
  const [searchValue, setSearchValue] = useState("");
  const [ascending, setAscending] = useState(false);
  const [isSelected, setIsSelected] = useState("");

  const sortOptions = [
    { value: "createdAt", lable: "上架時間" },
    { value: "price", lable: "價格" },
  ];

  useEffect(() => {
    handSortItem(ascending, isSelected);
    if (isSelected === "") {
      setIsSelected("createdAt");
    }
  }, [ascending, isSelected]);

  useEffect(() => {
    if (searchValue === "") {
      getProducts();
    }
  }, [searchValue]);

  // 處理搜尋按鈕點擊事件
  const onSearch = () => {
    if (handleSearch) {
      handleSearch(searchValue);
    }
  };

  return (
    <div className="search-box mb-10">
      <h3 className="title-h1 mb-2">關鍵字搜尋</h3>
      {/* seach */}
      <div className="w-full">
        <div className="relative mb-3">
          <input
            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-28 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            placeholder="請輸入關鍵字..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                onSearch()
              }
            }}
            
          />
          <button
            className="absolute top-1 right-1 flex items-center rounded bg-slate-800 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
            onClick={onSearch}
            
            disabled={!searchValue}
          >
            <FaSearch className="mr-2"/>
            搜尋
          </button>
        </div>
      </div>
      <div className="flex items-center">
        <select
          className="input-style w-40 bg-white mr-3"
          value={isSelected}
          onChange={(e) => setIsSelected(e.target.value)}
        >
          {sortOptions.map((option, i) => {
            return (
              <option key={i} value={option.value}>
                {option.lable}
              </option>
            );
          })}
        </select>
        <div className="flex">
          <span className="mr-2">排序:</span>
          <label className="flex items-center">
            <input
              type="checkbox"
              onChange={(e) => setAscending(e.target.checked)}
              className="mr-2 border-neutral-300"
            />
            {isSelected === "createdAt" || ""
              ? ascending
                ? "最舊"
                : "最新"
              : ascending
              ? "最低"
              : "最高"}
          </label>
        </div>
      </div>

    </div>
  );
}

export default Search;
