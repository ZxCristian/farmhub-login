import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Sidebar from './Sidebar';
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
  { date: '2 Feb', uses: 600 },
  { date: '3 Feb', uses: 500 },
  { date: '4 Feb', uses: 400 },
  { date: '5 Feb', uses: 300 },
  { date: '6 Feb', uses: 200 },
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
            <p className="value">₱17.7K</p>
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
              <p>₱35,0541.38</p>
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
          <div className="card discount">
            <h3>Discount code: FARMFRESH - this week</h3>
            <p className="value">2,480</p>
            <h4>Uses</h4>
            <LineChart width={200} height={100} data={discountData}>
              <Line type="monotone" dataKey="uses" stroke="#00C49F" />
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