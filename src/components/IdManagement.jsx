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

const ROLES = [
  { value: 'admin', label: '管理员' },
  { value: 'hall', label: '厅管' },
  { value: 'host', label: '主持' }
];

const emptyAccount = { username: '', password: '', role: 'host', group: '主持' };

const IdManagement = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = React.useState(() => getAccounts());
  const [newAccount, setNewAccount] = React.useState(emptyAccount);

  const handleChange = (index, field, value) => {
    const updated = [...accounts];
    updated[index][field] = value;
    if (field === 'role') {
      const r = ROLES.find((r) => r.value === value);
      if (r) updated[index].group = r.label;
    }
    setAccounts(updated);
  };

  const handleSave = () => {
    saveAccounts(accounts);
  };

  const handleAdd = () => {
    const roleInfo = ROLES.find((r) => r.value === newAccount.role);
    const account = {
      ...newAccount,
      id: Date.now().toString(),
      group: roleInfo ? roleInfo.label : newAccount.group
    };
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
              <select
                value={acc.role}
                onChange={(e) => handleChange(idx, 'role', e.target.value)}
                className="w-full border rounded px-2 py-1"
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
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
          <select
            value={newAccount.role}
            onChange={(e) => {
              const value = e.target.value;
              const info = ROLES.find((r) => r.value === value);
              setNewAccount({
                ...newAccount,
                role: value,
                group: info ? info.label : newAccount.group
              });
            }}
            className="w-full border rounded px-2 py-1"
          >
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
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
