let db;

// Initialize the database
function initDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("spacetradersData", 1);

    request.onupgradeneeded = function (e) {
      db = e.target.result;
      if (!db.objectStoreNames.contains("systems")) {
        db.createObjectStore("systems", { keyPath: "symbol" });
      }
    };

    request.onsuccess = function (e) {
      db = e.target.result;
      resolve(db);
    };

    request.onerror = function (e) {
      console.error("Error opening database:", e);
      reject(e);
    };
  });
}

async function ensureDatabaseInitialized() {
  if (!db) {
    await initDatabase();
  }
}

// Save data to the database
function saveToDatabase(data) {
  const transaction = db.transaction(["systems"], "readwrite");
  const store = transaction.objectStore("systems");
  data.forEach((item) => {
    store.put(item);
  });
}

// Call this function when you want to save data
export async function storeData(data) {
  await ensureDatabaseInitialized();
  saveToDatabase(data);
}

export async function fetchAllSystems() {
  await ensureDatabaseInitialized();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["systems"], "readonly");
    const store = transaction.objectStore("systems");

    const systems = [];
    const request = store.openCursor();
    request.onsuccess = function (e) {
      const cursor = e.target.result;
      if (cursor) {
        systems.push(cursor.value);
        cursor.continue();
      } else {
        resolve(systems);
      }
    };

    request.onerror = function (e) {
      reject("Error fetching all systems: " + e.target.errorCode);
    };
  });
}

export async function fetchSystemBySymbol(symbol) {
  await ensureDatabaseInitialized();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["systems"], "readonly");
    const store = transaction.objectStore("systems");
    const request = store.get(symbol);

    request.onsuccess = function (e) {
      resolve(e.target.result);
    };

    request.onerror = function (e) {
      reject("Error fetching system by symbol: " + e.target.errorCode);
    };
  });
}

export async function fetchSystemsByCondition(conditionFn) {
  await ensureDatabaseInitialized();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["systems"], "readonly");
    const store = transaction.objectStore("systems");

    const systems = [];
    const request = store.openCursor();
    request.onsuccess = function (e) {
      const cursor = e.target.result;
      if (cursor) {
        if (conditionFn(cursor.value)) {
          systems.push(cursor.value);
        }
        cursor.continue();
      } else {
        resolve(systems);
      }
    };

    request.onerror = function (e) {
      reject("Error fetching systems by condition: " + e.target.errorCode);
    };
  });
}
