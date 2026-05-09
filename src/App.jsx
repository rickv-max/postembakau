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
  TrendingUp,
  X,
  Edit3,
  Save,
  Calculator,
  ChevronUp,
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
} from "lucide-react";

// --- DATA AWAL (MOCK DATABASE) ---

const INITIAL_USERS = [
  {
    id: 1,
    username: "kasir",
    password: "123",
    name: "Rangga (Kasir)",
    role: "Kasir",
  },
  {
    id: 2,
    username: "admin",
    password: "admin",
    name: "Bpk. Pemilik",
    role: "Owner",
  },
];

const INITIAL_INVENTORY = [
  {
    id: 1,
    name: "Tembakau Gayo Aceh",
    pricePerGram: 150,
    stockGrams: 10000,
    category: "Nusantara",
  },
  {
    id: 2,
    name: "Tembakau Temanggung",
    pricePerGram: 200,
    stockGrams: 10000,
    category: "Nusantara",
  },
  {
    id: 3,
    name: "Tembakau Kasturi",
    pricePerGram: 120,
    stockGrams: 10000,
    category: "Nusantara",
  },
  {
    id: 4,
    name: "Tembakau Darmawangi",
    pricePerGram: 180,
    stockGrams: 10000,
    category: "Nusantara",
  },
  {
    id: 5,
    name: "Tembakau Virginia",
    pricePerGram: 250,
    stockGrams: 10000,
    category: "Import Blend",
  },
  {
    id: 6,
    name: "Tembakau Burley",
    pricePerGram: 220,
    stockGrams: 10000,
    category: "Import Blend",
  },
  {
    id: 7,
    name: "Tembakau Latakia",
    pricePerGram: 400,
    stockGrams: 10000,
    category: "Premium",
  },
  {
    id: 8,
    name: "Tembakau Perique",
    pricePerGram: 450,
    stockGrams: 10000,
    category: "Premium",
  },
  {
    id: 9,
    name: "Tembakau Oriental",
    pricePerGram: 300,
    stockGrams: 10000,
    category: "Import Blend",
  },
  {
    id: 10,
    name: "Tembakau Besuki",
    pricePerGram: 130,
    stockGrams: 10000,
    category: "Nusantara",
  },
];

const generateMockTransactions = () => {
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 15);
  return [
    {
      id: `TRX-${Date.now().toString().slice(-6)}1`,
      date: now.toISOString(),
      items: [{ name: "Tembakau Gayo Aceh", weight: 100, pricePerGram: 150 }],
      total: 15000,
      cash: 20000,
      change: 5000,
      cashier: "Rangga (Kasir)",
    },
    {
      id: `TRX-${Date.now().toString().slice(-6)}2`,
      date: lastMonth.toISOString(),
      items: [{ name: "Tembakau Virginia", weight: 50, pricePerGram: 250 }],
      total: 12500,
      cash: 15000,
      change: 2500,
      cashier: "Bpk. Pemilik",
    },
  ];
};

// --- HELPER FUNCTIONS ---
const formatRp = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatWeight = (grams) => {
  if (grams >= 1000) return `${(grams / 1000).toFixed(2)} kg`;
  return `${grams} gr`;
};

