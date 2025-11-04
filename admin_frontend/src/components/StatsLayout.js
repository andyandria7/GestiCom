  import React, { useEffect, useState, useMemo } from "react";
  import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    AreaChart,
    Area,
  } from "recharts";
  import api from "../services/api";

  const monthNames = {
    1: "Jan",
    2: "Fév",
    3: "Mar",
    4: "Avr",
    5: "Mai",
    6: "Juin",
    7: "Juil",
    8: "Août",
    9: "Sep",
    10: "Oct",
    11: "Nov",
    12: "Déc",
  };

  export default function StatsLayout() {
    const [data, setData] = useState(null);

    const COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

    useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await api.get("api/stats/dashboard");
      console.log("Fetched data:", response.data);
      setData({
        ...response.data,
        userDistribution: response.data.userDistribution.map((u) => ({
          ...u,
          count: Number(u.count),
        })),
        packsPerMonth: response.data.packsPerMonth.map((item) => ({
          ...item,
          count: Number(item.count),
        })),
        deliveriesPerMonth: Array.isArray(response.data.deliveriesPerMonth)
          ? response.data.deliveriesPerMonth.map((item) => ({
              ...item,
              count: Number(item.count),
            }))
          : [],  // Default to an empty array if not an array
        totalClients: response.data.totalClients,
      });
    } catch (error) {
      console.error("Erreur lors du chargement des stats :", error);
    }
  };
  fetchData();
}, []);



    const { mergedFinancialData, mergedActivityData } = useMemo(() => {
      if (!data)
        return { mergedFinancialData: [], mergedActivityData: [] };

      const initializeMonth = (month) => ({
        month: monthNames[month] || `Mois ${month}`,
        total_invested: 0,
        total_withdrawn: 0,
      });

      const initializeActivityMonth = (month) => ({
        month: monthNames[month] || `Mois ${month}`,
        packs_count: 0,
        products_count: 0,
        deliveries_count: 0,
      });

      const financialMap = new Map();
      data.investments.forEach((item) => {
        if (!financialMap.has(item.month))
          financialMap.set(item.month, initializeMonth(item.month));
        financialMap.get(item.month).total_invested = item.total_invested;
      });
      data.withdrawals.forEach((item) => {
        if (!financialMap.has(item.month))
          financialMap.set(item.month, initializeMonth(item.month));
        financialMap.get(item.month).total_withdrawn = item.total_withdrawn;
      });
      const mergedFinancialData = Array.from(financialMap.values());

      const activityMap = new Map();
      data.packsPerMonth.forEach((item) => {
        if (!activityMap.has(item.month))
          activityMap.set(item.month, initializeActivityMonth(item.month));
        activityMap.get(item.month).packs_count = item.count;
      });
       data.deliveriesPerMonth.forEach((item) => {
      if (!activityMap.has(item.month))
        activityMap.set(item.month, initializeActivityMonth(item.month));
      activityMap.get(item.month).deliveries_count = item.count;
    });
      data.productsPerMonth.forEach((item) => {
        if (!activityMap.has(item.month))
          activityMap.set(item.month, initializeActivityMonth(item.month));
        activityMap.get(item.month).products_count = item.count;
      });
      const mergedActivityData = Array.from(activityMap.values());

      return { mergedFinancialData, mergedActivityData };
    }, [data]);

    if (!data)
      return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-xl font-semibold text-blue-700">
              Chargement des données...
            </p>
          </div>
        </div>
      );

    const Card = ({ title, icon, children, gradient }) => (
      <div className={`bg-white p-6 rounded-2xl shadow-xl border-0 mb-8 hover:shadow-2xl transition-all duration-300 ${gradient ? 'bg-gradient-to-br ' + gradient : ''}`}>
        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-100">
          <span className="text-3xl">{icon}</span>
          <h2 className="text-2xl font-bold text-gray-800">
            {title}
          </h2>
        </div>
        {children}
      </div>
    );

    const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        return (
          <div className="bg-white p-4 rounded-xl shadow-2xl border border-gray-200">
            <p className="font-bold text-gray-800 mb-2">{label}</p>
            {payload.map((entry, index) => (
              <p key={index} style={{ color: entry.color }} className="text-sm font-semibold">
                {entry.name}: {entry.value.toLocaleString()} {entry.name.includes('Montant') ? 'Ar' : ''}
              </p>
            ))}
          </div>
        );
      }
      return null;
    };

    return (
      <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen font-sans">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Tableau de Bord des Statistiques
            </h1>
            <p className="text-gray-600 text-lg">Vue d'ensemble de vos performances</p>
          </div>

          {/* Graphique Deliveries avec courbes lisses */}
          <Card title="Tendances de Livraison Mensuelles" icon="🚚">
            <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mergedActivityData}>
                <defs>
                  <linearGradient id="colorPacks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="colorDeliveries" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="5 5" stroke="#e0e0e0" opacity={0.3} />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="natural"
                  dataKey="packs_count"
                  name="Packs Créés"
                  stroke="#10B981"
                  fill="url(#colorPacks)"
                />
                <Area
                  type="natural"
                  dataKey="deliveries_count"
                  name="Livraisons Validées"
                  stroke="#EF4444"
                  fill="url(#colorDeliveries)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          </Card>

          {/* Display total clients */}
        <Card title="Nombre Total de Clients" icon="👥">
          <div className="text-center text-2xl font-bold">{data.totalClients}</div>
        </Card>

          {/* Graphique financier avec courbes lisses */}
          <Card title="Tendances Financières Mensuelles" icon="💰">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mergedFinancialData}>
                  <defs>
                    <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="colorWithdrawn" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="5 5" stroke="#e0e0e0" opacity={0.3} />
                  <XAxis
                    dataKey="month"
                    stroke="#6B7280"
                    style={{ fontSize: '14px', fontWeight: '500' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                    stroke="#6B7280"
                    style={{ fontSize: '14px', fontWeight: '500' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="circle"
                  />
                  <Area
                    type="natural"
                    dataKey="total_invested"
                    name="Montant Investi"
                    stroke="#3B82F6"
                    strokeWidth={2.5}
                    fill="url(#colorInvested)"
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4, strokeOpacity: 0.8 }}
                    activeDot={{
                      r: 6,
                      strokeWidth: 2,
                      stroke: '#fff',
                      strokeOpacity: 1
                    }}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  />
                  <Area
                    type="natural"
                    dataKey="total_withdrawn"
                    name="Montant Retiré"
                    stroke="#EF4444"
                    strokeWidth={2.5}
                    fill="url(#colorWithdrawn)"
                    dot={{ fill: '#EF4444', strokeWidth: 2, r: 4, strokeOpacity: 0.8 }}
                    activeDot={{
                      r: 6,
                      strokeWidth: 2,
                      stroke: '#fff',
                      strokeOpacity: 1
                    }}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Graphique activité avec courbes lisses */}
          <Card title="Tendances de Création Mensuelles" icon="📊">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mergedActivityData}>
                  <defs>
                    <linearGradient id="colorPacks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="colorProducts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="5 5" stroke="#e0e0e0" opacity={0.3} />
                  <XAxis
                    dataKey="month"
                    stroke="#6B7280"
                    style={{ fontSize: '14px', fontWeight: '500' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#6B7280"
                    style={{ fontSize: '14px', fontWeight: '500' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="circle"
                  />
                  <Area
                    type="natural"
                    dataKey="packs_count"
                    name="Packs Créés"
                    stroke="#10B981"
                    strokeWidth={2.5}
                    fill="url(#colorPacks)"
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4, strokeOpacity: 0.8 }}
                    activeDot={{
                      r: 6,
                      strokeWidth: 2,
                      stroke: '#fff',
                      strokeOpacity: 1
                    }}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  />
                  <Area
                    type="natural"
                    dataKey="products_count"
                    name="Produits Créés"
                    stroke="#F59E0B"
                    strokeWidth={2.5}
                    fill="url(#colorProducts)"
                    dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4, strokeOpacity: 0.8 }}
                    activeDot={{
                      r: 6,
                      strokeWidth: 2,
                      stroke: '#fff',
                      strokeOpacity: 1
                    }}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Répartition utilisateurs */}
            <div className="lg:col-span-1">
              <Card title="Répartition des Utilisateurs" icon="👥">
                <div className="flex justify-center items-center h-[300px]">
                  {data.userDistribution && data.userDistribution.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.userDistribution}
                          dataKey="count"
                          nameKey="role"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          innerRadius={60}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {data.userDistribution.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center text-gray-500">
                      <p className="mb-2">Aucune donnée disponible</p>
                      <p className="text-sm">Les données de répartition des utilisateurs ne sont pas disponibles</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Transactions récentes */}
            <div className="lg:col-span-2">
              <Card title="Transactions Récentes" icon="💸">
                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                  {data.recentTransactions.map((t, index) => {
    const isDeposit = ["deposit", "deposit_request", "payment_request", "invest"].includes(t.type);
    const isWithdrawal = ["withdraw", "withdrawal_request", "retrait"].includes(t.type);

    return (
      <div
        key={index}
        className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isDeposit
                ? "bg-green-100 text-green-600"
                : isWithdrawal
                ? "bg-red-100 text-red-600"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {isDeposit ? "↑" : isWithdrawal ? "↓" : "•"}
          </div>
          <span className="text-gray-700 font-medium">
            {t.first_name} {t.last_name}
          </span>
        </div>

        <div className="text-right">
          <span
            className={`font-bold text-lg ${
              isDeposit ? "text-green-600" : isWithdrawal ? "text-red-600" : "text-gray-600"
            }`}
          >
            {Number(t.amount).toLocaleString()} Ar
          </span>
          <p className="text-xs text-gray-500">
            {isDeposit ? "Investissement" : isWithdrawal ? "Retrait" : t.type}
          </p>
        </div>
      </div>
    );
  })}

                </div>
              </Card>
            </div>
          </div>
        </div>

        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
        `}</style>
      </div>
    );
  }