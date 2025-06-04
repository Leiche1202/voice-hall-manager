import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import {
  getGroups,
  saveGroups,
  addGroup,
  deleteGroup
} from '@/services/groupService';

const emptyGroup = { name: '', permissions: '' };

const GroupManagement = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = React.useState(() => getGroups());
  const [newGroup, setNewGroup] = React.useState(emptyGroup);

  const handleChange = (index, field, value) => {
    const updated = [...groups];
    if (field === 'permissions') {
      updated[index][field] = value.split(',').map((p) => p.trim()).filter(Boolean);
    } else {
      updated[index][field] = value;
    }
    setGroups(updated);
    saveGroups(updated);
  };

  const handleAdd = () => {
    const group = {
      name: newGroup.name,
      permissions: newGroup.permissions
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean)
    };
    addGroup(group);
    setGroups(getGroups());
    setNewGroup(emptyGroup);
  };

  const handleDelete = (index) => {
    deleteGroup(index);
    setGroups(getGroups());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 text-center relative"
    >
      <h1 className="text-3xl font-bold mb-8 text-gray-800">分组管理</h1>
      <table className="w-full text-left border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">分组名称</th>
            <th className="p-2 border">权限 (逗号分隔)</th>
            <th className="p-2 border"></th>
          </tr>
        </thead>
        <tbody>
          {groups.map((g, idx) => (
            <tr key={g.name} className="border-t">
              <td className="p-2">
                <Input
                  type="text"
                  value={g.name}
                  onChange={(e) => handleChange(idx, 'name', e.target.value)}
                />
              </td>
              <td className="p-2">
                <Input
                  type="text"
                  value={Array.isArray(g.permissions) ? g.permissions.join(',') : g.permissions}
                  onChange={(e) => handleChange(idx, 'permissions', e.target.value)}
                />
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
          <CardTitle className="text-xl">新增分组</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input
            type="text"
            value={newGroup.name}
            onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
            placeholder="分组名称"
          />
          <Input
            type="text"
            value={newGroup.permissions}
            onChange={(e) => setNewGroup({ ...newGroup, permissions: e.target.value })}
            placeholder="权限，逗号分隔"
          />
          <Button onClick={handleAdd}>添加</Button>
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

export default GroupManagement;
