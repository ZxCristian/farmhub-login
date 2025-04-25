import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis} from 'recharts';
import Sidebar from './Sidebar';
import '../Dashboard.css';

const weeklySalesData = [
  { date: '1 Feb', sales: 2000 },
  { date: '2 Feb', sales: 3000 },
  { date: '3 Feb', sales: 2500 },
  { date: '4 Feb', sales: 4000 },
  { date: '5 Feb', sales: 3500 },
  { date: '6 Feb', sales: 3000 },
];

const monthlySalesData = [
  { date: 'Week 1', sales: 15000 },
  { date: 'Week 2', sales: 18000 },
  { date: 'Week 3', sales: 16000 },
  { date: 'Week 4', sales: 20000 },
];

const yearlySalesData = [
  { date: 'Jan', sales: 60000 },
  { date: 'Feb', sales: 65000 },
  { date: 'Mar', sales: 70000 },
  { date: 'Apr', sales: 68000 },
  { date: 'May', sales: 72000 },
  { date: 'Jun', sales: 75000 },
  { date: 'Jul', sales: 78000 },
  { date: 'Aug', sales: 80000 },
  { date: 'Sep', sales: 82000 },
  { date: 'Oct', sales: 85000 },
  { date: 'Nov', sales: 88000 },
  { date: 'Dec', sales: 90000 },
];

const weeklyAovData = [
  { date: '1 Feb', aov: 35000 },
  { date: '2 Feb', aov: 36000 },
  { date: '3 Feb', aov: 34000 },
  { date: '4 Feb', aov: 37000 },
  { date: '5 Feb', aov: 35500 },
  { date: '6 Feb', aov: 35000 },
];

const monthlyAovData = [
  { date: 'Week 1', aov: 35000 },
  { date: 'Week 2', aov: 36000 },
  { date: 'Week 3', aov: 35500 },
  { date: 'Week 4', aov: 36500 },
];

const yearlyAovData = [
  { date: 'Jan', aov: 34000 },
  { date: 'Feb', aov: 35541.38 },
  { date: 'Mar', aov: 36000 },
  { date: 'Apr', aov: 35000 },
  { date: 'May', aov: 36500 },
  { date: 'Jun', aov: 37000 },
  { date: 'Jul', aov: 37500 },
  { date: 'Aug', aov: 38000 },
  { date: 'Sep', aov: 38500 },
  { date: 'Oct', aov: 39000 },
  { date: 'Nov', aov: 39500 },
  { date: 'Dec', aov: 40000 },
];

const weeklyPreOrderData = [
  { date: '1 Feb', orders: 800 },
  { date: '2 Feb', orders: 600 },
  { date: '3 Feb', orders: 500 },
  { date: '4 Feb', orders: 400 },
  { date: '5 Feb', orders: 300 },
  { date: '6 Feb', orders: 200 },
];

const monthlyPreOrderData = [
  { date: 'Week 1', orders: 2500 },
  { date: 'Week 2', orders: 2200 },
  { date: 'Week 3', orders: 2000 },
  { date: 'Week 4', orders: 1800 },
];

const yearlyPreOrderData = [
  { date: 'Jan', orders: 10000 },
  { date: 'Feb', orders: 9500 },
  { date: 'Mar', orders: 9000 },
  { date: 'Apr', orders: 8500 },
  { date: 'May', orders: 8000 },
  { date: 'Jun', orders: 7500 },
  { date: 'Jul', orders: 7000 },
  { date: 'Aug', orders: 6500 },
  { date: 'Sep', orders: 6000 },
  { date: 'Oct', orders: 5500 },
  { date: 'Nov', orders: 5000 },
  { date: 'Dec', orders: 4500 },
];

