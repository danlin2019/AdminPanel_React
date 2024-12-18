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
 * 用於分頁讀取產品列表，支援游標分頁，並返回當前頁數、總頁數與產品資料。
 * 
 * @method GET
 * @endpoint /getProductList
 * 
 * @param {number} req.query.pageSize - 每頁顯示的產品數量，預設為 10。
 * @param {number} req.query.page - 當前的頁數，預設為第 1 頁。
 * @param {string} [req.query.startAfter] - 上一頁最後一筆資料的 ID，用於游標分頁。
 * 
 */

/**
 * limit：用於限制每次查詢返回的筆數。
 * startAfter：設定從指定 document 後開始查詢，用來跳到下一頁。
 */

exports.getProductList = onRequest((req, res) => {
  corsMiddleware(req, res, async () => {
    try {
      if (req.method !== "GET") {
        return res.status(405).send({ success: false, message: "方法不被允許" });
      }

      const pageSize = parseInt(req.query.pageSize) || 10; // 每頁筆數，預設 10 筆
      const page = parseInt(req.query.page) || 1; // 當前頁數，預設第 1 頁
      const startAfterDoc = req.query.startAfter || null; // 游標，從這個 Document 後開始

      // Step 1: 計算總筆數
      const totalSnapshot = await db.collection("productList").count().get();
      const totalProducts = totalSnapshot.data().count;
      const totalPages = Math.ceil(totalProducts / pageSize);

      // Step 2: 構建查詢
      let query = db.collection("productList").orderBy("createdAt").limit(pageSize);

      if (startAfterDoc) {
        const lastDocSnapshot = await db.collection("productList").doc(startAfterDoc).get();
        if (lastDocSnapshot.exists) {
          query = query.startAfter(lastDocSnapshot);
        } else {
          console.warn("游標未找到，返回第一頁");
        }
      }

      // Step 3: 查詢分頁資料
      const snapshot = await query.get();
      const products = [];
      let lastDocId = null;

      snapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() });
        lastDocId = doc.id; // 記錄最後一筆的 Document ID
      });

      // Step 4: 回應資料
      res.status(200).json({
        success: true,
        products,
        pagination: {
          currentPage: page,
          pageSize: pageSize,
          totalPages: totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
          lastDocId: lastDocId, // 游標分頁的游標
        },
      });
    } catch (error) {
      console.error("讀取產品列表失敗：", error.message);
      res.status(500).json({ success: false, error: "讀取產品列表失敗，請稍後再試" });
    }
  });
});

/**
 * 取得所有產品列表
 * 用於分頁顯示產品資料
 * @method GET
 * @endpoint /allProducts
 */
exports.allProducts = onRequest((req, res) => {
  corsMiddleware(req, res, async () => {
    try {
      if (req.method !== "GET") {
        return res.status(405).send({ success: false, message: "方法不被允許" });
      }

      const snapshot = await db.collection("productList").orderBy("createdAt", "desc").get();
      const products = [];
      snapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() });
      });

      const totalProducts = products.length;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const page = parseInt(req.query.page) || 1;
      const totalPages = Math.ceil(totalProducts / pageSize);

      const startIndex = (page - 1) * pageSize;
      const paginatedProducts = products.slice(startIndex, startIndex + pageSize);

      res.status(200).json({
        success: true,
        products: paginatedProducts,
        pagination: {
          totalProducts,
          pageSize,
          currentPage: page,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      });
    } catch (error) {
      console.error("獲取所有產品失敗：", error.message);
      res.status(500).json({ success: false, error: "獲取所有產品失敗，請稍後再試" });
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
