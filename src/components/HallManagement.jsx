import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { getAccounts, saveAccounts } from "@/services/accountService";
import { getHalls, addHall, deleteHall } from "@/services/hallService";
import { getTeams } from "@/services/teamService";

const HallManagement = () => {
  const navigate = useNavigate();
  const [halls, setHalls] = React.useState(() => getHalls());
  const [newHall, setNewHall] = React.useState("");
  const [accounts, setAccounts] = React.useState(() => getAccounts());
  const teams = React.useMemo(() => getTeams(), []);
  const hallManagers = React.useMemo(
    () =>
      accounts
        .filter((a) => (a.groups || []).includes("厅管"))
        .map((a) => a.username),
    [accounts],
  );

  const handleAddHall = () => {
    if (!newHall.trim()) return;
    addHall({ id: Date.now().toString(), name: newHall.trim() });
    setHalls(getHalls());
    setNewHall("");
  };

  const handleDeleteHall = (index) => {
    const removed = deleteHall(index);
    setHalls(getHalls());
    if (removed) {
      const updated = accounts.map((a) =>
        a.hall === removed.name ? { ...a, hall: "" } : a,
      );
      setAccounts(updated);
      saveAccounts(updated);
    }
  };

  const handleAssignHall = (accountIndex, hallName) => {
    const updated = [...accounts];
    updated[accountIndex].hall = hallName;
    setAccounts(updated);
    saveAccounts(updated);
  };

  const handleAssignManager = (accountIndex, managerName) => {
    const updated = [...accounts];
    updated[accountIndex].manager = managerName;
    setAccounts(updated);
    saveAccounts(updated);
  };

  const handleAssignTeam = (accountIndex, teamName) => {
    const updated = [...accounts];
    updated[accountIndex].team = teamName;
    setAccounts(updated);
    saveAccounts(updated);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 text-center relative"
    >
      <h1 className="text-3xl font-bold mb-8 text-gray-800">分厅管理</h1>
      <Card className="shadow mb-6">
        <CardHeader>
          <CardTitle className="text-xl">分厅列表</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">名称</th>
                <th className="p-2 border"></th>
              </tr>
            </thead>
            <tbody>
              {halls.map((hall, idx) => (
                <tr key={hall.id} className="border-t">
                  <td className="p-2">{hall.name}</td>
                  <td className="p-2">
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteHall(idx)}
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
      <Card className="shadow mb-6">
        <CardHeader>
          <CardTitle className="text-xl">新增分厅</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input
            type="text"
            value={newHall}
            onChange={(e) => setNewHall(e.target.value)}
            placeholder="分厅名称"
          />
          <Button onClick={handleAddHall}>添加</Button>
        </CardContent>
      </Card>
      <Card className="shadow mb-6">
        <CardHeader>
          <CardTitle className="text-xl">设置账号隶属厅</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">用户名</th>
                <th className="p-2 border">分组</th>
                <th className="p-2 border">厅管</th>
                <th className="p-2 border">隶属团队</th>
                <th className="p-2 border">隶属厅</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((acc, index) =>
                (acc.groups || []).some((g) => g === "厅管" || g === "主持") ? (
                  <tr key={acc.id} className="border-t">
                    <td className="p-2">{acc.username}</td>
                    <td className="p-2">{(acc.groups || []).join(", ")}</td>
                    <td className="p-2">
                      <select
                        className="border rounded px-2 py-1"
                        value={acc.manager || ""}
                        onChange={(e) =>
                          handleAssignManager(index, e.target.value)
                        }
                      >
                        <option value="">未指定</option>
                        {hallManagers.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2">
                      <select
                        className="border rounded px-2 py-1"
                        value={acc.team || ""}
                        onChange={(e) =>
                          handleAssignTeam(index, e.target.value)
                        }
                      >
                        <option value="">未分配</option>
                        {teams.map((t) => (
                          <option key={t.id} value={t.name}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2">
                      <select
                        className="border rounded px-2 py-1"
                        value={acc.hall || ""}
                        onChange={(e) =>
                          handleAssignHall(index, e.target.value)
                        }
                      >
                        <option value="">未分配</option>
                        {halls.map((h) => (
                          <option key={h.id} value={h.name}>
                            {h.name}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ) : null,
              )}
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
