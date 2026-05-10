import React, { useState, useMemo, useEffect } from "react";
import {
  ShoppingBag,
  Package,
  FileText,
  Trash2,
  Search,
  AlertCircle,
  CheckCircle2,
  Clock,
  Receipt,
  Printer,
  X,
  Edit3,
  Save,
  Calculator,
  ChevronUp,
  MapPin,
  Store,
  PlusCircle,
  Download,
  Calendar,
  User,
  LogOut,
  Eye,
  EyeOff,
  ShieldCheck,
  Lock,
  Users,
  UserPlus,
  Filter,
  Building,
} from "lucide-react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

// --- SETUP FIREBASE (CLOUD STORAGE) ---
const getFirebaseConfig = () => {
  if (typeof __firebase_config !== "undefined") {
    return JSON.parse(__firebase_config);
  }
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };
};

const firebaseConfig = getFirebaseConfig();
const isConfigValid =
  firebaseConfig.apiKey && firebaseConfig.apiKey !== "ISI_API_KEY_ANDA";

const app = isConfigValid ? initializeApp(firebaseConfig) : null;
const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;
const appId = typeof __app_id !== "undefined" ? __app_id : "takopos-cloud";

// --- DATA AWAL (MOCK DATABASE) ---

const INITIAL_BRANCHES = [
  { id: "br_01", name: "Randuagung" },
  { id: "br_02", name: "Pasar Randuagung" },
  { id: "br_03", name: "Tunjung" },
  { id: "br_04", name: "Jatiroto" },
  { id: "br_05", name: "Sumber Baru" },
];

const INITIAL_USERS = [
  {
    id: 1,
    username: "admin",
    password: "admin",
    name: "Bpk. Pemilik",
    role: "Owner",
    branchId: "all",
  },
  {
    id: 2,
    username: "kasir_rda",
    password: "123",
    name: "Kasir Randuagung",
    role: "Kasir",
    branchId: "br_01",
  },
  {
    id: 3,
    username: "kasir_tunjung",
    password: "123",
    name: "Kasir Tunjung",
    role: "Kasir",
    branchId: "br_03",
  },
];

const rdaData = [
  "CIA DJI SAM SOE|234",
  "DJI SAM SOE|234 SEDANG",
  "HARUM MANIS|CIAA RASA",
  "ISTIMEWA SUPER TOP|SUPER",
  "KREPEK SITUBONDO|KREPEK",
  "NYEGRAK|TOP RASA",
  "NYEGRAK|MOJO RASA",
  "NYEGRAK HALUS|HM",
  "PAITON|PUTIANN",
  "RASA CIA|L.A",
  "RASA CIA|K",
  "RASA CIA|MADURA",
  "RASA CIA|SURYA PUTRA",
  "RASA CIA HARUM|DJARUM",
  "RASA CIA SUPER|M",
  "RASA CIA SUPER|M12",
  "RASA CIA SUPER|L",
  "RASA GUDANG GARAM|CIA",
  "RASA HARUM MANIS|DJ",
  "RASA LEMAK KALEM|TR",
  "RASA LEMAK KALEM|TOP",
  "RASA LEMAK MANIS|AC",
  "RASA LEMAK MANIS|KING",
  "RASA LEMAK NYEGRAK|TOP BLACK",
  "RASA LEMAK SEDANG|J1",
  "RASA LEMAK TARIK|GA",
  "RASA NYEGRAK|D",
  "RASA NYEGRAK|SUPER ISTIMEWA",
  "RASA NYEGRAK|ISTIMEWA",
  "RASA NYEGRAK|SPESIAL",
  "RASA NYEGRAK HALUS|HG",
  "RASA NYEGRAK HALUS|GM",
  "RASA NYEGRAK KALEM|B3",
  "RASA NYEGRAK KALEM|R2",
  "RASA NYEGRAK KALEM|NK",
  "RASA NYEGRAK SANTAI|MK",
  "RASA NYEGRAK SUPER|C",
  "RASA NYEGRAK SUPER|A1",
  "RASA NYEGRAK SUPER|A4",
  "RASA SEDANG|PRIMA",
  "RASA SEDANG|TOP 01",
  "RASA SEDANG|N1 SURYA",
  "RASA SEDANG|F",
  "RASA SEDANG|H",
  "RASA SEDANG|SEDAP",
  "RASA SEDANG|SP",
  "RASA SEDANG|N",
  "RASA SEDANG|DE",
  "RASA SEDANG|MOJO",
  "RASA SEDANG|H1",
  "RASA SEDANG|N1",
  "RASA SEDANG|N12",
  "RASA SEDANG|PREMIUM",
  "RASA SEDANG|GT",
  "RASA SEDANG ANTEP|BM",
  "RASA SEDANG HALUS|NU",
  "RASA SEDANG HALUS|TOP ONE",
  "RASA SEDANG HALUS|R",
  "RASA SEDANG HALUS|KM",
  "RASA SEDANG HALUS|B4",
  "RASA SEDANG KALEM|MANTAB",
  "RASA SEDANG SUPER|F1",
  "RASA SEDANG SUPER|AL",
  "RASA SEDANG SUPER|B1",
  "RASA SEDANG SUPER|G",
  "RASA SEDANG TARIK|NA",
  "RASA SURYA|SEDANG",
  "SEDANG|GOLD",
  "SUPER CIA|TURBO",
  "SUPER CIA 2 THN|RADJA",
  "SUPER CIA 3 THN|INTER",
  "SUPER CIA 3 THN|CLASS",
  "SUPER CIA 3 THN|MASTER",
  "SUPER JOSS LEMAK|JOSS",
  "SUPER PREMIUM|A",
  "SUPER PREMIUM|B",
  "SURYA NUSANTARA|CIA RASA",
];
const tunjungData = [
  "CIA|MOJO RASA",
  "CIA MANIS|Z",
  "FULL NYEGRAK|ISTIMEWA",
  "LEMAK HARUM|AC",
  "MARLBORO|PUTIAN RASA",
  "MOJO RASA CIA|MOJO CIA",
  "RASA CIA|L.A",
  "RASA CIA|V",
  "RASA CIA|W1",
  "RASA CIA HARUM|V1",
  "RASA CIA MANIS|CM",
  "RASA CIA TARIK|M",
  "RASA CIA TARIK|W",
  "RASA CIA TARIK|N1",
  "RASA COUNTRY|PUTIAN",
  "RASA FULL CIA|S",
  "RASA FULL NYEGRAK|A1",
  "RASA FULL NYEGRAK|B",
  "RASA FULL SEDANG|G",
  "RASA FULL SEDANG|B1",
  "RASA HARUM MANIS|G1",
  "RASA HARUM MANIS|K",
  "RASA KALEM|P1",
  "RASA LEMAK|TOP ONE",
  "RASA LEMAK KALEM|TR",
  "RASA LEMAK SEDANG|E1",
  "RASA NYEGRAK|HG",
  "RASA NYEGRAK SANTAI|A2",
  "RASA NYEGRAK SUPER|GA",
  "RASA NYEGRAK SUPER MANTAB|SD",
  "RASA SEADANG KALEM|SP",
  "RASA SEDANG|FB",
  "RASA SEDANG|K1",
  "RASA SEDANG|TOP",
  "RASA SEDANG|H",
  "RASA SEDANG|NA",
  "RASA SEDANG|C1",
  "RASA SEDANG|MOJO",
  "RASA SEDANG|R",
  "RASA SEDANG|JP",
  "RASA SEDANG|N2",
  "RASA SEDANG|M1",
  "RASA SEDANG|R1",
  "RASA SEDANG|TM",
  "RASA SEDANG|BM",
  "RASA SEDANG|WA",
  "RASA SEDANG|L",
  "RASA SEDANG|L1",
  "RASA SEDANG ANTEP|F1",
  "RASA SEDANG HALUS|D",
  "RASA SEDANG HALUS|J1",
  "RASA SEDANG HALUS|RM",
  "RASA SEDANG HALUS|NU",
  "RASA SEDANG HARUM|N",
  "RASA SEDANG KALEM|C",
  "RASA SEDANG KALEM|H1",
  "RASA SEDANG KALEM|GT",
  "RASA SEDANG KALEM|HM",
  "RASA SEDANG SUPER|KING",
  "RASA SEDANG SUPER|E",
  "RASA SEDANG SUPER|P",
  "RASA SEDANG TARIK|F",
  "RASA SEDANG TARIK|J",
  "RASA SEDANG TARIK|D1",
  "RASA SURYA NUSANTARA|CIA",
  "SAMPOERNA|CIA RASA",
  "SITUBONDO|KREPEK",
  "SUPER LAJUH|TOP 02",
  "SUPER PREMIUM|A",
];
const jatirotoData = [
  "BEKOH MADURA|MUJIB",
  "BEKON MAT JEK I|BAKO",
  "BESUKI|PUTIAN",
  "CIA PREMIUM|GT",
  "CIA SUPER|E",
  "CIA SURYA|LOS",
  "KING MASTER|MASTER",
  "KUNING KAYU MAS|KAYU MAS",
  "MADURA RASA SEDANG|MDR",
  "MOJO RASA CIA|MOJO CIA",
  "NYEGRAK HALUS|HM",
  "NYEGRAK PAS|AS",
  "PAITON|PUTIANN",
  "RASA CIA|MADURA",
  "RASA CIA HALUS|PR",
  "RASA CIA ORIGINAL|MT",
  "RASA CIA SUPER|M",
  "RASA CIA TARIK|M12",
  "RASA HALUS MANIS|N",
  "RASA LEMAK|TOP 01",
  "RASA LEMAK HALUS|AM",
  "RASA LEMAK KALEM|AC",
  "RASA LEMAK KALEM|TR",
  "RASA LEMAK LOS|L.A",
  "RASA LEMAK SEDANG|B1",
  "RASA LEMAK TARIK|A1",
  "RASA LEMAK TARIK|B2",
  "RASA NUSANTARA|CIAA",
  "RASA NYEGRAK|MK",
  "RASA NYEGRAK|R2",
  "RASA NYEGRAK|TOP FULL",
  "RASA NYEGRAK|Y",
  "RASA NYEGRAK HALUS|GA",
  "RASA NYEGRAK HALUS|C",
  "RASA NYEGRAK KALEM|D1",
  "RASA NYEGRAK KALEM|G1",
  "RASA NYEGRAK KALEM|B3",
  "RASA NYEGRAK KALEM|E1",
  "RASA NYEGRAK SANTAI|B",
  "RASA NYEGRAK SUPER|X",
  "RASA SEDANG|TOP PAS",
  "RASA SEDANG|D",
  "RASA SEDANG|F",
  "RASA SEDANG|V",
  "RASA SEDANG|TOP ONE",
  "RASA SEDANG|MOJO",
  "RASA SEDANG HALUS|H",
  "RASA SEDANG HALUS|NU",
  "RASA SEDANG MANTAP|J1",
  "RASA SEDANG SUPER|KING",
  "RASA SEDANG TARIK|HG",
  "RASA SEDANG TARIK|Z",
  "RASA SEDANG TRAIK|NK",
  "RASA SURYA|CIA",
  "SITUBONDO|KREPEK",
  "SUPER PREMIUM|A",
];
const sumberbaruData = [
  "CIA HARUM|R2",
  "CIA HARUM|D7",
  "CIA HARUM|MK",
  "CIA HARUM MANIS|N WR",
  "CIA HARUM MANIS|P WR",
  "CIA HARUM MANIS|R WR",
  "CIA HARUM MANIS|S WR",
  "CIA HARUM MANIS|T",
  "CIA LOSS|ST",
  "CIA MANIS|CM",
  "LEMAK KALEM|AC",
  "LEMAK MANIS|DS",
  "LEMAK MANIS|TOP 2",
  "NYEGRAK HALUS|HM",
  "NYEGRAK KALEM|GA",
  "NYEGRAK SUPER|A1",
  "NYEGRAK SUPER|TOP 1",
  "PREMIUM|SUPER",
  "PUTIAN BESUKI SEDANG|A BES",
  "PUTIAN CIA HARUM|T WR",
  "PUTIAN CIA HARUM|V WR",
  "PUTIAN KREPEK|A KRE",
  "PUTIAN PAITON SEDANG|A PA",
  "PUTIAN WRINGIN|A WR",
  "PUTIAN WRINGIN|B WR",
  "PUTIAN WRINGIN|C WR",
  "PUTIAN WRINGIN|D WR",
  "PUTIAN WRINGIN CIA|E WR",
  "PUTIAN WRINGIN CIA|F WR",
  "PUTIAN WRINGIN CIA|G WR",
  "PUTIAN WRINGIN CIA|H WR",
  "PUTIAN WRINGIN CIA|E1 WR",
  "PUTIAN WRINGIN CIA|F1 WR",
  "PUTIAN WRINGIN CIA|G1 WR",
  "PUTIAN WRINGIN CIA|H1 WR",
  "PUTIAN WRINGIN CIA LOS|J1 WR",
  "PUTIAN WRINGIN CIA LOS|K1 WR",
  "PUTIAN WRINGIN CIA LOS|L1 WR",
  "PUTIAN WRINGIN CIA LOS|M1 WR",
  "PUTIAN WRINGIN CIA LOS|J WR",
  "PUTIAN WRINGIN CIA LOS|K WR",
  "PUTIAN WRINGIN CIA LOS|L WR",
  "PUTIAN WRINGIN CIA LOS|M WR",
  "PUTIAN WRINGIN SEDANG|A1 WR",
  "PUTIAN WRINGIN SEDANG|B1 WR",
  "PUTIAN WRINGIN SEDANG|C1 WR",
  "PUTIAN WRINGIN SEDANG|D1 WR",
  "RASA CIA|E",
  "RASA CIA|LA",
  "RASA CIA|ZA",
  "RASA CIA HARUM|DJARUM",
  "RASA CIA HARUM|SAMPOERNA",
  "RASA CIA LOS|W1",
  "RASA CIA LOSS|JF",
  "RASA CIA TARIK|SP",
  "RASA CIA TARIK|NA",
  "RASA GUDANG GARAM|GG",
  "RASA HARUM MANIS|DK",
  "RASA LEMAK|SEDAP",
  "RASA LEMAK HARUM|AE",
  "RASA LEMAK KALEM|TR",
  "RASA LEMAK MANIS|SR",
  "RASA LEMAK MANIS|C",
  "RASA LEMAK TARIK|DA",
  "RASA NUSANTARA|CIAA",
  "RASA NYEGRAK KALEM|B",
  "RASA RASA CIA TARIK|W",
  "RASA SEDANG|TOP PAS",
  "RASA SEDANG|F",
  "RASA SEDANG|V",
  "RASA SEDANG|TOP ONE",
  "RASA SEDANG|JP",
  "RASA SEDANG|GT",
  "RASA SEDANG|N1",
  "RASA SEDANG|FB",
  "RASA SEDANG|MANTAB",
  "RASA SEDANG|TOP",
  "RASA SEDANG|G",
  "RASA SEDANG|H",
  "RASA SEDANG HALUS|KM",
  "RASA SEDANG HALUS|NU",
  "RASA SEDANG HALUS|HR",
  "RASA SEDANG HALUS|YS",
  "RASA SEDANG HALUS|PR",
  "RASA SEDANG HALUS|GP",
  "RASA SEDANG HARUM|DJ",
  "RASA SEDANG KALEM|N",
  "RASA SEDANG KALEM|B1",
  "RASA SEDANG TARIK|BM",
  "RASA SEDANG TARIK|D",
  "RASA SEDANG TARIK|D1",
  "RASA SUPER PREMIUM|GOLD",
  "RASA SUPER PREMIUM|INTER",
  "RASA SURYA|CIA",
  "SEDANG|TOP SUPER",
  "SEDANG HALUS|PG",
  "SEDANG TARIK|A2",
  "SUPER PREMIUM|CLASS",
  "SUPER PREMIUM|TURBO",
];

