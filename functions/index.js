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


/**
 * 新增產品 API（後台）
 * 用於分頁顯示產品資料
 * @method POST
 * @endpoint /addProduct
 */
exports.addProduct = onRequest((req, res) => {
  corsMiddleware(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send({ message: "新增產品-方法不被允許" });
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
 * 取得所有產品列表（後台）
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
      const pageSize = parseInt(req.query.pageSize) || 12;
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
 * 編輯產品 API（後台）
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
 * 刪除產品 API（後台）
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

/**
 * 取得訂單列表（後台）
 * 用於分頁顯示產品資料
 * @method GET
 * @endpoint /getOrderList
 */
exports.getOrderList = onRequest((req, res) => {
  corsMiddleware(req, res, async () => {
    try {
      if (req.method !== "GET") {
        return res.status(405).send({ success: false, message: "方法不被允許" });
      }

      // 取得 Firestore 中的訂單資料，按建立時間排序
      const snapshot = await db.collection("orders").orderBy("createdAt", "desc").get();
      const orders = [];
      snapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() });
      });

      // 分頁處理
      const totalOrders = orders.length;
      const pageSize = parseInt(req.query.pageSize) || 12; // 每頁顯示數量
      const page = parseInt(req.query.page) || 1; // 當前頁碼
      const totalPages = Math.ceil(totalOrders / pageSize); // 總頁數

      const startIndex = (page - 1) * pageSize; // 當前頁起始索引
      const paginatedOrders = orders.slice(startIndex, startIndex + pageSize); // 當前頁的資料

      // 回應資料
      res.status(200).json({
        success: true,
        orders: paginatedOrders,
        pagination: {
          totalOrders,
          pageSize,
          currentPage: page,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      });
    } catch (error) {
      console.error("獲取訂單列表失敗：", error.message);
      res.status(500).json({ success: false, error: "獲取訂單列表失敗，請稍後再試" });
    }
  });
});


/**
 * 取得單一訂單資料（後台）
 * @method GET
 * @endpoint /getOrder/:id
 */
exports.getOrder = onRequest((req, res) => {
  corsMiddleware(req, res, async () => {
    try {
      if (req.method !== "GET") {
        return res.status(405).send({ success: false, message: "方法不被允許" });
      }

      const orderId = req.query.id; // 從路徑參數中取得訂單 ID
      if (!orderId) {
        return res.status(400).send({ success: false, message: "缺少訂單 ID" });
      }

      const doc = await db.collection("orders").doc(orderId).get();
      if (!doc.exists) {
        return res.status(404).json({ success: false, message: "訂單不存在" });
      }

      // 回應單一訂單資料
      res.status(200).json({ success: true, order: { id: doc.id, ...doc.data() } });
    } catch (error) {
      console.error("獲取訂單失敗：", error.message);
      res.status(500).json({ success: false, error: "獲取訂單失敗，請稍後再試" });
    }
  });
});

/**
 * 更新訂單 API（後台）
 * 用於更新訂單狀態或其他屬性
 * @method PUT
 * @endpoint /updateOrder
 */
exports.updateOrder = onRequest((req, res) => {
  corsMiddleware(req, res, async () => {
    if (req.method !== "PUT") {
      return res.status(405).json({ success: false, message: "方法不被允許" });
    }

    const { orderId, updates } = req.body;

    if (!orderId || !updates) {
      return res.status(400).json({ success: false, message: "缺少訂單 ID 或更新資料" });
    }

    try {
      // 更新 Firestore 中的訂單
      await db.collection("orders").doc(orderId).update(updates);

      res.status(200).json({ success: true, message: "訂單已成功更新" });
    } catch (error) {
      console.error("更新訂單失敗：", error);
      res.status(500).json({ success: false, error: "更新訂單失敗，請稍後再試" });
    }
  });
});

/**
 * 刪除訂單 API(後台)
 * 用於刪除選擇的產品項目
 * @method DELETE
 * @endpoint /deleteOrder
 */
exports.deleteOrder = onRequest((req, res) => {
  corsMiddleware(req, res, async () => {
    if (req.method !== "DELETE") {
      return res.status(405).json({ success: false, message: "方法不被允許" });
    }

    const orderId = req.query?.id;

    if (!orderId) {
      return res.status(400).json({ success: false, message: "缺少訂單 ID" });
    }

    try {
      // 刪除 Firestore 中的訂單
      await db.collection("orders").doc(orderId).delete();

      res.status(200).json({ success: true, message: "訂單已成功刪除" });
    } catch (error) {
      console.error("刪除訂單失敗：", error);
      res.status(500).json({ success: false, error: "刪除訂單失敗，請稍後再試" });
    }
  });
});

/** 
 * 前台建立訂單 產品詳細頁 購物車 
*/

/**
 * 建立訂單 API （前台）
 * @method POST
 * @endpoint /createOrder
 */
exports.createOrder = onRequest((req, res) => {
  corsMiddleware(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).json({ success: false, message: "createOrder 方法不被允許" });
    }

    const order = req.body;

    if (!order.name || !order.email) {
      return res.status(400).json({ success: false, message: "缺少必要的訂單信息" });
    }

    try {
      const newOrder = await db.collection("orders").add({
        ...order,
        status: "pending", // 訂單默認狀態
        createdAt: admin.firestore.Timestamp.now(),
      });

      res.status(201).json({
        success: true,
        id: newOrder.id,
        message: "訂單建立成功",
      });
    } catch (error) {
      console.error("建立訂單失敗：", error);
      res.status(500).json({ success: false, error: "伺服器錯誤" });
    }
  });
});

/**
 * 根據產品 ID 取得單一產品資料 （前台)
 * @method GET
 * @param {string} req.query.id - 產品的唯一 ID
 * @returns {Object} 回傳該產品的詳細資訊
 * @endpoint /getProductById
 */
exports.getProductById = onRequest((req, res) => {
  corsMiddleware(req, res, async () => {
    try {
      if (req.method !== "GET") {
        return res.status(405).json({ success: false, message: "方法不被允許" });
      }

      const productId = req.query.id; // 獲取請求的產品 ID
      if (!productId) {
        return res.status(400).json({ success: false, message: "缺少產品 ID" });
      }

      const productDoc = await db.collection("productList").doc(productId).get();

      if (!productDoc.exists) {
        return res.status(404).json({ success: false, message: "產品不存在" });
      }

      const product = { id: productDoc.id, ...productDoc.data() };

      res.status(200).json({ success: true, product });
    } catch (error) {
      console.error("獲取產品失敗：", error.message);
      res.status(500).json({ success: false, message: "伺服器錯誤" });
    }
  });
});