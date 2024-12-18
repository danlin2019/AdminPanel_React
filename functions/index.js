/**
 * 註解說明
 * @param 說明函式接收的參數名稱、型別和描述。
 * @returns 說明回傳值及其結構。
 * @example 提供具體的 API 使用範例，方便快速理解。
 */


const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
// 初始化 CORS 中間件
const cors = require("cors");
const corsMiddleware = cors({ origin: true });

// 新增產品 API
exports.addProduct = onRequest((req, res) => {
  console.log("請求方法：", req.method);
  console.log("請求頭部：", req.headers);
  console.log("請求體：", req.body);

  corsMiddleware(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send({ message: "方法不被允許" });
    }

    const product = req.body;

    if (!product.title || !product.price) {
      console.error("缺少必要字段：", product);
      return res.status(400).send({ success: false, message: "缺少必要字段" });
    }

    try {
      const newProduct = await db.collection("productList").add({
        ...product,
        createdAt: admin.firestore.Timestamp.now(),
      });
      console.log("成功新增產品，ID：", newProduct.id);
      res.status(201).json({
        success: true,
        id: newProduct.id,
        data: { ...product, id: newProduct.id },
      });
    } catch (error) {
      console.error("新增產品失敗：", error);
      res.status(500).json({ success: false, error: "新增產品失敗" });
    }



  });
});


/**
 * 讀取產品列表 API
 * 支援分頁、搜尋、排序功能。
 * 
 * @method GET
 * @endpoint /getProductList
 * 
 * @param {number} req.query.pageSize - 每頁顯示的產品數量，預設為 10。
 * @param {number} req.query.page - 當前的頁數，預設為第 1 頁。
 * @param {string} [req.query.startAfter] - 游標，從這個 Document 後開始查詢。
 * @param {string} [req.query.search] - 搜尋關鍵字，用於篩選產品名稱。
 * @param {string} [req.query.sortBy] - 排序欄位，預設為 "createdAt"。
 * @param {string} [req.query.sortOrder] - 排序順序，"asc" 升序 或 "desc" 降序。
 * 
 * @returns {Object} 回傳 JSON 格式的資料，包含產品列表與分頁資訊。
 */

exports.getProductList = onRequest((req, res) => {
  corsMiddleware(req, res, async () => {
    try {
      if (req.method !== "GET") {
        return res.status(405).send({ success: false, message: "方法不被允許" });
      }

      // 參數設定
      const pageSize = parseInt(req.query.pageSize) || 10; // 每頁筆數
      const page = parseInt(req.query.page) || 1; // 當前頁數
      const startAfterDoc = req.query.startAfter || null; // 游標分頁的起點
      const search = req.query.search || ""; // 搜尋條件
      const sortBy = req.query.sortBy || "createdAt"; // 排序欄位
      const sortOrder = req.query.sortOrder === "desc" ? "desc" : "asc"; // 排序順序

      // 初始化查詢
      let query = db.collection("productList").orderBy(sortBy, sortOrder);

      // 搜尋條件
      if (search) {
        if (sortBy !== "title") {
          throw new Error("搜尋功能目前僅支援 'title' 排序，請調整排序條件");
        }
        query = query
          .where("title", ">=", search)
          .where("title", "<=", search + "\uf8ff");
      }

      // 計算搜尋條件的總數
      const countQuery = query; // 使用相同的查詢條件計算總數
      const countSnapshot = await countQuery.get();
      const totalProducts = countSnapshot.size; // 搜尋結果的總筆數
      const totalPages = Math.ceil(totalProducts / pageSize);

      // 游標分頁
      if (startAfterDoc) {
        const lastDocSnapshot = await db.collection("productList").doc(startAfterDoc).get();
        if (lastDocSnapshot.exists) {
          query = query.startAfter(lastDocSnapshot);
        }
      }

      // 執行查詢
      const snapshot = await query.limit(pageSize).get();
      const products = [];
      let lastDocId = null;

      snapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() });
        lastDocId = doc.id; // 記錄最後一筆資料的 ID
      });

      // 回傳資料
      res.status(200).json({
        success: true,
        products,
        pagination: {
          currentPage: page,
          pageSize,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
          lastDocId,
        },
      });
    } catch (error) {
      console.error("讀取產品列表失敗：", error.message);
      res.status(500).json({ success: false, error: "讀取產品列表失敗，請稍後再試" });
    }
  });
});



/**
 * 編輯產品 API
 * 用於點選到的產品編輯既有資訊並且儲存
 * @method PATCH ＆ PUT
 * @endpoint /editProduct
 */

exports.editProduct = onRequest((req, res) => {
  corsMiddleware(req, res, async () => {
    if (req.method !== "PATCH" && req.method !== "PUT") {
      return res.status(405).send({ message: "方法不被允許" });
    }

    const productId = req.body.id; // 取得產品的 ID
    const updatedProduct = req.body; // 取得更新的資料

    if (!productId || !updatedProduct) {
      return res.status(400).send({ success: false, message: "缺少必要資料" });
    }

    try {
      // 更新 Firestore 中的產品
      await db.collection("productList").doc(productId).update({
        ...updatedProduct,
        updatedAt: admin.firestore.Timestamp.now(),
      });

      res.status(200).json({ success: true, message: "產品更新成功" });
    } catch (error) {
      console.error("編輯產品失敗：", error);
      res.status(500).json({ success: false, error: "產品更新失敗" });
    }
  });
});

/**
 * 刪除產品 API
 * 用於刪除選擇的產品項目
 * @method DELETE
 * @endpoint /deleteProduct
 */

exports.deleteProduct = onRequest((req, res) => {
  corsMiddleware(req, res, async () => {
    if (req.method !== "DELETE") {
      return res.status(405).send({ message: "方法不被允許" });
    }

    const productId = req.query.id; // 從查詢參數中取得產品的 ID

    if (!productId) {
      return res.status(400).send({ success: false, message: "缺少產品 ID" });
    }

    try {
      // 刪除 Firestore 中的產品
      await db.collection("productList").doc(productId).delete();

      res.status(200).json({ success: true, message: "產品刪除成功" });
    } catch (error) {
      console.error("刪除產品失敗：", error);
      res.status(500).json({ success: false, error: "產品刪除失敗" });
    }
  });
});
