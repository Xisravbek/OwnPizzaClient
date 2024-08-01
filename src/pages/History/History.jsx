import React, { useEffect, useState } from 'react';
import './History.scss';
import { getMyBookings } from '../../server/bookingServer';
import HistoryItem from '../../components/HistoryItem/HistoryItem';
import { Pagination } from 'antd';

const History = () => {
  const [myBookings, setMyBookings] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(4);

  const handleGetMyBookings = async () => {
    try {
      const id = localStorage.getItem('myId');
      const data = await getMyBookings(id);
      setMyBookings(data.bookings);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetMyBookings();
  }, []);

  const onChange = (page, pageSize) => {
    setCurrent(page);
    setPageSize(pageSize);
  };

  const startIndex = (current - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentItems = myBookings.slice(startIndex, endIndex);

  return (
    <div className="container">
      <div className="history">
        {currentItems.map(item => (
          <HistoryItem key={item._id} item={item} />
        ))}
      </div>
      <div style={{display: 'flex' , justifyContent: "center"}}>
      <Pagination
        current={current}
        onChange={onChange}
        total={myBookings.length}
        pageSize={pageSize}
        
      />
      </div>
    </div>
  );
};

export default History;
