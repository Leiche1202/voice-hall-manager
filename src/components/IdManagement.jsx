import React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import {
  getAccounts,
  addAccount,
  updateAccount,
  deleteAccount,
} from "@/services/accountService";
import { getGroups } from "@/services/groupService";

const emptyAccount = {
  username: "",
  password: "",
  phone: "",
  groups: [],
};

const IdManagement = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = React.useState([]);
  const [newAccount, setNewAccount] = React.useState(emptyAccount);
  const [removedIds, setRemovedIds] = React.useState([]);
  const [groups, setGroupList] = React.useState([]);

  React.useEffect(() => {
    getAccounts().then(setAccounts);
    getGroups().then((gs) => {
      setGroupList(gs);
    });
  }, []);

  const [dirty, setDirty] = React.useState(false);
  const [saveStatus, setSaveStatus] = React.useState("");

  React.useEffect(() => {
    if (saveStatus) {
      const t = setTimeout(() => setSaveStatus(""), 3000);
      return () => clearTimeout(t);
    }
  }, [saveStatus]);

  const handleChange = (index, field, value) => {
    const updated = [...accounts];
    updated[index][field] = value;
    setAccounts(updated);
    setDirty(true);
  };

  const toggleGroup = (index, groupName, checked) => {
    const updated = [...accounts];
    const current = updated[index].groups || [];
    updated[index].groups = checked
      ? Array.from(new Set([...current, groupName]))
      : current.filter((g) => g !== groupName);
    setAccounts(updated);
    setDirty(true);
  };

  const handleAdd = () => {
    const name = newAccount.username.trim();
    if (!name) return;
    if (accounts.some((a) => a.username === name)) {
      alert('用户名已存在');
      return;
    }
    if (newAccount.phone && accounts.some((a) => a.phone === newAccount.phone)) {
      alert('手机号已存在');
      return;
    }
    const account = {
      ...newAccount,
      id: Date.now().toString(),
      _new: true
    };
    setAccounts((prev) => [...prev, account]);
    setNewAccount(emptyAccount);
    setDirty(true);
  };

  const handleDelete = (index) => {
    setAccounts((prev) => {
      const removed = prev[index];
      if (removed && !removed._new) {
        setRemovedIds((ids) => [...ids, removed.id]);
      }
      return prev.filter((_, i) => i !== index);
    });
    setDirty(true);
  };

  const handleSave = async () => {
    setSaveStatus("正在保存...");
    try {
      for (const id of removedIds) {
        await deleteAccount(id);
      }
      for (const acc of accounts) {
        if (acc._new) {
          const saved = await addAccount(acc);
          acc.id = saved.id;
          delete acc._new;
        } else {
          await updateAccount(acc.id, acc);
        }
      }
      setRemovedIds([]);
      setAccounts([...accounts]);
      setDirty(false);
      setSaveStatus("保存成功");
    } catch (e) {
      console.error(e);
      setSaveStatus("保存失败");
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 text-center relative"
    >
      <h1 className="text-3xl font-bold mb-8 text-gray-800">用户编辑</h1>
      {saveStatus && (
        <div
          className={`mb-4 p-3 rounded-md text-center ${saveStatus.includes('失败') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
        >
          {saveStatus}
        </div>
      )}
      <Card className="shadow">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">账户</th>
                <th className="p-2 border">用户名</th>
                <th className="p-2 border">手机号</th>
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
                    onChange={(e) =>
                      handleChange(idx, "username", e.target.value)
                    }
                  />
                </td>
                <td className="p-2">
                  <Input
                    type="text"
                    value={acc.phone}
                    onChange={(e) =>
                      handleChange(idx, "phone", e.target.value)
                    }
                  />
                </td>
                <td className="p-2">
                  <Input
                    type="text"
                    value={acc.password}
                    onChange={(e) =>
                      handleChange(idx, "password", e.target.value)
                      }
                    />
                  </td>
                  <td className="p-2">
                    <div className="flex flex-wrap gap-2">
                      {groups.map((g) => (
                        <label
                          key={g.name}
                          className="flex items-center space-x-1"
                        >
                          <input
                            type="checkbox"
                            checked={(acc.groups || []).includes(g.name)}
                            onChange={(e) =>
                              toggleGroup(idx, g.name, e.target.checked)
                            }
                            className="form-checkbox"
                          />
                          <span>{g.name}</span>
                        </label>
                      ))}
                    </div>
                  </td>
                  <td className="p-2">
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(idx)}
                    >
                      删除
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
      <div className="mt-4">
        <Button onClick={handleSave} disabled={!dirty}>
          保存修改
        </Button>
      </div>
      <Card className="shadow mt-6">
        <CardHeader>
          <CardTitle className="text-xl">新增账户</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input
            type="text"
            value={newAccount.username}
            onChange={(e) =>
              setNewAccount({ ...newAccount, username: e.target.value })
            }
            placeholder="用户名"
          />
          <Input
            type="text"
            value={newAccount.phone}
            onChange={(e) =>
              setNewAccount({ ...newAccount, phone: e.target.value })
            }
            placeholder="手机号"
          />
          <Input
            type="text"
            value={newAccount.password}
            onChange={(e) =>
              setNewAccount({ ...newAccount, password: e.target.value })
            }
            placeholder="密码"
          />
          <div className="flex flex-wrap gap-2">
            {groups.map((g) => (
              <label key={g.name} className="flex items-center space-x-1">
                <input
                  type="checkbox"
                  checked={newAccount.groups.includes(g.name)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setNewAccount((prev) => {
                      const current = prev.groups;
                      const updated = checked
                        ? Array.from(new Set([...current, g.name]))
                        : current.filter((n) => n !== g.name);
                      return { ...prev, groups: updated };
                    });
                  }}
                  className="form-checkbox"
                />
                <span>{g.name}</span>
              </label>
            ))}
          </div>
          <Button type="button" onClick={handleAdd}>添加</Button>
        </CardContent>
      </Card>
      <div className="mt-6 flex justify-center gap-4">
        <Button onClick={() => navigate("/permission-management")}>权限管理</Button>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          返回
        </Button>
      </div>
    </motion.div>
  );
};

export default IdManagement;
