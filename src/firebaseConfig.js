// Firebase Configuration connected to teatime-7dc11

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, update, remove, get } from 'firebase/database';

const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyBWeOAdamBxbOBpDEy_p2p7ifKrdZZjeFQ",
  authDomain: "teatime-7dc11.firebaseapp.com",
  databaseURL: "https://teatime-7dc11-default-rtdb.firebaseio.com",
  projectId: "teatime-7dc11",
  storageBucket: "teatime-7dc11.firebasestorage.app",
  messagingSenderId: "755888765022",
  appId: "1:755888765022:web:c35385254cc4438b2f9ccf",
  measurementId: "G-XN6HJ1F689"
};

let db = null;
let isUsingFirebase = false;

// Check if user saved custom config in localStorage
const savedConfig = localStorage.getItem('cup_of_tea_firebase_config');
let activeConfig = DEFAULT_FIREBASE_CONFIG;

if (savedConfig) {
  try {
    activeConfig = { ...DEFAULT_FIREBASE_CONFIG, ...JSON.parse(savedConfig) };
  } catch (e) {
    console.error("Failed to parse saved config");
  }
}

if (activeConfig.apiKey && activeConfig.databaseURL) {
  try {
    const app = initializeApp(activeConfig);
    db = getDatabase(app);
    isUsingFirebase = true;
    console.log("Connected to Firebase Realtime Database!");
  } catch (e) {
    console.warn("Firebase init failed, falling back to local multi-tab sync:", e);
  }
}

// Local multi-tab synchronization channel (fallback if offline)
const localChannel = new BroadcastChannel('cup_of_tea_local_sync');
const localStore = {};

export function saveFirebaseConfig(configObj) {
  localStorage.setItem('cup_of_tea_firebase_config', JSON.stringify(configObj));
  window.location.reload();
}

export function isFirebaseActive() {
  return isUsingFirebase;
}

// Universal database sync wrapper
export const DB = {
  set: async (path, data) => {
    if (isUsingFirebase && db) {
      await set(ref(db, path), data);
    } else {
      localStore[path] = JSON.parse(JSON.stringify(data));
      localStorage.setItem('cot_store_' + path, JSON.stringify(data));
      localChannel.postMessage({ type: 'UPDATE', path, data });
    }
  },

  remove: async (path) => {
    if (isUsingFirebase && db) {
      await remove(ref(db, path));
    } else {
      delete localStore[path];
      localStorage.removeItem('cot_store_' + path);
      localChannel.postMessage({ type: 'UPDATE', path, data: null });
    }
  },

  update: async (path, data) => {
    if (isUsingFirebase && db) {
      await update(ref(db, path), data);
    } else {
      const existing = localStore[path] || JSON.parse(localStorage.getItem('cot_store_' + path) || '{}');
      const updated = { ...existing, ...data };
      localStore[path] = updated;
      localStorage.setItem('cot_store_' + path, JSON.stringify(updated));
      localChannel.postMessage({ type: 'UPDATE', path, data: updated });
    }
  },

  get: async (path) => {
    if (isUsingFirebase && db) {
      const snapshot = await get(ref(db, path));
      return snapshot.val();
    } else {
      return localStore[path] || JSON.parse(localStorage.getItem('cot_store_' + path) || 'null');
    }
  },

  listen: (path, callback) => {
    if (isUsingFirebase && db) {
      const dbRef = ref(db, path);
      onValue(dbRef, (snapshot) => {
        callback(snapshot.val());
      });
    } else {
      const val = localStore[path] || JSON.parse(localStorage.getItem('cot_store_' + path) || 'null');
      callback(val);
      
      localChannel.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'UPDATE' && event.data.path === path) {
          localStore[path] = event.data.data;
          callback(event.data.data);
        }
      });
      
      window.addEventListener('storage', (e) => {
        if (e.key === 'cot_store_' + path) {
          const updated = JSON.parse(e.newValue || 'null');
          localStore[path] = updated;
          callback(updated);
        }
      });
    }
  }
};
