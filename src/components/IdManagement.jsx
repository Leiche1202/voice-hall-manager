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
import { getGroups } from '@/services/groupService';

const emptyAccount = { username: '', password: '', groups: [] };

const IdManagement = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = React.useState(() => getAccounts());
  const [newAccount, setNewAccount] = React.useState(emptyAccount);
  const groups = React.useMemo(() => getGroups(), []);

  const handleChange = (index, field, value) => {
    const updated = [...accounts];
    if (field === 'groups') {
      const options = Array.from(value.options).filter((o) => o.selected).map((o) => o.value);
      updated[index].groups = options;
    } else {
      updated[index][field] = value;
    }
    setAccounts(updated);
    saveAccounts(updated);
  };

  const handleAdd = () => {
    const account = {
      ...newAccount,
      id: Date.now().toString()
    };
    addAccount(account);
    const updated = getAccounts();
    setAccounts(updated);
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
      <table className="w-full text-left border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">账户</th>
            <th className="p-2 border">用户名</th>
            <th className="p-2 border">密码</th>
            <th className="p-2 border">分组</th>
            <th className="p-2 border"></th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((acc, idx) => (
            <tr key={acc.id} className="border-t">
              <td className="p-2">账户 {idx + 1}</td>
              <td className="p-2">
                <Input
                  type="text"
                  value={acc.username}
                  onChange={(e) => handleChange(idx, 'username', e.target.value)}
                />
              </td>
              <td className="p-2">
                <Input
                  type="text"
                  value={acc.password}
                  onChange={(e) => handleChange(idx, 'password', e.target.value)}
                />
              </td>
              <td className="p-2">
                <select
                  multiple
                  value={acc.groups || []}
                  onChange={(e) => handleChange(idx, 'groups', e.target)}
                  className="w-full border rounded px-2 py-1"
                >
                  {groups.map((g) => (
                    <option key={g.name} value={g.name}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </td>
              <td className="p-2">
                <Button variant="destructive" onClick={() => handleDelete(idx)}>
                  删除
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
            multiple
            value={newAccount.groups}
            onChange={(e) => {
              const options = Array.from(e.target.options)
                .filter((o) => o.selected)
                .map((o) => o.value);
              setNewAccount({ ...newAccount, groups: options });
            }}
            className="w-full border rounded px-2 py-1"
          >
            {groups.map((g) => (
              <option key={g.name} value={g.name}>
                {g.name}
              </option>
            ))}
          </select>
          <Button onClick={handleAdd}>添加</Button>
        </CardContent>
      </Card>
      <div className="mt-6 flex justify-center gap-4">
        <Button onClick={() => navigate('/group-management')}>分组编辑</Button>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          返回
        </Button>
      </div>
    </motion.div>
  );
};

export default IdManagement;
