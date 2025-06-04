import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { getAccounts, saveAccounts } from '@/services/accountService';

const HallManagement = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = React.useState(() => getAccounts());

  const handleHallChange = (id, value) => {
    const updated = accounts.map((acc) =>
      acc.id === id ? { ...acc, hall: value } : acc
    );
    setAccounts(updated);
    saveAccounts(updated);
  };

  const hallAccounts = accounts.filter((acc) =>
    (acc.groups || []).some((g) => g === '厅管' || g === '主持')
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 text-center relative"
    >
      <h1 className="text-3xl font-bold mb-8 text-gray-800">分厅管理</h1>
      <Card className="shadow">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">用户名</th>
                <th className="p-2 border">分组</th>
                <th className="p-2 border">隶属厅</th>
              </tr>
            </thead>
            <tbody>
              {hallAccounts.map((acc) => (
                <tr key={acc.id} className="border-t">
                  <td className="p-2">{acc.username}</td>
                  <td className="p-2">{(acc.groups || []).join(', ')}</td>
                  <td className="p-2">
                    <Input
                      type="text"
                      value={acc.hall || ''}
                      onChange={(e) => handleHallChange(acc.id, e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
      <div className="mt-6 flex justify-center">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          返回
        </Button>
      </div>
    </motion.div>
  );
};

export default HallManagement;
