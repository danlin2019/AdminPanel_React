import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";


const Charts = () => {
  const [chartOptions, setChartOptions] = useState(null); // ECharts 設定
  const [filterType, setFilterType] = useState("all"); // 篩選：all , weekly, monthly
  const [loading,setLoading] = useState(false)
  useEffect(() => {
    getProducts();
  }, [filterType]); // 當篩選方式改變時，重新獲取並處理數據

  // 取得產品列表 API
  const getProducts = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${import.meta.env.VITE_APP_API_URL}getOrderList`)
      const orders = res?.data?.orders || []

      // 根據篩選方式分組數據
      const groupedData = groupByFilterType(orders, filterType)
      const names = Array.from(groupedData.keys()) // 分組後名稱
      const quantities = Array.from(groupedData.values()) // 分組後數量

      // ECharts 配置
      setChartOptions({
        title: {
          text:
            filterType === "all"
              ? "品項數據 - 全部"
              : `品項數據 - ${
                  filterType === "weekly" ? "每週" : "每月"
            }`,
            textStyle:{
              fontSize: 15,
            }
        },
        tooltip: {},
        xAxis: {
          data: names,
          axisLabel: {
            interval: 0,
            // rotate: 45,
            formatter: (value) => value.split(" ").join("\n"),
            margin: 10,
            align: "center",
          },
        },
        yAxis: {
          axisLabel: {
            margin: 10,
          },
        },
        series: [
          {
            name: "銷量",
            type: "bar",
            data: quantities,
            itemStyle: {
              color: (params) => {
                const colors = ["#476bb5", "#91CC75", "#FAC858", "#EE6666", "#73C0DE", "#5aade4", "#FC8452"]
                return colors[params.dataIndex % colors.length]
              },
            },
          },
        ],
      })
      setLoading(false)
    } catch (error) {
      console.error("獲取資料失敗：", error)
    }
  }

  // 根據篩選方式分組數據
  const groupByFilterType = (orders, type) => {
    const groupedMap = new Map()

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const title = item.title || "未知名稱"
        const quantity = item.quantity || 0
        let key

        if (type === "all") {
          // 全部分組只根據品項名稱
          key = title
        } else if (type === "weekly") {
          // 每週
          const date = new Date(item.time || order.time)
          const year = date.getFullYear()
          const week = Math.ceil(
            (date - new Date(year, 0, 1)) / (7 * 24 * 60 * 60 * 1000)
          )
          key = `${title} (${year}-W${week})`
        } else if (type === "monthly") {
          // 每月
          const date = new Date(item.time || order.time)
          key = `${title} (${date.getFullYear()}-${date.getMonth() + 1})` // 格式化為 YYYY-MM
        }

        // 累加數量
        groupedMap.set(key, (groupedMap.get(key) || 0) + quantity)
      });
    });

    return groupedMap
  };

  return (
    <div className="w-[90%] m-auto ">
      <h2 className="title-h1 mb-5">銷售數據</h2>

      <div className="mb-12 space-x-4">
        <button className="text-gray-500 hover:text-black" onClick={() => setFilterType("all")}><span className="text-[#5aade4]">•</span>所有</button>
        <button className="text-gray-500 hover:text-black" onClick={() => setFilterType("weekly")}><span className="text-[#5aade4]">•</span>每週</button>
        <button className="text-gray-500 hover:text-black" onClick={() => setFilterType("monthly")}><span className="text-[#5aade4]">•</span>每月</button>
      </div>
      {/* loading */}
      { loading && <div className="text-gray-400 text-center py-5">載入中...請稍候</div> }
      {chartOptions && (
        <ReactECharts
          option={chartOptions}
          style={{ height: 500, width: "100%" }}
          opts={{ renderer: "svg" }}
        />
      )}
    </div>
  );
};

export default Charts;
