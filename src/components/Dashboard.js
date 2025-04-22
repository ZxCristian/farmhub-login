import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Sidebar from './Sidebar'; // Import the Sidebar component
import '../Dashboard.css';

const salesData = [
  { date: '1 Feb', sales: 2000 },
  { date: '2 Feb', sales: 3000 },
  { date: '3 Feb', sales: 2500 },
  { date: '4 Feb', sales: 4000 },
  { date: '5 Feb', sales: 3500 },
  { date: '6 Feb', sales: 3000 },
];

const discountData = [
  { date: '1 Feb', uses: 800 },
  { date: '2 Feb', sales: 600 },
  { date: '3 Feb', sales: 500 },
  { date: '4 Feb', sales: 400 },
  { date: '5 Feb', sales: 300 },
  { date: '6 Feb', sales: 200 },
];

function Dashboard() {
  return (
    <div className="dashboard">
      <Sidebar activePage="Dashboard" />
      <div className="main-content dashboard-bg">
        <h1>DASHBOARD</h1>
        <div className="dashboard-grid">
          <div className="card sales">
            <h3>Sales</h3>
            <p className="value">$17.7K</p>
            <p className="change down">▼ 5.7% vs. yesterday</p>
            <h4>This week</h4>
            <LineChart width={200} height={100} data={salesData}>
              <Line type="monotone" dataKey="sales" stroke="#00C49F" />
              <XAxis dataKey="date" hide />
              <YAxis hide />
            </LineChart>
          </div>
          <div className="card aov">
            <h3>AOV - this week</h3>
            <div className="gauge">
              <p>$35.38</p>
            </div>
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
                  <td>$32.22</td>
                  <td>Sale</td>
                </tr>
                <tr>
                  <td>234</td>
                  <td>Paid</td>
                  <td>$27.78</td>
                  <td>Sale</td>
                </tr>
                <tr>
                  <td>436</td>
                  <td>Refunded</td>
                  <td>$56</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>879</td>
                  <td>Partially refunded</td>
                  <td>$56.9</td>
                  <td>Sale</td>
                </tr>
                <tr>
                  <td>901</td>
                  <td>Refunded</td>
                  <td>$4,376</td>
                  <td>HELLO</td>
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
                  <td>Fraud</td>
                  <td>2</td>
                </tr>
                <tr>
                  <td>Inventory</td>
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
                  <td>Rouge lipstick</td>
                  <td>278</td>
                </tr>
                <tr>
                  <td>Honey lipstick</td>
                  <td>271</td>
                </tr>
                <tr>
                  <td>Max mascara</td>
                  <td>115</td>
                </tr>
                <tr>
                  <td>Lip tint</td>
                  <td>103</td>
                </tr>
                <tr>
                  <td>Brow beautiful</td>
                  <td>86</td>
                </tr>
                <tr>
                  <td>Lip liner</td>
                  <td>65</td>
                </tr>
                <tr>
                  <td>Beeswax balm</td>
                  <td>30</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="card discount">
            <h3>Discount code: HELLO - this week</h3>
            <p className="value">2,480</p>
            <h4>Uses</h4>
            <LineChart width={200} height={100} data={discountData}>
              <Line type="monotone" dataKey="sales" stroke="#00C49F" />
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