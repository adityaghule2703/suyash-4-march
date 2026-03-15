// pages/Dashboard.jsx
import React, { useState } from 'react'
import LineChart from '../components/LineChart'
import BarChart from '../components/BarChart'
import DoughnutChart from '../components/DoughnutChart'

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Last 30 days')

  const stats = [
    { 
      label: "Total Revenue", 
      value: "$42,580", 
      change: "+12.5%", 
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ), 
      color: "from-[#074346] to-[#074346]",
      trend: "up"
    },
    { 
      label: "Total Users", 
      value: "3,847", 
      change: "+8.2%", 
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 2.1a9 9 0 10-18 0" />
        </svg>
      ), 
      color: "from-[#074346] to-[#074346]",
      trend: "up"
    },
    { 
      label: "New Orders", 
      value: "1,854", 
      change: "+23.1%", 
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ), 
      color: "from-[#074346] to-[#074346]",
      trend: "up"
    },
    { 
      label: "Growth Rate", 
      value: "42.7%", 
      change: "+5.4%", 
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ), 
      color: "from-[#074346] to-[#074346]",
      trend: "up"
    },
  ];

  const recentActivities = [
    { user: "Alex Johnson", action: "added new user", time: "2 min ago", type: "user" },
    { user: "Sarah Miller", action: "updated billing settings", time: "15 min ago", type: "settings" },
    { user: "Mike Wilson", action: "completed order #2345", time: "1 hour ago", type: "order" },
    { user: "Emma Davis", action: "uploaded monthly report", time: "2 hours ago", type: "report" },
    { user: "John Smith", action: "created new project", time: "4 hours ago", type: "project" },
  ];

  const topProducts = [
    { name: "Product A", sales: 245, revenue: "$12,450" },
    { name: "Product B", sales: 189, revenue: "$9,850" },
    { name: "Product C", sales: 156, revenue: "$7,890" },
    { name: "Product D", sales: 132, revenue: "$6,540" },
    { name: "Product E", sales: 98, revenue: "$4,920" },
  ];

  const getActivityIcon = (type) => {
    switch(type) {
      case 'user':
        return (
          <svg className="w-4 h-4 text-[#0A5C60]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'settings':
        return (
          <svg className="w-4 h-4 text-[#0A5C60]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          </svg>
        );
      case 'order':
        return (
          <svg className="w-4 h-4 text-[#0A5C60]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'report':
        return (
          <svg className="w-4 h-4 text-[#9FE2BF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-[#063B3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
    }
  };

  return (
    <div className="p-5">
      <div className="space-y-5">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-[#151C26]">Dashboard Overview</h1>
            <p className="text-xs text-[#4B5568] mt-0.5">Welcome back! Here's what's happening with your business today.</p>
          </div>
          <div className="flex items-center gap-2">
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-1.5 text-xs border border-[#E3E8EF] rounded-md focus:outline-none focus:ring-1 focus:ring-[#0A5C60] focus:border-transparent text-[#4B5568]"
            >
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
              <option>Last year</option>
            </select>
            <button className="px-3 py-1.5 text-xs bg-[#074346] text-white rounded-md hover:from-[#8ED1AE] hover:to-[#094B4F] transition-all font-medium flex items-center gap-1.5 shadow-sm">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Generate Report
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-4 border border-[#E3E8EF] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-medium text-[#4B5568] uppercase tracking-wider">{stat.label}</p>
                  <p className="text-xl font-bold text-[#151C26] mt-0.5">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium flex items-center gap-0.5 ${
                      stat.trend === 'up' ? 'bg-[#9FE2BF] text-[#063B3E]' : 'bg-red-100 text-red-700'
                    }`}>
                      {stat.trend === 'up' ? (
                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                      ) : (
                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      )}
                      {stat.change}
                    </span>
                    <span className="text-[10px] text-[#94A3B8]">from last month</span>
                  </div>
                </div>
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-sm`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Revenue Chart */}
          <div className="bg-white rounded-lg p-4 border border-[#E3E8EF] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-[#151C26]">Revenue Overview</h3>
                <p className="text-[11px] text-[#4B5568] mt-0.5">Monthly revenue and orders trends</p>
              </div>
              <select className="text-[11px] border border-[#E3E8EF] rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#0A5C60] focus:border-transparent text-[#4B5568]">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
              </select>
            </div>
            <div className="h-72">
              <LineChart />
            </div>
          </div>

          {/* Top Products Chart */}
          <div className="bg-white rounded-lg p-4 border border-[#E3E8EF] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-[#151C26]">Top Products</h3>
                <p className="text-[11px] text-[#4B5568] mt-0.5">Best selling products by revenue</p>
              </div>
              <button className="text-[11px] text-[#0A5C60] hover:text-[#063B3E] font-medium">
                View All
              </button>
            </div>
            <div className="h-72">
              <BarChart />
            </div>
          </div>
        </div>

        {/* Second Row Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Device Usage */}
          <div className="bg-white rounded-lg p-4 border border-[#E3E8EF] shadow-sm">
            <h3 className="text-sm font-semibold text-[#151C26] mb-4">Device Usage</h3>
            <div className="h-56">
              <DoughnutChart />
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg p-4 border border-[#E3E8EF] shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#151C26]">Recent Activities</h3>
              <button className="text-[11px] text-[#0A5C60] hover:text-[#063B3E] font-medium">
                View All
              </button>
            </div>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-2 hover:bg-[#F8FFFC] rounded-md transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9FE2BF] to-[#0A5C60]/20 flex items-center justify-center flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#4B5568]">
                      <span className="font-medium text-[#151C26]">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">{activity.time}</p>
                  </div>
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    index === 0 ? 'bg-[#9FE2BF]' : 
                    index === 1 ? 'bg-[#0A5C60]' : 
                    index === 2 ? 'bg-[#063B3E]' : 
                    index === 3 ? 'bg-[#128C7E]' : 'bg-[#0D696C]'
                  }`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products Table */}
        <div className="bg-white rounded-lg border border-[#E3E8EF] shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-[#E3E8EF] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#151C26]">Top Selling Products</h3>
            <button className="text-[11px] text-[#0A5C60] hover:text-[#063B3E] font-medium">
              View All Products
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[#9FE2BF]/20 to-[#0A5C60]/20">
                  <th className="text-left p-3 text-[10px] font-semibold text-[#4B5568] uppercase tracking-wider">Product</th>
                  <th className="text-left p-3 text-[10px] font-semibold text-[#4B5568] uppercase tracking-wider">Sales</th>
                  <th className="text-left p-3 text-[10px] font-semibold text-[#4B5568] uppercase tracking-wider">Revenue</th>
                  <th className="text-left p-3 text-[10px] font-semibold text-[#4B5568] uppercase tracking-wider">Growth</th>
                  <th className="text-left p-3 text-[10px] font-semibold text-[#4B5568] uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => (
                  <tr key={index} className="border-b border-[#F2F5F8] last:border-0 hover:bg-[#F8FFFC] transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded bg-gradient-to-br from-[#9FE2BF] to-[#0A5C60] flex items-center justify-center shadow-sm">
                          <span className="text-white text-[10px] font-medium">{product.name.charAt(0)}</span>
                        </div>
                        <span className="text-xs font-medium text-[#151C26]">{product.name}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="text-xs text-[#4B5568]">{product.sales}</span>
                      <span className="text-[9px] text-[#94A3B8] ml-1">units</span>
                    </td>
                    <td className="p-3 text-xs font-medium text-[#151C26]">{product.revenue}</td>
                    <td className="p-3">
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1 w-fit ${
                        index < 2 ? 'bg-[#9FE2BF] text-[#063B3E]' : 'bg-[#0A5C60]/10 text-[#0A5C60]'
                      }`}>
                        {index < 2 ? (
                          <>
                            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                            +{index === 0 ? '24' : '18'}%
                          </>
                        ) : (
                          <>
                            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                            +{index === 2 ? '12' : index === 3 ? '8' : '5'}%
                          </>
                        )}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                        index < 3 ? 'bg-[#9FE2BF] text-[#063B3E]' : 'bg-[#0A5C60]/10 text-[#0A5C60]'
                      }`}>
                        {index < 3 ? 'In Stock' : 'Low Stock'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard