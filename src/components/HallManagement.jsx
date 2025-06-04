import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { getAccounts } from "@/services/accountService";
import { getHalls, addHall, deleteHall, saveHalls } from "@/services/hallService";
import { getTeams } from "@/services/teamService";

const HallManagement = () => {
  const navigate = useNavigate();
  const [halls, setHalls] = React.useState(() => getHalls());
  const [dirty, setDirty] = React.useState(false);
  const [newHall, setNewHall] = React.useState({ name: "", managerId: "", teamId: "" });
  const accounts = React.useMemo(() => getAccounts(), []);
  const teams = React.useMemo(() => getTeams(), []);
  const hallManagers = React.useMemo(
    () =>
      accounts
        .filter((a) =>
          (a.groups || []).some((g) => g === "厅管" || g === "多厅厅管")
        )
        .map((a) => ({ id: a.id, name: a.username })),
    [accounts],
  );

  const handleAddHall = () => {
    if (!newHall.name.trim()) return;
    addHall({
      id: Date.now().toString(),
      name: newHall.name.trim(),
      managerId: newHall.managerId,
      teamId: newHall.teamId,
    });
    setHalls(getHalls());
    setNewHall({ name: "", managerId: "", teamId: "" });
    setDirty(false);
  };

  const handleDeleteHall = (index) => {
    deleteHall(index);
    setHalls(getHalls());
    setDirty(false);
  };

  const handleChangeHall = (index, field, value) => {
    const updated = [...halls];
    updated[index][field] = value;
    setHalls(updated);
    setDirty(true);
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
          <CardTitle className="text-xl">新增分厅</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input
            type="text"
            value={newHall.name}
            onChange={(e) => setNewHall({ ...newHall, name: e.target.value })}
            placeholder="分厅名称"
          />
          <select
            className="border rounded px-2 py-1 w-full"
            value={newHall.managerId}
            onChange={(e) => setNewHall({ ...newHall, managerId: e.target.value })}
          >
            <option value="">选择厅管</option>
            {hallManagers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
          <select
            className="border rounded px-2 py-1 w-full"
            value={newHall.teamId}
            onChange={(e) => setNewHall({ ...newHall, teamId: e.target.value })}
          >
            <option value="">选择隶属团队</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <Button type="button" onClick={handleAddHall}>添加</Button>
        </CardContent>
      </Card>
      <Card className="shadow mb-6">
        <CardHeader>
          <CardTitle className="text-xl">分厅列表</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">名称</th>
                <th className="p-2 border">厅管</th>
                <th className="p-2 border">隶属团队</th>
                <th className="p-2 border"></th>
              </tr>
            </thead>
            <tbody>
              {halls.map((hall, index) => (
                <tr key={hall.id} className="border-t">
                  <td className="p-2">
                    <Input
                      type="text"
                      value={hall.name}
                      onChange={(e) => handleChangeHall(index, "name", e.target.value)}
                    />
                  </td>
                  <td className="p-2">
                    <select
                      className="border rounded px-2 py-1"
                      value={hall.managerId || ""}
                      onChange={(e) => handleChangeHall(index, "managerId", e.target.value)}
                    >
                      <option value="">未指定</option>
                      {hallManagers.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2">
                    <select
                      className="border rounded px-2 py-1"
                      value={hall.teamId || ""}
                      onChange={(e) => handleChangeHall(index, "teamId", e.target.value)}
                    >
                      <option value="">未指定</option>
                      {teams.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2">
                    <Button variant="destructive" onClick={() => handleDeleteHall(index)}>
                      删除
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
      <div className="mt-6 flex justify-center gap-4">
        <Button onClick={() => { saveHalls(halls); setDirty(false); }} disabled={!dirty}>
          保存修改
        </Button>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          返回
        </Button>
      </div>
    </motion.div>
  );
};

export default HallManagement;