const generateInitialInventory = () => {
  let inventory = [];
  let idCounter = 1;

  const addItems = (branchId, itemsArr) => {
    itemsArr.forEach((itemStr) => {
      const [name, code] = itemStr.split("|");
      // Harga dan Stok Dibuat Random
      const cost = Math.floor(Math.random() * 8 + 5) * 10; // Modal 50 s.d 120
      const price = cost + Math.floor(Math.random() * 5 + 3) * 10; // Jual modal + 30 s.d 70
      const stock = Math.floor(Math.random() * 90 + 10) * 100; // Stok 1000 s.d 10000 gr

      inventory.push({
        id: idCounter++,
        name: name,
        itemCode: code,
        pricePerGram: price,
        costPerGram: cost,
        stockGrams: stock,
        category: "Tembakau Racikan",
        isPiece: false,
        branchId: branchId,
      });
    });
  };

  addItems("br_01", rdaData); // Randuagung
  addItems("br_02", sumberbaruData); // Pasar Randuagung disamakan dengan Sumber Baru
  addItems("br_03", tunjungData); // Tunjung
  addItems("br_04", jatirotoData); // Jatiroto
  addItems("br_05", sumberbaruData); // Sumber Baru

  return inventory;
};

const INITIAL_INVENTORY = generateInitialInventory();

// --- HELPER FUNCTIONS ---
const formatRp = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatWeight = (grams, isPiece) => {
  if (isPiece) return `${grams} pcs`;
  if (grams >= 1000) return `${(grams / 1000).toFixed(2)} kg`;
  return `${grams} gr`;
};

