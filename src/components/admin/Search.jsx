import { useEffect, useState } from "react";

function Search({ getProducts ,handleSearch }) {
  const [searchValue, setSearchValue] = useState("");
  const [ascending , setAscending] = useState(false)

  useEffect(()=>{
    handleSearch(searchValue,ascending)
  },[searchValue,ascending])

  // 處理搜尋按鈕點擊事件
  const onSearch = () => {
    if(handleSearch){
      handleSearch(searchValue,ascending)
    }
  };
  
  return(
    <div className="search-box">
      <h3>搜尋區塊</h3>
      {/* seach */}
      <div className="w-full max-w-sm min-w-[200px]">
        <div className="relative">
          <input
            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-28 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            placeholder="請輸入關鍵字..." 
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          {/* <button
            className="absolute top-1 right-1 flex items-center rounded bg-slate-800 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
            onClick = {onSearch}
            disabled = {!searchValue}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
              <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
            </svg>
            搜尋
          </button>  */}
        </div>
      </div>
      價格:
        <input
          type='checkbox'
          // checked={ascending}
          onChange={(e) => setAscending(e.target.checked)}
        />
        { ascending ? '最新' : '最舊'}
    </div>
  )
}

export default Search