function Dashboard() {
  const [salesPeriod, setSalesPeriod] = useState('weekly');
  const [aovPeriod, setAovPeriod] = useState('weekly');
  const [preOrderPeriod, setPreOrderPeriod] = useState('weekly');

  const getSalesData = () => {
    switch (salesPeriod) {
      case 'weekly':
        return weeklySalesData;
      case 'monthly':
        return monthlySalesData;
      case 'yearly':
        return yearlySalesData;
      default:
        return weeklySalesData;
    }
  };

  const getSalesTotal = () => {
    switch (salesPeriod) {
      case 'weekly':
        return '₱17.7K';
      case 'monthly':
        return '₱69.0K';
      case 'yearly':
        return '₱928.0K';
      default:
        return '₱17.7K';
    }
  };

  const getSalesChange = () => {
    switch (salesPeriod) {
      case 'weekly':
        return '▼ 5.7% vs. yesterday';
      case 'monthly':
        return '▲ 2.3% vs. last month';
      case 'yearly':
        return '▲ 8.5% vs. last year';
      default:
        return '▼ 5.7% vs. yesterday';
    }
  };

  const getAovData = () => {
    switch (aovPeriod) {
      case 'weekly':
        return weeklyAovData;
      case 'monthly':
        return monthlyAovData;
      case 'yearly':
        return yearlyAovData;
      default:
        return weeklyAovData;
    }
  };

  const getAovTotal = () => {
    switch (aovPeriod) {
      case 'weekly':
        return '₱35,541.38';
      case 'monthly':
        return '₱35,750.00';
      case 'yearly':
        return '₱37,000.00';
      default:
        return '₱35,541.38';
    }
  };

  const getAovChange = () => {
    switch (aovPeriod) {
      case 'weekly':
        return '▲ 1.2% vs. last week';
      case 'monthly':
        return '▲ 2.0% vs. last month';
      case 'yearly':
        return '▲ 5.7% vs. last year';
      default:
        return '▲ 1.2% vs. last week';
    }
  };

  const getPreOrderData = () => {
    switch (preOrderPeriod) {
      case 'weekly':
        return weeklyPreOrderData;
      case 'monthly':
        return monthlyPreOrderData;
      case 'yearly':
        return yearlyPreOrderData;
      default:
        return weeklyPreOrderData;
    }
  };

  const getPreOrderTotal = () => {
    const data = getPreOrderData();
    const total = data.reduce((sum, item) => sum + item.orders, 0);
    return total.toLocaleString();
  };

  const getPreOrderChange = () => {
    switch (preOrderPeriod) {
      case 'weekly':
        return '▼ 3.5% vs. last week';
      case 'monthly':
        return '▲ 1.8% vs. last month';
      case 'yearly':
        return '▲ 4.2% vs. last year';
      default:
        return '▼ 3.5% vs. last week';
    }
  };

  return (
    <div className="dashboard">
      <Sidebar activePage="Dashboard" />
      <div className="main-content dashboard-bg">
        <h1>DASHBOARD</h1>
        <div className="dashboard-grid">
          <div className="card sales">
            <h3>Sales</h3>
            <p className="value">{getSalesTotal()}</p>
            <p className={`change ${salesPeriod === 'weekly' ? 'down' : 'up'}`}>
              {getSalesChange()}
            </p>
            <div className="sales-period-tabs">
              <button
                className={salesPeriod === 'weekly' ? 'active' : ''}
                onClick={() => setSalesPeriod('weekly')}
              >
                Weekly
              </button>
              <button
                className={salesPeriod === 'monthly' ? 'active' : ''}
                onClick={() => setSalesPeriod('monthly')}
              >
                Monthly
              </button>
              <button
                className={salesPeriod === 'yearly' ? 'active' : ''}
                onClick={() => setSalesPeriod('yearly')}
              >
                Yearly
              </button>
            </div>
            <h4>
              {salesPeriod.charAt(0).toUpperCase() + salesPeriod.slice(1)}
            </h4>
            <LineChart width={200} height={100} data={getSalesData()}>
              <Line type="monotone" dataKey="sales" stroke="#00C49F" />
              <XAxis dataKey="date" hide />
              <YAxis hide />
            </LineChart>
          </div>
          <div className="card aov">
            <h3>AOV</h3>
            <p className="value">{getAovTotal()}</p>
            <p className="change up">{getAovChange()}</p>
            <div className="aov-period-tabs">
              <button
                className={aovPeriod === 'weekly' ? 'active' : ''}
                onClick={() => setAovPeriod('weekly')}
              >
                Weekly
              </button>
              <button
                className={aovPeriod === 'monthly' ? 'active' : ''}
                onClick={() => setAovPeriod('monthly')}
              >
                Monthly
              </button>
              <button
                keep
                className={aovPeriod === 'yearly' ? 'active' : ''}
                onClick={() => setAovPeriod('yearly')}
              >
                Yearly
              </button>
            </div>
            <h4>
              {aovPeriod.charAt(0).toUpperCase() + aovPeriod.slice(1)}
            </h4>
            <LineChart width={200} height={100} data={getAovData()}>
              <Line type="monotone" dataKey="aov" stroke="#00C49F" />
              <XAxis dataKey="date" hide />
              <YAxis hide />
            </LineChart>
          </div>
          <div className="card orders">
            <h3>Unfulfilled orders - Today</h3>
            <table>
              <thead>
                <tr>
                  <th>NUMBER</th>
                  <th>PAYMENT STATUS</th>
                  <th>TOTAL</th>
                  <th>TAGS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>101</td>
                  <td>Paid</td>
                  <td>₱32.22</td>
                  <td>Organic</td>
                </tr>
                <tr>
                  <td>234</td>
                  <td>Paid</td>
                  <td>₱27.78</td>
                  <td>Fresh</td>
                </tr>
                <tr>
                  <td>436</td>
                  <td>Refunded</td>
                  <td>₱56</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>879</td>
                  <td>Partially refunded</td>
                  <td>₱56.9</td>
                  <td>Organic</td>
                </tr>
                <tr>
                  <td>901</td>
                  <td>Refunded</td>
                  <td>₱4,376</td>
                  <td>Fresh</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="card cancellations">
            <h3>Cancellations</h3>
            <p className="value">15</p>
            <p className="change down">▼ 67% vs. last month</p>
            <table>
              <thead>
                <tr>
                  <th>REASON</th>
                  <th>NUMBER</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Declined</td>
                  <td>9</td>
                </tr>
                <tr>
                  <td>Out of Stock</td>
                  <td>4</td>
                </tr>
                <tr>
                  <td>Customer Cancelled</td>
                  <td>2</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="card best-sellers">
            <h3>Best sellers - this week</h3>
            <table>
              <thead>
                <tr>
                  <th>PRODUCT</th>
                  <th>SOLD</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Carrots</td>
                  <td>350</td>
                </tr>
                <tr>
                  <td>Tomatoes</td>
                  <td>320</td>
                </tr>
                <tr>
                  <td>Potatoes</td>
                  <td>280</td>
                </tr>
                <tr>
                  <td>Broccoli</td>
                  <td>200</td>
                </tr>
                <tr>
                  <td>Cucumbers</td>
                  <td>150</td>
                </tr>
                <tr>
                  <td>Spinach</td>
                  <td>120</td>
                </tr>
                <tr>
                  <td>Onions</td>
                  <td>90</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="card pre-orders">
            <h3>Active Pre-orders</h3>
            <p className="value">{getPreOrderTotal()}</p>
            <p className={`change ${preOrderPeriod === 'weekly' ? 'down' : 'up'}`}>
              {getPreOrderChange()}
            </p>
            <div className="pre-order-period-tabs">
              <button
                className={preOrderPeriod === 'weekly' ? 'active' : ''}
                onClick={() => setPreOrderPeriod('weekly')}
              >
                Weekly
              </button>
              <button
                className={preOrderPeriod === 'monthly' ? 'active' : ''}
                onClick={() => setPreOrderPeriod('monthly')}
              >
                Monthly
              </button>
              <button
                className={preOrderPeriod === 'yearly' ? 'active' : ''}
                onClick={() => setPreOrderPeriod('yearly')}
              >
                Yearly
              </button>
            </div>
            <h4>
              {preOrderPeriod.charAt(0).toUpperCase() + preOrderPeriod.slice(1)}
            </h4>
            <LineChart width={200} height={100} data={getPreOrderData()}>
              <Line type="monotone" dataKey="orders" stroke="#00C49F" />
              <XAxis dataKey="date" hide />
              <YAxis hide />
            </LineChart>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;