import React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { getAccounts } from "@/services/accountService";
import {
  getTeams,
  saveTeams,
  addTeam,
  deleteTeam,
} from "@/services/teamService";

const emptyTeam = { name: "", ownerId: "", parentId: "" };

const TeamManagement = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = React.useState(() => getTeams());
  const [dirty, setDirty] = React.useState(false);
  const [newTeam, setNewTeam] = React.useState(emptyTeam);
  const managers = React.useMemo(
    () =>
      getAccounts()
        .filter((a) =>
          (a.groups || []).some((g) => g === "厅管" || g === "多厅厅管")
        )
        .map((a) => ({ id: a.id, name: a.username })),
    [],
  );

  const handleChange = (index, field, value) => {
    const updated = [...teams];
    updated[index][field] = value;
    setTeams(updated);
    setDirty(true);
  };

  const handleAdd = () => {
    if (!newTeam.name.trim()) return;
    addTeam({
      ...newTeam,
      id: Date.now().toString(),
    });
    setTeams(getTeams());
    setNewTeam(emptyTeam);
    setDirty(false);
  };

  const handleDelete = (index) => {
    deleteTeam(index);
    setTeams(getTeams());
    setDirty(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 text-center relative"
    >
      <h1 className="text-3xl font-bold mb-8 text-gray-800">团队管理</h1>
      <Card className="shadow">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">团队名称</th>
                <th className="p-2 border">所有者</th>
                <th className="p-2 border">上级厅管</th>
                <th className="p-2 border"></th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team, idx) => (
                <tr key={team.id} className="border-t">
                  <td className="p-2">
                    <Input
                      type="text"
                      value={team.name}
                      onChange={(e) =>
                        handleChange(idx, "name", e.target.value)
                      }
                    />
                  </td>
                  <td className="p-2">
                    <select
                      className="border rounded px-2 py-1"
                      value={team.ownerId || ""}
                      onChange={(e) =>
                        handleChange(idx, "ownerId", e.target.value)
                      }
                    >
                      <option value="">未指定</option>
                      {managers.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2">
                    <select
                      className="border rounded px-2 py-1"
                      value={team.parentId || ""}
                      onChange={(e) =>
                        handleChange(idx, "parentId", e.target.value)
                      }
                    >
                      <option value="">未指定</option>
                      {managers.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
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
      <Card className="shadow mt-6">
        <CardHeader>
          <CardTitle className="text-xl">新增团队</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input
            type="text"
            value={newTeam.name}
            onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
            placeholder="团队名称"
          />
          <select
            className="border rounded px-2 py-1 w-full"
            value={newTeam.ownerId}
            onChange={(e) => setNewTeam({ ...newTeam, ownerId: e.target.value })}
          >
            <option value="">选择团队所有者</option>
            {managers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
          <select
            className="border rounded px-2 py-1 w-full"
            value={newTeam.parentId}
            onChange={(e) => setNewTeam({ ...newTeam, parentId: e.target.value })}
          >
            <option value="">选择上级厅管</option>
            {managers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
          <Button onClick={handleAdd}>添加</Button>
        </CardContent>
      </Card>
      <div className="mt-6 flex justify-center gap-4">
        <Button onClick={() => { saveTeams(teams); setDirty(false); }} disabled={!dirty}>
          保存修改
        </Button>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          返回
        </Button>
      </div>
    </motion.div>
  );
};

export default TeamManagement;