// --- MAIN APPLICATION COMPONENT ---
export default function App() {
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
  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem("tako_inventory");
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });
  const [cart, setCart] = useState([]);
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("tako_transactions");
    return saved ? JSON.parse(saved) : generateMockTransactions();
  });
  const [searchQuery, setSearchQuery] = useState("");

  // UI & MODALS STATE
  const [toast, setToast] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [weightInput, setWeightInput] = useState("");
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const [checkoutModal, setCheckoutModal] = useState(false);
  const [cashInput, setCashInput] = useState("");
  const [receiptModal, setReceiptModal] = useState(null);

  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // PROFILE & TEAM MANAGEMENT STATE
  const [profileModal, setProfileModal] = useState(false);
  const [profileTab, setProfileTab] = useState("security");
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    name: "",
    role: "Kasir",
  });

  const [selectedMonthYear, setSelectedMonthYear] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  // --- LOCAL STORAGE EFFECTS ---
  useEffect(() => {
    localStorage.setItem("tako_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("tako_currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("tako_currentUser");
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("tako_inventory", JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem("tako_transactions", JSON.stringify(transactions));
  }, [transactions]);

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
  };

  const handleChangePassword = (oldPass, newPass) => {
    if (currentUser.password !== oldPass) {
      showToast("Password lama tidak sesuai!", "error");
      return false;
    }
    setUsers((prev) =>
      prev.map((u) =>
        u.id === currentUser.id ? { ...u, password: newPass } : u,
      ),
    );
    setCurrentUser((prev) => ({ ...prev, password: newPass }));
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
    if (!newUser.name || !newUser.username || !newUser.password) {
      showToast("Mohon lengkapi semua data!", "error");
      return;
    }

    setUsers([{ ...newUser, id: Date.now() }, ...users]);
    setIsAddingUser(false);
    setNewUser({ username: "", password: "", name: "", role: "Kasir" });
    showToast("Akun karyawan berhasil dibuat");
  };

  const handleDeleteUser = (id) => {
    if (id === currentUser.id) {
      showToast("Anda tidak bisa menghapus akun sendiri!", "error");
      return;
    }
    setUsers(users.filter((u) => u.id !== id));
    showToast("Akun karyawan dihapus");
  };

  // --- CART LOGIC ---
  const filteredProducts = useMemo(() => {
    return inventory.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [inventory, searchQuery]);

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
      showToast("Masukkan berat yang valid", "error");
      return;
    }

    const existingCartItem = cart.find(
      (item) => item.id === selectedProduct.id,
    );
    const currentCartWeight = existingCartItem ? existingCartItem.weight : 0;

    if (currentCartWeight + weight > selectedProduct.stockGrams) {
      showToast(
        `Stok tidak cukup! Sisa stok: ${formatWeight(selectedProduct.stockGrams)}`,
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
      `Berhasil menambahkan ${formatWeight(weight)} ${selectedProduct.name}`,
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
        newInventory[invIndex] = {
          ...newInventory[invIndex],
          stockGrams: newInventory[invIndex].stockGrams - cartItem.weight,
        };
      }
    });
    setInventory(newInventory);

    const transaction = {
      id: `TRX-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
      items: [...cart],
      total: cartTotal,
      cash: cash,
      change: cash - cartTotal,
      cashier: currentUser.name,
    };

    setTransactions([transaction, ...transactions]);
    setCart([]);
    setCheckoutModal(false);
    setIsMobileCartOpen(false);
    setCashInput("");
    setReceiptModal(transaction);
    showToast("Pembayaran berhasil!");
  };

  const handleSaveInventory = () => {
    if (!editingProduct.name || editingProduct.pricePerGram <= 0) {
      showToast("Nama dan harga harus valid!", "error");
      return;
    }
    if (isAddingNew) {
      setInventory([{ ...editingProduct, id: Date.now() }, ...inventory]);
      showToast("Produk baru berhasil ditambahkan");
    } else {
      setInventory((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? editingProduct : p)),
      );
      showToast("Data produk berhasil diperbarui");
    }
    setEditingProduct(null);
    setIsAddingNew(false);
  };

  const handleDeleteProduct = (id) => {
    setInventory((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((item) => item.id !== id));
    if (cart.length === 1 && cart[0].id === id) setIsMobileCartOpen(false);
    setConfirmDeleteId(null);
    showToast("Produk berhasil dihapus");
  };

  const handleOpenAddProduct = () => {
    setIsAddingNew(true);
    setEditingProduct({
      name: "",
      pricePerGram: 0,
      stockGrams: 0,
      category: "Nusantara",
    });
  };

  const availableMonths = useMemo(() => {
    const months = new Set();
    transactions.forEach((trx) => {
      const d = new Date(trx.date);
      months.add(
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      );
    });
    const now = new Date();
    months.add(
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`,
    );
    return Array.from(months).sort().reverse();
  }, [transactions]);

  const filteredHistory = useMemo(() => {
    return transactions.filter((trx) => {
      const d = new Date(trx.date);
      return (
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}` ===
        selectedMonthYear
      );
    });
  }, [transactions, selectedMonthYear]);

  const formatMonthName = (YYYY_MM) => {
    const [year, month] = YYYY_MM.split("-");
    return new Date(year, parseInt(month) - 1, 1).toLocaleDateString("id-ID", {
      month: "long",
      year: "numeric",
    });
  };

  const handleExportExcel = () => {
    if (filteredHistory.length === 0) {
      showToast("Tidak ada data.", "error");
      return;
    }

    // MENGGUNAKAN TITIK KOMA (;) AGAR RAPI DI EXCEL REGIONAL INDONESIA
    const separator = ";";
    const headers = [
      "ID Transaksi",
      "Tanggal",
      "Jam",
      "Nama Kasir",
      "Daftar Pembelian",
      "Total Transaksi",
      "Tunai",
      "Kembalian",
    ];

    let grandTotal = 0;
    let grandCash = 0;
    let grandChange = 0;

    const csvData = filteredHistory.map((trx) => {
      const d = new Date(trx.date);
      // Ganti pemisah item menggunakan + agar tidak bentrok dengan karakter CSV
      const itemsStr = trx.items
        .map((item) => `${item.weight}gr ${item.name}`)
        .join(" + ");

      grandTotal += trx.total;
      grandCash += trx.cash;
      grandChange += trx.change;

      // Data string dibungkus kutip ganda, angka dibiarkan murni agar terbaca format angka di Excel
      return [
        `"${trx.id}"`,
        `"${d.toLocaleDateString("id-ID")}"`,
        `"${d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}"`,
        `"${trx.cashier || "-"}"`,
        `"${itemsStr}"`,
        trx.total,
        trx.cash,
        trx.change,
      ].join(separator);
    });

    const totalRow = [
      `""`,
      `""`,
      `""`,
      `""`,
      `"TOTAL KESELURUHAN"`,
      grandTotal,
      grandCash,
      grandChange,
    ].join(separator);

    csvData.push(totalRow);

    // Tambahkan instruksi 'sep=;' di baris pertama agar Excel tahu pemisahnya
    const csvString =
      `sep=${separator}\n` + [headers.join(separator), ...csvData].join("\n");
    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvString], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute(
      "download",
      `Laporan_Toko_Tembakau_${selectedMonthYear}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(
      `Berhasil mengunduh laporan ${formatMonthName(selectedMonthYear)}`,
    );
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
            <div className="text-center mb-8 md:mb-10">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl mx-auto flex items-center justify-center shadow-xl shadow-gray-900/20 mb-4 md:mb-6 rotate-3">
                <TrendingUp className="text-amber-400 w-8 h-8 md:w-10 md:h-10 -rotate-3" />
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                TakoPOS
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
                  {formatWeight(item.weight)}{" "}
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

  const renderPOS = () => (
    <div className="flex h-full w-full gap-4 md:gap-6 relative">
      <div className="flex-1 flex flex-col h-full min-w-0">
        <div className="mb-4 relative shrink-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cari varian tembakau..."
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
              <div className="absolute top-0 right-0 bg-gray-100 text-gray-600 text-[9px] md:text-[10px] font-bold px-2 py-1 rounded-bl-xl rounded-tr-xl truncate max-w-[60%]">
                {product.category}
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
                  / gr
                </span>
              </p>
              <div className="flex justify-between items-center pt-2 md:pt-3 border-t border-gray-100">
                <span className="text-[10px] md:text-xs text-gray-500">
                  Stok:
                </span>
                <span
                  className={`text-xs md:text-sm font-bold ${product.stockGrams < 1000 ? "text-red-500" : "text-emerald-600"}`}
                >
                  {formatWeight(product.stockGrams)}
                </span>
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full py-10 text-center text-gray-500">
              Pencarian tidak ditemukan.
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

  const renderInventory = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 h-full flex flex-col overflow-hidden relative">
      <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-gray-50/50 shrink-0">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-gray-900">
            Manajemen Gudang
          </h2>
          <p className="text-xs md:text-sm text-gray-500">
            Kontrol stok akurasi gram
          </p>
        </div>
        {/* Tombol Tambah Produk HANYA untuk Owner */}
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
                  Kategori
                </th>
                <th className="pb-3 px-2 text-sm font-bold text-gray-500 text-right">
                  Harga/Gr
                </th>
                <th className="pb-3 px-2 text-sm font-bold text-gray-500 text-right">
                  Stok Aktual
                </th>
                <th className="pb-3 px-2 text-sm font-bold text-gray-500 text-center">
                  Status
                </th>
                {/* Kolom Aksi HANYA untuk Owner */}
                {currentUser?.role === "Owner" && (
                  <th className="pb-3 px-2 text-sm font-bold text-gray-500 text-right">
                    Aksi
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {inventory.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50/50 group transition-colors"
                >
                  <td className="py-4 px-2 font-bold text-gray-800">
                    {item.name}
                  </td>
                  <td className="py-4 px-2 text-sm text-gray-500">
                    {item.category}
                  </td>
                  <td className="py-4 px-2 text-sm font-semibold text-gray-700 text-right">
                    {formatRp(item.pricePerGram)}
                  </td>
                  <td className="py-4 px-2 text-right">
                    <div className="font-black text-gray-900">
                      {formatWeight(item.stockGrams)}
                    </div>
                    <div className="text-[10px] font-medium text-gray-400">
                      {item.stockGrams} gr
                    </div>
                  </td>
                  <td className="py-4 px-2 text-center">
                    {item.stockGrams > 2000 ? (
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

                  {/* Tombol Aksi HANYA untuk Owner */}
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
              {inventory.length === 0 && (
                <tr>
                  <td
                    colSpan={currentUser?.role === "Owner" ? "6" : "5"}
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
          {inventory.map((item) => (
            <div
              key={item.id}
              className="bg-white p-3.5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900 leading-tight mb-1 text-sm">
                    {item.name}
                  </h3>
                  <span className="text-[9px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md font-semibold">
                    {item.category}
                  </span>
                </div>
                {item.stockGrams > 2000 ? (
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
                    Harga
                  </p>
                  <p className="font-bold text-sm text-gray-800">
                    {formatRp(item.pricePerGram)}
                    <span className="text-[9px] font-normal text-gray-400">
                      /gr
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-gray-500 font-semibold mb-0.5">
                    Stok
                  </p>
                  <p className="font-black text-gray-900 text-sm">
                    {formatWeight(item.stockGrams)}
                  </p>
                </div>
              </div>

              {/* Tombol Edit/Delete Mobile HANYA untuk Owner */}
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
          {inventory.length === 0 && (
            <div className="py-10 text-center text-gray-500 bg-white rounded-2xl border border-dashed border-gray-300">
              <Package className="w-10 h-10 mx-auto text-gray-300 mb-2" />
              <p className="text-sm font-medium">Gudang kosong.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 h-full flex flex-col overflow-hidden">
      <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col gap-3 md:gap-4 bg-gray-50/50 shrink-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-gray-900">
              Laporan Penjualan
            </h2>
            <p className="text-xs md:text-sm text-gray-500">
              Pilih bulan untuk melihat riwayat
            </p>
          </div>
          <div className="flex flex-row items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-48">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={selectedMonthYear}
                onChange={(e) => setSelectedMonthYear(e.target.value)}
                className="w-full pl-9 pr-4 py-2 md:py-2.5 bg-white border border-gray-200 rounded-xl text-xs md:text-sm font-bold text-gray-700 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 appearance-none shadow-sm cursor-pointer min-h-[40px] md:min-h-[44px]"
              >
                {availableMonths.map((month) => (
                  <option key={month} value={month}>
                    {formatMonthName(month)}
                  </option>
                ))}
              </select>
            </div>
            {/* Hanya Owner yang bisa export */}
            {currentUser?.role === "Owner" && (
              <button
                onClick={handleExportExcel}
                disabled={filteredHistory.length === 0}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-3 md:px-4 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-1.5 md:gap-2 transition-colors shadow-sm active:scale-95 shrink-0 min-h-[40px] md:min-h-[44px]"
              >
                <Download className="w-4 h-4 shrink-0" />
                <span className="hidden md:inline whitespace-nowrap">
                  Export Excel (CSV)
                </span>
                <span className="md:hidden whitespace-nowrap">Export</span>
              </button>
            )}
          </div>
        </div>
        {/* Hanya Owner yang bisa melihat total transaksi dan pendapatan */}
        {currentUser?.role === "Owner" && (
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
                Pendapatan
              </p>
              <p className="text-lg md:text-xl font-black text-emerald-900">
                {formatRp(
                  filteredHistory.reduce((acc, curr) => acc + curr.total, 0),
                )}
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 md:p-6 bg-slate-50 md:bg-white space-y-3 md:space-y-4 pb-6">
        {filteredHistory.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 py-20">
            <Receipt className="w-12 h-12 md:w-16 md:h-16 opacity-20 mb-3 md:mb-4" />
            <p className="font-medium text-xs md:text-sm">
              Tidak ada transaksi pada {formatMonthName(selectedMonthYear)}.
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
                        {formatWeight(item.weight)}
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
                <button
                  onClick={() => setReceiptModal(trx)}
                  className="mt-3 md:mt-4 w-full bg-gray-900 text-white text-xs md:text-sm font-bold py-2 md:py-2.5 rounded-xl hover:bg-gray-800 transition-colors flex justify-center items-center gap-1.5 md:gap-2 active:scale-95 min-h-[40px] md:min-h-[44px]"
                >
                  <Printer className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" />{" "}
                  <span className="whitespace-nowrap">Cetak Ulang</span>
                </button>
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
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
                <TrendingUp className="text-white w-4 h-4 md:w-5 md:h-5" />
              </div>
              <div>
                <h1 className="font-black text-lg md:text-xl text-gray-900 leading-none tracking-tight">
                  TakoPOS
                </h1>
                <p className="text-[8px] md:text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-0.5">
                  Sistem Tembakau
                </p>
              </div>
            </div>

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
                  {currentUser.role}
                </p>
              </div>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-md border border-white text-xs md:text-sm font-black uppercase">
                {currentUser.name.charAt(0)}
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-hidden relative max-w-7xl mx-auto w-full p-2 md:p-4 lg:p-6 pb-[72px] md:pb-6">
        {activeTab === "pos" && renderPOS()}
        {activeTab === "inventory" && renderInventory()}
        {activeTab === "history" && renderHistory()}
      </main>

      {/* BOTTOM NAVIGATION (Hanya Muncul di Mobile) */}
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

      {/* Modal 0: PROFILE & TEAM MANAGEMENT */}
      {profileModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-end lg:items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-t-3xl lg:rounded-3xl w-full max-w-md shadow-2xl animate-in slide-in-from-bottom-5 lg:zoom-in-95 duration-200 overflow-hidden pb-safe max-h-[90dvh] flex flex-col">
            <div className="bg-gray-900 p-5 md:p-6 text-center relative shrink-0">
              <button
                onClick={() => {
                  setProfileModal(false);
                  setIsAddingUser(false);
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
                {currentUser.role}
              </span>
            </div>

            {currentUser.role === "Owner" && (
              <div className="flex border-b border-gray-100 shrink-0">
                <button
                  onClick={() => {
                    setProfileTab("security");
                    setIsAddingUser(false);
                  }}
                  className={`flex-1 py-2.5 md:py-3 text-xs md:text-sm font-bold flex justify-center items-center gap-1.5 md:gap-2 border-b-2 transition-colors ${profileTab === "security" ? "border-amber-500 text-amber-600" : "border-transparent text-gray-500 hover:bg-gray-50"}`}
                >
                  <Lock className="w-3.5 h-3.5 md:w-4 md:h-4" /> Akun Saya
                </button>
                <button
                  onClick={() => setProfileTab("team")}
                  className={`flex-1 py-2.5 md:py-3 text-xs md:text-sm font-bold flex justify-center items-center gap-1.5 md:gap-2 border-b-2 transition-colors ${profileTab === "team" ? "border-amber-500 text-amber-600" : "border-transparent text-gray-500 hover:bg-gray-50"}`}
                >
                  <Users className="w-3.5 h-3.5 md:w-4 md:h-4" /> Kelola Tim
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
                                    {u.role}
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
            </div>
          </div>
        </div>
      )}

      {/* Modal 1: Add to Cart (Diubah max-w-md menjadi max-w-sm agar lebih proporsional) */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-end lg:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-t-3xl lg:rounded-3xl w-full max-w-sm shadow-2xl animate-in slide-in-from-bottom-5 lg:zoom-in-95 duration-200 max-h-[90dvh] flex flex-col overflow-hidden">
            {/* Header Modal */}
            <div className="p-5 md:p-6 pb-2 shrink-0">
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-5 lg:hidden shrink-0"></div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg md:text-xl font-black text-gray-900 leading-tight">
                    {selectedProduct.name}
                  </h3>
                  <p className="text-sm md:text-base text-amber-600 font-bold mt-0.5 md:mt-1">
                    {formatRp(selectedProduct.pricePerGram)} / gram
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
                  {formatWeight(selectedProduct.stockGrams)}
                </span>
              </div>
            </div>

            {/* Konten Scroll Modal */}
            <div className="px-5 md:px-6 py-2 overflow-y-auto custom-scrollbar flex-1">
              <label className="block text-xs md:text-sm font-bold text-gray-700 mb-3">
                Tentukan Berat (Gram)
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
                  gr
                </span>
              </div>
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
            </div>

            {/* Footer Modal (Tombol Statis) */}
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

      {/* Modal 2: Checkout (Diubah max-w-md menjadi max-w-sm agar proporsional) */}
      {checkoutModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-end lg:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-t-3xl lg:rounded-3xl w-full max-w-sm shadow-2xl animate-in slide-in-from-bottom-5 lg:zoom-in-95 duration-200 max-h-[90dvh] flex flex-col overflow-hidden">
            {/* Header Modal */}
            <div className="p-5 md:p-6 pb-2 shrink-0">
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-5 lg:hidden shrink-0"></div>
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

            {/* Konten Scroll Modal */}
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

            {/* Footer Modal (Tombol Statis) */}
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

      {/* Modal 3: Receipt (Diubah ukurannya meniru kertas struk thermal asli) */}
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
              {/* Header Struk */}
              <div className="p-5 md:p-6 pb-4 shrink-0 text-center border-b-2 border-dashed border-gray-300">
                <div className="w-12 h-12 bg-gray-900 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <Receipt className="text-white w-6 h-6" />
                </div>
                <h2 className="font-black text-2xl text-gray-900 tracking-tight">
                  TakoPOS
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

              {/* Items Struk (Scrollable) */}
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
                          {formatWeight(item.weight)}{" "}
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

              {/* Footer Struk & Tombol */}
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
                    <span>Kasir Bertugas:</span>
                    <span>{receiptModal.cashier}</span>
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
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-end lg:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-t-3xl lg:rounded-3xl w-full max-w-md shadow-2xl animate-in slide-in-from-bottom-5 lg:zoom-in-95 duration-200 max-h-[90dvh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-4 md:p-6 pb-2 shrink-0">
              <div className="w-10 h-1.5 bg-gray-200 rounded-full mx-auto mb-4 md:mb-6 lg:hidden shrink-0"></div>
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
                <p className="text-amber-600 font-bold mt-2 text-xs md:text-sm bg-amber-50 inline-block px-2.5 md:px-3 py-1 rounded-lg shrink-0 w-fit">
                  {editingProduct.name}
                </p>
              )}
            </div>

            {/* Scrollable Content */}
            <div className="px-4 md:px-6 py-2 overflow-y-auto custom-scrollbar flex-1">
              <div className="space-y-4 md:space-y-5 mb-4">
                <div>
                  <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5 md:mb-2">
                    Nama Tembakau
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
                <div>
                  <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5 md:mb-2">
                    Kategori
                  </label>
                  <select
                    className="w-full p-3 md:p-4 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none font-bold text-sm md:text-base transition-all bg-white"
                    value={editingProduct.category}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        category: e.target.value,
                      })
                    }
                  >
                    <option value="Nusantara">Nusantara</option>
                    <option value="Import Blend">Import Blend</option>
                    <option value="Premium">Premium</option>
                    <option value="Aksesoris">Aksesoris</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5 md:mb-2">
                    Harga per Gram (Rp)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 md:left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm md:text-base">
                      Rp
                    </span>
                    <input
                      type="number"
                      inputMode="numeric"
                      className="w-full py-3 md:py-4 pl-10 md:pl-12 pr-4 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none font-bold text-base md:text-lg transition-all"
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
                  <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5 md:mb-2 flex justify-between items-end">
                    <span>Stok Fisik (Gram)</span>
                    {!isAddingNew && (
                      <span className="text-[10px] md:text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-bold">
                        Aktual: {formatWeight(editingProduct.stockGrams || 0)}
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

            {/* Footer */}
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

      {/* GLOBAL TOAST NOTIFICATION */}
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
