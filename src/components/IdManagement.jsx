import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import {
  getAccounts,
  saveAccounts,
  addAccount,
  deleteAccount
} from '@/services/accountService';

const emptyAccount = { username: '', password: '', role: 'host', displayName: '' };

const IdManagement = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = React.useState(() => getAccounts());
  const [newAccount, setNewAccount] = React.useState(emptyAccount);

  const handleChange = (index, field, value) => {
    const updated = [...accounts];
    updated[index][field] = value;
    setAccounts(updated);
  };

  const handleSave = () => {
    saveAccounts(accounts);
  };

  const handleAdd = () => {
    const account = { ...newAccount, id: Date.now().toString() };
    addAccount(account);
    setAccounts(getAccounts());
    setNewAccount(emptyAccount);
  };

  const handleDelete = (index) => {
    deleteAccount(index);
    setAccounts(getAccounts());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 text-center relative"
    >
      <h1 className="text-3xl font-bold mb-8 text-gray-800">ID 编辑</h1>
      <div className="space-y-4">
        {accounts.map((acc, idx) => (
          <Card key={acc.id} className="shadow">
            <CardHeader>
              <CardTitle className="text-xl">账户 {idx + 1}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Input
                type="text"
                value={acc.username}
                onChange={(e) => handleChange(idx, 'username', e.target.value)}
                placeholder="用户名"
              />
              <Input
                type="text"
                value={acc.password}
                onChange={(e) => handleChange(idx, 'password', e.target.value)}
                placeholder="密码"
              />
              <Input
                type="text"
                value={acc.role}
                onChange={(e) => handleChange(idx, 'role', e.target.value)}
                placeholder="角色"
              />
              <Input
                type="text"
                value={acc.displayName}
                onChange={(e) => handleChange(idx, 'displayName', e.target.value)}
                placeholder="显示名"
              />
              <Button
                variant="destructive"
                onClick={() => handleDelete(idx)}
                className="mt-2"
              >
                删除
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="shadow mt-6">
        <CardHeader>
          <CardTitle className="text-xl">新增账户</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input
            type="text"
            value={newAccount.username}
            onChange={(e) => setNewAccount({ ...newAccount, username: e.target.value })}
            placeholder="用户名"
          />
          <Input
            type="text"
            value={newAccount.password}
            onChange={(e) => setNewAccount({ ...newAccount, password: e.target.value })}
            placeholder="密码"
          />
          <Input
            type="text"
            value={newAccount.role}
            onChange={(e) => setNewAccount({ ...newAccount, role: e.target.value })}
            placeholder="角色"
          />
          <Input
            type="text"
            value={newAccount.displayName}
            onChange={(e) => setNewAccount({ ...newAccount, displayName: e.target.value })}
            placeholder="显示名"
          />
          <Button onClick={handleAdd}>添加</Button>
        </CardContent>
      </Card>
      <div className="mt-6 flex justify-center gap-4">
        <Button onClick={handleSave}>保存修改</Button>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          返回
        </Button>
      </div>
    </motion.div>
  );
};

export default IdManagement;