// --- MAIN APPLICATION COMPONENT ---
export default function App() {
  // FIREBASE STATE
  const [fbUser, setFbUser] = useState(null);

  // AUTH STATE
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("tako_users");
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("tako_currentUser");
    return saved ? JSON.parse(saved) : null;
  });

  // MAIN APP STATE
  const [activeTab, setActiveTab] = useState("pos");
  const [activeBranch, setActiveBranch] = useState("all");
  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem("tako_inventory");
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });
  const [cart, setCart] = useState([]);
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("tako_transactions");
    return saved ? JSON.parse(saved) : [];
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [branches, setBranches] = useState(() => {
    const saved = localStorage.getItem("tako_branches");
    return saved ? JSON.parse(saved) : INITIAL_BRANCHES;
  });

  // UI & MODALS STATE
  const [toast, setToast] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [weightInput, setWeightInput] = useState("");
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const [checkoutModal, setCheckoutModal] = useState(false);
  const [cashInput, setCashInput] = useState("");
  const [receiptModal, setReceiptModal] = useState(null);
  const [dailyReportModal, setDailyReportModal] = useState(false);

  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [confirmDeleteTransactionId, setConfirmDeleteTransactionId] =
    useState(null);

  // PROFILE, TEAM, & BRANCH MANAGEMENT STATE
  const [profileModal, setProfileModal] = useState(false);
  const [profileTab, setProfileTab] = useState("security"); // 'security', 'team', 'branches'
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    name: "",
    role: "Kasir",
    branchId: branches[0]?.id || "",
  });
  const [isAddingBranch, setIsAddingBranch] = useState(false);
  const [newBranchName, setNewBranchName] = useState("");

  // FILTER LAPORAN STATE
  const [filterMode, setFilterMode] = useState("month");
  const [selectedFilterValue, setSelectedFilterValue] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  const handleFilterModeChange = (mode) => {
    setFilterMode(mode);
    const d = new Date();
    if (mode === "day")
      setSelectedFilterValue(
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
      );
    else if (mode === "month")
      setSelectedFilterValue(
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      );
    else if (mode === "year") setSelectedFilterValue(`${d.getFullYear()}`);
  };

  const getBranchName = (branchId) => {
    if (branchId === "all") return "Semua Cabang";
    const branch = branches.find((b) => b.id === branchId);
    return branch ? branch.name : "Tidak Diketahui";
  };

  // --- LOCAL STORAGE EFFECTS ---
  useEffect(() => {
    localStorage.setItem("tako_users", JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    localStorage.setItem("tako_inventory", JSON.stringify(inventory));
  }, [inventory]);
  useEffect(() => {
    localStorage.setItem("tako_transactions", JSON.stringify(transactions));
  }, [transactions]);
  useEffect(() => {
    localStorage.setItem("tako_branches", JSON.stringify(branches));
  }, [branches]);
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("tako_currentUser", JSON.stringify(currentUser));
      if (currentUser.role === "Owner" && activeBranch === "all") {
        // Biarkan 'all' jika Owner
      } else {
        setActiveBranch(currentUser.branchId);
      }
    } else {
      localStorage.removeItem("tako_currentUser");
    }
  }, [currentUser]);

  // --- FIREBASE CLOUD EFFECTS ---
  useEffect(() => {
    if (!auth) return;
    const initAuth = async () => {
      try {
        if (
          typeof __initial_auth_token !== "undefined" &&
          __initial_auth_token
        ) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Firebase Auth Error:", error);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setFbUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!fbUser || !db) return;

    const unsubUsers = onSnapshot(
      collection(db, "artifacts", appId, "public", "data", "appUsers"),
      (snapshot) => {
        if (!snapshot.empty) setUsers(snapshot.docs.map((doc) => doc.data()));
        else
          INITIAL_USERS.forEach((u) =>
            setDoc(
              doc(
                db,
                "artifacts",
                appId,
                "public",
                "data",
                "appUsers",
                String(u.id),
              ),
              u,
            ),
          );
      },
      (err) => console.error("Sync Error:", err),
    );

    const unsubInv = onSnapshot(
      collection(db, "artifacts", appId, "public", "data", "inventory"),
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudData = snapshot.docs.map((doc) => doc.data());
          setInventory(cloudData);

          // --- SKRIP AUTO SEED / FORCE UPLOAD ---
          // Jika data di awan hanya berisi data uji coba yang lama (< 50 barang)
          // secara otomatis paksa upload ratusan data INITIAL_INVENTORY yang baru.
          if (cloudData.length < 50 && INITIAL_INVENTORY.length > 300) {
            console.log(
              "Mendeteksi sisa data lama. Mengunggah data master baru ke Cloud...",
            );
            INITIAL_INVENTORY.forEach((inv) => {
              setDoc(
                doc(
                  db,
                  "artifacts",
                  appId,
                  "public",
                  "data",
                  "inventory",
                  String(inv.id),
                ),
                inv,
              );
            });
          }
        } else {
          INITIAL_INVENTORY.forEach((inv) =>
            setDoc(
              doc(
                db,
                "artifacts",
                appId,
                "public",
                "data",
                "inventory",
                String(inv.id),
              ),
              inv,
            ),
          );
        }
      },
      (err) => console.error("Sync Error:", err),
    );

    const unsubTrx = onSnapshot(
      collection(db, "artifacts", appId, "public", "data", "transactions"),
      (snapshot) => {
        const trxs = snapshot.docs.map((doc) => doc.data());
        trxs.sort((a, b) => new Date(b.date) - new Date(a.date));
        setTransactions(trxs);
      },
      (err) => console.error("Sync Error:", err),
    );

    const unsubBranches = onSnapshot(
      collection(db, "artifacts", appId, "public", "data", "branches"),
      (snapshot) => {
        if (!snapshot.empty)
          setBranches(snapshot.docs.map((doc) => doc.data()));
        else
          INITIAL_BRANCHES.forEach((b) =>
            setDoc(
              doc(db, "artifacts", appId, "public", "data", "branches", b.id),
              b,
            ),
          );
      },
      (err) => console.error("Sync Error:", err),
    );

    return () => {
      unsubUsers();
      unsubInv();
      unsubTrx();
      unsubBranches();
    };
  }, [fbUser]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // --- AUTH & USER MANAGEMENT LOGIC ---
  const handleLogin = (username, password) => {
    const user = users.find(
      (u) => u.username === username && u.password === password,
    );
    if (user) {
      setCurrentUser(user);
      if (user.role === "Owner") setActiveBranch("all");
      else {
        setActiveBranch(user.branchId);
        handleFilterModeChange("day");
      }
      setCart([]);
      showToast(`Selamat datang, ${user.name}`);
    } else {
      showToast("Username atau Password salah!", "error");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCart([]);
    setProfileModal(false);
    setActiveTab("pos");
    setProfileTab("security");
    setActiveBranch("all");
  };

  const handleChangePassword = (oldPass, newPass) => {
    if (currentUser.password !== oldPass) {
      showToast("Password lama tidak sesuai!", "error");
      return false;
    }
    const updatedUser = { ...currentUser, password: newPass };
    if (fbUser && db)
      setDoc(
        doc(
          db,
          "artifacts",
          appId,
          "public",
          "data",
          "appUsers",
          String(currentUser.id),
        ),
        updatedUser,
      );
    else
      setUsers((prev) =>
        prev.map((u) => (u.id === currentUser.id ? updatedUser : u)),
      );
    setCurrentUser(updatedUser);
    showToast("Password berhasil diubah!");
    setProfileModal(false);
    return true;
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (
      users.some(
        (u) => u.username.toLowerCase() === newUser.username.toLowerCase(),
      )
    ) {
      showToast("Username sudah terpakai!", "error");
      return;
    }
    if (
      !newUser.name ||
      !newUser.username ||
      !newUser.password ||
      !newUser.branchId
    ) {
      showToast("Mohon lengkapi semua data!", "error");
      return;
    }

    const newUserObj = { ...newUser, id: Date.now() };
    if (fbUser && db)
      setDoc(
        doc(
          db,
          "artifacts",
          appId,
          "public",
          "data",
          "appUsers",
          String(newUserObj.id),
        ),
        newUserObj,
      );
    else setUsers([newUserObj, ...users]);

    setIsAddingUser(false);
    setNewUser({
      username: "",
      password: "",
      name: "",
      role: "Kasir",
      branchId: branches[0]?.id || "",
    });
    showToast(
      `Akun kasir berhasil dibuat untuk ${getBranchName(newUserObj.branchId)}`,
    );
  };

  const handleDeleteUser = (id) => {
    if (id === currentUser.id) {
      showToast("Anda tidak bisa menghapus akun sendiri!", "error");
      return;
    }
    if (fbUser && db)
      deleteDoc(
        doc(db, "artifacts", appId, "public", "data", "appUsers", String(id)),
      );
    else setUsers(users.filter((u) => u.id !== id));
    showToast("Akun karyawan dihapus");
  };

  // --- BRANCH MANAGEMENT LOGIC ---
  const handleCreateBranch = (e) => {
    e.preventDefault();
    if (!newBranchName.trim()) {
      showToast("Nama cabang tidak boleh kosong!", "error");
      return;
    }

    const newBranchId = `br_${Date.now().toString().slice(-4)}`;
    const newBranchObj = { id: newBranchId, name: newBranchName.trim() };

    if (fbUser && db)
      setDoc(
        doc(db, "artifacts", appId, "public", "data", "branches", newBranchId),
        newBranchObj,
      );
    else setBranches([...branches, newBranchObj]);

    setIsAddingBranch(false);
    setNewBranchName("");
    showToast(`Cabang ${newBranchObj.name} berhasil ditambahkan`);
  };

  // --- DATA FILTERING BY BRANCH ---
  const branchInventory = useMemo(() => {
    if (activeBranch === "all") return inventory;
    return inventory.filter((item) => item.branchId === activeBranch);
  }, [inventory, activeBranch]);

  const branchTransactions = useMemo(() => {
    if (activeBranch === "all") return transactions;
    return transactions.filter((trx) => trx.branchId === activeBranch);
  }, [transactions, activeBranch]);

  // --- CART & SEARCH LOGIC ---
  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return branchInventory.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        (p.itemCode && p.itemCode.toLowerCase().includes(query)), // Memungkinkan pencarian dari kode barang
    );
  }, [branchInventory, searchQuery]);

  const cartTotal = useMemo(() => {
    return cart.reduce(
      (total, item) => total + item.pricePerGram * item.weight,
      0,
    );
  }, [cart]);

  const handleOpenAddModal = (product) => {
    if (product.stockGrams <= 0) {
      showToast("Stok habis!", "error");
      return;
    }
    setSelectedProduct(product);
    setWeightInput("");
  };

  const handleAddToCart = () => {
    const weight = parseInt(weightInput);
    if (!weight || weight <= 0) {
      showToast(
        `Masukkan ${selectedProduct.isPiece ? "jumlah" : "berat"} yang valid`,
        "error",
      );
      return;
    }

    const existingCartItem = cart.find(
      (item) => item.id === selectedProduct.id,
    );
    const currentCartWeight = existingCartItem ? existingCartItem.weight : 0;

    if (currentCartWeight + weight > selectedProduct.stockGrams) {
      showToast(
        `Stok tidak cukup! Sisa stok: ${formatWeight(selectedProduct.stockGrams, selectedProduct.isPiece)}`,
        "error",
      );
      return;
    }

    setCart((prev) => {
      if (existingCartItem)
        return prev.map((item) =>
          item.id === selectedProduct.id
            ? { ...item, weight: item.weight + weight }
            : item,
        );
      return [...prev, { ...selectedProduct, weight }];
    });

    showToast(
      `Berhasil menambahkan ${formatWeight(weight, selectedProduct.isPiece)} ${selectedProduct.name}`,
    );
    setSelectedProduct(null);
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
    if (cart.length === 1) setIsMobileCartOpen(false);
  };

  const handleProcessPayment = () => {
    const cash = parseInt(cashInput.replace(/\D/g, ""));
    if (!cash || cash < cartTotal) {
      showToast("Uang pembayaran kurang!", "error");
      return;
    }

    const newInventory = [...inventory];

    cart.forEach((cartItem) => {
      const invIndex = newInventory.findIndex((p) => p.id === cartItem.id);
      if (invIndex !== -1) {
        const updatedInv = {
          ...newInventory[invIndex],
          stockGrams: newInventory[invIndex].stockGrams - cartItem.weight,
        };
        newInventory[invIndex] = updatedInv;
        if (fbUser && db)
          setDoc(
            doc(
              db,
              "artifacts",
              appId,
              "public",
              "data",
              "inventory",
              String(updatedInv.id),
            ),
            updatedInv,
          );
      }
    });
    if (!fbUser || !db) setInventory(newInventory);

    const transactionTotalCost = cart.reduce(
      (sum, item) => sum + (item.costPerGram || 0) * item.weight,
      0,
    );

    const transaction = {
      id: `TRX-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
      items: [...cart],
      total: cartTotal,
      totalCost: transactionTotalCost,
      profit: cartTotal - transactionTotalCost,
      cash: cash,
      change: cash - cartTotal,
      cashier: currentUser.name,
      branchId: activeBranch,
    };

    if (fbUser && db)
      setDoc(
        doc(
          db,
          "artifacts",
          appId,
          "public",
          "data",
          "transactions",
          String(transaction.id),
        ),
        transaction,
      );
    else setTransactions([transaction, ...transactions]);

    setCart([]);
    setCheckoutModal(false);
    setIsMobileCartOpen(false);
    setCashInput("");

    if (currentUser?.role === "Owner") {
      setReceiptModal(transaction);
    }
    showToast("Pembayaran berhasil!");
  };

  const handleSaveInventory = () => {
    if (!editingProduct.name || editingProduct.pricePerGram <= 0) {
      showToast("Nama dan harga harus valid!", "error");
      return;
    }
    if (activeBranch === "all" && isAddingNew && !editingProduct.branchId) {
      showToast("Pilih cabang terlebih dahulu!", "error");
      return;
    }

    const invObj = isAddingNew
      ? { ...editingProduct, id: Date.now() }
      : editingProduct;

    if (fbUser && db)
      setDoc(
        doc(
          db,
          "artifacts",
          appId,
          "public",
          "data",
          "inventory",
          String(invObj.id),
        ),
        invObj,
      );
    else {
      if (isAddingNew) setInventory([invObj, ...inventory]);
      else
        setInventory((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? invObj : p)),
        );
    }

    if (isAddingNew)
      showToast(
        `Produk baru berhasil ditambahkan di ${getBranchName(invObj.branchId)}`,
      );
    else showToast("Data produk berhasil diperbarui");

    setEditingProduct(null);
    setIsAddingNew(false);
  };

  const handleDeleteProduct = (id) => {
    if (fbUser && db)
      deleteDoc(
        doc(db, "artifacts", appId, "public", "data", "inventory", String(id)),
      );
    else setInventory((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((item) => item.id !== id));
    if (cart.length === 1 && cart[0].id === id) setIsMobileCartOpen(false);
    setConfirmDeleteId(null);
    showToast("Produk berhasil dihapus");
  };

  const handleDeleteTransaction = (id) => {
    if (fbUser && db)
      deleteDoc(
        doc(
          db,
          "artifacts",
          appId,
          "public",
          "data",
          "transactions",
          String(id),
        ),
      );
    else setTransactions((prev) => prev.filter((trx) => trx.id !== id));
    setConfirmDeleteTransactionId(null);
    showToast("Data riwayat berhasil dihapus secara permanen");
  };

  const handleOpenAddProduct = () => {
    setIsAddingNew(true);
    setEditingProduct({
      name: "",
      pricePerGram: 0,
      costPerGram: 0,
      stockGrams: 0,
      itemCode: "",
      isPiece: false,
      branchId: activeBranch === "all" ? branches[0]?.id || "" : activeBranch,
    });
  };

  // --- REPORT FILTERING LOGIC ---
  const availableOptions = useMemo(() => {
    const options = new Set();
    const now = new Date();

    if (filterMode === "day")
      options.add(
        `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`,
      );
    if (filterMode === "month")
      options.add(
        `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`,
      );
    if (filterMode === "year") options.add(`${now.getFullYear()}`);

    branchTransactions.forEach((trx) => {
      const d = new Date(trx.date);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      if (filterMode === "day") options.add(`${y}-${m}-${day}`);
      if (filterMode === "month") options.add(`${y}-${m}`);
      if (filterMode === "year") options.add(`${y}`);
    });
    return Array.from(options).sort().reverse();
  }, [branchTransactions, filterMode]);

  const filteredHistory = useMemo(() => {
    return branchTransactions.filter((trx) => {
      const d = new Date(trx.date);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      let trxStr = "";
      if (filterMode === "day") trxStr = `${y}-${m}-${day}`;
      if (filterMode === "month") trxStr = `${y}-${m}`;
      if (filterMode === "year") trxStr = `${y}`;
      return trxStr === selectedFilterValue;
    });
  }, [branchTransactions, filterMode, selectedFilterValue]);

  const dailyItemsSummary = useMemo(() => {
    const summary = {};
    filteredHistory.forEach((trx) => {
      trx.items.forEach((item) => {
        const key = `${item.name}_${item.isPiece ? "pcs" : "gr"}`;
        if (!summary[key])
          summary[key] = {
            name: item.name,
            weight: 0,
            total: 0,
            isPiece: item.isPiece,
          };
        summary[key].weight += item.weight;
        summary[key].total += item.weight * item.pricePerGram;
      });
    });
    return Object.values(summary);
  }, [filteredHistory]);

  const formatFilterLabel = (val, mode) => {
    if (!val) return "";
    const parts = val.split("-");
    const y = parts[0];
    const m = parts[1] ? parseInt(parts[1]) - 1 : 0;
    const d = parts[2] ? parseInt(parts[2]) : 1;
    if (mode === "day")
      return new Date(y, m, d).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    if (mode === "month")
      return new Date(y, m, 1).toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric",
      });
    if (mode === "year") return y;
  };

  const handleExportExcel = () => {
    if (filteredHistory.length === 0) {
      showToast("Tidak ada data.", "error");
      return;
    }

    const separator = ";";
    const headers = [
      "ID Transaksi",
      "Cabang",
      "Tanggal",
      "Jam",
      "Nama Kasir",
      "Daftar Pembelian",
      "Total Modal (Kulak)",
      "Total Pendapatan Jual",
      "Keuntungan Bersih",
      "Tunai",
      "Kembalian",
    ];

    let grandTotalCost = 0;
    let grandTotal = 0;
    let grandProfit = 0;
    let grandCash = 0;
    let grandChange = 0;

    const csvData = filteredHistory.map((trx) => {
      const d = new Date(trx.date);
      const itemsStr = trx.items
        .map(
          (item) => `${formatWeight(item.weight, item.isPiece)} ${item.name}`,
        )
        .join(" + ");
      const trxCost =
        trx.totalCost !== undefined
          ? trx.totalCost
          : trx.items.reduce(
              (sum, item) => sum + (item.costPerGram || 0) * item.weight,
              0,
            );
      const trxProfit =
        trx.profit !== undefined ? trx.profit : trx.total - trxCost;

      grandTotalCost += trxCost;
      grandTotal += trx.total;
      grandProfit += trxProfit;
      grandCash += trx.cash;
      grandChange += trx.change;

      return [
        `"${trx.id}"`,
        `"${getBranchName(trx.branchId)}"`,
        `"${d.toLocaleDateString("id-ID")}"`,
        `"${d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}"`,
        `"${trx.cashier || "-"}"`,
        `"${itemsStr}"`,
        trxCost,
        trx.total,
        trxProfit,
        trx.cash,
        trx.change,
      ].join(separator);
    });

    const totalRow = [
      `""`,
      `""`,
      `""`,
      `""`,
      `""`,
      `"TOTAL KESELURUHAN"`,
      grandTotalCost,
      grandTotal,
      grandProfit,
      grandCash,
      grandChange,
    ].join(separator);
    csvData.push(totalRow);

    const csvString =
      `sep=${separator}\n` + [headers.join(separator), ...csvData].join("\n");
    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvString], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    let modeLabel =
      filterMode === "day"
        ? "Harian"
        : filterMode === "month"
          ? "Bulanan"
          : "Tahunan";
    link.setAttribute(
      "download",
      `Laporan_${modeLabel}_${getBranchName(activeBranch).replace(/\s/g, "")}_${selectedFilterValue}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(
      `Berhasil mengunduh laporan Excel ${formatFilterLabel(selectedFilterValue, filterMode)}`,
    );
  };

  const handleSavePDF = () => {
    if (filteredHistory.length === 0) {
      showToast("Tidak ada data untuk dicetak.", "error");
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      showToast(
        "Gagal membuka tab baru. Mohon izinkan pop-up di browser Anda.",
        "error",
      );
      return;
    }

    const totalSetoran = filteredHistory.reduce(
      (acc, curr) => acc + curr.total,
      0,
    );
    const waktuCetak = new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const tanggalCetak = new Date().toLocaleDateString("id-ID");
    const periode = formatFilterLabel(selectedFilterValue, filterMode);
    const namaKasir = currentUser?.name || "Kasir";
    const namaCabang = getBranchName(currentUser?.branchId);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Laporan_Penjualan_${namaKasir.replace(/\s+/g, "_")}_${tanggalCetak.replace(/\//g, "-")}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; color: #111; max-width: 800px; margin: 0 auto; }
          .header { text-align: center; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 20px; }
          .title { font-size: 26px; font-weight: 900; margin: 0 0 5px 0; }
          .subtitle { font-size: 14px; color: #666; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
          .meta { display: flex; justify-content: space-between; font-size: 13px; color: #444; margin-top: 20px; background: #f9f9f9; padding: 15px; border-radius: 8px; border: 1px solid #eee; }
          .section-title { font-size: 14px; font-weight: 900; text-transform: uppercase; color: #333; border-bottom: 2px solid #333; padding-bottom: 8px; margin-bottom: 15px; margin-top: 35px; }
          .item { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed #eee; padding: 10px 0; font-size: 14px; }
          .item-name { font-weight: bold; color: #222; }
          .item-weight { font-size: 12px; color: #777; margin-top: 4px; }
          .item-total { font-weight: 900; font-size: 15px; }
          .summary { margin-top: 35px; border: 2px solid #eee; border-radius: 12px; padding: 20px; background: #fafafa; }
          .summary-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 15px; font-weight: 600; color: #555; }
          .summary-total { font-size: 22px; font-weight: 900; color: #111; margin-top: 15px; padding-top: 15px; border-top: 2px dashed #ccc; }
          .footer { text-align: center; margin-top: 50px; font-size: 11px; color: #aaa; }
          @media print {
            @page { margin: 15mm; }
            body { padding: 0; background: white; max-width: 100%; }
            .header, .summary, .meta { background: white; border-color: #ddd; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="title">Toko SHAFIRA</h1>
          <div class="subtitle">Laporan Penjualan Cabang</div>
          <div class="meta">
            <div><strong>Kasir:</strong> ${namaKasir}<br><strong style="display:inline-block; margin-top:5px;">Cabang:</strong> ${namaCabang}</div>
            <div style="text-align: right;"><strong>Periode:</strong> ${periode}<br><strong style="display:inline-block; margin-top:5px;">Dicetak:</strong> ${tanggalCetak} ${waktuCetak}</div>
          </div>
        </div>
        <div class="section-title">Rincian Barang Terjual</div>
        ${dailyItemsSummary
          .map(
            (item) => `
          <div class="item">
            <div><div class="item-name">${item.name}</div><div class="item-weight">${formatWeight(item.weight, item.isPiece)}</div></div>
            <div class="item-total">${formatRp(item.total)}</div>
          </div>
        `,
          )
          .join("")}
        ${dailyItemsSummary.length === 0 ? '<p style="text-align:center; font-style:italic; color:#999; font-size:14px; padding: 20px;">Belum ada penjualan pada periode ini</p>' : ""}
        <div class="summary">
          <div class="summary-row"><span>Total Transaksi Selesai</span><span>${filteredHistory.length} Transaksi</span></div>
          <div class="summary-row summary-total"><span>TOTAL UANG SETORAN</span><span>${formatRp(totalSetoran)}</span></div>
        </div>
        <div class="footer">Dokumen sah dihasilkan secara otomatis oleh Sistem TakoPOS.<br>Dicetak dari aplikasi web kasir.</div>
        <script>window.onload = () => { window.print(); }</script>
      </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    showToast("Menyiapkan file PDF...");
  };

  // --- REUSABLE COMPONENTS ---
  const NavItems = [
    { id: "pos", icon: ShoppingBag, label: "Kasir" },
    { id: "inventory", icon: Package, label: "Gudang" },
    { id: "history", icon: FileText, label: "Laporan" },
  ];

  // ==========================================
  // RENDERER: LOGIN SCREEN
  // ==========================================
  if (!currentUser) {
    const LoginScreen = () => {
      const [user, setUser] = useState("");
      const [pass, setPass] = useState("");
      const [showPass, setShowPass] = useState(false);

      const submitLogin = (e) => {
        e.preventDefault();
        handleLogin(user, pass);
      };

      return (
        <div className="min-h-[100dvh] flex items-center justify-center bg-gray-900 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDIiLz4KPC9zdmc+')] px-4 selection:bg-amber-500/30">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 md:p-8 animate-in fade-in zoom-in-95 duration-500 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 to-orange-600"></div>

            {!fbUser && (
              <div className="absolute top-4 right-4 flex items-center gap-1.5 text-[9px] font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-md border border-orange-100">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>{" "}
                Cloud Offline
              </div>
            )}
            {fbUser && (
              <div className="absolute top-4 right-4 flex items-center gap-1.5 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>{" "}
                Cloud Aktif
              </div>
            )}

            <div className="text-center mb-8 md:mb-10 mt-2">
              <img
                src="/logo.PNG"
                alt="Logo Toko Shafira"
                className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-2xl shadow-xl mb-4 md:mb-6 object-contain bg-white"
              />
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                Toko SHAFIRA
              </h1>
              <p className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest mt-1 md:mt-2">
                Sistem Autentikasi
              </p>
            </div>

            <form onSubmit={submitLogin} className="space-y-5">
              <div>
                <label className="block text-xs md:text-sm font-bold text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                  <input
                    type="text"
                    autoFocus
                    required
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none font-bold text-gray-900 transition-all text-sm md:text-base"
                    placeholder="Masukkan username"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs md:text-sm font-bold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                  <input
                    type={showPass ? "text" : "password"}
                    required
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    className="w-full pl-10 md:pl-12 pr-12 py-3 md:py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none font-bold text-gray-900 transition-all text-sm md:text-base"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1"
                  >
                    {showPass ? (
                      <EyeOff className="w-4 h-4 md:w-5 md:h-5" />
                    ) : (
                      <Eye className="w-4 h-4 md:w-5 md:h-5" />
                    )}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-gray-900 hover:bg-black text-white font-black py-3 md:py-4 rounded-xl shadow-xl shadow-gray-900/20 transition-all active:scale-95 text-base md:text-lg mt-2 flex justify-center items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 md:w-5 md:h-5" /> Masuk ke
                Sistem
              </button>
            </form>

            
          </div>

          {toast && (
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[80] animate-in fade-in slide-in-from-top-5">
              <div
                className={`flex items-center gap-3 px-4 md:px-6 py-3 md:py-4 rounded-2xl shadow-2xl font-bold text-xs md:text-sm border ${toast.type === "error" ? "bg-red-50 text-red-700 border-red-200" : "bg-gray-900 text-white border-gray-800"}`}
              >
                {toast.type === "error" ? (
                  <AlertCircle className="w-4 h-4 md:w-5 md:h-5" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" />
                )}
                {toast.message}
              </div>
            </div>
          )}
        </div>
      );
    };
    return <LoginScreen />;
  }

  // ==========================================
  // RENDERER: MAIN COMPONENTS
  // ==========================================

  const CartContent = ({ isMobile }) => (
    <div
      className={`flex flex-col h-full ${isMobile ? "bg-white rounded-t-3xl" : "bg-white rounded-2xl border border-gray-200"}`}
    >
      <div
        className={`p-4 md:p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 ${isMobile ? "rounded-t-3xl" : "rounded-t-2xl"}`}
      >
        <h2 className="text-base md:text-lg font-bold flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 text-amber-600" />{" "}
          Keranjang
        </h2>
        {isMobile ? (
          <button
            onClick={() => setIsMobileCartOpen(false)}
            className="bg-gray-200 hover:bg-gray-300 p-1.5 md:p-2 rounded-full transition-colors"
          >
            <ChevronUp className="w-4 h-4 md:w-5 md:h-5 text-gray-700 translate-y-[2px]" />
          </button>
        ) : (
          <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold">
            {cart.length} Item
          </span>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 custom-scrollbar">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3 py-10">
            <ShoppingBag className="w-12 h-12 md:w-16 md:h-16 opacity-20" />
            <p className="text-sm">Keranjang kosong</p>
          </div>
        ) : (
          cart.map((item) => (
            <div
              key={item.id}
              className="flex flex-col bg-white rounded-xl p-3 shadow-sm border border-gray-100"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold text-gray-800 text-sm">
                  {item.name}
                </span>
                <button
                  onClick={() => handleRemoveFromCart(item.id)}
                  className="text-red-400 hover:text-red-600 p-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">
                  {formatWeight(item.weight, item.isPiece)}{" "}
                  <span className="text-gray-300 mx-1">x</span>{" "}
                  {formatRp(item.pricePerGram)}
                </span>
                <span className="font-bold text-amber-700">
                  {formatRp(item.weight * item.pricePerGram)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
      <div
        className={`p-4 md:p-5 bg-white border-t border-gray-100 space-y-3 md:space-y-4 shrink-0 ${isMobile ? "" : "rounded-b-2xl"}`}
      >
        <div className="flex justify-between items-center">
          <span className="text-sm md:text-base text-gray-500 font-medium">
            Total Harga
          </span>
          <span className="text-xl md:text-2xl font-black text-gray-900">
            {formatRp(cartTotal)}
          </span>
        </div>
        <button
          disabled={cart.length === 0}
          onClick={() => {
            if (isMobile) setIsMobileCartOpen(false);
            setCheckoutModal(true);
          }}
          className="w-full min-h-[48px] md:min-h-[56px] py-3 md:py-4 rounded-xl font-bold text-base md:text-lg transition-all flex justify-center items-center gap-2 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed bg-amber-500 hover:bg-amber-600 active:scale-95 text-white shadow-lg shadow-amber-500/30"
        >
          <Calculator className="w-4 h-4 md:w-5 md:h-5 shrink-0" />{" "}
          <span className="whitespace-nowrap">Bayar Sekarang</span>
        </button>
      </div>
    </div>
  );

  const renderPOS = () => {
    if (activeBranch === "all") {
      return (
        <div className="flex h-full w-full items-center justify-center">
          <div className="text-center bg-white p-8 rounded-3xl border border-gray-200 shadow-sm max-w-sm">
            <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="font-black text-xl text-gray-900 mb-2">
              Mode Semua Cabang Aktif
            </h3>
            <p className="text-sm text-gray-500">
              Silakan pilih salah satu cabang spesifik di menu atas untuk
              memulai transaksi kasir.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex h-full w-full gap-4 md:gap-6 relative">
        <div className="flex-1 flex flex-col h-full min-w-0">
          <div className="mb-4 relative shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari nama atau kode barang..."
              className="w-full pl-12 pr-4 py-3 md:py-3.5 rounded-2xl border-0 bg-white shadow-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-amber-400 outline-none transition-all text-sm md:text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 overflow-y-auto pb-6 custom-scrollbar content-start">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => handleOpenAddModal(product)}
                className={`bg-white rounded-2xl border p-3 md:p-4 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 relative flex flex-col h-full ${product.stockGrams <= 0 ? "border-red-200 opacity-60 grayscale-[0.5]" : "border-gray-100 hover:border-amber-400 shadow-sm"}`}
              >
                <div className="absolute top-0 right-0 bg-gray-100 text-gray-600 text-[9px] md:text-[10px] font-bold px-2 py-1 rounded-bl-xl rounded-tr-xl truncate max-w-[60%] font-mono">
                  {product.itemCode || "-"}
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-amber-50 to-orange-50 rounded-full flex items-center justify-center mb-2 md:mb-3 shrink-0">
                  <Package className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />
                </div>
                <h3 className="font-bold text-gray-800 leading-snug mb-1 text-sm md:text-base line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-amber-600 font-black text-sm md:text-base mb-2 md:mb-3 mt-auto">
                  {formatRp(product.pricePerGram)}{" "}
                  <span className="text-gray-400 text-[10px] md:text-xs font-normal">
                    / {product.isPiece ? "pcs" : "gr"}
                  </span>
                </p>
                <div className="flex justify-between items-center pt-2 md:pt-3 border-t border-gray-100">
                  <span className="text-[10px] md:text-xs text-gray-500">
                    Stok:
                  </span>
                  <span
                    className={`text-xs md:text-sm font-bold ${product.stockGrams < (product.isPiece ? 10 : 1000) ? "text-red-500" : "text-emerald-600"}`}
                  >
                    {formatWeight(product.stockGrams, product.isPiece)}
                  </span>
                </div>
              </div>
            ))}
            {filteredProducts.length === 0 && (
              <div className="col-span-full py-10 text-center text-gray-500">
                Pencarian tidak ditemukan di cabang ini.
              </div>
            )}
          </div>
        </div>
        <div className="hidden lg:flex w-96 flex-col shrink-0">
          <CartContent isMobile={false} />
        </div>

        {cart.length > 0 && (
          <div className="lg:hidden fixed bottom-[84px] left-4 right-4 z-30 animate-in slide-in-from-bottom-5">
            <button
              onClick={() => setIsMobileCartOpen(true)}
              className="w-full bg-gray-900 text-white rounded-2xl p-3 shadow-2xl flex justify-between items-center border border-gray-800 active:scale-[0.98] transition-transform"
            >
              <div className="text-left flex items-center gap-3">
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 text-amber-400" />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-gray-900">
                    {cart.length}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-medium">
                    Total Belanja
                  </p>
                  <p className="font-bold text-base leading-none mt-0.5">
                    {formatRp(cartTotal)}
                  </p>
                </div>
              </div>
              <div className="bg-amber-500 text-gray-900 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm shadow-amber-500/50">
                Checkout
              </div>
            </button>
          </div>
        )}
        {isMobileCartOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex items-end justify-center bg-gray-900/40 backdrop-blur-sm">
            <div className="w-full h-[85dvh] animate-in slide-in-from-bottom-full duration-300">
              <CartContent isMobile={true} />
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderInventory = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 h-full flex flex-col overflow-hidden relative">
      <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-gray-50/50 shrink-0">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-gray-900">
            Manajemen Gudang{" "}
            {activeBranch !== "all" && `(${getBranchName(activeBranch)})`}
          </h2>
          <p className="text-xs md:text-sm text-gray-500">
            Kontrol stok akurasi gram/satuan
          </p>
        </div>
        {currentUser?.role === "Owner" && (
          <button
            onClick={handleOpenAddProduct}
            className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 md:py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm shadow-amber-500/20 active:scale-95 min-h-[40px] md:min-h-[44px]"
          >
            <PlusCircle className="w-4 h-4 shrink-0" />{" "}
            <span className="whitespace-nowrap">Tambah Produk Baru</span>
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 md:p-6 bg-slate-50 md:bg-white pb-6">
        <div className="hidden md:block">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="pb-3 px-2 text-sm font-bold text-gray-500">
                  Nama Produk
                </th>
                <th className="pb-3 px-2 text-sm font-bold text-gray-500">
                  Kode
                </th>
                {activeBranch === "all" && (
                  <th className="pb-3 px-2 text-sm font-bold text-gray-500">
                    Lokasi Cabang
                  </th>
                )}
                <th className="pb-3 px-2 text-sm font-bold text-gray-500 text-right">
                  Harga Jual
                </th>
                {currentUser?.role === "Owner" && (
                  <th className="pb-3 px-2 text-sm font-bold text-gray-500 text-right">
                    Harga Kulak
                  </th>
                )}
                <th className="pb-3 px-2 text-sm font-bold text-gray-500 text-right">
                  Stok Aktual
                </th>
                <th className="pb-3 px-2 text-sm font-bold text-gray-500 text-center">
                  Status
                </th>
                {currentUser?.role === "Owner" && (
                  <th className="pb-3 px-2 text-sm font-bold text-gray-500 text-right">
                    Aksi
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {branchInventory.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50/50 group transition-colors"
                >
                  <td className="py-4 px-2 font-bold text-gray-800">
                    {item.name}
                  </td>
                  <td className="py-4 px-2 text-sm font-bold font-mono text-gray-500">
                    {item.itemCode || "-"}
                  </td>
                  {activeBranch === "all" && (
                    <td className="py-4 px-2 text-xs font-bold text-blue-600 bg-blue-50/30 rounded-lg">
                      {getBranchName(item.branchId)}
                    </td>
                  )}
                  <td className="py-4 px-2 text-sm font-semibold text-gray-700 text-right">
                    {formatRp(item.pricePerGram)}
                    <span className="text-[10px] text-gray-400 font-normal">
                      /{item.isPiece ? "pcs" : "gr"}
                    </span>
                  </td>
                  {currentUser?.role === "Owner" && (
                    <td className="py-4 px-2 text-sm font-semibold text-gray-500 text-right">
                      {formatRp(item.costPerGram || 0)}
                    </td>
                  )}
                  <td className="py-4 px-2 text-right">
                    <div className="font-black text-gray-900">
                      {formatWeight(item.stockGrams, item.isPiece)}
                    </div>
                  </td>
                  <td className="py-4 px-2 text-center">
                    {item.stockGrams > (item.isPiece ? 20 : 2000) ? (
                      <span className="bg-emerald-100 text-emerald-700 py-1 px-3 rounded-md text-xs font-bold">
                        Aman
                      </span>
                    ) : item.stockGrams > 0 ? (
                      <span className="bg-orange-100 text-orange-700 py-1 px-3 rounded-md text-xs font-bold">
                        Menipis
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-700 py-1 px-3 rounded-md text-xs font-bold">
                        Habis
                      </span>
                    )}
                  </td>

                  {currentUser?.role === "Owner" && (
                    <td className="py-4 px-2 text-right">
                      <div className="flex justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setIsAddingNew(false);
                            setEditingProduct({ ...item });
                          }}
                          className="text-gray-500 hover:text-amber-600 bg-white hover:bg-amber-50 border border-gray-200 hover:border-amber-200 p-2 rounded-lg transition-all shadow-sm"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(item.id)}
                          className="text-gray-500 hover:text-red-600 bg-white hover:bg-red-50 border border-gray-200 hover:border-red-200 p-2 rounded-lg transition-all shadow-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {branchInventory.length === 0 && (
                <tr>
                  <td
                    colSpan={
                      activeBranch === "all"
                        ? currentUser?.role === "Owner"
                          ? "8"
                          : "6"
                        : currentUser?.role === "Owner"
                          ? "7"
                          : "5"
                    }
                    className="py-10 text-center text-gray-500"
                  >
                    Gudang kosong.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="md:hidden space-y-3">
          {branchInventory.map((item) => (
            <div
              key={item.id}
              className="bg-white p-3.5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900 leading-tight mb-1 text-sm">
                    {item.name}
                  </h3>
                  <div className="flex gap-1.5 mt-1">
                    <span className="text-[9px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md font-bold font-mono">
                      {item.itemCode || "-"}
                    </span>
                    {activeBranch === "all" && (
                      <span className="text-[9px] px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md font-bold">
                        {getBranchName(item.branchId)}
                      </span>
                    )}
                  </div>
                </div>
                {item.stockGrams > (item.isPiece ? 20 : 2000) ? (
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] mt-1"></div>
                ) : item.stockGrams > 0 ? (
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)] mt-1"></div>
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] mt-1"></div>
                )}
              </div>
              <div className="flex items-end justify-between bg-gray-50 p-2.5 rounded-xl border border-gray-100/50">
                <div>
                  <p className="text-[9px] text-gray-500 font-semibold mb-0.5">
                    Harga Jual
                  </p>
                  <p className="font-bold text-sm text-gray-800">
                    {formatRp(item.pricePerGram)}
                    <span className="text-[9px] font-normal text-gray-400">
                      /{item.isPiece ? "pcs" : "gr"}
                    </span>
                  </p>
                </div>
                {currentUser?.role === "Owner" && (
                  <div>
                    <p className="text-[9px] text-gray-500 font-semibold mb-0.5">
                      Harga Kulak
                    </p>
                    <p className="font-bold text-sm text-amber-700">
                      {formatRp(item.costPerGram || 0)}
                      <span className="text-[9px] font-normal text-gray-400">
                        /{item.isPiece ? "pcs" : "gr"}
                      </span>
                    </p>
                  </div>
                )}
                <div className="text-right">
                  <p className="text-[9px] text-gray-500 font-semibold mb-0.5">
                    Stok
                  </p>
                  <p className="font-black text-gray-900 text-sm">
                    {formatWeight(item.stockGrams, item.isPiece)}
                  </p>
                </div>
              </div>

              {currentUser?.role === "Owner" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsAddingNew(false);
                      setEditingProduct({ ...item });
                    }}
                    className="flex-1 py-2 bg-white border border-gray-200 hover:border-amber-500 hover:text-amber-600 rounded-xl text-xs font-bold text-gray-600 transition-colors flex justify-center items-center gap-1.5 active:scale-95"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(item.id)}
                    className="px-3 py-2 bg-white border border-gray-200 hover:border-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors flex justify-center items-center active:scale-95"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                </div>
              )}
            </div>
          ))}
          {branchInventory.length === 0 && (
            <div className="py-10 text-center text-gray-500 bg-white rounded-2xl border border-dashed border-gray-300">
              <Package className="w-10 h-10 mx-auto text-gray-300 mb-2" />
              <p className="text-sm font-medium">
                Gudang kosong di cabang ini.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 h-full flex flex-col overflow-hidden">
      <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-3 md:gap-4 bg-gray-50/50 shrink-0">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-gray-900">
            Laporan Penjualan{" "}
            {activeBranch !== "all" && `(${getBranchName(activeBranch)})`}
          </h2>
          <p className="text-xs md:text-sm text-gray-500">
            Pilih periode untuk melihat riwayat
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full xl:w-auto">
          <div className="flex gap-2 w-full sm:w-auto flex-1">
            {currentUser?.role === "Owner" && (
              <div className="relative w-1/3 sm:w-32 shrink-0">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={filterMode}
                  onChange={(e) => handleFilterModeChange(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 md:py-2.5 bg-white border border-gray-200 rounded-xl text-xs md:text-sm font-bold text-gray-700 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 appearance-none shadow-sm cursor-pointer min-h-[40px] md:min-h-[44px]"
                >
                  <option value="day">Harian</option>
                  <option value="month">Bulanan</option>
                  <option value="year">Tahunan</option>
                </select>
              </div>
            )}

            <div
              className={`relative ${currentUser?.role === "Owner" ? "flex-1 sm:w-48" : "w-full"}`}
            >
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={selectedFilterValue}
                onChange={(e) => setSelectedFilterValue(e.target.value)}
                className="w-full pl-9 pr-4 py-2 md:py-2.5 bg-white border border-gray-200 rounded-xl text-xs md:text-sm font-bold text-gray-700 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 appearance-none shadow-sm cursor-pointer min-h-[40px] md:min-h-[44px]"
              >
                {availableOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {formatFilterLabel(opt, filterMode)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {currentUser?.role === "Owner" && (
            <button
              onClick={handleExportExcel}
              disabled={filteredHistory.length === 0}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm active:scale-95 shrink-0 min-h-[40px] md:min-h-[44px]"
            >
              <Download className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">Export (CSV)</span>
            </button>
          )}

          {currentUser?.role !== "Owner" && (
            <button
              onClick={handleSavePDF}
              disabled={filteredHistory.length === 0}
              className="w-full sm:w-auto bg-gray-900 hover:bg-black disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm active:scale-95 shrink-0 min-h-[40px] md:min-h-[44px]"
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">Buat PDF Laporan</span>
            </button>
          )}
        </div>
      </div>

      <div className="p-4 md:p-6 bg-white border-b border-gray-100 shrink-0">
        {currentUser?.role === "Owner" ? (
          <div className="flex gap-2 md:gap-4 w-full overflow-x-auto pb-1 hide-scrollbar">
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-left min-w-[120px] md:min-w-[140px] flex-1 sm:flex-none">
              <p className="text-[9px] md:text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-0.5">
                Total Transaksi
              </p>
              <p className="text-lg md:text-xl font-black text-blue-900">
                {filteredHistory.length}
              </p>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-left min-w-[140px] md:min-w-[160px] flex-1 sm:flex-none">
              <p className="text-[9px] md:text-[10px] text-emerald-600 font-bold uppercase tracking-wider mb-0.5">
                Pendapatan Jual
              </p>
              <p className="text-lg md:text-xl font-black text-emerald-900">
                {formatRp(
                  filteredHistory.reduce((acc, curr) => acc + curr.total, 0),
                )}
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-left min-w-[140px] md:min-w-[160px] flex-1 sm:flex-none">
              <p className="text-[9px] md:text-[10px] text-amber-600 font-bold uppercase tracking-wider mb-0.5">
                Keuntungan Bersih
              </p>
              <p className="text-lg md:text-xl font-black text-amber-900">
                {formatRp(
                  filteredHistory.reduce((acc, curr) => {
                    const trxCost =
                      curr.totalCost !== undefined
                        ? curr.totalCost
                        : curr.items.reduce(
                            (sum, item) =>
                              sum + (item.costPerGram || 0) * item.weight,
                            0,
                          );
                    const trxProfit =
                      curr.profit !== undefined
                        ? curr.profit
                        : curr.total - trxCost;
                    return acc + trxProfit;
                  }, 0),
                )}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-left w-max">
            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-0.5">
              Total Transaksi Hari Ini
            </p>
            <p className="text-xl font-black text-blue-900">
              {filteredHistory.length}
            </p>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 md:p-6 bg-slate-50 md:bg-white space-y-3 md:space-y-4 pb-6">
        {filteredHistory.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 py-20">
            <Receipt className="w-12 h-12 md:w-16 md:h-16 opacity-20 mb-3 md:mb-4" />
            <p className="font-medium text-xs md:text-sm">
              Tidak ada transaksi pada{" "}
              {formatFilterLabel(selectedFilterValue, filterMode)}.
            </p>
          </div>
        ) : (
          filteredHistory.map((trx) => (
            <div
              key={trx.id}
              className="border border-gray-200 rounded-2xl p-3.5 md:p-5 bg-white hover:border-amber-300 transition-all hover:shadow-md flex flex-col md:flex-row justify-between gap-3 md:gap-6"
            >
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2 md:mb-3 pb-2 md:pb-3 border-b border-gray-50">
                  <span className="font-black text-gray-900 text-sm md:text-base">
                    {trx.id}
                  </span>
                  <span className="text-[9px] md:text-[10px] text-gray-500 flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 md:px-2 md:py-1 rounded-md">
                    <Clock className="w-2.5 h-2.5 md:w-3 md:h-3" />{" "}
                    {new Date(trx.date).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    • {new Date(trx.date).toLocaleDateString("id-ID")}
                  </span>
                  {trx.cashier && (
                    <span className="text-[9px] md:text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 md:px-2 md:py-1 rounded-md font-bold">
                      {trx.cashier}
                    </span>
                  )}
                  {activeBranch === "all" && (
                    <span className="text-[9px] md:text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 md:px-2 md:py-1 rounded-md font-bold">
                      <MapPin className="inline w-3 h-3 mr-0.5" />{" "}
                      {getBranchName(trx.branchId)}
                    </span>
                  )}
                </div>
                <ul className="space-y-1.5 md:space-y-2">
                  {trx.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-[11px] md:text-xs text-gray-600 flex justify-between items-center bg-gray-50/50 p-1.5 md:p-2 rounded-lg"
                    >
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 block"></span>
                        <span className="font-semibold text-gray-800">
                          {item.name}
                        </span>
                      </div>
                      <span className="font-mono text-gray-500 bg-white px-1.5 py-0.5 rounded border border-gray-100">
                        {formatWeight(item.weight, item.isPiece)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:w-48 shrink-0 flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-100 pt-2.5 md:pt-0 md:pl-5">
                <div>
                  <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5 md:mb-1">
                    Nilai Transaksi
                  </p>
                  <p className="font-black text-lg md:text-xl text-gray-900">
                    {formatRp(trx.total)}
                  </p>
                </div>

                {currentUser?.role === "Owner" && (
                  <div className="flex gap-2 mt-3 md:mt-4">
                    <button
                      onClick={() => setReceiptModal(trx)}
                      className="flex-1 bg-gray-900 text-white text-xs md:text-sm font-bold py-2 md:py-2.5 rounded-xl hover:bg-gray-800 transition-colors flex justify-center items-center gap-1.5 md:gap-2 active:scale-95 min-h-[40px] md:min-h-[44px]"
                    >
                      <Printer className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" />{" "}
                      <span className="whitespace-nowrap">Cetak</span>
                    </button>
                    <button
                      onClick={() => setConfirmDeleteTransactionId(trx.id)}
                      className="bg-red-50 text-red-600 px-3 md:px-4 text-xs md:text-sm font-bold py-2 md:py-2.5 rounded-xl hover:bg-red-100 hover:text-red-700 transition-colors flex justify-center items-center active:scale-95 min-h-[40px] md:min-h-[44px]"
                    >
                      <Trash2 className="w-4 h-4 shrink-0" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="h-[100dvh] flex flex-col bg-slate-100 text-gray-800 font-sans selection:bg-amber-200 overflow-hidden">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 flex-none z-20 shadow-sm relative">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-row justify-between items-center py-2.5 md:py-3 sm:h-16 gap-3 sm:gap-0">
            <div className="flex items-center gap-2.5 md:gap-3">
              <img
                src="/logo.PNG"
                alt="Logo Toko Shafira"
                className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl shadow-sm shrink-0 object-contain bg-white"
              />
              <div>
                <h1 className="font-black text-lg md:text-xl text-gray-900 leading-none tracking-tight">
                  Toko SHAFIRA
                </h1>
                <p className="text-[8px] md:text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-0.5">
                  Sistem Tembakau
                </p>
              </div>
            </div>

            {currentUser?.role === "Owner" && (
              <div className="hidden sm:flex relative items-center ml-4 shrink-0">
                <MapPin className="absolute left-3 w-4 h-4 text-amber-600 z-10" />
                <select
                  value={activeBranch}
                  onChange={(e) => setActiveBranch(e.target.value)}
                  className="pl-9 pr-8 py-2 bg-amber-50 border border-amber-200 rounded-xl text-sm font-bold text-amber-900 outline-none focus:ring-2 focus:ring-amber-500/20 appearance-none shadow-sm cursor-pointer hover:bg-amber-100 transition-colors"
                >
                  <option value="all">🌍 Semua Cabang</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      📍 {b.name}
                    </option>
                  ))}
                </select>
                <ChevronUp className="absolute right-3 w-4 h-4 text-amber-600 rotate-180 pointer-events-none" />
              </div>
            )}

            <nav className="hidden md:flex bg-gray-100/80 p-1.5 rounded-xl shadow-inner mx-4">
              {NavItems.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm transition-all min-w-[100px] ${activeTab === tab.id ? "bg-white text-amber-700 shadow-[0_2px_10px_rgba(0,0,0,0.05)]" : "text-gray-500 hover:text-gray-800 active:bg-gray-200"}`}
                >
                  <tab.icon
                    className={`w-4 h-4 ${activeTab === tab.id ? "text-amber-500" : ""}`}
                  />
                  {tab.label}
                </button>
              ))}
            </nav>

            <button
              onClick={() => setProfileModal(true)}
              className="flex items-center gap-2 hover:bg-gray-50 p-1 md:p-1.5 rounded-full md:rounded-xl transition-colors border border-transparent hover:border-gray-200"
            >
              <div className="hidden md:block text-right mr-1">
                <p className="text-sm font-bold text-gray-900 leading-none">
                  {currentUser.name}
                </p>
                <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">
                  {currentUser.role}{" "}
                  {currentUser.role !== "Owner" &&
                    `• ${getBranchName(currentUser.branchId)}`}
                </p>
              </div>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-md border border-white text-xs md:text-sm font-black uppercase">
                {currentUser.name.charAt(0)}
              </div>
            </button>
          </div>
        </div>
      </header>

      {currentUser?.role === "Owner" && (
        <div className="sm:hidden px-4 py-2 bg-white border-b border-gray-200 z-10">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-600 z-10" />
            <select
              value={activeBranch}
              onChange={(e) => setActiveBranch(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-sm font-bold text-amber-900 outline-none focus:ring-2 focus:ring-amber-500/20 appearance-none shadow-sm cursor-pointer"
            >
              <option value="all">🌍 Tampilkan Semua Cabang</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  📍 Cabang {b.name}
                </option>
              ))}
            </select>
            <ChevronUp className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-600 rotate-180 pointer-events-none" />
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-hidden relative max-w-7xl mx-auto w-full p-2 md:p-4 lg:p-6 pb-[72px] md:pb-6">
        {activeTab === "pos" && renderPOS()}
        {activeTab === "inventory" && renderInventory()}
        {activeTab === "history" && renderHistory()}
      </main>

      {/* BOTTOM NAVIGATION */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-gray-200 pb-safe">
        <div className="flex justify-around items-center px-2 py-1.5">
          {NavItems.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center w-full py-1 gap-0.5 transition-colors ${isActive ? "text-amber-600" : "text-gray-400 hover:text-gray-600"}`}
              >
                <div
                  className={`p-1.5 rounded-xl transition-all ${isActive ? "bg-amber-50" : "bg-transparent"}`}
                >
                  <tab.icon
                    className={`w-5 h-5 ${isActive ? "fill-amber-100/50" : ""}`}
                  />
                </div>
                <span
                  className={`text-[9px] font-bold ${isActive ? "text-amber-700" : "text-gray-500"}`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* Modal 0: PROFILE, TEAM, & BRANCH MANAGEMENT */}
      {profileModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden pb-safe max-h-[90dvh] flex flex-col">
            <div className="bg-gray-900 p-5 md:p-6 text-center relative shrink-0">
              <button
                onClick={() => {
                  setProfileModal(false);
                  setIsAddingUser(false);
                  setIsAddingBranch(false);
                }}
                className="absolute top-3 right-3 text-gray-400 hover:text-white bg-white/10 p-1.5 rounded-full transition-colors"
              >
                <X className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <div className="w-14 h-14 md:w-16 md:h-16 bg-white text-gray-900 rounded-full mx-auto mb-2 md:mb-3 flex items-center justify-center text-xl md:text-2xl font-black shadow-lg uppercase">
                {currentUser.name.charAt(0)}
              </div>
              <h3 className="text-lg md:text-xl font-black text-white leading-none">
                {currentUser.name}
              </h3>
              <span className="inline-block mt-2 px-2.5 py-0.5 bg-amber-500 text-gray-900 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-full">
                {currentUser.role}{" "}
                {currentUser.role !== "Owner" &&
                  `| ${getBranchName(currentUser.branchId)}`}
              </span>
            </div>

            {currentUser.role === "Owner" && (
              <div className="flex border-b border-gray-100 shrink-0">
                <button
                  onClick={() => {
                    setProfileTab("security");
                    setIsAddingUser(false);
                    setIsAddingBranch(false);
                  }}
                  className={`flex-1 py-2.5 md:py-3 text-[10px] md:text-xs font-bold flex justify-center items-center gap-1.5 border-b-2 transition-colors ${profileTab === "security" ? "border-amber-500 text-amber-600" : "border-transparent text-gray-500 hover:bg-gray-50"}`}
                >
                  <Lock className="w-3.5 h-3.5 md:w-4 md:h-4" /> Akun Saya
                </button>
                <button
                  onClick={() => {
                    setProfileTab("team");
                    setIsAddingBranch(false);
                  }}
                  className={`flex-1 py-2.5 md:py-3 text-[10px] md:text-xs font-bold flex justify-center items-center gap-1.5 border-b-2 transition-colors ${profileTab === "team" ? "border-amber-500 text-amber-600" : "border-transparent text-gray-500 hover:bg-gray-50"}`}
                >
                  <Users className="w-3.5 h-3.5 md:w-4 md:h-4" /> Kelola Tim
                </button>
                <button
                  onClick={() => {
                    setProfileTab("branches");
                    setIsAddingUser(false);
                  }}
                  className={`flex-1 py-2.5 md:py-3 text-[10px] md:text-xs font-bold flex justify-center items-center gap-1.5 border-b-2 transition-colors ${profileTab === "branches" ? "border-amber-500 text-amber-600" : "border-transparent text-gray-500 hover:bg-gray-50"}`}
                >
                  <Building className="w-3.5 h-3.5 md:w-4 md:h-4" /> Cabang
                </button>
              </div>
            )}

            <div className="p-4 md:p-6 overflow-y-auto custom-scrollbar flex-1">
              {profileTab === "security" && (
                <div className="space-y-4 md:space-y-6">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const oldP = e.target.oldPass.value;
                      const newP = e.target.newPass.value;
                      const confP = e.target.confPass.value;
                      if (newP !== confP) {
                        showToast(
                          "Password baru dan konfirmasi tidak cocok!",
                          "error",
                        );
                        return;
                      }
                      if (handleChangePassword(oldP, newP)) {
                        e.target.reset();
                      }
                    }}
                    className="space-y-3 md:space-y-4"
                  >
                    <p className="text-xs md:text-sm font-bold text-gray-800 mb-1 md:mb-2">
                      Ubah Kata Sandi
                    </p>
                    <input
                      type="password"
                      name="oldPass"
                      required
                      placeholder="Password Lama"
                      className="w-full p-2.5 md:p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-xs md:text-sm font-bold transition-all"
                    />
                    <input
                      type="password"
                      name="newPass"
                      required
                      placeholder="Password Baru"
                      className="w-full p-2.5 md:p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-xs md:text-sm font-bold transition-all"
                    />
                    <input
                      type="password"
                      name="confPass"
                      required
                      placeholder="Ulangi Password Baru"
                      className="w-full p-2.5 md:p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-xs md:text-sm font-bold transition-all"
                    />
                    <button
                      type="submit"
                      className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 md:py-3.5 rounded-xl transition-colors text-xs md:text-sm min-h-[44px]"
                    >
                      Update Password
                    </button>
                  </form>
                  <div className="border-t border-gray-100"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 md:py-3.5 rounded-xl transition-colors text-xs md:text-sm min-h-[44px]"
                  >
                    <LogOut className="w-4 h-4" /> Keluar dari Sistem
                  </button>
                </div>
              )}

              {profileTab === "team" && currentUser.role === "Owner" && (
                <div className="space-y-3 md:space-y-4">
                  {!isAddingUser ? (
                    <>
                      <div className="flex justify-between items-center mb-1 md:mb-2">
                        <p className="text-xs md:text-sm font-bold text-gray-800">
                          Daftar Akun Sistem
                        </p>
                        <button
                          onClick={() => setIsAddingUser(true)}
                          className="text-[10px] md:text-xs bg-amber-100 text-amber-700 hover:bg-amber-200 px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-colors"
                        >
                          <UserPlus className="w-3 h-3" /> Tambah Kasir
                        </button>
                      </div>
                      <div className="space-y-2">
                        {users.map((u) => (
                          <div
                            key={u.id}
                            className="flex justify-between items-center p-2.5 md:p-3 border border-gray-100 rounded-xl hover:border-amber-200 transition-colors bg-gray-50/50"
                          >
                            <div className="flex items-center gap-2 md:gap-3">
                              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gray-200 flex items-center justify-center text-[10px] md:text-xs font-black text-gray-600 uppercase">
                                {u.name.charAt(0)}
                              </div>
                              <div>
                                <p className="text-xs md:text-sm font-bold text-gray-900 leading-tight">
                                  {u.name}
                                </p>
                                <p className="text-[9px] md:text-[10px] text-gray-500 font-medium">
                                  @{u.username} •{" "}
                                  <span
                                    className={
                                      u.role === "Owner"
                                        ? "text-blue-600 font-bold"
                                        : "text-amber-600"
                                    }
                                  >
                                    {u.role === "Owner"
                                      ? "Owner"
                                      : getBranchName(u.branchId)}
                                  </span>
                                </p>
                              </div>
                            </div>
                            {u.id !== currentUser.id && (
                              <button
                                onClick={() => handleDeleteUser(u.id)}
                                className="p-1.5 md:p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Hapus Akun"
                              >
                                <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                      <div className="flex items-center gap-2 mb-3 md:mb-4">
                        <button
                          onClick={() => setIsAddingUser(false)}
                          className="p-1 md:p-1.5 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200"
                        >
                          <ChevronUp className="w-4 h-4 -rotate-90" />
                        </button>
                        <p className="text-xs md:text-sm font-bold text-gray-800">
                          Buat Akun Kasir Baru
                        </p>
                      </div>
                      <form
                        onSubmit={handleCreateUser}
                        className="space-y-2.5 md:space-y-3"
                      >
                        <input
                          type="text"
                          required
                          placeholder="Nama Lengkap"
                          value={newUser.name}
                          onChange={(e) =>
                            setNewUser({ ...newUser, name: e.target.value })
                          }
                          className="w-full p-2.5 md:p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-xs md:text-sm font-bold transition-all"
                        />
                        <input
                          type="text"
                          required
                          placeholder="Username Login"
                          value={newUser.username}
                          onChange={(e) =>
                            setNewUser({
                              ...newUser,
                              username: e.target.value
                                .toLowerCase()
                                .replace(/\s/g, ""),
                            })
                          }
                          className="w-full p-2.5 md:p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-xs md:text-sm font-bold transition-all"
                        />
                        <input
                          type="text"
                          required
                          placeholder="Password"
                          value={newUser.password}
                          onChange={(e) =>
                            setNewUser({ ...newUser, password: e.target.value })
                          }
                          className="w-full p-2.5 md:p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-xs md:text-sm font-bold transition-all"
                        />

                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <select
                            required
                            value={newUser.branchId}
                            onChange={(e) =>
                              setNewUser({
                                ...newUser,
                                branchId: e.target.value,
                              })
                            }
                            className="w-full pl-9 p-2.5 md:p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-xs md:text-sm font-bold transition-all appearance-none"
                          >
                            {branches.map((b) => (
                              <option key={b.id} value={b.id}>
                                Tugaskan di: {b.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 md:py-3.5 rounded-xl transition-colors text-xs md:text-sm mt-1 md:mt-2 shadow-lg shadow-emerald-600/20 min-h-[44px]"
                        >
                          Simpan Akun Baru
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              )}

              {/* TAB KELOLA CABANG BARU */}
              {profileTab === "branches" && currentUser.role === "Owner" && (
                <div className="space-y-3 md:space-y-4">
                  {!isAddingBranch ? (
                    <>
                      <div className="flex justify-between items-center mb-1 md:mb-2">
                        <p className="text-xs md:text-sm font-bold text-gray-800">
                          Daftar Lokasi Cabang
                        </p>
                        <button
                          onClick={() => setIsAddingBranch(true)}
                          className="text-[10px] md:text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-colors"
                        >
                          <PlusCircle className="w-3 h-3" /> Tambah Cabang
                        </button>
                      </div>
                      <div className="space-y-2">
                        {branches.map((b) => (
                          <div
                            key={b.id}
                            className="flex justify-between items-center p-2.5 md:p-3 border border-gray-100 rounded-xl bg-gray-50/50"
                          >
                            <div className="flex items-center gap-2 md:gap-3">
                              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                <Store className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-xs md:text-sm font-bold text-gray-900 leading-tight">
                                  {b.name}
                                </p>
                                <p className="text-[9px] md:text-[10px] text-gray-500 font-medium font-mono">
                                  {b.id}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                      <div className="flex items-center gap-2 mb-3 md:mb-4">
                        <button
                          onClick={() => setIsAddingBranch(false)}
                          className="p-1 md:p-1.5 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200"
                        >
                          <ChevronUp className="w-4 h-4 -rotate-90" />
                        </button>
                        <p className="text-xs md:text-sm font-bold text-gray-800">
                          Buat Cabang Baru
                        </p>
                      </div>
                      <form
                        onSubmit={handleCreateBranch}
                        className="space-y-2.5 md:space-y-3"
                      >
                        <input
                          type="text"
                          required
                          placeholder="Nama Cabang (Cth: Lumajang Kota)"
                          value={newBranchName}
                          onChange={(e) => setNewBranchName(e.target.value)}
                          className="w-full p-2.5 md:p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-xs md:text-sm font-bold transition-all"
                        />
                        <button
                          type="submit"
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 md:py-3.5 rounded-xl transition-colors text-xs md:text-sm mt-1 md:mt-2 shadow-lg shadow-blue-600/20 min-h-[44px]"
                        >
                          Simpan Cabang
                        </button>
                      </form>
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                        <p className="text-[10px] text-blue-800 font-bold text-center">
                          Menambah cabang akan secara otomatis tersedia di
                          daftar pilihan saat mendaftarkan kasir dan menambah
                          stok gudang.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal 1: Add to Cart */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90dvh] flex flex-col overflow-hidden">
            <div className="p-5 md:p-6 pb-2 shrink-0">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg md:text-xl font-black text-gray-900 leading-tight">
                    {selectedProduct.name}
                  </h3>
                  <p className="text-sm md:text-base text-amber-600 font-bold mt-0.5 md:mt-1">
                    {formatRp(selectedProduct.pricePerGram)} /{" "}
                    {selectedProduct.isPiece ? "pcs" : "gram"}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-gray-400 hover:bg-gray-100 p-1.5 md:p-2 rounded-full transition-colors bg-gray-50 shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="bg-amber-50/50 border border-amber-100/50 p-3 md:p-4 rounded-xl flex justify-between items-center">
                <span className="text-xs md:text-sm font-semibold text-amber-800">
                  Sisa Stok Gudang
                </span>
                <span className="font-black text-base md:text-lg text-amber-900 bg-amber-100/50 px-2.5 py-1 rounded-lg">
                  {formatWeight(
                    selectedProduct.stockGrams,
                    selectedProduct.isPiece,
                  )}
                </span>
              </div>
            </div>
            <div className="px-5 md:px-6 py-2 overflow-y-auto custom-scrollbar flex-1">
              <label className="block text-xs md:text-sm font-bold text-gray-700 mb-3">
                Tentukan {selectedProduct.isPiece ? "Jumlah" : "Berat"} (
                {selectedProduct.isPiece ? "Pcs" : "Gram"})
              </label>
              <div className="relative mb-4">
                <input
                  type="number"
                  autoFocus
                  className="w-full text-3xl md:text-4xl font-black text-center py-3 md:py-4 px-4 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-0 outline-none transition-colors text-gray-900"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  placeholder="0"
                />
                <span className="absolute right-4 md:right-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-base md:text-lg">
                  {selectedProduct.isPiece ? "pcs" : "gr"}
                </span>
              </div>
              {!selectedProduct.isPiece && (
                <div className="grid grid-cols-4 gap-1.5 md:gap-2 mb-2">
                  {[50, 100, 250, 500].map((w) => (
                    <button
                      key={w}
                      onClick={() => setWeightInput(w.toString())}
                      className="py-2.5 md:py-3 bg-white border border-gray-200 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-700 rounded-xl text-xs md:text-sm font-black text-gray-600 transition-colors shadow-sm active:scale-95"
                    >
                      +{w}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="p-5 md:p-6 pt-4 border-t border-gray-100 shrink-0 bg-white">
              <button
                onClick={handleAddToCart}
                className="w-full min-h-[48px] md:min-h-[52px] bg-gray-900 hover:bg-black text-white font-bold py-3 md:py-3.5 rounded-xl shadow-xl shadow-gray-900/20 transition-all active:scale-95 text-sm md:text-base flex justify-center items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 shrink-0" />{" "}
                <span className="whitespace-nowrap">Masukkan Keranjang</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Checkout */}
      {checkoutModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90dvh] flex flex-col overflow-hidden">
            <div className="p-5 md:p-6 pb-2 shrink-0">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl md:text-2xl font-black text-gray-900">
                  Pembayaran
                </h3>
                <button
                  onClick={() => setCheckoutModal(false)}
                  className="text-gray-400 hover:bg-gray-100 p-1.5 md:p-2 rounded-full transition-colors bg-gray-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="px-5 md:px-6 py-2 overflow-y-auto custom-scrollbar flex-1">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-5 md:p-6 rounded-2xl mb-5 text-center shadow-inner relative overflow-hidden shrink-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20"></div>
                <p className="text-[10px] md:text-xs text-gray-400 mb-1 font-bold uppercase tracking-widest relative z-10">
                  Total Tagihan
                </p>
                <p className="text-3xl md:text-4xl font-black text-white relative z-10">
                  {formatRp(cartTotal)}
                </p>
              </div>
              <div className="space-y-4 md:space-y-5 mb-2">
                <div>
                  <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5 md:mb-2">
                    Uang Diterima dari Pelanggan
                  </label>
                  <input
                    type="text"
                    autoFocus
                    inputMode="numeric"
                    className="w-full text-xl md:text-2xl font-black p-3 md:p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-right transition-all"
                    value={cashInput}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setCashInput(val ? formatRp(parseInt(val)) : "");
                    }}
                    placeholder="Rp 0"
                  />
                </div>
                {cashInput &&
                  parseInt(cashInput.replace(/\D/g, "")) >= cartTotal && (
                    <div className="p-3 md:p-4 bg-emerald-50 text-emerald-900 rounded-xl border-2 border-emerald-100 flex justify-between items-center animate-in fade-in shrink-0">
                      <span className="font-bold text-xs md:text-sm uppercase tracking-wide">
                        Kembalian
                      </span>
                      <span className="text-xl md:text-2xl font-black">
                        {formatRp(
                          parseInt(cashInput.replace(/\D/g, "")) - cartTotal,
                        )}
                      </span>
                    </div>
                  )}
              </div>
            </div>
            <div className="p-5 md:p-6 pt-4 border-t border-gray-100 shrink-0 bg-white">
              <button
                onClick={handleProcessPayment}
                className="w-full min-h-[48px] md:min-h-[52px] bg-blue-600 hover:bg-blue-700 text-white font-black py-3 md:py-3.5 px-2 rounded-xl shadow-xl shadow-blue-600/30 transition-all active:scale-95 text-sm md:text-base flex justify-center items-center"
              >
                <span className="whitespace-nowrap">
                  Proses Transaksi Selesai
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Receipt (KHUSUS OWNER) */}
      {receiptModal && (
        <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="relative animate-in zoom-in-95 duration-300 w-full max-w-[340px]">
            <button
              onClick={() => setReceiptModal(null)}
              className="absolute -top-4 -right-4 text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-800 rounded-full p-2 shadow-xl border border-gray-200 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="bg-white w-full rounded-xl shadow-2xl flex flex-col max-h-[85dvh] overflow-hidden">
              <div className="p-5 md:p-6 pb-4 shrink-0 text-center border-b-2 border-dashed border-gray-300">
                <div className="w-12 h-12 bg-gray-900 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <Receipt className="text-white w-6 h-6" />
                </div>
                <h2 className="font-black text-2xl text-gray-900 tracking-tight">
                  Toko SHAFIRA
                </h2>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">
                  Struk Pembelian
                </p>
                <div className="mt-4 text-[10px] text-gray-500 flex justify-between items-center bg-gray-50 p-2 rounded-lg font-mono">
                  <span>{receiptModal.id}</span>
                  <span>
                    {new Date(receiptModal.date).toLocaleDateString("id-ID")}
                  </span>
                </div>
              </div>
              <div className="px-5 md:px-6 py-4 overflow-y-auto custom-scrollbar flex-1">
                <div className="space-y-3">
                  {receiptModal.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-start text-sm"
                    >
                      <div className="pr-3">
                        <p className="font-bold text-gray-800 leading-tight">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 font-medium">
                          {formatWeight(item.weight, item.isPiece)}{" "}
                          <span className="mx-1 text-gray-300">x</span>{" "}
                          {formatRp(item.pricePerGram)}
                        </p>
                      </div>
                      <p className="font-black text-gray-900">
                        {formatRp(item.weight * item.pricePerGram)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-5 md:p-6 pt-0 shrink-0">
                <div className="space-y-2 mb-5 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="flex justify-between font-black text-lg text-gray-900 mb-2 pb-2 border-b border-gray-200">
                    <span>TOTAL</span>
                    <span>{formatRp(receiptModal.total)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 font-medium">
                    <span>Tunai</span>
                    <span>{formatRp(receiptModal.cash)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 font-medium">
                    <span>Kembali</span>
                    <span>{formatRp(receiptModal.change)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400 font-medium mt-3 pt-3 border-t border-gray-200 border-dashed">
                    <span>Kasir:</span>
                    <span>
                      {receiptModal.cashier} (
                      {getBranchName(receiptModal.branchId)})
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    showToast("Perintah cetak dikirim ke printer thermal.");
                    setReceiptModal(null);
                  }}
                  className="w-full min-h-[48px] flex items-center justify-center gap-2 border-2 border-gray-900 text-gray-900 font-black py-3 rounded-xl hover:bg-gray-900 hover:text-white transition-colors active:scale-95 shrink-0 text-sm"
                >
                  <Printer className="w-5 h-5 shrink-0" />{" "}
                  <span className="whitespace-nowrap">Cetak Struk Fisik</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Edit/Add Inventory */}
      {editingProduct && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90dvh] flex flex-col overflow-hidden">
            <div className="p-4 md:p-6 pb-2 shrink-0">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl md:text-2xl font-black text-gray-900">
                  {isAddingNew ? "Tambah Produk Baru" : "Edit Data Produk"}
                </h3>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setIsAddingNew(false);
                  }}
                  className="text-gray-400 hover:bg-gray-100 p-1.5 md:p-2 rounded-full transition-colors bg-gray-50"
                >
                  <X className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
              {!isAddingNew && (
                <p className="text-amber-600 font-bold mt-2 text-xs md:text-sm bg-amber-50 inline-block px-2.5 md:px-3 py-1 rounded-lg shrink-0 w-fit font-mono">
                  {editingProduct.itemCode || "-"} | {editingProduct.name}
                </p>
              )}
            </div>

            <div className="px-4 md:px-6 py-2 overflow-y-auto custom-scrollbar flex-1">
              <div className="space-y-4 md:space-y-5 mb-4">
                {isAddingNew && activeBranch === "all" && (
                  <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                    <label className="block text-xs md:text-sm font-bold text-blue-900 mb-1.5">
                      Lokasi Simpan Produk
                    </label>
                    <select
                      value={editingProduct.branchId}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          branchId: e.target.value,
                        })
                      }
                      className="w-full p-2.5 bg-white border border-blue-200 rounded-lg text-sm font-bold text-blue-800 outline-none"
                    >
                      {branches.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5 md:mb-2">
                    Nama Barang
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 md:p-4 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none font-bold text-sm md:text-base transition-all"
                    value={editingProduct.name}
                    placeholder="Contoh: Tembakau Gayo"
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5 md:mb-2">
                      Kode Barang
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 md:p-4 border-2 border-gray-200 rounded-xl focus:border-amber-50 outline-none font-bold text-sm md:text-base transition-all bg-white"
                      value={editingProduct.itemCode || ""}
                      placeholder="Contoh: A1"
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          itemCode: e.target.value.toUpperCase(),
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5 md:mb-2">
                      Tipe Jual
                    </label>
                    <select
                      className="w-full p-3 md:p-4 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none font-bold text-sm md:text-base transition-all bg-white"
                      value={editingProduct.isPiece ? "true" : "false"}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          isPiece: e.target.value === "true",
                        })
                      }
                    >
                      <option value="false">Timbang (Gram)</option>
                      <option value="true">Satuan (Pcs)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] md:text-xs font-bold text-gray-700 mb-1.5">
                      Harga Jual / {editingProduct.isPiece ? "Pcs" : "Gr"}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-xs md:text-sm">
                        Rp
                      </span>
                      <input
                        type="number"
                        inputMode="numeric"
                        className="w-full py-2.5 md:py-3 pl-8 md:pl-9 pr-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none font-bold text-sm md:text-base transition-all"
                        value={editingProduct.pricePerGram || ""}
                        placeholder="0"
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            pricePerGram: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] md:text-xs font-bold text-gray-700 mb-1.5">
                      Harga Kulak / {editingProduct.isPiece ? "Pcs" : "Gr"}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-xs md:text-sm">
                        Rp
                      </span>
                      <input
                        type="number"
                        inputMode="numeric"
                        className="w-full py-2.5 md:py-3 pl-8 md:pl-9 pr-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none font-bold text-sm md:text-base transition-all"
                        value={editingProduct.costPerGram || ""}
                        placeholder="0"
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            costPerGram: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5 md:mb-2 flex justify-between items-end">
                    <span>
                      Stok Fisik ({editingProduct.isPiece ? "Pcs" : "Gram"})
                    </span>
                    {!isAddingNew && (
                      <span className="text-[10px] md:text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-bold">
                        Aktual:{" "}
                        {formatWeight(
                          editingProduct.stockGrams || 0,
                          editingProduct.isPiece,
                        )}
                      </span>
                    )}
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    className="w-full p-3 md:p-4 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none font-bold text-base md:text-lg transition-all"
                    value={editingProduct.stockGrams || ""}
                    placeholder="0"
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        stockGrams: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="p-4 md:p-6 pt-4 border-t border-gray-100 shrink-0 bg-white">
              <button
                onClick={handleSaveInventory}
                className="w-full min-h-[48px] md:min-h-[56px] flex justify-center items-center gap-1.5 md:gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 md:py-4 rounded-xl shadow-xl shadow-emerald-600/20 transition-all active:scale-95 text-sm md:text-base"
              >
                <Save className="w-4 h-4 md:w-5 md:h-5 shrink-0" />{" "}
                <span className="whitespace-nowrap">Simpan Data Produk</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 5: Delete Confirmation */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[80] p-4">
          <div className="bg-white rounded-3xl p-5 md:p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200 text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
              <Trash2 className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
            </div>
            <h3 className="text-lg md:text-xl font-black text-gray-900 mb-1.5 md:mb-2">
              Hapus Produk?
            </h3>
            <p className="text-gray-500 text-xs md:text-sm mb-5 md:mb-6">
              Tindakan ini tidak dapat dibatalkan. Produk akan dihapus secara
              permanen dari sistem gudang.
            </p>
            <div className="flex gap-2.5 md:gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 py-2.5 md:py-3 font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-sm md:text-base"
              >
                Batal
              </button>
              <button
                onClick={() => handleDeleteProduct(confirmDeleteId)}
                className="flex-1 py-2.5 md:py-3 font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-lg shadow-red-600/20 transition-colors text-sm md:text-base"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 6: Transaction Delete Confirmation */}
      {confirmDeleteTransactionId && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[80] p-4">
          <div className="bg-white rounded-3xl p-5 md:p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200 text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
              <Trash2 className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
            </div>
            <h3 className="text-lg md:text-xl font-black text-gray-900 mb-1.5 md:mb-2">
              Hapus Riwayat?
            </h3>
            <p className="text-gray-500 text-xs md:text-sm mb-5 md:mb-6">
              Tindakan ini tidak dapat dibatalkan. Data riwayat transaksi ini
              akan dihapus permanen dari laporan.
            </p>
            <div className="flex gap-2.5 md:gap-3">
              <button
                onClick={() => setConfirmDeleteTransactionId(null)}
                className="flex-1 py-2.5 md:py-3 font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-sm md:text-base"
              >
                Batal
              </button>
              <button
                onClick={() =>
                  handleDeleteTransaction(confirmDeleteTransactionId)
                }
                className="flex-1 py-2.5 md:py-3 font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-lg shadow-red-600/20 transition-colors text-sm md:text-base"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed top-6 lg:bottom-6 lg:top-auto left-1/2 -translate-x-1/2 z-[90] animate-in fade-in slide-in-from-top-5 lg:slide-in-from-bottom-5">
          <div
            className={`flex items-center gap-2.5 md:gap-3 px-4 md:px-6 py-3 md:py-4 rounded-2xl shadow-2xl font-bold text-xs md:text-sm border ${toast.type === "error" ? "bg-red-50 text-red-700 border-red-200" : "bg-gray-900 text-white border-gray-800"}`}
          >
            {toast.type === "error" ? (
              <AlertCircle className="w-4 h-4 md:w-5 md:h-5" />
            ) : (
              <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" />
            )}
            {toast.message}
          </div>
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #E2E8F0; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #CBD5E1; }
        input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
        .pb-safe { padding-bottom: env(safe-area-inset-bottom); }
      `,
        }}
      />
    </div>
  );
}
